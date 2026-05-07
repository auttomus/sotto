import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Memaksa koneksi saat server menyala (Fail-fast)
    await this.$connect();
  }

  async onModuleDestroy() {
    // Menutup koneksi dengan aman saat server dimatikan
    await this.$disconnect();
  }
}
