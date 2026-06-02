import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Ambil profil berdasarkan username atau ID (public) */
  async getProfileByUsername(usernameOrId: string) {
    // Regex sederhana untuk mengecek format UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        usernameOrId,
      );

    const account = await this.prisma.account.findFirst({
      where: isUuid ? { id: usernameOrId } : { username: usernameOrId },
      include: {
        school: { select: { name: true } },
        major: { select: { name: true } },
      },
    });
    if (!account) throw new NotFoundException('Akun tidak ditemukan.');
    return account;
  }

  /** Ambil profil berdasarkan ID */
  async getProfileById(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        school: { select: { name: true } },
        major: { select: { name: true } },
      },
    });
    if (!account) throw new NotFoundException('Akun tidak ditemukan.');
    return account;
  }

  /** Update profil sendiri */
  async updateProfile(accountId: string, input: UpdateProfileInput) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(input.displayName !== undefined && {
          displayName: input.displayName,
        }),
        ...(input.note !== undefined && { note: input.note }),
        ...(input.avatarObjectKey !== undefined && {
          avatarObjectKey: input.avatarObjectKey,
        }),
        ...(input.bannerObjectKey !== undefined && {
          bannerObjectKey: input.bannerObjectKey,
        }),
      },
      include: {
        school: { select: { name: true } },
        major: { select: { name: true } },
      },
    });
  }

  /** Ambil daftar followers */
  async getFollowers(accountId: string, cursor?: string, take = 20) {
    const follows = await this.prisma.follow.findMany({
      where: { targetAccountId: accountId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor
        ? {
            cursor: {
              accountId_targetAccountId: {
                accountId: cursor,
                targetAccountId: accountId,
              },
            },
            skip: 1,
          }
        : {}),
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarObjectKey: true,
            trustScore: true,
          },
        },
      },
    });
    return follows.map((f) => f.follower);
  }

  /** Ambil daftar following */
  async getFollowing(accountId: string, cursor?: string, take = 20) {
    const follows = await this.prisma.follow.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor
        ? {
            cursor: {
              accountId_targetAccountId: {
                accountId: accountId,
                targetAccountId: cursor,
              },
            },
            skip: 1,
          }
        : {}),
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarObjectKey: true,
            trustScore: true,
          },
        },
      },
    });
    return follows.map((f) => f.following);
  }
}
