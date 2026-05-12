import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Follow seseorang. Update counter secara atomic. */
  async follow(accountId: string, targetAccountId: string) {
    if (accountId === targetAccountId) {
      throw new ConflictException('Tidak bisa follow diri sendiri.');
    }

    // Cek apakah sudah follow
    const existing = await this.prisma.follow.findUnique({
      where: {
        accountId_targetAccountId: { accountId, targetAccountId },
      },
    });
    if (existing) throw new ConflictException('Sudah mengikuti akun ini.');

    // Buat follow + update counter dalam satu transaksi
    await this.prisma.$transaction([
      this.prisma.follow.create({
        data: { accountId, targetAccountId },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { followingCount: { increment: 1 } },
      }),
      this.prisma.account.update({
        where: { id: targetAccountId },
        data: { followersCount: { increment: 1 } },
      }),
    ]);
    return true;
  }

  /** Unfollow seseorang. Update counter secara atomic. */
  async unfollow(accountId: string, targetAccountId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: {
        accountId_targetAccountId: { accountId, targetAccountId },
      },
    });
    if (!existing) return false;

    await this.prisma.$transaction([
      this.prisma.follow.delete({
        where: { id: existing.id },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { followingCount: { decrement: 1 } },
      }),
      this.prisma.account.update({
        where: { id: targetAccountId },
        data: { followersCount: { decrement: 1 } },
      }),
    ]);
    return true;
  }

  /** Cek apakah accountId mengikuti targetAccountId */
  async isFollowing(
    accountId: string,
    targetAccountId: string,
  ): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        accountId_targetAccountId: { accountId, targetAccountId },
      },
    });
    return !!follow;
  }

  /** Cek apakah saling follow (mutual) */
  async isMutual(accountIdA: string, accountIdB: string): Promise<boolean> {
    const count = await this.prisma.follow.count({
      where: {
        OR: [
          { accountId: accountIdA, targetAccountId: accountIdB },
          { accountId: accountIdB, targetAccountId: accountIdA },
        ],
      },
    });
    return count === 2;
  }

  /**
   * Hitung jarak graf heuristik untuk Synergy Engine.
   * 0 = diri sendiri, 1 = mutual, 2 = follow sepihak, 3 = strangers.
   */
  async computeGraphDistance(
    accountIdA: string,
    accountIdB: string,
  ): Promise<number> {
    if (accountIdA === accountIdB) return 0;
    const follows = await this.prisma.follow.findMany({
      where: {
        OR: [
          { accountId: accountIdA, targetAccountId: accountIdB },
          { accountId: accountIdB, targetAccountId: accountIdA },
        ],
      },
    });
    if (follows.length === 2) return 1; // mutual
    if (follows.length === 1) return 2; // one-way
    return 3; // strangers
  }
}
