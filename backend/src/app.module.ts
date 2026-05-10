import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Common
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';

// ORM
import { PrismaModule } from './prisma/prisma.module';

// Infrastructure Adapters
import { RedisInfraModule } from './infrastructure/redis/redis.module';
import { ScyllaInfraModule } from './infrastructure/scylla/scylla.module';
import { MinioInfraModule } from './infrastructure/minio/minio.module';
import { BullInfraModule } from './infrastructure/bull/bull.module';

// Domain Modules — Identity & Social
import { IamModule } from './modules/iam/iam.module';
import { AccountsModule } from './modules/accounts/accounts.module';

// Domain Modules — Content & Discovery
import { FeedModule } from './modules/feed/feed.module';
import { SynergyModule } from './modules/synergy/synergy.module';
import { SynergyWorkerModule } from './modules/synergy-worker/synergy-worker.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SearchModule } from './modules/search/search.module';

// Domain Modules — Gig Economy
import { ListingsModule } from './modules/listings/listings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NegotiationsModule } from './modules/negotiations/negotiations.module';

// Domain Modules — Communication
import { ChatModule } from './modules/chat/chat.module';

// Domain Modules — Supporting
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaModule } from './modules/media/media.module';
import { TagsModule } from './modules/tags/tags.module';
import { SchoolsModule } from './modules/schools/schools.module';

@Module({
  imports: [
    // ─── 1. Konfigurasi Global ──────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      // Meneruskan objek request ke konteks GraphQL
      // agar JWT guard dan @CurrentUser() berfungsi di resolver
      context: ({ req }: { req: Request }) => ({ req }),
    }),

    // ─── 2. Infrastruktur ───────────────────────────────
    PrismaModule,
    RedisInfraModule,
    ScyllaInfraModule,
    MinioInfraModule,
    BullInfraModule,

    // ─── 3. Modul Domain ────────────────────────────────

    // Identity & Social
    IamModule,
    AccountsModule,

    // Content & Discovery (Pilar 1: Panggung Pameran)
    FeedModule,
    SynergyModule,
    SynergyWorkerModule,
    AnalyticsModule,
    SearchModule,

    // Gig Economy (Pilar 2: Pasar Keahlian)
    ListingsModule,
    OrdersModule,
    PaymentsModule,
    NegotiationsModule,

    // Communication (Pilar 3: Ruang Negosiasi)
    ChatModule,

    // Supporting
    NotificationsModule,
    MediaModule,
    TagsModule,
    SchoolsModule,
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
