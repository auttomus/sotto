import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VectorService } from './vector.service';
import { GraphProximityService } from './graph-proximity.service';
import { ReputationService } from './reputation.service';
import { COMPLEMENTARITY_MATRIX } from './constants/complementarity-matrix';

interface CandidatePost {
  postId: string;
  authorId: string;
  createdAt: Date;
}

interface RankedPost extends CandidatePost {
  score: number;
}

@Injectable()
export class SynergyService {
  private alpha: number;
  private beta: number;
  private gamma: number;
  private lambdaG: number;
  private lambdaT: number;

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
    this.lambdaT = parseFloat(this.config.get('SYNERGY_LAMBDA_T', '0.0288'));
  }

  /**
   * S(u_i, p_j) = [α·C(u_i,p_j) + β·G(u_i,u_k) + γ·R(u_k)] · D(Δt)
   * Mengurutkan daftar postingan berdasarkan relevansi untuk user tertentu.
   */
  async rankPosts(
    accountId: string,
    candidates: CandidatePost[],
    topN = 20,
  ): Promise<RankedPost[]> {
    if (candidates.length === 0) return [];

    const demandVector = await this.vectorService.getDemandVector(accountId);
    const now = Date.now();

    const scored: RankedPost[] = await Promise.all(
      candidates.map(async (post) => {
        // C(u_i, p_j): Komplementaritas vektor
        const supplyVector = await this.vectorService.buildSupplyVector(
          post.postId,
        );
        const complementarity = this.computeComplementarity(
          demandVector,
          supplyVector,
        );

        // G(u_i, u_k): Kedekatan graf
        const proximity = await this.graphProximity.computeProximity(
          BigInt(accountId),
          BigInt(post.authorId),
          this.lambdaG,
        );

        // R(u_k): Reputasi & kualitas
        const rep = await this.reputation.computeReputation(
          BigInt(post.authorId),
          post.postId,
        );

        // D(Δt): Peluruhan waktu
        const ageHours =
          (now - new Date(post.createdAt).getTime()) / (1000 * 3600);
        const timeDecay = Math.exp(-this.lambdaT * ageHours);

        // S(u_i, p_j)
        const score =
          (this.alpha * complementarity +
            this.beta * proximity +
            this.gamma * rep) *
          timeDecay;

        return { ...post, score };
      }),
    );

    // Sort descending by score, ambil top N
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
  }

  /**
   * C(u_i, p_j) = d_i^T · M · s_j / (||d_i|| · ||M·s_j||)
   * Modified cosine similarity melalui matriks komplementaritas.
   */
  private computeComplementarity(demand: number[], supply: number[]): number {
    const M = COMPLEMENTARITY_MATRIX;

    // M·s_j (matrix-vector multiplication)
    const mTimesSupply = M.map((row) =>
      row.reduce((sum, val, i) => sum + val * supply[i], 0),
    );

    // d_i^T · (M·s_j) (dot product)
    const dotProduct = demand.reduce(
      (sum, val, i) => sum + val * mTimesSupply[i],
      0,
    );

    // Norms
    const normDemand = Math.sqrt(
      demand.reduce((sum, val) => sum + val * val, 0),
    );
    const normMSupply = Math.sqrt(
      mTimesSupply.reduce((sum, val) => sum + val * val, 0),
    );

    if (normDemand === 0 || normMSupply === 0) return 0;

    return dotProduct / (normDemand * normMSupply);
  }
}
