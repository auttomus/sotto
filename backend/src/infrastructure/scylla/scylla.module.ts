import { Global, Module } from '@nestjs/common';
import { ScyllaService } from './scylla.service';

@Global()
@Module({
  providers: [ScyllaService],
  exports: [ScyllaService],
})
export class ScyllaInfraModule {}
