import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SynergyCronService } from './synergy-cron.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { SynergyModule } from '../synergy/synergy.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AnalyticsModule,
    SynergyModule,
    TagsModule,
  ],
  providers: [SynergyCronService],
})
export class SynergyWorkerModule {}
