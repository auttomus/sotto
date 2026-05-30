import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersScheduler {
  private readonly logger = new Logger(OrdersScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Cron Job untuk otomatis menyelesaikan (auto-complete) pesanan yang berstatus
   * DELIVERED lebih dari 24 jam tanpa adanya konfirmasi pembeli atau pengajuan komplain.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleAutoCompletion() {
    this.logger.log('Menjalankan pengecekan Auto-Completion pesanan...');

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    // Cari semua order dengan status DELIVERED yang deliveredAt lebih dari 24 jam lalu
    const ordersToComplete = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
        deliveredAt: {
          lte: cutoffTime,
        },
      },
    });

    if (ordersToComplete.length === 0) {
      this.logger.log(
        'Tidak ada pesanan DELIVERED yang perlu di-auto-complete.',
      );
      return;
    }

    this.logger.log(
      `Ditemukan ${ordersToComplete.length} pesanan untuk di-auto-complete.`,
    );

    for (const order of ordersToComplete) {
      try {
        this.logger.log(
          `Auto-completing Order #${order.id} (Seller: ${order.sellerAccountId})`,
        );

        // Panggil advanceStatus dengan mensimulasikan ID pembeli agar beralih ke COMPLETED
        // dan mencairkan dana escrow ke seller secara otomatis
        await this.ordersService.advanceStatus(order.id, order.buyerAccountId);

        this.logger.log(`Order #${order.id} berhasil diselesaikan otomatis.`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `Gagal auto-complete Order #${order.id}: ${errorMessage}`,
        );
      }
    }
  }
}
