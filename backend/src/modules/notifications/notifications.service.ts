import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  /** Buat notifikasi baru. Dipanggil oleh modul lain (orders, chat, follows). */
  async createNotification(params: {
    accountId: string;
    fromAccountId?: string;
    type: NotificationType;
    targetType?: string;
    targetId?: string;
  }) {
    // Jangan buat notifikasi untuk diri sendiri
    if (params.fromAccountId && params.fromAccountId === params.accountId) {
      return null;
    }

    const notif = await this.prisma.notification.create({
      data: {
        accountId: params.accountId,
        fromAccountId: params.fromAccountId,
        type: params.type,
        targetType: params.targetType,
        targetId: params.targetId,
      },
      include: {
        fromAccount: { select: { displayName: true } },
      },
    });

    // Push real-time ke client via Socket.IO
    this.gateway.emitNewNotification(params.accountId, {
      id: notif.id,
      type: notif.type,
      targetType: notif.targetType,
      targetId: notif.targetId,
      fromAccountId: notif.fromAccountId,
      fromDisplayName:
        (notif as { fromAccount?: { displayName?: string | null } | null })
          .fromAccount?.displayName ?? null,
      isRead: notif.isRead,
      createdAt: notif.createdAt,
    });

    return notif;
  }

  /** Ambil notifikasi milik user dengan cursor pagination */
  async getNotifications(accountId: string, cursor?: string, take = 20) {
    return this.prisma.notification.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: take + 1, // Ambil 1 ekstra untuk cek hasMore
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        fromAccount: { select: { displayName: true } },
      },
    });
  }

  /** Hitung notifikasi yang belum dibaca */
  async getUnreadCount(accountId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { accountId, isRead: false },
    });
  }

  /** Tandai satu notifikasi sebagai sudah dibaca */
  async markAsRead(notificationId: string, accountId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, accountId },
      data: { isRead: true },
    });
  }

  /** Tandai semua notifikasi milik user sebagai sudah dibaca */
  async markAllAsRead(accountId: string) {
    return this.prisma.notification.updateMany({
      where: { accountId, isRead: false },
      data: { isRead: true },
    });
  }
}
