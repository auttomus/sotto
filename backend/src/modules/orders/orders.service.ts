import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus, NotificationType, ListingType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
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
            ? (listing.type === ListingType.DIGITAL_PRODUCT ? OrderStatus.COMPLETED : OrderStatus.IN_PROGRESS)
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
    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        // Payment confirmed → in progress (biasanya dipicu oleh webhook)
        newStatus = OrderStatus.IN_PROGRESS;
        break;
      case OrderStatus.IN_PROGRESS:
        // Seller kirim hasil → completed (buyer confirm)
        if (!isBuyer)
          throw new BadRequestException(
            'Hanya pembeli yang bisa menyelesaikan order.',
          );
        newStatus = OrderStatus.COMPLETED;
        break;
      default:
        throw new BadRequestException(
          `Order dengan status ${order.status} tidak bisa di-advance.`,
        );
    }

    // Optimistic locking
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
        lockVersion: order.lockVersion,
      },
      data: {
        status: newStatus,
        lockVersion: { increment: 1 },
      },
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

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId, lockVersion: order.lockVersion },
      data: { status: OrderStatus.CANCELLED, lockVersion: { increment: 1 } },
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
}
