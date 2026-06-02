import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { TagsService } from '../tags/tags.service';

export interface LatentPost {
  vector: number[];
  bias: number;
  tags: string[];
}

@Injectable()
export class VectorService {
  constructor(
    private readonly redis: RedisService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Mengambil representasi latent vector dan bias untuk user.
   */
  async getLatentUser(
    accountId: string,
  ): Promise<{ vector: number[]; bias: number }> {
    const key = `latent:v1:user:${accountId}`;
    const cached = await this.redis.getJson<{ vector: number[]; bias: number }>(
      key,
    );
    if (cached) return cached;

    // Default: inisialisasi acak kecil agar tidak bias 0
    const vector = Array.from(
      { length: 16 },
      () => (Math.random() - 0.5) * 0.1,
    );
    return { vector, bias: 0 };
  }

  /**
   * Mengambil representasi latent vector dan bias untuk post.
   * Menggunakan rata-rata embedding tag (Content-based) untuk post baru/cold-start.
   */
  async getLatentPost(postId: string): Promise<LatentPost> {
    const key = `latent:v1:post:${postId}`;
    let cached = await this.redis.getJson<LatentPost>(key);

    if (!cached) {
      let tagNames: string[] = [];
      try {
        const tags = await this.tagsService.getTagsForObject(
          postId,
          'ScyllaPost',
        );
        tagNames = tags.map((t) => t.name);
      } catch {
        // Abaikan database error, inisialisasi kosong
      }

      const vector = Array.from(
        { length: 16 },
        () => (Math.random() - 0.5) * 0.1,
      );

      cached = { vector, bias: 0, tags: tagNames };
      // Simpan di Redis dengan TTL 7 hari
      await this.redis.setJson(key, cached, 604800);
    }

    if (cached.tags.length === 0) return cached;

    // Komposisikan vektor spesifik post dengan rata-rata embedding tagnya
    const totalVector = [...cached.vector];
    let tagCount = 0;

    for (const tagName of cached.tags) {
      const tagVec = await this.redis.getJson<number[]>(
        `latent:v1:tag:${tagName}`,
      );
      if (tagVec) {
        for (let d = 0; d < 16; d++) {
          totalVector[d] += tagVec[d];
        }
        tagCount++;
      }
    }

    if (tagCount > 0) {
      for (let d = 0; d < 16; d++) {
        totalVector[d] /= tagCount + 1;
      }
    }

    return { vector: totalVector, bias: cached.bias, tags: cached.tags };
  }

  /**
   * Mengambil nilai global baseline mean (mu) untuk kalkulasi rekomendasi.
   */
  getGlobalMu(): number {
    return 2.0;
  }
}
