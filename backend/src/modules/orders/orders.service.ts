import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Buat order baru (status: PENDING_PAYMENT) */
  async createOrder(buyerAccountId: bigint, input: CreateOrderInput) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: BigInt(input.listingId) },
    });
    if (!listing) throw new NotFoundException('Listing tidak ditemukan.');

    if (listing.accountId === buyerAccountId) {
      throw new BadRequestException('Tidak bisa membeli listing sendiri.');
    }

    return this.prisma.order.create({
      data: {
        buyerAccountId,
        sellerAccountId: listing.accountId,
        listingId: listing.id,
        customOfferId: input.customOfferId
          ? BigInt(input.customOfferId)
          : undefined,
        agreedPrice: input.agreedPrice,
        status: OrderStatus.PENDING_PAYMENT,
      },
    });
  }

  /** Advance order status: state machine transitions */
  async advanceStatus(orderId: bigint, accountId: bigint) {
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
    return this.prisma.order.update({
      where: {
        id: orderId,
        lockVersion: order.lockVersion,
      },
      data: {
        status: newStatus,
        lockVersion: { increment: 1 },
      },
    });
  }

  /** Cancel order */
  async cancelOrder(orderId: bigint, accountId: bigint) {
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

    return this.prisma.order.update({
      where: { id: orderId, lockVersion: order.lockVersion },
      data: { status: OrderStatus.CANCELLED, lockVersion: { increment: 1 } },
    });
  }

  /** Ambil order berdasarkan ID */
  async getOrder(orderId: bigint) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true, buyer: true, seller: true },
    });
  }

  /** Ambil daftar order milik user */
  async getMyOrders(
    accountId: bigint,
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
}
