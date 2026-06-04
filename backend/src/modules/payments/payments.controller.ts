import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';

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

  constructor(private readonly paymentsService: PaymentsService) {}

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

    // 2. Proses status pembayaran terpusat
    const result = await this.paymentsService.processPaymentResult(
      cleanOrderId,
      transaction_status,
    );

    if (result === 'NOT_FOUND') {
      return { received: true, error: 'Order not found' };
    }

    return { received: true };
  }
}
