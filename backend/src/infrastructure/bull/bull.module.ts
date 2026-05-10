import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Modul global untuk Bull queue.
 * Menggunakan Redis sebagai backend.
 * Domain modules mendaftarkan queue spesifik via BullModule.registerQueue().
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get<string>('REDIS_URL', 'redis://localhost:6379'),
      }),
    }),
  ],
  exports: [BullModule],
})
export class BullInfraModule {}
