import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  // Mengaktifkan CORS (Cross-Origin Resource Sharing)
  // Penting agar frontend (Vite) bisa berkomunikasi dengan backend ini
  app.enableCors({
    origin: '*',
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
