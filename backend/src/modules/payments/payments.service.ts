import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';
import { NotificationType, OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { EscrowService } from './escrow.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly serverKey = process.env.MIDTRANS_SERVER_KEY;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly escrowService: EscrowService,
    private readonly chatService: ChatService,
  ) {}

  /** Request Snap Token ke Midtrans Sandbox */
  async getSnapToken(orderId: string, publicUrl: string): Promise<string> {
    if (!this.serverKey) {
      throw new BadRequestException(
        'Kredensial Midtrans Server Key belum dikonfigurasi di env backend lokal Anda.',
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order tidak ditemukan.');
    }

    if (Math.round(Number(order.agreedPrice)) <= 0) {
      throw new BadRequestException(
        'Transaksi gratis (Rp 0) tidak memerlukan proses pembayaran Midtrans.',
      );
    }

    const email = order.buyer.user?.email || 'pembeli@sotto.com';

    const midtransOrderId = `${order.id}-${Date.now()}`;
    const payload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(Number(order.agreedPrice)),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: order.buyer.displayName || 'Pembeli',
        email: email,
      },
      notification_url: `${publicUrl}/payments/webhook`,
      callbacks: {
        finish: `${publicUrl}/workspace/order/${order.id}`,
      },
    };

    this.logger.log(`Requesting Midtrans Snap Token for order ${orderId}...`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    try {
      const response = await fetch(
        'https://app.sandbox.midtrans.com/snap/v1/transactions',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Midtrans Snap API Error: ${errorText}`);
        throw new BadRequestException(
          `Gagal menghubungi Midtrans Snap: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as { token: string };
      this.logger.log(
        `Midtrans Snap Token generated successfully: ${data.token}`,
      );

      // Simpan mapping orderId → midtransOrderId untuk verifikasi nanti
      this.recordMidtransOrderId(orderId, midtransOrderId);

      return data.token;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Midtrans Snap request failed: ${errorMsg}`);
      throw new BadRequestException('Koneksi pembayaran Midtrans terputus.');
    }
  }

  /**
   * Memproses hasil pembayaran (baik dari webhook maupun query status langsung).
   * Update status order, alokasikan escrow, kirim notifikasi & system chat message.
   */
  async processPaymentResult(
    cleanOrderId: string,
    transactionStatus: string,
  ): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: cleanOrderId },
    });
    if (!order) {
      this.logger.error(
        `Order ${cleanOrderId} tidak ditemukan untuk pemrosesan status.`,
      );
      return 'NOT_FOUND';
    }

    // Jika sudah bukan PENDING_PAYMENT, skip pemrosesan agar tidak double-run/race condition
    if (order.status !== 'PENDING_PAYMENT') {
      this.logger.log(
        `Order ${cleanOrderId} sudah berstatus ${order.status}, skip pemrosesan.`,
      );
      return order.status;
    }

    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
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

      return nextStatus;
    } else if (
      transactionStatus === 'deny' ||
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire'
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

      return OrderStatus.CANCELLED;
    }

    return order.status;
  }

  /**
   * Verifikasi status pembayaran langsung ke Midtrans Status API.
   * Dipanggil oleh frontend setelah Snap popup onSuccess sebagai
   * fallback jika webhook tidak sampai (e.g. Cloudflare blocking).
   */
  async verifyAndUpdatePayment(orderId: string): Promise<string> {
    if (!this.serverKey) {
      throw new BadRequestException('Midtrans Server Key belum dikonfigurasi.');
    }

    // 1. Cari order di database
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} tidak ditemukan.`);
    }

    // Jika sudah bukan PENDING_PAYMENT, tidak perlu cek lagi
    if (order.status !== 'PENDING_PAYMENT') {
      this.logger.log(
        `Order ${orderId} sudah berstatus ${order.status}, skip verifikasi.`,
      );
      return order.status;
    }

    // 2. Cari transaksi Midtrans terkait (order_id di Midtrans = orderId-timestamp)
    const possibleTransactions =
      await this.findRecentMidtransTransaction(orderId);

    if (!possibleTransactions) {
      this.logger.warn(
        `Tidak ada transaksi Midtrans yang ditemukan untuk order ${orderId}.`,
      );
      return order.status;
    }

    const { transaction_status } = possibleTransactions;

    this.logger.log(
      `Midtrans status untuk order ${orderId}: ${transaction_status}`,
    );

    // 3. Proses status pembayaran terpusat
    return this.processPaymentResult(orderId, transaction_status);
  }

  /**
   * Cari transaksi Midtrans terbaru untuk orderId yang diberikan.
   * Karena order_id di Midtrans format: `{uuid}-{timestamp}`,
   * kita simpan mapping-nya. Untuk saat ini, gunakan approach
   * yang query langsung ke Midtrans Order Status API.
   */
  private lastMidtransOrderIds = new Map<string, string>();

  /** Simpan mapping orderId → midtransOrderId saat membuat snap token */
  recordMidtransOrderId(orderId: string, midtransOrderId: string) {
    this.lastMidtransOrderIds.set(orderId, midtransOrderId);
    this.logger.log(
      `Recorded Midtrans order mapping: ${orderId} → ${midtransOrderId}`,
    );
  }

  private async findRecentMidtransTransaction(
    orderId: string,
  ): Promise<{ transaction_status: string } | null> {
    const midtransOrderId = this.lastMidtransOrderIds.get(orderId);
    if (!midtransOrderId) {
      this.logger.warn(
        `No Midtrans order ID mapping found for ${orderId}. Cannot verify.`,
      );
      return null;
    }

    try {
      const response = await fetch(
        `https://api.sandbox.midtrans.com/v2/${midtransOrderId}/status`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
          },
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Midtrans Status API error for ${midtransOrderId}: ${response.statusText}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        transaction_status: string;
        order_id: string;
      };
      this.logger.log(
        `Midtrans Status API response for ${midtransOrderId}: ${JSON.stringify(data)}`,
      );
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Midtrans Status API request failed: ${msg}`);
      return null;
    }
  }

  /** Verifikasi Signature Key dari Webhook Midtrans */
  verifySignature(body: Record<string, any>): boolean {
    const { order_id, status_code, gross_amount, signature_key } = body;
    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return false;
    }

    const payload = `${order_id}${status_code}${gross_amount}${this.serverKey}`;
    const localSignature = createHash('sha512').update(payload).digest('hex');

    this.logger.log(`Webhook Signature Verification:`);
    this.logger.log(`Received: ${signature_key}`);
    this.logger.log(`Computed: ${localSignature}`);

    return localSignature === signature_key;
  }
}
