# Sotto Backend Service

Layanan inti backend Sotto yang dibangun dengan framework NestJS. Mengintegrasikan data relasional (PostgreSQL), data high-throughput (ScyllaDB), caching & queues (Redis), serta mesin rekomendasi Synergy Engine.

## Kredit Teknologi & Stack Utama

Sotto Backend memanfaatkan teknologi berikut:
* Framework: NestJS (TypeScript)
* API Gateway: GraphQL (Apollo Server) & REST API (khusus Authentication & Midtrans Webhook)
* Database Relasional: PostgreSQL dengan ORM Prisma
* Database NoSQL: ScyllaDB (menggunakan Cassandra Node Driver) untuk data berskala besar (posts, chat messages, interaction logs, feeds)
* Caching & Message Broker: Redis & BullMQ (Background jobs & cron scheduling)
* Object Storage: MinIO (Lokal) / Cloudflare R2 (Produksi) melalui S3 SDK Client
* Payment Gateway: Midtrans (Sandbox)

## Persyaratan & Cara Menjalankan

### Persyaratan Sistem
1. Node.js (v22+)
2. pnpm (v11+)
3. Docker & Docker Compose

### Jalur Pengembangan (Mode Hybrid)

Dalam mode pengembangan lokal (Hybrid), database dan infrastruktur pendukung dijalankan melalui Docker, sedangkan kode aplikasi berjalan langsung di sistem lokal Anda.

#### Skenario 1: Menjalankan dari Root Direktori (Rekomendasi)
Anda dapat mengendalikan seluruh siklus pengembangan langsung dari root direktori proyek menggunakan perintah terpusat:

1. Salin dan sesuaikan konfigurasi env:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Jalankan infrastruktur pendukung:
   ```bash
   pnpm dev:hybrid
   ```
3. Lakukan setup database (hanya pertama kali):
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
4. Jalankan backend:
   ```bash
   pnpm backend:dev
   ```

#### Skenario 2: Menjalankan langsung di dalam Folder Backend
Jika Anda ingin beroperasi langsung di dalam folder backend:

1. Masuk ke folder backend, salin env, dan instal dependensi:
   ```bash
   cd backend
   cp .env.example .env
   pnpm install
   ```
2. Jalankan migrasi prisma:
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```
3. Jalankan server backend:
   ```bash
   pnpm run start:dev
   ```

Aplikasi backend akan aktif di http://localhost:3000. Anda bisa mengakses GraphQL Playground melalui browser di http://localhost:3000/graphql.

## Dokumen Referensi Pengembang
Untuk panduan arsitektur sistem, struktur proyek, dan alur kerja pengoperasian yang lebih detail, silakan baca dokumentasi berikut:
* [Development Hub & Panduan Menjalankan Sistem](../development/README.md)
* [Referensi Struktur & Arsitektur Backend](../development/backend-reference/structure-reference.md)
* [Referensi Struktur & Desain Frontend](../development/frontend-reference/structure-reference.md)
