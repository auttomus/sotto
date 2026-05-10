import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { TagsService } from '../tags/tags.service';
import {
  CATEGORY_INDEX_MAP,
  VECTOR_DIMENSIONS,
} from './constants/complementarity-matrix';

@Injectable()
export class VectorService {
  constructor(
    private readonly redis: RedisService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Bangun vektor supply s_j dari tag-tag sebuah postingan.
   * Tag yang cocok dengan kategori utama mendapat bobot merata.
   */
  async buildSupplyVector(postId: string): Promise<number[]> {
    const tags = await this.tagsService.getTagsForObject(postId, 'ScyllaPost');
    const vector = new Array<number>(VECTOR_DIMENSIONS).fill(0);

    let matchCount = 0;
    for (const tag of tags) {
      const index = CATEGORY_INDEX_MAP[tag.name];
      if (index !== undefined) {
        vector[index] = 1;
        matchCount++;
      }
    }

    // Normalisasi: bagi rata bobot antar kategori yang cocok
    if (matchCount > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= matchCount;
      }
    }

    return vector;
  }

  /**
   * Ambil vektor demand d_i dari Redis cache.
   * Ditulis oleh synergy-worker secara berkala.
   */
  async getDemandVector(accountId: string): Promise<number[]> {
    const cached = await this.redis.getJson<number[]>(
      `user:${accountId}:demand`,
    );
    // Default: vektor nol (user baru tanpa riwayat interaksi)
    return cached ?? new Array<number>(VECTOR_DIMENSIONS).fill(0);
  }

  /** Simpan vektor demand ke Redis cache */
  async setDemandVector(
    accountId: string,
    vector: number[],
    ttlSeconds = 7200,
  ): Promise<void> {
    await this.redis.setJson(`user:${accountId}:demand`, vector, ttlSeconds);
  }
}
