import { Injectable } from '@nestjs/common';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly scylla: ScyllaService) {}

  /** Catat interaksi user. Fire-and-forget. */
  async trackEvent(userId: bigint, actionType: string, targetId: string) {
    await this.scylla.execute(
      `INSERT INTO interaction_logs (user_id, interaction_time, action_type, target_id)
       VALUES (?, ?, ?, ?)`,
      [userId.toString(), new Date(), actionType, targetId],
    );
  }

  /** Ambil log interaksi user dalam rentang waktu tertentu */
  async getInteractionLogs(userId: bigint, sinceHoursAgo = 168) {
    const since = new Date(Date.now() - sinceHoursAgo * 3600 * 1000);
    const result = await this.scylla.execute(
      `SELECT action_type, target_id, interaction_time FROM interaction_logs
       WHERE user_id = ? AND interaction_time >= ? ORDER BY interaction_time DESC`,
      [userId.toString(), since],
    );
    return result.rows.map((row) => ({
      actionType: row['action_type'] as string,
      targetId: row['target_id'] as string,
      interactionTime: row['interaction_time'] as Date,
    }));
  }
}
