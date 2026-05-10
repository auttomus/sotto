import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsService } from '../analytics/analytics.service';
import { VectorService } from '../synergy/vector.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import {
  CATEGORY_INDEX_MAP,
  VECTOR_DIMENSIONS,
} from '../synergy/constants/complementarity-matrix';

@Injectable()
export class SynergyCronService {
  private readonly logger = new Logger(SynergyCronService.name);

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly vectorService: VectorService,
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Setiap jam: hitung vektor demand d_i untuk semua user aktif.
   * Baca interaction_logs dari ScyllaDB → aggregate per kategori → cache ke Redis.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async computeDemandVectors() {
    this.logger.log('Memulai komputasi vektor demand...');

    // Ambil semua account IDs yang punya interaksi
    const accounts = await this.prisma.account.findMany({
      select: { id: true },
    });

    let processed = 0;
    for (const account of accounts) {
      try {
        const logs = await this.analyticsService.getInteractionLogs(
          account.id,
          168, // 7 hari terakhir
        );

        if (logs.length === 0) continue;

        // Aggregate: hitung frekuensi interaksi per kategori tag
        const categoryCounts = new Array(VECTOR_DIMENSIONS).fill(0);
        let totalCategorized = 0;

        for (const log of logs) {
          // Ambil tag dari target post
          const tags = await this.tagsService.getTagsForObject(
            log.targetId,
            'ScyllaPost',
          );
          for (const tag of tags) {
            const index = CATEGORY_INDEX_MAP[tag.name];
            if (index !== undefined) {
              categoryCounts[index]++;
              totalCategorized++;
            }
          }
        }

        // Normalisasi
        const demandVector =
          totalCategorized > 0
            ? categoryCounts.map((c) => c / totalCategorized)
            : new Array(VECTOR_DIMENSIONS).fill(0);

        await this.vectorService.setDemandVector(
          account.id.toString(),
          demandVector,
        );
        processed++;
      } catch (err) {
        this.logger.error(
          `Gagal proses demand vector untuk account ${account.id}: ${err}`,
        );
      }
    }

    this.logger.log(`Selesai: ${processed}/${accounts.length} vektor diupdate`);
  }
}
