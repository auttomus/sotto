import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

/**
 * REST Controller untuk menerima webhook dari payment gateway (Midtrans).
 * HARUS REST karena Midtrans POST ke URL fixed, bukan GraphQL.
 */
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  @Public()
  @Post('webhook')
  async handleWebhook(@Body() body: Record<string, unknown>) {
    this.logger.log('Menerima webhook pembayaran:', JSON.stringify(body));

    // TODO: Implementasi validasi signature Midtrans
    // TODO: Update status order berdasarkan transaction_status
    // TODO: Trigger escrow release / instant transfer for digital products

    return { received: true };
  }
}
