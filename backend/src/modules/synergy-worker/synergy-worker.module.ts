import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SynergyCronService } from './synergy-cron.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [ScheduleModule.forRoot(), MediaModule],
  providers: [SynergyCronService],
})
export class SynergyWorkerModule {}
