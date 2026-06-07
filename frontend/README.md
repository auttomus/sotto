# Sotto Frontend Application

Aplikasi antarmuka pengguna (SPA) Sotto yang dibangun dengan framework React Router v7. Terhubung secara realtime dengan backend Sotto melalui Apollo GraphQL Client dan WebSockets.

## Kredit Teknologi & Stack Utama

Sotto Frontend memanfaatkan ekosistem teknologi modern berikut:
* Framework: React Router v7 (Framework Mode / SSR Ready)
* Build Tool: Vite
* CSS Framework & Styling: Tailwind CSS v4
* GraphQL Client: Apollo Client
* State Management: Zustand
* Animasi & Transisi: Framer Motion
* Ikonografi: Lucide React
* Realtime WebSockets: Socket.io-client

## Cara Menjalankan untuk Pengembangan

### Persyaratan Sistem
1. Node.js (v22+)
2. pnpm (v11+)

### Jalur Pengembangan (Mode Hybrid)

Dalam mode pengembangan lokal (Hybrid), database dan infrastruktur pendukung dijalankan melalui Docker di latar belakang, sedangkan kode frontend berjalan di sistem lokal Anda.

#### Skenario 1: Menjalankan dari Root Direktori (Rekomendasi)
Anda dapat menjalankan server pengembangan frontend langsung dari root direktori proyek:

1. Salin dan sesuaikan konfigurasi env:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Pastikan infrastruktur backend telah berjalan (via `pnpm dev:hybrid`).
3. Jalankan frontend:
   ```bash
   pnpm frontend:dev
   ```

#### Skenario 2: Menjalankan langsung di dalam Folder Frontend
Jika Anda ingin beroperasi langsung di dalam folder frontend:

1. Masuk ke folder frontend dan salin env:
   ```bash
   cd frontend
   cp .env.example .env
   ```
2. Pasang dependensi secara lokal:
   ```bash
   pnpm install --ignore-workspace
   ```
3. Jalankan server pengembangan (HMR aktif):
   ```bash
   pnpm run dev
   ```

Aplikasi frontend akan aktif dan dapat diakses melalui browser di http://localhost:5173.

## Membangun untuk Produksi

Jika Anda ingin membundel aplikasi untuk rilis produksi:

1. Build aplikasi:
   ```bash
   pnpm run build
   ```
2. Jalankan hasil build (Production Server):
   ```bash
   pnpm run start
   ```

## Dokumen Referensi Pengembang
Untuk panduan arsitektur sistem, struktur proyek, dan alur kerja pengoperasian yang lebih detail, silakan baca dokumentasi berikut:
* [Development Hub & Panduan Menjalankan Sistem](../development/README.md)
* [Referensi Struktur & Arsitektur Backend](../development/backend-reference/structure-reference.md)
* [Referensi Struktur & Desain Frontend](../development/frontend-reference/structure-reference.md)
