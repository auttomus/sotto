import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Ambil profil berdasarkan username (public) */
  async getProfileByUsername(username: string) {
    const account = await this.prisma.account.findUnique({
      where: { username },
      include: { school: { select: { name: true } } },
    });
    if (!account) throw new NotFoundException('Akun tidak ditemukan.');
    return account;
  }

  /** Ambil profil berdasarkan ID */
  async getProfileById(accountId: bigint) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { school: { select: { name: true } } },
    });
    if (!account) throw new NotFoundException('Akun tidak ditemukan.');
    return account;
  }

  /** Update profil sendiri */
  async updateProfile(accountId: bigint, input: UpdateProfileInput) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(input.displayName !== undefined && { displayName: input.displayName }),
        ...(input.note !== undefined && { note: input.note }),
        ...(input.major !== undefined && { major: input.major }),
        ...(input.avatarObjectKey !== undefined && { avatarObjectKey: input.avatarObjectKey }),
      },
      include: { school: { select: { name: true } } },
    });
  }

  /** Ambil daftar followers */
  async getFollowers(accountId: bigint, cursor?: string, take = 20) {
    const follows = await this.prisma.follow.findMany({
      where: { targetAccountId: accountId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor ? { cursor: { id: BigInt(cursor) }, skip: 1 } : {}),
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
  async getFollowing(accountId: bigint, cursor?: string, take = 20) {
    const follows = await this.prisma.follow.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor ? { cursor: { id: BigInt(cursor) }, skip: 1 } : {}),
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
