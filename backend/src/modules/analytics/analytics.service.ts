import { Injectable, Logger } from '@nestjs/common';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { types } from 'cassandra-driver';
import { MatrixFactorizationService } from '../synergy/matrix-factorization.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly scylla: ScyllaService,
    private readonly matrixFactorization: MatrixFactorizationService,
  ) {}

  /** Catat interaksi user. Fire-and-forget. */
  async trackEvent(userId: string, actionType: string, targetId: string) {
    // 1. Tulis log ke ScyllaDB untuk audit & backup
    await this.scylla.execute(
      `INSERT INTO interaction_logs (user_id, interaction_time, action_type, target_id)
       VALUES (?, ?, ?, ?) USING TTL 2592000`,
      [types.Uuid.fromString(userId), new Date(), actionType, targetId],
    );

    // 2. Lakukan incremental update ke model latent space secara real-time
    const weightMap: Record<string, number> = {
      view: 1.0,
      click: 1.5,
      like: 3.0,
      reply: 5.0,
      order: 10.0,
    };
    const rating = weightMap[actionType.toLowerCase()] ?? 1.0;

    // Fire-and-forget update agar tidak menghambat response API
    this.matrixFactorization
      .updateInteraction(userId, targetId, rating)
      .catch((err) => {
        this.logger.error(`Incremental update gagal: ${err}`);
      });
  }

  /** Ambil log interaksi user dalam rentang waktu tertentu */
  async getInteractionLogs(userId: string, sinceHoursAgo = 168) {
    const since = new Date(Date.now() - sinceHoursAgo * 3600 * 1000);
    const result = await this.scylla.execute(
      `SELECT action_type, target_id, interaction_time FROM interaction_logs
       WHERE user_id = ? AND interaction_time >= ? ORDER BY interaction_time DESC`,
      [types.Uuid.fromString(userId), since],
    );
    return result.rows.map((row) => ({
      actionType: row['action_type'] as string,
      targetId: row['target_id'] as string,
      interactionTime: row['interaction_time'] as Date,
    }));
  }
}
