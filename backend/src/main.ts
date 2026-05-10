import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

// 1. Mendaftarkan fungsi toJSON ke dalam antarmuka global BigInt milik TypeScript
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// 2. Mengimplementasikan fungsi dengan mendeklarasikan tipe 'this' secara eksplisit
BigInt.prototype.toJSON = function (this: bigint) {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation & Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Membuang properti ilegal
      forbidNonWhitelisted: true, // Menolak request jika ada data sampah
      transform: true, // WAJIB: Agar class-transformer di DTO bisa bekerja
    }),
  );

  // Global Exception Filters
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Mengaktifkan CORS (Cross-Origin Resource Sharing)
  // PERBAIKAN: origin wildcard '*' + credentials: true = browser reject.
  // Gunakan URL eksplisit dari .env
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Server mendengarkan di port 3000
  await app.listen(process.env.PORT ?? 3000);
}

// Menangani error jika aplikasi gagal start
bootstrap().catch((err) => {
  console.error('CRITICAL ERROR saat booting aplikasi:', err);
});
