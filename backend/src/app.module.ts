import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './modules/iam/iam.module';
import { ListingsModule } from './modules/listings/listings.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';

@Module({
  imports: [
    // 1. Konfigurasi Environment Global
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. GraphQL (Apollo)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      // Meneruskan objek request Express ke dalam konteks GraphQL
      // agar JwtAuthGuard dan @CurrentUser() bisa berfungsi di resolver
      context: ({ req }: { req: Request }) => ({ req }),
    }),

    // 3. Modul Infrastruktur
    PrismaModule,

    // 4. Modul Domain
    IamModule,
    ListingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Guard: semua endpoint terlindungi secara default.
    // Endpoint publik harus ditandai eksplisit dengan @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
