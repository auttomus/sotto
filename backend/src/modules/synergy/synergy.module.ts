import { Module } from '@nestjs/common';
import { SynergyService } from './synergy.service';
import { VectorService } from './vector.service';
import { GraphProximityService } from './graph-proximity.service';
import { ReputationService } from './reputation.service';
import { TagsModule } from '../tags/tags.module';
import { AccountsModule } from '../accounts/accounts.module';
import { MatrixFactorizationService } from './matrix-factorization.service';

@Module({
  imports: [TagsModule, AccountsModule],
  providers: [
    SynergyService,
    VectorService,
    GraphProximityService,
    ReputationService,
    MatrixFactorizationService,
  ],
  exports: [
    SynergyService,
    VectorService,
    ReputationService,
    MatrixFactorizationService,
  ],
})
export class SynergyModule {}
