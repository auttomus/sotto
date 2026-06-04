# Sotto - Platform Media Sosial Terdistribusi

Sotto adalah platform media sosial terdistribusi yang mengintegrasikan tiga pilar utama ekosistem digital dalam satu sistem terpadu: Sosial, Toko, dan Porto (Sotto).

Sistem ini didesain menggunakan NestJS di backend, React Router v7 & Vite di frontend, serta diorkestrasi menggunakan Docker & Nginx reverse proxy.

## Akses Cepat

Jika Anda ingin langsung mencoba aplikasi tanpa melakukan konfigurasi lingkungan pengembangan lokal, Anda dapat mengakses versi publik yang sudah dideploy secara langsung pada tautan berikut:

**https://sotto.auttomus.xyz**

---

## Konsep Utama (Sosial, Porto, Toko)

Sotto disebut sebagai platform media sosial terdistribusi karena mendistribusikan fungsionalitas dan layanannya ke dalam tiga ekosistem utama yang saling terhubung secara real-time:

- **Sosial:** Komunikasi dan interaksi sosial melalui _feed_ publik, sistem pertemanan, dan obrolan langsung (_direct messaging_).
- **Porto:** Media pameran karya digital, proyek, dan portofolio profesional yang langsung menyatu dengan identitas profil pengguna.
- **Toko:** Fitur e-commerce terintegrasi untuk transaksi jasa atau produk digital secara langsung, lengkap dengan sistem penawaran kustom (_custom offer_ di dalam chat room) dan pembayaran aman (escrow).

---

## Arsitektur & Teknologi

- **Frontend:** React Router v7, React, Vite, Tailwind CSS v4.
- **Backend:** NestJS (TypeScript), GraphQL (Apollo), Prisma ORM.
- **Penyimpanan & Basis Data:**
  - **PostgreSQL:** Mengelola data transaksional relasional (autentikasi, profil pengguna, relasi pertemanan) dengan integritas ACID.
  - **ScyllaDB:** Basis data NoSQL berkinerja tinggi berbasis wide-column untuk menyimpan data bervolume besar (interaksi likes, komentar, riwayat obrolan).
  - **Redis:** Digunakan untuk caching data, manajemen sesi, dan BullMQ (antrean pesan).
  - **MinIO / Cloudflare R2:** Penyimpanan objek (media, gambar profil, aset postingan) yang kompatibel dengan protokol Amazon S3.
- **Gateway & Proxy:** Nginx (reverse proxy di port 8080 sebagai entrypoint), Ngrok (webhook lokal), Cloudflare Tunnel.
- **Orkestrasi:** Docker & Docker Compose.

---

## Kebutuhan Sistem & Prerequisites

Sebelum menjalankan aplikasi secara lokal, pastikan Anda telah menginstal dan menyiapkan beberapa kebutuhan berikut:

1. **Docker & Docker Compose** (Rekomendasi utama untuk orkestrasi service).
2. **Node.js (v18+)** & **pnpm** (Manajer paket untuk pengerjaan lokal dan migrasi database).
3. **Kredensial & API Key Layanan Pihak Ketiga** (harus dikonfigurasi pada env):
   - **Cloudflare R2 / S3-Compatible Object Storage:** Memerlukan Endpoint URL, Access Key, Secret Key, nama Bucket (Public & Private), dan domain CDN/subdomain R2.dev publik.
   - **Midtrans (Sandbox):** Server Key dan Client Key untuk pemrosesan pembayaran/donasi simulasi.
   - **Ngrok:** Authtoken Ngrok untuk membuat tunnel HTTPS lokal agar dapat menerima webhook dari Midtrans secara real-time.
   - **Cloudflare Tunnel (Opsional):** Token tunnel jika ingin mempublikasikan service lokal tanpa port forwarding.

---

## Panduan Pemasangan Lokal

Ikuti langkah-langkah di bawah ini untuk mengonfigurasi dan menjalankan Sotto di mesin lokal Anda.

### 1. Salin dan Konfigurasi Environment Variables

Salin berkas template `.env.example` di masing-masing direktori dan sesuaikan nilainya:

- **Backend:**
  ```bash
  cp backend/.env.example backend/.env
  ```
- **Frontend:**
  ```bash
  cp frontend/.env.example frontend/.env
  ```
- **Infrastruktur (Docker):**

  ```bash
  cp infrastructure/.env.docker.example infrastructure/.env.docker
  ```

  _(Konfigurasi environment utama untuk Docker sudah terpusat di [infrastructure/.env.docker](file:///home/auttomus/Documents/Code/PROJECT/sotto/infrastructure/.env.docker))_

### 2. Jalankan Layanan dengan Docker Compose

Gunakan Docker Compose untuk mengunduh image, mem-build frontend/backend, dan menjalankan seluruh kontainer:

```bash
docker compose up -d --build
```

### 3. Jalankan Migrasi Database & Seeding

> [!IMPORTANT]
> **Jangan jalankan migrasi dari dalam kontainer backend (`docker compose exec backend pnpm prisma migrate dev`).**
> Kontainer backend menggunakan build produksi yang meminimalkan dependensi development (termasuk Prisma CLI), sehingga menjalankan perintah tersebut di dalam kontainer akan menghasilkan error.

Karena berkas [docker-compose.override.yml](file:///home/auttomus/Documents/Code/PROJECT/sotto/docker-compose.override.yml) otomatis mengekspos port PostgreSQL (`5432`) ke host (mesin lokal), Anda wajib menjalankan perintah migrasi langsung dari terminal lokal Anda:

```bash
# Masuk ke direktori backend
cd backend

# Instal dependensi lokal
pnpm install

# Jalankan migrasi skema database PostgreSQL
pnpm prisma migrate dev

# Isi data awal (seeding) ke database
pnpm prisma db seed
```

_Menjalankan perintah ini secara lokal juga akan menggenerasi Prisma Client di dalam folder `node_modules` lokal Anda, yang menjamin fitur auto-completion (IntelliSense) dan pengecekan tipe TypeScript di IDE berjalan dengan normal._

---

## Panduan Pengembangan & Build Ulang

Ketika Anda melakukan perubahan kode di frontend maupun backend, Anda dapat mem-build ulang image kontainer yang bersangkutan tanpa harus me-restart seluruh sistem:

- **Membangun Ulang Seluruh Service:**
  ```bash
  docker compose up --build -d
  ```
- **Membangun Ulang Backend Saja:**
  ```bash
  docker compose build backend
  docker compose up -d backend
  ```
- **Membangun Ulang Frontend Saja:**
  ```bash
  docker compose build frontend
  docker compose up -d frontend
  ```

Jika ingin menjalankan aplikasi secara langsung di mesin lokal tanpa Docker (untuk proses debug cepat):

- **Menjalankan Backend:**
  ```bash
  cd backend
  pnpm install
  pnpm prisma generate
  pnpm run dev
  ```
- **Menjalankan Frontend:**
  ```bash
  cd frontend
  pnpm install
  pnpm run dev
  ```

---

## Pemetaan Port & Akses Layanan

Secara default, Nginx bertindak sebagai reverse proxy di depan frontend dan backend untuk menyatukan routing dan mencegah masalah CORS.

| Layanan             | Port Eksternal (Host) | Deskripsi / Endpoint Akses                                            |
| :------------------ | :-------------------: | :-------------------------------------------------------------------- |
| **Nginx Gateway**   |        `8080`         | **http://localhost:8080** (Akses Utama Aplikasi)                      |
| **NestJS Backend**  |        `3000`         | GraphQL (`/graphql`), REST (`/api`, `/iam`), WebSocket (`/socket.io`) |
| **PostgreSQL**      |        `5432`         | Database Relasional Utama (melalui*dev-override*)                     |
| **ScyllaDB**        |        `9042`         | Cassandra-compatible NoSQL database                                   |
| **Redis**           |        `6379`         | Penyimpanan cache memori & manajemen antrean                          |
| **MinIO Console**   |        `9001`         | Antarmuka web pengelola Object Storage lokal                          |
| **Ngrok Dashboard** |        `4040`         | Status tunnel lokal Ngrok untuk webhook                               |

---

## Dokumentasi Tambahan

Untuk panduan pengembangan yang lebih mendalam, petunjuk arsitektur, dan referensi kode lengkap, silakan baca dokumentasi di folder [development](file:///home/auttomus/Documents/Code/PROJECT/sotto/development).
