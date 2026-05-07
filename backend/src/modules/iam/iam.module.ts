import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Registrasi JWT secara dinamis membaca dari .env
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'sotto_super_secret_key_2026'),
        signOptions: { expiresIn: '7d' }, // Token hangus dalam 7 hari
      }),
    }),
  ],
  controllers: [IamController],
  providers: [IamService, JwtStrategy],
})
export class IamModule {}
