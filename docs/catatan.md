# 🗃️ DOKUMENTASI SISTEM: INISIALISASI DATABASE, ALUR AUTENTIKASI, DAN DETAIL KONEKSI

Dokumen ini menyajikan panduan komprehensif mengenai arsitektur penyimpanan data, sistem keamanan autentikasi, serta detail konfigurasi jaringan dalam **Project Sotto**. Dokumen ini dirancang secara terstruktur dan mendalam agar mudah dipahami secara konseptual maupun teknis.

---

## 🏗️ 1. PEMBUATAN DAN INISIALISASI DATABASE

Sistem basis data pada Project Sotto menggunakan pendekatan multi-database (*polyglot persistence*) untuk menangani tipe data yang berbeda secara optimal. Proses inisialisasi basis data dari awal hingga siap digunakan oleh aplikasi mengikuti alur kerja terstruktur berikut:

### A. Orkestrasi Kontainer Infrastruktur (Docker)

Seluruh layanan database berjalan dalam kontainer terisolasi menggunakan Docker Compose. Konfigurasi ini memastikan lingkungan pengembangan (*development environment*) konsisten di semua mesin.

1. Layanan diaktifkan dengan perintah:
   ```bash
   docker compose up -d
   ```
2. Docker akan men-download image dan menjalankan empat layanan utama:
   * **PostgreSQL (Port `5432`)**: Menyimpan data relasional utama (User, Profil, Listing, Order, dll).
   * **ScyllaDB (Port `9042`)**: Database NoSQL berbasis Cassandra untuk penyimpanan riwayat chat performa tinggi.
   * **Redis (Port `6379`)**: Penyimpanan memori kunci-nilai (*key-value*) untuk antrean proses latar belakang (*BullMQ*).
   * **MinIO (Port `9000`/`9001`)**: Object Storage kompatibel S3 untuk penyimpanan file media seperti foto profil dan aset listing.

### B. Migrasi Skema Relasional (Prisma ORM)

Setelah kontainer PostgreSQL aktif, skema relasional yang dideklarasikan di dalam file `backend/prisma/schema.prisma` harus dipetakan ke dalam struktur tabel fisik di PostgreSQL.

1. Skema Prisma mendefinisikan model-model entitas data menggunakan *Domain Specific Language* (DSL) Prisma.
2. Pengembang menjalankan perintah migrasi:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Perintah ini melakukan tiga hal secara otomatis:
   * Membaca file `schema.prisma`.
   * Membuat file migrasi SQL baru berisi instruksi DDL (`CREATE TABLE`, `ALTER TABLE`, dll) di folder `backend/prisma/migrations/`.
   * Mengeksekusi file SQL tersebut ke dalam database PostgreSQL target untuk membuat tabel fisik beserta indeks dan relasinya.
   * Meregenerasi **Prisma Client** (`@prisma/client`) agar kode TypeScript backend mendapatkan *type-safety* penuh sesuai skema terbaru.

### C. Pengisian Data Awal (Seeding)

Untuk mempermudah pengujian fitur-fitur aplikasi, database PostgreSQL diisi dengan data awal (dummy/seed data) seperti akun uji coba, listing default, dan konfigurasi sistem.

1. Mekanisme inisialisasi seeding terkonfigurasi di `backend/package.json` di bawah blok `"prisma"`:
   ```json
   "prisma": {
     "seed": "tsx prisma/seed.ts"
   }
   ```
2. Eksekusi seeding dilakukan dengan perintah:
   ```bash
   npx prisma db seed
   ```
3. Script `seed.ts` akan dieksekusi secara asinkron menggunakan modul `tsx` (TypeScript Execute) untuk mengisi tabel-tabel utama di PostgreSQL dengan aman menggunakan API Prisma Client.

---

## 🔐 2. MEKANISME AUTENTIKASI DAN ALUR LOGIN

Sistem keamanan autentikasi pada Sotto dikelola secara terpusat oleh modul **IAM (Identity and Access Management)** di backend yang dibangun menggunakan NestJS. Mekanisme ini menggabungkan hashing kata sandi satu arah dan token akses tanpa status (*stateless*).

### A. Model Pemisahan Kredensial dan Profil Publik

Demi keamanan data tingkat tinggi, informasi login sensitif dipisahkan dari profil publik pengguna menggunakan relasi satu-ke-satu (*one-to-one*) di database:

* **Tabel `User` (`users`)**: Menyimpan data kredensial ketat yang meliputi `id`, `email`, `encryptedPassword` (kata sandi terenkripsi), dan foreign key `accountId`.
* **Tabel `Account` (`accounts`)**: Menyimpan profil publik pengguna yang meliputi `id`, `username`, `displayName` (nama tampilan), dan `avatarObjectKey` (kunci media avatar).

Pemisahan ini melindungi data sensitif pengguna agar tidak terekspos secara tidak sengaja dalam query pencarian profil publik atau kueri eksplorasi penawaran.

### B. Teknologi Kriptografi yang Digunakan

Sistem mengamankan autentikasi menggunakan dua pustaka kriptografi standar industri:

1. **Bcrypt**: Digunakan untuk menyamarkan kata sandi. Ketika user mendaftar, kata sandi di-hash menggunakan algoritma Bcrypt yang menambahkan *salt* acak secara otomatis. Proses enkripsi ini bersifat satu arah, artinya kata sandi asli tidak pernah bisa didekripsi kembali dari nilai hash tersebut.
2. **JSON Web Token (JWT)**: Digunakan untuk manajemen sesi autentikasi. Setelah user terverifikasi, server membuat token bertanda tangan digital yang berisi enkripsi data identitas user (*payload*) menggunakan kunci rahasia (*JWT Secret Key*).

### C. Alur Logika Proses Login Langkah-demi-Langkah

Proses masuk (*login*) yang ditangani oleh modul IAM (`iam.service.ts`) mengikuti urutan eksekusi berikut:

```mermaid
sequenceDiagram
    actor Client as Aplikasi Frontend
    participant Server as NestJS IAM Service
    participant DB as PostgreSQL (Prisma)

    Client->>Server: Kirim email & kata sandi (LoginDto)
    Server->>DB: Kueri user berdasarkan email (prisma.user.findUnique)
    DB-->>Server: Kembalikan data User + Relasi Account
    alt Email tidak terdaftar
        Server-->>Client: Lempar UnauthorizedException
    end
    Server->>Server: Verifikasi kata sandi (bcrypt.compare)
    alt Hash kata sandi tidak cocok
        Server-->>Client: Lempar UnauthorizedException
    end
    Server->>Server: Susun Payload JWT (sub: userId, accountId)
    Server->>Server: Tanda tangani Payload secara asinkron (jwtService.signAsync)
    Server-->>Client: Kembalikan string accessToken & detail ringkasan profil (Account)
```

1. **Penerimaan Data**: Frontend mengirimkan `LoginDto` (berisi data email dan kata sandi mentah) ke endpoint `/graphql` (kueri/mutasi login) atau endpoint HTTP login backend.
2. **Pencarian Data User**: Backend memanggil database PostgreSQL melalui Prisma:

   ```typescript
   const user = await this.prisma.user.findUnique({
     where: { email },
     include: { account: true }
   });
   ```

   Jika record user tidak ditemukan, sistem langsung melempar `UnauthorizedException` secara generik demi keamanan (mencegah penyerang menebak email mana yang valid).
3. **Verifikasi Hash Kata Sandi**: Server mencocokkan kata sandi teks polos yang dikirim oleh user dengan kata sandi terenkripsi (`user.encryptedPassword`) dari database menggunakan Bcrypt:

   ```typescript
   const isPasswordValid = await bcrypt.compare(password, user.encryptedPassword);
   ```

   Jika hasil pencocokan bernilai `false`, server melempar `UnauthorizedException`.
4. **Pembuatan Payload & Penandatanganan Token**: Jika cocok, server membuat objek payload:

   ```typescript
   const payload = { sub: user.id, accountId: user.accountId };
   ```

   Objek payload ini kemudian dienkripsi dan ditandatangani secara asinkron oleh NestJS `JwtService` menggunakan kunci rahasia yang dimuat dari environment variable:

   ```typescript
   const accessToken = await this.jwtService.signAsync(payload);
   ```
5. **Pengembalian Respon**: Server mengembalikan token akses beserta informasi profil dasar (seperti `username`, `displayName`, dan `avatarObjectKey`) kepada frontend.
6. **Sesi Berkelanjutan**: Frontend menyimpan `accessToken` di penyimpanan lokal aman. Pada setiap permintaan berikutnya yang membutuhkan izin akses, frontend menyertakan token ini pada header HTTP:

   ```http
   Authorization: Bearer <accessToken>
   ```

   Di sisi server, JWT Guard akan memverifikasi tanda tangan token tersebut untuk mengekstrak identitas pengguna secara aman tanpa status sesi disimpan di server (*stateless*).

---

## 🔌 3. CARA KONEKSI KE DATABASE DAN DETAIL LAYANAN

Seluruh koneksi basis data dikonfigurasi melalui variabel lingkungan (*environment variables*) di dalam file `.env` di direktori proyek. Berikut adalah detail lengkap protokol, parameter koneksi, dan mekanisme integrasi setiap database:

### A. Koneksi PostgreSQL (Prisma ORM)

PostgreSQL bertindak sebagai repositori data relasional utama. Integrasinya dijembatani oleh Prisma ORM.

* **Alamat Variabel Lingkungan**: `DATABASE_URL`
* **Format string koneksi**:
  ```ini
  DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?schema=public"
  ```
* **Contoh Koneksi Lokal (Docker)**:
  ```ini
  DATABASE_URL="postgresql://postgres:postgres_secure_password@localhost:5432/sotto_db?schema=public"
  ```
* **Mekanisme Driver**: Prisma engine membaca URL koneksi ini pada saat inisialisasi aplikasi untuk membuat kumpulan koneksi (*connection pool*) internal. Driver ini menangani pemetaan query asinkron dari TypeScript ke perintah SQL PostgreSQL secara transparan.

### B. Koneksi ScyllaDB (Wide-Column NoSQL)

ScyllaDB digunakan khusus untuk menangani penyimpanan pesan chat interaktif (`Message`) karena mendukung throughput penulisan yang luar biasa tinggi dan skalabilitas horizontal horizontal tanpa hambatan.

* **Driver Node.js**: `cassandra-driver`
* **Format Konfigurasi Koneksi**:
  ```typescript
  import { Client } from 'cassandra-driver';

  const scyllaClient = new Client({
    contactPoints: ['localhost'], // Alamat host node ScyllaDB
    localDataCenter: 'datacenter1', // Nama data center ScyllaDB
    keyspace: 'sotto_chat', // Nama keyspace (skema database) target
    queryOptions: { consistency: 1 } // Tingkat konsistensi pembacaan/penulisan (default: ONE)
  });
  ```
* **Mekanisme Kerja**: NestJS menginisialisasi modul database ScyllaDB sebagai penyedia kueri global (*global provider*). Seluruh proses penyimpanan pesan, pemuatan daftar obrolan, dan pelacakan riwayat pesan memanggil driver ini secara langsung menggunakan format query CQL (*Cassandra Query Language*).

### C. Koneksi Redis (In-Memory Key-Value)

Redis melayani dua fungsi penting dalam proyek Sotto: sebagai broker antrean asinkron (*message queue*) dengan BullMQ untuk memproses tugas-tugas berat di latar belakang, serta sebagai lapisan cache berkinerja tinggi.

* **Pustaka Integrasi**: `ioredis`
* **Format Konfigurasi Koneksi**:
  ```typescript
  import Redis from 'ioredis';

  const redisConnection = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null // Penting untuk kompabilitas penuh dengan BullMQ
  });
  ```
* **Mekanisme Kerja**: Modul NestJS `BullModule` menggunakan koneksi Redis ini untuk mendaftarkan pekerjaan (*jobs*) ke dalam antrean memori, mendistribusikannya ke pekerja latar belakang (*workers*), dan memantau status tugas secara *real-time*.

### D. Koneksi MinIO (S3 Object Storage)

MinIO bertindak sebagai penyimpanan objek digital (*Object Storage*) lokal untuk mengelola semua file unggahan pengguna (gambar penawaran, avatar pengguna, file dokumen) secara mandiri.

* **Pustaka Integrasi**: `minio` (S3 SDK)
* **Format Konfigurasi Koneksi**:
  ```typescript
  import * as Minio from 'minio';

  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false, // Set ke true jika di lingkungan produksi dengan HTTPS
    accessKey: 'minio_access_key',
    secretKey: 'minio_secret_key'
  });
  ```
* **Mekanisme Kerja**: Ketika frontend mengunggah berkas media, backend akan memproses unggahan tersebut, membuat kunci objek acak unik, mengunggah aliran buffer file ke keranjang (*bucket*) MinIO target, dan menyimpan kunci referensinya (seperti `avatarObjectKey`) di dalam database PostgreSQL.
