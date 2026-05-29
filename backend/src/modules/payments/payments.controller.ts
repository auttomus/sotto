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
import { OrderStatus } from '@prisma/client';

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
      await this.prisma.order.update({
        where: { id: cleanOrderId },
        data: { status: OrderStatus.IN_PROGRESS },
      });
      this.logger.log(
        `Order ${cleanOrderId} telah DIBAYAR. Status diperbarui ke IN_PROGRESS.`,
      );
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      await this.prisma.order.update({
        where: { id: cleanOrderId },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.log(
        `Order ${cleanOrderId} BATAL/EXPIRED. Status diperbarui ke CANCELLED.`,
      );
    } else {
      this.logger.warn(
        `Order ${cleanOrderId} — status tidak dikenali: ${transaction_status}`,
      );
    }

    return { received: true };
  }
}
