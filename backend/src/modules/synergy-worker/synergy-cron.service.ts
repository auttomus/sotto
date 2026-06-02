import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediaService } from '../media/media.service';

@Injectable()
export class SynergyCronService {
  private readonly logger = new Logger(SynergyCronService.name);

  constructor(private readonly mediaService: MediaService) {}

  /**
   * Setiap tengah malam: Bersihkan media "Yatim Piatu" (Orphaned).
   * Menghapus file di MinIO dan record di DB yang tidak pernah ditempelkan ke entitas apapun.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleMediaCleanup() {
    this.logger.log('Memulai pembersihan media orphaned...');
    const deletedCount = await this.mediaService.cleanupOrphanedMedia();
    if (deletedCount > 0) {
      this.logger.log(`Pembersihan selesai: ${deletedCount} file dihapus.`);
    } else {
      this.logger.log('Pembersihan selesai: Tidak ada file orphaned.');
    }
  }
}
