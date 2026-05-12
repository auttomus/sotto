import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Buat review untuk order yang sudah COMPLETED */
  async createReview(
    orderId: string,
    reviewerAccountId: string,
    rating: number,
    comment?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new BadRequestException('Order tidak ditemukan.');
    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Order belum selesai.');
    }
    if (order.buyerAccountId !== reviewerAccountId) {
      throw new BadRequestException('Hanya pembeli yang bisa memberi review.');
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

    return review;
  }
}
