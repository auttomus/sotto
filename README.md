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

## Panduan Pemasangan & Pengembangan Lokal

Seluruh panduan teknis untuk menjalankan aplikasi di komputer lokal Anda, detail environment, pilihan alur kerja (Hybrid vs Docker), dan pemetaan port telah dipindahkan ke:

* **[Pusat Panduan Pengembangan Lokal (development/README.md)](development/README.md)**

Silakan merujuk ke dokumen tersebut untuk petunjuk pemasangan langkah-demi-langkah.

