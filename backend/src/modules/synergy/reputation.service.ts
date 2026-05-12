import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';

@Injectable()
export class ReputationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * R(u_k) = (T_k / 5) · log10(1 + E_j)
   * T_k = trust_score, E_j = engagement count
   */
  async computeReputation(
    authorAccountId: string,
    postId: string,
  ): Promise<number> {
    // Trust score dari PostgreSQL
    const account = await this.prisma.account.findUnique({
      where: { id: authorAccountId },
      select: { trustScore: true },
    });
    const trustScore = account ? Number(account.trustScore) : 0;

    // Engagement count dari Redis (likes, comments, views)
    const engagement =
      (await this.redis.getJson<number>(`post:${postId}:engagement`)) ?? 0;

    return (trustScore / 5) * Math.log10(1 + engagement);
  }

  /** Increment engagement counter untuk sebuah post */
  async incrementEngagement(postId: string): Promise<void> {
    await this.redis.incr(`post:${postId}:engagement`);
  }
}
