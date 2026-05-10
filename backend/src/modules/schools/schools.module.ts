import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsResolver } from './schools.resolver';

@Module({
  providers: [SchoolsResolver, SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
