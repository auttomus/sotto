import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './modules/iam/iam.module';
import { ListingsModule } from './modules/listings/listings.module';

@Module({
  imports: [
    // Membuat ConfigModule bisa diakses dari mana saja tanpa import ulang
    ConfigModule.forRoot({ isGlobal: true }),

    // Modul database kita
    PrismaModule,

    IamModule,

    ListingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
