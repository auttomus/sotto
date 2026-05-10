import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferInput } from './dto/create-offer.input';
import { OfferStatus } from '@prisma/client';

@Injectable()
export class NegotiationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Buat penawaran khusus (oleh seller di dalam chat) */
  async createOffer(sellerAccountId: bigint, input: CreateOfferInput) {
    return this.prisma.customOffer.create({
      data: {
        conversationId: BigInt(input.conversationId),
        sellerAccountId,
        buyerAccountId: BigInt(input.buyerAccountId),
        listingId: input.listingId ? BigInt(input.listingId) : undefined,
        description: input.description,
        proposedPrice: input.proposedPrice,
        deliveryTimeDays: input.deliveryTimeDays,
        status: OfferStatus.PENDING,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 hari
      },
    });
  }

  /** Terima penawaran → nanti trigger order creation */
  async acceptOffer(offerId: bigint, buyerAccountId: bigint) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });
    if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
    if (offer.buyerAccountId !== buyerAccountId) {
      throw new BadRequestException('Hanya pembeli yang bisa menerima.');
    }
    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Penawaran sudah tidak aktif.');
    }

    return this.prisma.customOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.ACCEPTED },
    });
  }

  /** Tolak penawaran */
  async rejectOffer(offerId: bigint, buyerAccountId: bigint) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });
    if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
    if (offer.buyerAccountId !== buyerAccountId) {
      throw new BadRequestException('Hanya pembeli yang bisa menolak.');
    }

    return this.prisma.customOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.REJECTED },
    });
  }

  /** Tarik kembali penawaran (oleh seller) */
  async withdrawOffer(offerId: bigint, sellerAccountId: bigint) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });
    if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
    if (offer.sellerAccountId !== sellerAccountId) {
      throw new BadRequestException('Hanya penjual yang bisa menarik.');
    }

    return this.prisma.customOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.WITHDRAWN },
    });
  }

  /** Ambil semua penawaran di sebuah conversation */
  async getOffersForConversation(conversationId: bigint) {
    return this.prisma.customOffer.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
