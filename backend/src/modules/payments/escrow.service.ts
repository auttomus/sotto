import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Escrow Service — Mengelola penahanan dan pelepasan dana.
 */
@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Tahan dana saat order dibuat (setelah pembayaran berhasil) */
  async holdFunds(
    orderId: string,
    amount: number,
    _tx?: Prisma.TransactionClient,
  ): Promise<void> {
    this.logger.log(
      `Escrow HOLD: Order ${orderId}, Rp ${amount}${_tx ? ' (transactional)' : ''}`,
    );
    // Hold dana tercatat secara virtual di status order IN_PROGRESS
    await Promise.resolve();
  }

  /** Lepaskan dana ke seller setelah order completed */
  async releaseFunds(
    orderId: string,
    sellerAccountId: string,
    txClient?: Prisma.TransactionClient,
  ): Promise<void> {
    this.logger.log(
      `Escrow RELEASE: Order ${orderId} → Seller ${sellerAccountId}`,
    );

    const client: Prisma.TransactionClient = txClient || this.prisma;

    // 1. Ambil data order untuk mendapatkan harga
    const order = await client.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error(`Order ${orderId} tidak ditemukan untuk pelepasan dana.`);
    }

    const amount = order.agreedPrice;

    // 2. Cari atau buat Wallet untuk seller
    let wallet = await client.wallet.findUnique({
      where: { accountId: sellerAccountId },
    });

    if (!wallet) {
      wallet = await client.wallet.create({
        data: {
          accountId: sellerAccountId,
          balance: 0,
        },
      });
    }

    // 3. Tambahkan saldo ke Wallet
    const updatedWallet = await client.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // 4. Catat transaksi masuk di WalletTransaction
    await client.walletTransaction.create({
      data: {
        walletId: updatedWallet.id,
        amount: amount,
        type: 'ESCROW_RELEASE',
        description: `Pencairan dana pesanan #${orderId.slice(0, 8).toUpperCase()}`,
        orderId: orderId,
      },
    });

    this.logger.log(
      `Escrow RELEASE sukses: Rp ${amount.toString()} ditambahkan ke Wallet ${sellerAccountId}`,
    );
  }

  /** Refund ke buyer jika order dibatalkan */
  async refundFunds(
    orderId: string,
    buyerAccountId: string,
    txClient?: Prisma.TransactionClient,
  ): Promise<void> {
    this.logger.log(
      `Escrow REFUND: Order ${orderId} → Buyer ${buyerAccountId}`,
    );

    const client: Prisma.TransactionClient = txClient || this.prisma;

    const order = await client.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error(`Order ${orderId} tidak ditemukan untuk refund.`);
    }

    const amount = order.agreedPrice;

    // Cari atau buat Wallet untuk buyer
    let wallet = await client.wallet.findUnique({
      where: { accountId: buyerAccountId },
    });

    if (!wallet) {
      wallet = await client.wallet.create({
        data: {
          accountId: buyerAccountId,
          balance: 0,
        },
      });
    }

    // Tambahkan saldo refund ke wallet buyer
    const updatedWallet = await client.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Catat mutasi refund
    await client.walletTransaction.create({
      data: {
        walletId: updatedWallet.id,
        amount: amount,
        type: 'REFUND',
        description: `Refund dana pesanan #${orderId.slice(0, 8).toUpperCase()}`,
        orderId: orderId,
      },
    });

    this.logger.log(
      `Escrow REFUND sukses: Rp ${amount.toString()} dikembalikan ke Wallet ${buyerAccountId}`,
    );
  }
}
