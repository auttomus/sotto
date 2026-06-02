import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { VectorService } from './vector.service';

@Injectable()
export class MatrixFactorizationService {
  private readonly logger = new Logger(MatrixFactorizationService.name);
  private readonly latentDim = 16;
  private readonly learningRate = 0.05;
  private readonly regularization = 0.02;
  private readonly globalMu = 2.0;

  constructor(
    private readonly redis: RedisService,
    private readonly vectorService: VectorService,
  ) {}

  /**
   * Mengupdate parameter user, post, dan tag secara incremental (1 step SGD).
   * Dipanggil secara asynchronous ketika ada interaksi baru (view, like, reply, dll).
   */
  async updateInteraction(userId: string, postId: string, rating: number) {
    const userKey = `latent:v1:user:${userId}`;
    const postKey = `latent:v1:post:${postId}`;

    try {
      // 1. Ambil representasi user & pastikan post ter-cache (termasuk tag list-nya)
      const user = await this.vectorService.getLatentUser(userId);
      await this.vectorService.getLatentPost(postId);

      // Ambil data mentah post (sebelum dikomposisikan dengan tag) dari cache
      const postCached = await this.redis.getJson<{
        vector: number[];
        bias: number;
        tags: string[];
      }>(postKey);
      if (!postCached) return;

      // 2. Ambil representasi latent untuk masing-masing tag dari post
      const tagVectors: number[][] = [];
      for (const tagName of postCached.tags) {
        const tagKey = `latent:v1:tag:${tagName}`;
        const tagVec = await this.redis.getJson<number[]>(tagKey);
        tagVectors.push(
          tagVec ??
            Array.from(
              { length: this.latentDim },
              () => (Math.random() - 0.5) * 0.1,
            ),
        );
      }

      // 3. Hitung q_i^total = q_i + mean(v_t)
      const qTotal = [...postCached.vector];
      if (tagVectors.length > 0) {
        for (let d = 0; d < this.latentDim; d++) {
          const tagSum = tagVectors.reduce((sum, tv) => sum + tv[d], 0);
          qTotal[d] += tagSum / tagVectors.length;
        }
      }

      // 4. Hitung estimasi prediksi: r_hat = mu + b_u + b_i + (p_u . q_total)
      const dotProduct = user.vector.reduce(
        (sum, val, idx) => sum + val * qTotal[idx],
        0,
      );
      const prediction =
        this.globalMu + user.bias + postCached.bias + dotProduct;

      // 5. Hitung error: e = rating_aktual - rating_prediksi
      const error = rating - prediction;

      // 6. Update bias menggunakan SGD
      const nextUserBias =
        user.bias +
        this.learningRate * (error - this.regularization * user.bias);
      const nextPostBias =
        postCached.bias +
        this.learningRate * (error - this.regularization * postCached.bias);

      // 7. Update vektor laten user & post menggunakan SGD
      const nextUserVector = [...user.vector];
      const nextPostVector = [...postCached.vector];

      for (let d = 0; d < this.latentDim; d++) {
        const uVal = user.vector[d];
        const pVal = postCached.vector[d];

        nextUserVector[d] +=
          this.learningRate * (error * qTotal[d] - this.regularization * uVal);
        nextPostVector[d] +=
          this.learningRate * (error * uVal - this.regularization * pVal);
      }

      // 8. Update vektor laten tag-tag pendukung menggunakan SGD
      const nextTagVectors: number[][] = [];
      if (tagVectors.length > 0) {
        for (let i = 0; i < tagVectors.length; i++) {
          const tv = tagVectors[i];
          const nextTv = [...tv];
          for (let d = 0; d < this.latentDim; d++) {
            nextTv[d] +=
              this.learningRate *
              ((error / tagVectors.length) * user.vector[d] -
                this.regularization * tv[d]);
          }
          nextTagVectors.push(nextTv);
        }
      }

      // 9. Simpan kembali semuanya ke Redis
      await this.redis.setJson(
        userKey,
        { vector: nextUserVector, bias: nextUserBias },
        604800, // 7 hari TTL
      );
      await this.redis.setJson(
        postKey,
        { vector: nextPostVector, bias: nextPostBias, tags: postCached.tags },
        604800, // 7 hari TTL
      );

      for (let i = 0; i < postCached.tags.length; i++) {
        const tagKey = `latent:v1:tag:${postCached.tags[i]}`;
        await this.redis.setJson(tagKey, nextTagVectors[i], 2592000); // 30 hari TTL
      }
    } catch (err) {
      this.logger.error(
        `Gagal melakukan incremental update untuk user ${userId} dan post ${postId}: ${err}`,
      );
    }
  }
}
