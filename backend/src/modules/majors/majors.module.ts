import { Module } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { MajorsResolver } from './majors.resolver';

@Module({
  providers: [MajorsResolver, MajorsService],
  exports: [MajorsService],
})
export class MajorsModule {}
