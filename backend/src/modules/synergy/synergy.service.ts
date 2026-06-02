import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VectorService } from './vector.service';
import { GraphProximityService } from './graph-proximity.service';
import { ReputationService } from './reputation.service';

interface CandidatePost {
  postId: string;
  authorId: string;
  createdAt: Date;
}

@Injectable()
export class SynergyService {
  private alpha: number;
  private beta: number;
  private gamma: number;
  private lambdaG: number;
  private lambdaT: number;
  private freshnessBoost: number;
  private freshnessDecay: number;

  constructor(
    private readonly config: ConfigService,
    private readonly vectorService: VectorService,
    private readonly graphProximity: GraphProximityService,
    private readonly reputation: ReputationService,
  ) {
    this.alpha = parseFloat(this.config.get('SYNERGY_ALPHA', '0.6'));
    this.beta = parseFloat(this.config.get('SYNERGY_BETA', '0.1'));
    this.gamma = parseFloat(this.config.get('SYNERGY_GAMMA', '0.3'));
    this.lambdaG = parseFloat(this.config.get('SYNERGY_LAMBDA_G', '0.5'));
    this.lambdaT = parseFloat(this.config.get('SYNERGY_LAMBDA_T', '0.0577'));
    this.freshnessBoost = parseFloat(
      this.config.get('SYNERGY_FRESHNESS_BOOST', '0.5'),
    );
    this.freshnessDecay = parseFloat(
      this.config.get('SYNERGY_FRESHNESS_DECAY', '0.3466'),
    );
  }

  /**
   * Mengurutkan daftar postingan berdasarkan kedekatan latent space, graf sosial, reputasi, dan peluruhan waktu.
   */
  async rankPosts<T extends CandidatePost>(
    accountId: string,
    candidates: T[],
    topN = 20,
  ): Promise<(T & { score: number })[]> {
    if (candidates.length === 0) return [];

    const user = await this.vectorService.getLatentUser(accountId);
    const now = Date.now();

    const scored = await Promise.all(
      candidates.map(async (post) => {
        // 1. C(u_i, p_j): Kemiripan latent space + bias
        const postLatent = await this.vectorService.getLatentPost(post.postId);
        const similarity = this.computeLatentSimilarity(
          user.vector,
          postLatent.vector,
        );
        const affinity = similarity + user.bias + postLatent.bias;

        // 2. G(u_i, u_k): Kedekatan graf sosial
        const proximity = await this.graphProximity.computeProximity(
          accountId,
          post.authorId,
          this.lambdaG,
        );

        // 3. R(u_k): Reputasi & kualitas postingan
        const rep = await this.reputation.computeReputation(
          post.authorId,
          post.postId,
        );

        // 4. D(Δt): Peluruhan waktu (time decay) & Freshness Boost
        const ageHours =
          (now - new Date(post.createdAt).getTime()) / (1000 * 3600);
        const timeDecay = Math.exp(-this.lambdaT * ageHours);
        const freshBoost =
          this.freshnessBoost * Math.exp(-this.freshnessDecay * ageHours);

        // 5. Total Score
        const baseScore =
          this.alpha * affinity + this.beta * proximity + this.gamma * rep;
        const score = baseScore * timeDecay + freshBoost;

        return { ...post, score };
      }),
    );

    // Urutkan berdasarkan skor tertinggi, ambil top N
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
  }

  /**
   * Menghitung cosine similarity antara dua vektor laten.
   */
  private computeLatentSimilarity(
    userVector: number[],
    postVector: number[],
  ): number {
    const dotProduct = userVector.reduce(
      (sum, val, idx) => sum + val * postVector[idx],
      0,
    );
    const normUser = Math.sqrt(
      userVector.reduce((sum, val) => sum + val * val, 0),
    );
    const normPost = Math.sqrt(
      postVector.reduce((sum, val) => sum + val * val, 0),
    );

    if (normUser === 0 || normPost === 0) return 0;
    return dotProduct / (normUser * normPost);
  }
}
