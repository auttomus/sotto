import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Buat review untuk order yang sudah COMPLETED */
  async createReview(
    orderId: string,
    reviewerAccountId: string,
    rating: number,
    comment?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customOffer: true },
    });
    if (!order) throw new BadRequestException('Order tidak ditemukan.');
    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Order belum selesai.');
    }
    if (order.buyerAccountId !== reviewerAccountId) {
      throw new BadRequestException('Hanya pembeli yang bisa memberi review.');
    }
    if (order.customOfferId && !order.customOffer?.listingId) {
      throw new BadRequestException(
        'Penawaran khusus mandiri tidak dapat diberi ulasan karena bersifat privat.',
      );
    }

    // Cek duplikat
    const existing = await this.prisma.review.findUnique({
      where: { orderId },
    });
    if (existing) throw new BadRequestException('Review sudah diberikan.');

    // Buat review + update trust_score dalam transaksi
    const review = await this.prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          orderId,
          reviewerAccountId,
          targetAccountId: order.sellerAccountId,
          rating,
          comment,
        },
      });

      // Hitung ulang rata-rata trust_score
      const avgResult = await tx.review.aggregate({
        where: { targetAccountId: order.sellerAccountId },
        _avg: { rating: true },
      });

      await tx.account.update({
        where: { id: order.sellerAccountId },
        data: { trustScore: avgResult._avg.rating ?? 0 },
      });

      return newReview;
    });

    // Notifikasi ke seller: ada review/rating baru
    await this.notificationsService.createNotification({
      accountId: order.sellerAccountId,
      fromAccountId: reviewerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Review',
      targetId: orderId,
    });

    return review;
  }
}
