# Panduan Pengembangan (Development Hub) - Sotto

Selamat datang di pusat dokumentasi pengembangan Sotto. Dokumen ini dirancang untuk membantu Anda memahami, menyiapkan, dan menjalankan lingkungan pengembangan lokal dengan cepat dan efisien.

---

## ─── KEBUTUHAN SISTEM (PREREQUISITES) ──────────────────────────────────────

Sebelum memulai, pastikan sistem lokal Anda telah terpasang beberapa perkakas berikut:

1. **Docker & Docker Compose:** Digunakan untuk menjalankan basis data dan komponen infrastruktur lokal secara terisolasi.
2. **Node.js (v18+) & pnpm:** Manajer paket untuk eksekusi server lokal (frontend & backend) serta migrasi database.
3. **Kredensial Layanan Pihak Ketiga (Simpan di file `.env`):**
   - **Cloudflare R2 / S3 Storage:** Endpoint URL, Access & Secret Key, serta nama Bucket untuk manajemen berkas.
   - **Midtrans (Sandbox):** Server Key dan Client Key untuk simulasi donasi/pembayaran.
   - **Ngrok:** Token otentikasi Ngrok untuk membuat tunnel HTTPS lokal (diperlukan untuk webhook Midtrans).

---

## ─── CARA MENJALANKAN PROJECT (QUICK START) ──────────────────────────────────

Terdapat dua opsi utama untuk menjalankan dan mengembangkan Sotto di mesin lokal Anda:

### OPSI A: Mode Hybrid (Sangat Direkomendasikan ⚡)

_Infrastruktur (database, cache, broker) berjalan di dalam Docker, sedangkan kode aplikasi (backend NestJS dan frontend Vite) berjalan langsung di Host OS Anda._

- **Kelebihan:** Mendukung _Hot-Reloading_ (HMR) secara instan pada frontend dan backend tanpa perlu membangun ulang kontainer Docker.

1. **Jalankan Infrastruktur (Docker):**

   ```bash
   pnpm infra:up
   ```

   _Ini akan menyalakan kontainer database: `postgres`, `scylladb`, `redis`, dan `minio`._
2. **Jalankan Migrasi & Seeding Database (Hanya untuk Pertama Kali):**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
3. **Jalankan Backend NestJS (Terminal 1):**

   ```bash
   pnpm backend:dev
   ```

   _Berjalan di `http://localhost:3000` dengan GraphQL Playground di `/graphql`._
4. **Jalankan Frontend Vite (Terminal 2):**

   ```bash
   pnpm frontend:dev
   ```

   _Berjalan di `http://localhost:5173` dengan fitur HMR._

---

### OPSI B: Mode Full Docker Compose (Simulasi Produksi 🐳)

_Seluruh ekosistem Sotto (termasuk kode aplikasi, frontend, dan gateway Nginx) berjalan secara terisolasi di dalam kontainer._

1. **Jalankan Seluruh Stack Kontainer:**
   ```bash
   docker compose up -d --build
   ```
2. **Akses Aplikasi:**
   - Melalui Nginx Gateway: `http://localhost:8080` (Akses terpadu).
   - Langsung ke Frontend: `http://localhost:5173` (Dipetakan langsung dari kontainer).
3. **Membangun Ulang (Bila Ada Perubahan Kode):**
   ```bash
   docker compose build backend && docker compose up -d backend
   ```

---

## ─── PANDUAN RESET DATABASE (POSTGRESQL & SCYLLADB) ────────────────────────

Jika Anda ingin membersihkan seluruh data lokal (_fresh install_), lakukan langkah berikut secara berurutan:

### 1. Reset PostgreSQL (Relational DB)

1. Jalankan perintah migrasi dev:
   ```bash
   pnpm db:migrate
   ```
2. Jika Prisma mendeteksi ketidaksinkronan (_drift_) atau menanyakan persetujuan reset:
   _Ketik **`y`** lalu tekan **Enter**._
3. Skema PostgreSQL akan dihapus dan dibangun ulang dari awal secara otomatis.

### 2. Reset ScyllaDB (NoSQL DB)

1. **Wajib:** Matikan aplikasi Backend NestJS (`pnpm backend:dev`) jika sedang menyala, untuk mencegah error kegagalan koneksi (_NoHostAvailableError_).
2. Jalankan perintah pembersihan keyspace ScyllaDB:

   ```bash
   pnpm db:scylla:reset
   ```

   _Perintah ini akan masuk ke kontainer `sotto_scylla` dan menghapus keyspace `sotto` secara bersih._
3. Jalankan kembali Backend NestJS Anda:

   ```bash
   pnpm backend:dev
   ```

   _Saat startup, backend secara otomatis akan mendeteksi keyspace yang kosong, membuat ulang keyspace, serta menyusun seluruh struktur tabel NoSQL yang dibutuhkan._

### 3. Isi Ulang Data Master (Seeding)

Setelah kedua database di-reset, jalankan perintah seeding untuk memasukkan data sekolah, jurusan, dan kategori awal:

```bash
pnpm db:seed
```

---

## ─── PANDUAN INTEGRASI PEMBAYARAN (MIDTRANS WEBHOOK) ────────────────────────

Untuk menguji fitur pembayaran/donasi Midtrans Sandbox, backend Anda wajib menerima webhook notifikasi (`/payments/webhook`) dari server Midtrans.

### SKENARIO 1: Pada Mode Hybrid (Opsi A) ─── REKOMENDASI LOKAL ⚡

1. Jalankan database (`pnpm infra:up`) serta backend dan frontend di Host OS Anda.
2. Jalankan Ngrok secara langsung di Host OS Anda ke port backend:
   ```bash
   ngrok http 3000
   ```
3. **Selesai!** Backend otomatis mendeteksi URL Ngrok aktif di port `4040` host OS dan mendaftarkannya ke Midtrans. Akses frontend Anda langsung di `http://localhost:5173`.

### SKENARIO 2: Pada Mode Full Docker Compose (Opsi B) ─── SIMULASI PENUH 🐳

1. Jalankan kontainer penuh: `docker compose up -d`.
2. Dapatkan URL publik HTTPS aktif dengan membuka antarmuka web Ngrok di:
   [http://localhost:4040](http://localhost:4040)
3. Akses aplikasi Anda melalui URL publik Ngrok tersebut. Nginx akan mengarahkan rute `/` ke frontend dan `/graphql` / `/payments/webhook` ke backend.
4. _Catatan: File [frontend/vite.config.ts](file:///home/auttomus/Documents/Code/PROJECT/sotto/frontend/vite.config.ts) sudah dikonfigurasi dengan `allowedHosts: true` agar browser tidak memblokir akses domain Ngrok._

---

## ─── PERINTAH PINTAS MONOREPO (ROOT SCRIPTS) ───────────────────────────────

Jalankan perintah-perintah terpusat ini langsung dari direktori root monorepo:

| Perintah                 | Deskripsi                                                          |
| :----------------------- | :----------------------------------------------------------------- |
| `pnpm infra:up`        | Menyalakan database & infra lokal di latar belakang.               |
| `pnpm infra:down`      | Menghentikan kontainer infrastruktur Docker.                       |
| `pnpm infra:logs`      | Melihat log kontainer database secara real-time.                   |
| `pnpm backend:dev`     | Menjalankan backend NestJS dengan mode watch (Hot-Reload) di host. |
| `pnpm frontend:dev`    | Menjalankan frontend React Router / Vite di host (port `5173`).  |
| `pnpm db:migrate`      | Menjalankan migrasi skema database PostgreSQL secara lokal.        |
| `pnpm db:seed`         | Memasukkan data dummy awal ke PostgreSQL.                          |
| `pnpm db:scylla:reset` | Menghapus keyspace ScyllaDB lokal (untuk mereset skema NoSQL).     |
| `pnpm dev:hybrid`      | Pintasan satu langkah untuk menyiapkan infrastruktur Mode Hybrid.  |

---

## ─── OPSI PENYIMPANAN ASET MEDIA (MINIO VS CLOUDFLARE R2) ──────────────────

### Skenario A: Menggunakan Penyimpanan MinIO Lokal (Offline)

_Cocok jika Anda ingin mengembangkan aplikasi tanpa membutuhkan koneksi internet._

- **Konfigurasi `backend/.env`:**
  ```ini
  MINIO_ENDPOINT=localhost
  MINIO_PORT=9000
  MINIO_USE_SSL=false
  MINIO_PUBLIC_URL=http://localhost:9000
  ```
- **Konfigurasi `frontend/.env`:**
  ```ini
  VITE_MINIO_PUBLIC_URL=http://localhost:9000/public-assets
  ```

### Skenario B: Menggunakan Cloudflare R2 CDN Langsung (Live Local Dev)

_Menghubungkan langsung lingkungan pengembangan lokal ke bucket Cloudflare R2 asli._

- **Konfigurasi `backend/.env`:**
  ```ini
  MINIO_ENDPOINT=<account_id>.r2.cloudflarestorage.com
  MINIO_PORT=
  MINIO_USE_SSL=true
  MINIO_PUBLIC_URL=https://cdn.sotto.auttomus.xyz
  ```
- **Konfigurasi `frontend/.env`:**
  ```ini
  VITE_MINIO_PUBLIC_URL=https://cdn.sotto.auttomus.xyz
  ```

---

## ─── PANDUAN INSPEKSI DATABASE (DEVELOPMENT & PRODUCTION) ──────────────────

Berikut adalah daftar perkakas (tools) dan konfigurasi untuk mengamati data pada masing-masing basis data:

### 1. PostgreSQL (Relational Data)

* **Development (Lokal):**
  - **Prisma Studio (Web GUI):** Jalankan perintah `pnpm --filter backend prisma studio` di direktori root. Buka [http://localhost:5555](http://localhost:5555) di browser Anda.
  - **Aplikasi GUI (DBeaver / TablePlus):**
    - Host: `localhost` | Port: `5432`
    - Username: `postgres` | Password: `supersecret_postgres_password`
    - Database: `sotto_platform_db`
* **Production (VPS):**
  - Karena port `5432` di VPS tidak diekspos ke publik demi keamanan, Anda **wajib** menggunakan fitur **SSH Tunneling** di DBeaver atau TablePlus untuk terhubung.
    - SSH Host: `IP_VPS_ANDA` | SSH User: `root` (atau nama user VPS Anda).
    - Database Host: `localhost` | Database Port: `5432`.
    - Username & Password: Sesuai isi `.env.prod` Anda di VPS.

### 2. ScyllaDB (NoSQL Data: Posts, Comments, Messages)

* **Development (Lokal):**
  - **cqlsh (Terminal CLI):** Jalankan perintah berikut di terminal Anda:

    ```bash
    docker exec -it sotto_scylla cqlsh
    ```

    Gunakan perintah CQL untuk melihat data, contoh:
    ```sql
    USE sotto;
    SELECT * FROM posts LIMIT 10;
    ```
  - **Aplikasi GUI (DbGate / TablePlus / Magda):**

    - **DbGate:** 100% Free & Open Source (mendukung Cassandra/ScyllaDB secara penuh).
    - **TablePlus (Free Tier):** Mendukung Cassandra (terbatas 2 koneksi aktif).
    - **Magda:** GUI khusus Cassandra open-source berbasis Rust.
    - *Pengaturan Koneksi:* Buat koneksi baru jenis **Cassandra** ➔ Host: `localhost` | Port: `9042`.
* **Production (VPS):**
  - **CLI di VPS:** Hubungi VPS Anda melalui SSH, kemudian jalankan: `docker exec -it sotto_scylla cqlsh`.
  - **GUI Client (SSH Tunnel):** Hubungkan **DbGate** atau **TablePlus** lokal Anda dengan mengaktifkan fitur **SSH Tunneling** mengarah ke port `9042` VPS Anda.

### 3. Redis (Cache & Queue Management)

* **Development (Lokal):**
  - **redis-cli (Terminal CLI):**
    ```bash
    docker exec -it sotto_redis redis-cli
    ```

    *Gunakan perintah `keys *` untuk melihat key, atau `flushall` untuk menghapus seluruh cache.*
  - **Aplikasi GUI (Redis Insight):** Alat resmi gratis dari Redis yang sangat visual untuk memantau data cache dan antrean BullMQ. Hubungkan ke Host: `localhost` | Port: `6379`.
* **Production (VPS):**
  - **CLI di VPS:** Hubungi VPS via SSH, jalankan `docker exec -it sotto_redis redis-cli`.
  - **Redis Insight (SSH Tunnel):** Konfigurasi koneksi baru menggunakan **SSH Tunnel** mengarah ke port `6379` VPS Anda.

### 4. MinIO / Cloudflare R2 (Object Storage)

* **Development (Lokal - MinIO):**
  - Buka antarmuka web konsol MinIO di browser: [http://localhost:9001](http://localhost:9001).
  - Masuk dengan kredensial developer default:
    - Username: `admin_minio`
    - Password: `supersecret_minio_password`
      atau sesuai dengan yang kamu ubah (bila ada mengubahnya)
* **Production (Cloudflare R2):**
  - Buka dashboard resmi Cloudflare ➔ Menu **R2** ➔ Pilih bucket produksi Anda. Semua file media/aset yang diunggah di produksi dapat langsung diinspeksi atau diunduh dari sana.

---

## ─── EVALUASI & REFERENSI KONFIGURASI PENTING ────────────────────────────

### 1. Resolusi Konflik Port Frontend

Port server pengembangan (_Vite Dev Server_) dipindahkan ke **`5173`** (sebelumnya `8080`) untuk menghindari konflik dengan port kontainer Nginx Gateway (`8080`).

### 2. Konfigurasi Fleksibel Proxy Nginx

Nginx dipisah menjadi dua berkas konfigurasi di bawah direktori `./nginx/`:

- **`nginx.dev.conf`:** Proxy aset `/public-assets/` ke kontainer MinIO lokal aktif (development).
- **`nginx.prod.conf`:** Proxy aset MinIO dinonaktifkan karena langsung dilayani oleh CDN R2 publik (produksi).

### 3. Autodiscovery Ngrok (Midtrans Webhook)

Pencarian endpoint Ngrok di backend secara berurutan mengecek:

1. `process.env.NGROK_API_URL`
2. `http://localhost:4040/api/tunnels` (jika berjalan di host OS)
3. `http://ngrok:4040/api/tunnels` (jika berjalan di dalam Docker network)

### 4. Pemisahan Berkas Environment Docker (Dev vs Prod)

- **`docker-compose.yml` (Development):** Membaca variabel dari [infrastructure/.env.docker](file:///home/auttomus/Documents/Code/PROJECT/sotto/infrastructure/.env.docker).
- **`docker-compose.prod.yml` (Production VPS):** Membaca variabel dari [infrastructure/.env.prod](file:///home/auttomus/Documents/Code/PROJECT/sotto/infrastructure/.env.prod).

### 5. Komunikasi Langsung Tanpa Nginx di Mode Hybrid (Dev)

Frontend berkomunikasi langsung ke backend di port `3000` (bukan lewat Nginx). Backend mengizinkan komunikasi langsung ini dengan mengaktifkan CORS bagi asal `http://localhost:5173` (diatur via variabel `FRONTEND_URL` di `backend/.env`).

### 6. Jaminan Keamanan Lingkungan Produksi (VPS)

Seluruh modifikasi lokal ini dijamin **tidak akan mengganggu** sistem produksi di VPS:

- Kontainer `ngrok` hanya ada di `docker-compose.yml` (development) dan tidak didefinisikan sama sekali di `docker-compose.prod.yml` (produksi menggunakan Cloudflare Tunnel resmi).

---

## ─── DAFTAR DOKUMENTASI REFERENSI LAIN ──────────────────────────────────────

- **[Panduan Arsitektur &amp; Teknologi (stack-reference.md)](file:///home/auttomus/Documents/Code/PROJECT/sotto/development/stack-reference.md)**
- **[Inisial Prompt &amp; Rencana Awal (initial-prompt.md)](file:///home/auttomus/Documents/Code/PROJECT/sotto/development/initial-prompt.md)**
