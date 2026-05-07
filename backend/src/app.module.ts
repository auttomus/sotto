import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './modules/iam/iam.module';
import { ListingsModule } from './modules/listings/listings.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    // 1. Konfigurasi Environment Global
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Skema di-generate otomatis di sini
      sortSchema: true,
      playground: true, // Mengaktifkan GUI Apollo Playground di /graphql
    }),

    // 3. Modul Infrastruktur
    PrismaModule,

    // 4. Modul Domain
    IamModule,
  ],
})
export class AppModule {}
