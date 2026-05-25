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

    // 2. Cari order terkait di database
    const order = await this.prisma.order.findUnique({
      where: { id: order_id },
    });
    if (!order) {
      this.logger.error(`Order ${order_id} tidak ditemukan untuk webhook ini.`);
      return { received: true, error: 'Order not found' };
    }

    // 3. Update status order berdasarkan status transaksi Midtrans
    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      await this.prisma.order.update({
        where: { id: order_id },
        data: { status: OrderStatus.IN_PROGRESS },
      });
      this.logger.log(
        `Order ${order_id} telah DIBAYAR. Status diperbarui ke IN_PROGRESS.`,
      );
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      await this.prisma.order.update({
        where: { id: order_id },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.log(
        `Order ${order_id} BATAL/EXPIRED. Status diperbarui ke CANCELLED.`,
      );
    }

    return { received: true };
  }
}
