import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly serverKey = process.env.MIDTRANS_SERVER_KEY;

  constructor(private readonly prisma: PrismaService) {}

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

    const email = order.buyer.user?.email || 'pembeli@sotto.com';

    const payload = {
      transaction_details: {
        order_id: `${order.id}-${Date.now()}`,
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
      return data.token;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Midtrans Snap request failed: ${errorMsg}`);
      throw new BadRequestException('Koneksi pembayaran Midtrans terputus.');
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
