import { Module } from '@nestjs/common';
import { NegotiationsService } from './negotiations.service';
import { NegotiationsResolver } from './negotiations.resolver';

@Module({
  providers: [NegotiationsResolver, NegotiationsService],
  exports: [NegotiationsService],
})
export class NegotiationsModule {}
