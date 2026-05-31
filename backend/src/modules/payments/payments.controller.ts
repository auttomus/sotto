import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

import { EscrowService } from './escrow.service';
import { ChatService } from '../chat/chat.service';

export interface MidtransWebhookBody {
  order_id: string;
  transaction_status: string;
  gross_amount: string;
  status_code: string;
  signature_key: string;
  fraud_status?: string;
}

/**
 * REST Controller untuk menerima webhook dari payment gateway (Midtrans).
 * HARUS REST karena Midtrans POST ke URL fixed, bukan GraphQL.
 */
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly escrowService: EscrowService,
    private readonly chatService: ChatService,
  ) {}

  @Public()
  @Post('webhook')
  async handleWebhook(@Body() rawBody: unknown) {
    this.logger.log('Menerima webhook pembayaran:', JSON.stringify(rawBody));

    const body = rawBody as MidtransWebhookBody;

    // 1. Verifikasi Signature Key Midtrans
    const isValid = this.paymentsService.verifySignature(body);
    if (!isValid) {
      this.logger.error('Signature webhook Midtrans tidak valid!');
      throw new BadRequestException('Signature tidak valid.');
    }

    const order_id = body.order_id;
    const transaction_status = body.transaction_status;

    this.logger.log(
      `Webhook received — order_id: ${order_id}, status: ${transaction_status}`,
    );

    // Extract the clean 36-character UUID from the appended transaction ID (UUID-timestamp)
    const cleanOrderId =
      order_id.length >= 36 ? order_id.slice(0, 36) : order_id;

    this.logger.log(
      `Extracted cleanOrderId: ${cleanOrderId} from original: ${order_id}`,
    );

    // 2. Cari order terkait di database
    const order = await this.prisma.order.findUnique({
      where: { id: cleanOrderId },
    });
    if (!order) {
      this.logger.error(
        `Order ${cleanOrderId} (original: ${order_id}) tidak ditemukan untuk webhook ini.`,
      );
      return { received: true, error: 'Order not found' };
    }

    // 3. Update status order berdasarkan status transaksi Midtrans
    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      const listing = await this.prisma.listing.findUnique({
        where: { id: order.listingId },
      });
      const isDigital = listing?.type === 'DIGITAL_PRODUCT';
      const nextStatus = isDigital
        ? OrderStatus.COMPLETED
        : OrderStatus.IN_PROGRESS;

      // Jalankan sebagai transaksi atomik di database
      const updatedOrder = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id: cleanOrderId },
          data: { status: nextStatus },
        });

        if (nextStatus === OrderStatus.IN_PROGRESS) {
          // Kunci dana secara virtual di escrow
          await this.escrowService.holdFunds(
            cleanOrderId,
            Number(order.agreedPrice),
            tx,
          );
        } else if (nextStatus === OrderStatus.COMPLETED) {
          // Jika digital produk, langsung cairkan dana escrow ke wallet seller
          await this.escrowService.releaseFunds(
            cleanOrderId,
            order.sellerAccountId,
            tx,
          );
        }

        return updated;
      });

      this.logger.log(
        `Order ${cleanOrderId} telah DIBAYAR. Status diperbarui ke ${nextStatus}.`,
      );

      // Notifikasi ke seller: pembayaran diterima
      await this.notificationsService.createNotification({
        accountId: order.sellerAccountId,
        fromAccountId: order.buyerAccountId,
        type: NotificationType.ORDER_UPDATE,
        targetType: 'Order',
        targetId: cleanOrderId,
      });

      // Kirim system message ke direct conversation antara buyer dan seller
      try {
        const conversation = await this.prisma.conversation.findFirst({
          where: {
            type: 'DIRECT',
            AND: [
              { participants: { some: { accountId: order.buyerAccountId } } },
              { participants: { some: { accountId: order.sellerAccountId } } },
            ],
          },
        });

        if (conversation) {
          const sysTag =
            nextStatus === OrderStatus.COMPLETED ? 'COMPLETED' : 'IN_PROGRESS';
          const sysMsg =
            nextStatus === OrderStatus.COMPLETED
              ? 'Pembayaran produk digital sukses. Pesanan langsung selesai!'
              : 'Pembayaran sukses diverifikasi! Dana escrow aman tersimpan, pesanan resmi dimulai.';
          await this.chatService.sendMessage(
            conversation.id,
            order.buyerAccountId,
            `[SYSTEM_ORDER_${sysTag}] ${sysMsg}`,
          );
        }
      } catch (chatErr) {
        this.logger.error(
          `Gagal mengirim pesan sistem chat untuk order ${cleanOrderId}: ${chatErr instanceof Error ? chatErr.message : String(chatErr)}`,
        );
      }

      // Real-time order update ke kedua pihak
      const payload = {
        orderId: cleanOrderId,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      };
      this.notificationsGateway.emitOrderUpdated(order.buyerAccountId, payload);
      this.notificationsGateway.emitOrderUpdated(
        order.sellerAccountId,
        payload,
      );
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      const updatedOrder = await this.prisma.order.update({
        where: { id: cleanOrderId },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.log(
        `Order ${cleanOrderId} BATAL/EXPIRED. Status diperbarui ke CANCELLED.`,
      );

      // Notifikasi ke kedua pihak: order dibatalkan
      await this.notificationsService.createNotification({
        accountId: order.sellerAccountId,
        fromAccountId: order.buyerAccountId,
        type: NotificationType.ORDER_UPDATE,
        targetType: 'Order',
        targetId: cleanOrderId,
      });
      await this.notificationsService.createNotification({
        accountId: order.buyerAccountId,
        type: NotificationType.ORDER_UPDATE,
        targetType: 'Order',
        targetId: cleanOrderId,
      });

      // Real-time order update
      const payload = {
        orderId: cleanOrderId,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      };
      this.notificationsGateway.emitOrderUpdated(order.buyerAccountId, payload);
      this.notificationsGateway.emitOrderUpdated(
        order.sellerAccountId,
        payload,
      );
    } else {
      this.logger.warn(
        `Order ${cleanOrderId} — status tidak dikenali: ${transaction_status}`,
      );
    }

    return { received: true };
  }
}
