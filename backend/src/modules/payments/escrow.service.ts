import { Injectable, Logger } from '@nestjs/common';

/**
 * Escrow Service — Mengelola penahanan dan pelepasan dana.
 * Placeholder untuk integrasi payment gateway nyata.
 */
@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  /** Tahan dana saat order dibuat (setelah pembayaran berhasil) */
  async holdFunds(orderId: string, amount: number): Promise<void> {
    this.logger.log(`Escrow HOLD: Order ${orderId}, Rp ${amount}`);
    // TODO: Integrasi dengan payment gateway / internal ledger
    await Promise.resolve();
  }

  /** Lepaskan dana ke seller setelah order completed */
  async releaseFunds(orderId: string, sellerAccountId: string): Promise<void> {
    this.logger.log(
      `Escrow RELEASE: Order ${orderId} → Seller ${sellerAccountId}`,
    );
    // TODO: Transfer dana dari escrow ke wallet seller
    await Promise.resolve();
  }

  /** Refund ke buyer jika order dibatalkan */
  async refundFunds(orderId: string, buyerAccountId: string): Promise<void> {
    this.logger.log(
      `Escrow REFUND: Order ${orderId} → Buyer ${buyerAccountId}`,
    );
    // TODO: Refund ke payment method buyer
    await Promise.resolve();
  }
}
