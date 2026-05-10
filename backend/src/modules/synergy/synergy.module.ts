import { Module } from '@nestjs/common';
import { SynergyService } from './synergy.service';
import { VectorService } from './vector.service';
import { GraphProximityService } from './graph-proximity.service';
import { ReputationService } from './reputation.service';
import { TagsModule } from '../tags/tags.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TagsModule, AccountsModule],
  providers: [
    SynergyService,
    VectorService,
    GraphProximityService,
    ReputationService,
  ],
  exports: [SynergyService, VectorService, ReputationService],
})
export class SynergyModule {}
