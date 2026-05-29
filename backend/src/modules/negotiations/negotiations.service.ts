import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferInput } from './dto/create-offer.input';
import { OfferStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class NegotiationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /** Buat penawaran khusus (oleh seller di dalam chat) */
  async createOffer(sellerAccountId: string, input: CreateOfferInput) {
    const offer = await this.prisma.customOffer.create({
      data: {
        conversationId: input.conversationId,
        sellerAccountId,
        buyerAccountId: input.buyerAccountId,
        listingId: input.listingId ? input.listingId : undefined,
        description: input.description,
        proposedPrice: input.proposedPrice,
        deliveryTimeDays: input.deliveryTimeDays,
        status: OfferStatus.PENDING,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 hari
      },
    });

    // Notifikasi ke buyer: ada penawaran baru
    await this.notificationsService.createNotification({
      accountId: input.buyerAccountId,
      fromAccountId: sellerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'CustomOffer_Created',
      targetId: input.conversationId,
    });

    // Emit real-time ke buyer
    this.notificationsGateway.emitConversationUpdated(input.buyerAccountId, {
      conversationId: input.conversationId,
    });

    return offer;
  }

  /** Terima penawaran → nanti trigger order creation */
  async acceptOffer(offerId: string, buyerAccountId: string) {
    return this.prisma.$transaction(async (tx) => {
      const offer = await tx.customOffer.findUnique({
        where: { id: offerId },
      });
      if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
      if (offer.buyerAccountId !== buyerAccountId) {
        throw new BadRequestException('Hanya pembeli yang bisa menerima.');
      }
      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException('Penawaran sudah tidak aktif.');
      }

      // 1. Update Custom Offer Status to ACCEPTED
      const updatedOffer = await tx.customOffer.update({
        where: { id: offerId },
        data: { status: OfferStatus.ACCEPTED },
      });

      // 2. Resolve listingId
      let listingId = offer.listingId;
      if (!listingId) {
        // SELALU buat listing fallback/private khusus untuk standalone custom offer agar judul/deskripsi tetap akurat
        const cleanTitle =
          offer.description.split('\n')[0].trim().slice(0, 80) ||
          `Jasa Kustom (${offer.deliveryTimeDays} Hari)`;
        const fallbackListing = await tx.listing.create({
          data: {
            accountId: offer.sellerAccountId,
            title: cleanTitle,
            description:
              offer.description ||
              'Pengerjaan kustom disepakati melalui obrolan chat',
            price: offer.proposedPrice,
            status: 'ARCHIVED',
            isUnlimited: true,
          },
        });
        listingId = fallbackListing.id;
      }

      // 3. Create the Order
      await tx.order.create({
        data: {
          buyerAccountId: offer.buyerAccountId,
          sellerAccountId: offer.sellerAccountId,
          listingId,
          customOfferId: offer.id,
          agreedPrice: offer.proposedPrice,
          status:
            Number(offer.proposedPrice) <= 0
              ? 'IN_PROGRESS'
              : 'PENDING_PAYMENT',
        },
      });

      // Notifikasi ke seller: penawaran diterima
      await this.notificationsService.createNotification({
        accountId: offer.sellerAccountId,
        fromAccountId: buyerAccountId,
        type: NotificationType.ORDER_UPDATE,
        targetType: 'CustomOffer_Accepted',
        targetId: offer.conversationId,
      });

      // Emit real-time ke seller
      this.notificationsGateway.emitConversationUpdated(offer.sellerAccountId, {
        conversationId: offer.conversationId,
      });

      return updatedOffer;
    });
  }

  /** Tolak penawaran */
  async rejectOffer(offerId: string, buyerAccountId: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });
    if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
    if (offer.buyerAccountId !== buyerAccountId) {
      throw new BadRequestException('Hanya pembeli yang bisa menolak.');
    }

    const updatedOffer = await this.prisma.customOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.REJECTED },
    });

    // Notifikasi ke seller: penawaran ditolak
    await this.notificationsService.createNotification({
      accountId: offer.sellerAccountId,
      fromAccountId: buyerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'CustomOffer_Rejected',
      targetId: offer.conversationId,
    });

    // Emit real-time ke seller
    this.notificationsGateway.emitConversationUpdated(offer.sellerAccountId, {
      conversationId: offer.conversationId,
    });

    return updatedOffer;
  }

  /** Tarik kembali penawaran (oleh seller) */
  async withdrawOffer(offerId: string, sellerAccountId: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });
    if (!offer) throw new NotFoundException('Penawaran tidak ditemukan.');
    if (offer.sellerAccountId !== sellerAccountId) {
      throw new BadRequestException('Hanya penjual yang bisa menarik.');
    }

    const updatedOffer = await this.prisma.customOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.WITHDRAWN },
    });

    // Notifikasi ke buyer: penawaran ditarik
    await this.notificationsService.createNotification({
      accountId: offer.buyerAccountId,
      fromAccountId: sellerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'CustomOffer_Withdrawn',
      targetId: offer.conversationId,
    });

    // Emit real-time ke buyer
    this.notificationsGateway.emitConversationUpdated(offer.buyerAccountId, {
      conversationId: offer.conversationId,
    });

    return updatedOffer;
  }

  /** Ambil semua penawaran di sebuah conversation */
  async getOffersForConversation(conversationId: string) {
    return this.prisma.customOffer.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
