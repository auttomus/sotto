import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus, NotificationType, ListingType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

import { EscrowService } from '../payments/escrow.service';
import { ChatService } from '../chat/chat.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly escrowService: EscrowService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  /** Buat order baru (status: PENDING_PAYMENT) */
  async createOrder(buyerAccountId: string, input: CreateOrderInput) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: input.listingId },
    });
    if (!listing) throw new NotFoundException('Listing tidak ditemukan.');

    if (listing.accountId === buyerAccountId) {
      throw new BadRequestException('Tidak bisa membeli listing sendiri.');
    }

    const order = await this.prisma.order.create({
      data: {
        buyerAccountId,
        sellerAccountId: listing.accountId,
        listingId: listing.id,
        customOfferId: input.customOfferId ? input.customOfferId : undefined,
        agreedPrice: input.agreedPrice,
        status:
          input.agreedPrice <= 0
            ? listing.type === ListingType.DIGITAL_PRODUCT
              ? OrderStatus.COMPLETED
              : OrderStatus.IN_PROGRESS
            : OrderStatus.PENDING_PAYMENT,
      },
    });

    // Notifikasi ke seller: ada order baru
    await this.notificationsService.createNotification({
      accountId: order.sellerAccountId,
      fromAccountId: buyerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: order.id,
    });

    // Real-time order update ke kedua pihak
    this.emitOrderUpdate(order);

    // Kirim system message ke direct chat room
    const isPaidInitially = order.status !== OrderStatus.PENDING_PAYMENT;
    const initialMsg = isPaidInitially
      ? `Pesanan baru dibuat untuk "${listing.title}" dan pembayaran langsung diverifikasi.`
      : `Pesanan baru dibuat untuk "${listing.title}". Menunggu pembayaran dari pembeli.`;

    await this.sendSystemChatMessage(
      order,
      isPaidInitially ? 'IN_PROGRESS' : 'CREATED',
      initialMsg,
    );

    return order;
  }

  /** Advance order status: state machine transitions */
  async advanceStatus(orderId: string, accountId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    // Validasi: hanya buyer atau seller yang boleh advance
    const isBuyer = order.buyerAccountId === accountId;
    const isSeller = order.sellerAccountId === accountId;
    if (!isBuyer && !isSeller) {
      throw new ForbiddenException('Akses ditolak.');
    }

    let newStatus: OrderStatus;
    const dataUpdate: Prisma.OrderUpdateInput = {};

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        // Payment confirmed → in progress (biasanya dipicu oleh webhook)
        newStatus = OrderStatus.IN_PROGRESS;
        break;
      case OrderStatus.IN_PROGRESS:
        // Seller kirim hasil → DELIVERED
        if (!isSeller)
          throw new BadRequestException(
            'Hanya penjual yang dapat menandai pesanan selesai dikerjakan.',
          );
        newStatus = OrderStatus.DELIVERED;
        dataUpdate.deliveredAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        // Buyer confirm → COMPLETED (Cairkan Escrow)
        if (!isBuyer)
          throw new BadRequestException(
            'Hanya pembeli yang bisa menyelesaikan order.',
          );
        newStatus = OrderStatus.COMPLETED;
        break;
      case OrderStatus.DISPUTED:
        // Buyer batalkan komplain dan selesaikan → COMPLETED (Cairkan Escrow)
        if (!isBuyer)
          throw new BadRequestException(
            'Hanya pembeli yang dapat mencabut komplain dan menyelesaikan pesanan.',
          );
        newStatus = OrderStatus.COMPLETED;
        break;
      default:
        throw new BadRequestException(
          `Order dengan status ${order.status} tidak bisa di-advance.`,
        );
    }

    // Eksekusi sebagai transaksi database tunggal untuk keamanan dana
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: {
          id: orderId,
          lockVersion: order.lockVersion,
        },
        data: {
          status: newStatus,
          lockVersion: { increment: 1 },
          ...dataUpdate,
        },
      });

      if (newStatus === OrderStatus.COMPLETED) {
        // Cairkan dana escrow ke wallet penjual
        await this.escrowService.releaseFunds(
          orderId,
          order.sellerAccountId,
          tx,
        );
      }

      return updated;
    });

    // 🔔 Notifikasi ke pihak lawan
    const recipientId = isBuyer ? order.sellerAccountId : order.buyerAccountId;
    await this.notificationsService.createNotification({
      accountId: recipientId,
      fromAccountId: accountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // 📡 Real-time order update ke kedua pihak
    this.emitOrderUpdate(updatedOrder);

    // Kirim system message ke direct chat room
    if (updatedOrder.status === 'DELIVERED') {
      await this.sendSystemChatMessage(
        updatedOrder,
        'DELIVERED',
        'Penjual telah menyerahkan pengerjaan pesanan. Silakan periksa hasil kerja.',
      );
    } else if (updatedOrder.status === 'COMPLETED') {
      await this.sendSystemChatMessage(
        updatedOrder,
        'COMPLETED',
        'Pesanan selesai dikonfirmasi! Dana escrow berhasil dicairkan ke saldo penjual.',
      );
    }

    return updatedOrder;
  }

  /** Cancel order */
  async cancelOrder(orderId: string, accountId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');
    if (
      order.buyerAccountId !== accountId &&
      order.sellerAccountId !== accountId
    ) {
      throw new ForbiddenException('Akses ditolak.');
    }
    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Order yang sudah selesai tidak bisa dibatalkan.',
      );
    }

    // Lapis 1: Cegah pembeli membatalkan secara sepihak saat pesanan sedang berjalan
    if (
      order.status === OrderStatus.IN_PROGRESS &&
      order.buyerAccountId === accountId
    ) {
      throw new BadRequestException(
        'Pesanan sedang berjalan. Pembeli tidak dapat membatalkan pesanan secara sepihak. Hubungi penjual untuk pengajuan kesepakatan pembatalan.',
      );
    }

    // Eksekusi pembatalan dan refund dalam satu transaksi
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId, lockVersion: order.lockVersion },
        data: { status: OrderStatus.CANCELLED, lockVersion: { increment: 1 } },
      });

      // Jika pesanan sudah sempat dibayar (Virtual Escrow aktif), lakukan refund kembali ke buyer
      if (
        order.status === OrderStatus.IN_PROGRESS ||
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.DISPUTED
      ) {
        await this.escrowService.refundFunds(orderId, order.buyerAccountId, tx);
      }

      return updated;
    });

    // 🔔 Notifikasi ke pihak lawan
    const recipientId =
      order.buyerAccountId === accountId
        ? order.sellerAccountId
        : order.buyerAccountId;
    await this.notificationsService.createNotification({
      accountId: recipientId,
      fromAccountId: accountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // 📡 Real-time order update ke kedua pihak
    this.emitOrderUpdate(updatedOrder);

    // Kirim system message ke direct chat room
    const wasPaid =
      order.status === OrderStatus.IN_PROGRESS ||
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.DISPUTED;
    const cancelMsg = wasPaid
      ? 'Pesanan telah dibatalkan. Dana escrow di-refund kembali ke saldo pembeli.'
      : 'Pesanan telah dibatalkan sebelum pembayaran dilakukan.';

    await this.sendSystemChatMessage(updatedOrder, 'CANCELLED', cancelMsg);

    return updatedOrder;
  }

  /** Ajukan komplain/sengketa atas pesanan (Hanya Pembeli) */
  async fileComplaint(
    orderId: string,
    buyerAccountId: string,
    reason: string,
    notes?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    if (order.buyerAccountId !== buyerAccountId) {
      throw new ForbiddenException(
        'Hanya pembeli yang dapat mengajukan komplain.',
      );
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Komplain hanya dapat diajukan jika penjual sudah menyerahkan pekerjaan (DELIVERED).',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId, lockVersion: order.lockVersion },
      data: {
        status: OrderStatus.DISPUTED,
        disputedAt: new Date(),
        disputedById: buyerAccountId,
        complaintReason: reason,
        complaintNotes: notes,
        lockVersion: { increment: 1 },
      },
    });

    // Notifikasi ke penjual
    await this.notificationsService.createNotification({
      accountId: order.sellerAccountId,
      fromAccountId: buyerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // Kirim system message ke direct chat room
    const notesStr = notes ? ` Catatan: ${notes}` : '';
    await this.sendSystemChatMessage(
      updatedOrder,
      'DISPUTED',
      `Komplain diajukan oleh pembeli. Alasan: ${reason}.${notesStr}`,
    );

    this.emitOrderUpdate(updatedOrder);
    return updatedOrder;
  }

  /** Penjual setuju refund pesanan yang dikomplain (Hanya Penjual) */
  async refundDisputedOrder(orderId: string, sellerAccountId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    if (order.sellerAccountId !== sellerAccountId) {
      throw new ForbiddenException(
        'Hanya penjual yang dapat menyetujui refund sengketa ini.',
      );
    }

    if (order.status !== OrderStatus.DISPUTED) {
      throw new BadRequestException(
        'Refund sengketa hanya dapat dilakukan jika status pesanan adalah DISPUTED.',
      );
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId, lockVersion: order.lockVersion },
        data: {
          status: OrderStatus.CANCELLED,
          lockVersion: { increment: 1 },
        },
      });

      // Kembalikan dana ke wallet pembeli
      await this.escrowService.refundFunds(orderId, order.buyerAccountId, tx);
      return updated;
    });

    // Notifikasi ke pembeli
    await this.notificationsService.createNotification({
      accountId: order.buyerAccountId,
      fromAccountId: sellerAccountId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // Kirim system message ke direct chat room
    await this.sendSystemChatMessage(
      updatedOrder,
      'CANCELLED',
      'Sengketa diselesaikan: Penjual menyetujui pengembalian dana sepenuhnya ke pembeli.',
    );

    this.emitOrderUpdate(updatedOrder);
    return updatedOrder;
  }

  /** Ajukan proposal bagi hasil sengketa */
  async proposeSplitRefund(
    orderId: string,
    proposerId: string,
    buyerAmount: number,
    sellerAmount: number,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    if (order.status !== OrderStatus.DISPUTED) {
      throw new BadRequestException(
        'Proposal bagi hasil hanya dapat diajukan saat pesanan berstatus DISPUTED.',
      );
    }

    if (
      order.buyerAccountId !== proposerId &&
      order.sellerAccountId !== proposerId
    ) {
      throw new ForbiddenException(
        'Hanya pembeli atau penjual yang terlibat yang dapat mengajukan proposal bagi hasil.',
      );
    }

    const total = buyerAmount + sellerAmount;
    if (Math.abs(total - order.agreedPrice.toNumber()) > 0.01) {
      throw new BadRequestException(
        'Total bagi hasil harus sama dengan nilai harga kesepakatan pesanan.',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId, lockVersion: order.lockVersion },
      data: {
        proposedSplitBuyerAmount: buyerAmount,
        proposedSplitSellerAmount: sellerAmount,
        proposedSplitById: proposerId,
        lockVersion: { increment: 1 },
      },
    });

    const otherPartyId =
      proposerId === order.buyerAccountId
        ? order.sellerAccountId
        : order.buyerAccountId;
    const proposerRole =
      proposerId === order.buyerAccountId ? 'Pembeli' : 'Penjual';

    // Kirim Notifikasi ke pihak lain
    await this.notificationsService.createNotification({
      accountId: otherPartyId,
      fromAccountId: proposerId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // Kirim system message ke room chat
    await this.sendSystemChatMessage(
      updatedOrder,
      'DISPUTED',
      `Proposal bagi hasil diajukan oleh ${proposerRole}: Pembeli Rp ${buyerAmount.toLocaleString('id-ID')}, Penjual Rp ${sellerAmount.toLocaleString('id-ID')}.`,
    );

    this.emitOrderUpdate(updatedOrder);
    return updatedOrder;
  }

  /** Setujui proposal bagi hasil sengketa */
  async acceptSplitRefund(orderId: string, accepterId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    if (order.status !== OrderStatus.DISPUTED) {
      throw new BadRequestException(
        'Proposal bagi hasil hanya dapat disetujui saat pesanan berstatus DISPUTED.',
      );
    }

    if (
      !order.proposedSplitById ||
      !order.proposedSplitBuyerAmount ||
      !order.proposedSplitSellerAmount
    ) {
      throw new BadRequestException(
        'Tidak ada proposal bagi hasil yang aktif saat ini.',
      );
    }

    if (order.proposedSplitById === accepterId) {
      throw new BadRequestException(
        'Anda tidak dapat menyetujui proposal bagi hasil yang Anda ajukan sendiri.',
      );
    }

    if (
      order.buyerAccountId !== accepterId &&
      order.sellerAccountId !== accepterId
    ) {
      throw new ForbiddenException('Anda tidak terlibat dalam pesanan ini.');
    }

    const buyerShare = order.proposedSplitBuyerAmount.toNumber();
    const sellerShare = order.proposedSplitSellerAmount.toNumber();

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId, lockVersion: order.lockVersion },
        data: {
          status: OrderStatus.CANCELLED,
          lockVersion: { increment: 1 },
        },
      });

      // Proses bagi hasil dana ke wallet masing-masing
      await this.escrowService.settleSplitFunds(
        orderId,
        order.buyerAccountId,
        order.sellerAccountId,
        buyerShare,
        sellerShare,
        tx,
      );

      return updated;
    });

    const otherPartyId =
      accepterId === order.buyerAccountId
        ? order.sellerAccountId
        : order.buyerAccountId;

    // Kirim Notifikasi ke pihak yang mengajukan proposal
    await this.notificationsService.createNotification({
      accountId: otherPartyId,
      fromAccountId: accepterId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // Kirim system message ke room chat
    await this.sendSystemChatMessage(
      updatedOrder,
      'COMPLETED',
      `Kesepakatan tercapai! Bagi hasil disetujui: Pembeli menerima Rp ${buyerShare.toLocaleString('id-ID')}, Penjual menerima Rp ${sellerShare.toLocaleString('id-ID')}.`,
    );

    this.emitOrderUpdate(updatedOrder);
    return updatedOrder;
  }

  /** Tolak proposal bagi hasil sengketa */
  async rejectSplitRefund(orderId: string, rejecterId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan.');

    if (order.status !== OrderStatus.DISPUTED) {
      throw new BadRequestException(
        'Proposal bagi hasil hanya dapat ditolak saat sengketa aktif.',
      );
    }

    if (!order.proposedSplitById) {
      throw new BadRequestException(
        'Tidak ada proposal bagi hasil yang aktif saat ini.',
      );
    }

    if (order.proposedSplitById === rejecterId) {
      throw new BadRequestException(
        'Anda tidak dapat menolak proposal yang Anda ajukan sendiri. Tunggu respon pihak lawan.',
      );
    }

    if (
      order.buyerAccountId !== rejecterId &&
      order.sellerAccountId !== rejecterId
    ) {
      throw new ForbiddenException('Anda tidak terlibat dalam pesanan ini.');
    }

    const proposerId = order.proposedSplitById;

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId, lockVersion: order.lockVersion },
      data: {
        proposedSplitBuyerAmount: null,
        proposedSplitSellerAmount: null,
        proposedSplitById: null,
        lockVersion: { increment: 1 },
      },
    });

    const rejecterRole =
      rejecterId === order.buyerAccountId ? 'Pembeli' : 'Penjual';

    // Kirim Notifikasi ke pihak yang mengajukan proposal
    await this.notificationsService.createNotification({
      accountId: proposerId,
      fromAccountId: rejecterId,
      type: NotificationType.ORDER_UPDATE,
      targetType: 'Order',
      targetId: orderId,
    });

    // Kirim system message ke room chat
    await this.sendSystemChatMessage(
      updatedOrder,
      'DISPUTED',
      `Proposal bagi hasil ditolak oleh ${rejecterRole}.`,
    );

    this.emitOrderUpdate(updatedOrder);
    return updatedOrder;
  }

  /** Ambil order berdasarkan ID */
  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true, buyer: true, seller: true },
    });
  }

  /** Ambil daftar order milik user */
  async getMyOrders(
    accountId: string,
    role: 'buyer' | 'seller',
    status?: OrderStatus,
  ) {
    return this.prisma.order.findMany({
      where: {
        ...(role === 'buyer'
          ? { buyerAccountId: accountId }
          : { sellerAccountId: accountId }),
        ...(status ? { status } : {}),
      },
      include: { listing: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Private helper ─────────────────────────────────────

  /** Emit real-time order update ke buyer + seller */
  private emitOrderUpdate(order: {
    id: string;
    buyerAccountId: string;
    sellerAccountId: string;
    status: OrderStatus;
    updatedAt: Date;
  }) {
    const payload = {
      orderId: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
    };
    this.notificationsGateway.emitOrderUpdated(order.buyerAccountId, payload);
    this.notificationsGateway.emitOrderUpdated(order.sellerAccountId, payload);
  }

  /** Kirim pesan sistem ke chat room pesanan */
  private async sendSystemChatMessage(
    order: {
      id: string;
      buyerAccountId: string;
      sellerAccountId: string;
    },
    statusType: string,
    messageContent: string,
  ) {
    try {
      const conversation = await this.prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { participants: { some: { accountId: order.buyerAccountId } } },
            { participants: { some: { accountId: order.sellerAccountId } } },
          ],
        },
      });

      if (conversation) {
        await this.chatService.sendMessage(
          conversation.id,
          order.buyerAccountId,
          `[SYSTEM_ORDER_${statusType}] ${messageContent}`,
        );
      }
    } catch (err) {
      console.error(
        `Gagal mengirim pesan sistem chat untuk order ${order.id}:`,
        err,
      );
    }
  }
}
