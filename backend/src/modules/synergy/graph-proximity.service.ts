import { Injectable } from '@nestjs/common';
import { FollowsService } from '../accounts/follows.service';

@Injectable()
export class GraphProximityService {
  constructor(private readonly followsService: FollowsService) {}

  /**
   * Hitung G(u_i, u_k) = e^(-λ_g · d(u_i, u_k))
   * d: 0=self, 1=mutual, 2=one-way, 3=strangers
   */
  async computeProximity(
    accountIdA: bigint,
    accountIdB: bigint,
    lambdaG: number,
  ): Promise<number> {
    const distance = await this.followsService.computeGraphDistance(
      accountIdA,
      accountIdB,
    );
    return Math.exp(-lambdaG * distance);
  }
}
