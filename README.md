# Sotto - Platform Media Sosial Terdistribusi

[![Linter Status](https://github.com/untacorp/sotto/actions/workflows/eslint.yml/badge.svg)](https://github.com/untacorp/sotto/actions/workflows/eslint.yml)
[![Docker Release](https://github.com/untacorp/sotto/actions/workflows/docker-release.yml/badge.svg)](https://github.com/untacorp/sotto/actions/workflows/docker-release.yml)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-blue.svg)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D11.0.0-orange.svg)](https://pnpm.io/)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPLv3-green.svg)](LICENSE)

Sotto adalah platform media sosial terdistribusi yang mengintegrasikan tiga pilar utama ekosistem digital dalam satu sistem terpadu: Sosial, Toko, dan Porto (Sotto).

Sistem ini didesain menggunakan arsitektur monorepo dengan NestJS di backend, React Router v7 & Vite di frontend, serta diorkestrasi menggunakan Docker & Nginx.

## Akses Cepat

Jika Anda ingin langsung mencoba aplikasi tanpa melakukan konfigurasi lingkungan pengembangan lokal, Anda dapat mengakses versi publik yang sudah dideploy secara langsung pada tautan berikut:

**https://sotto.auttomus.xyz**

---

## Konsep Utama (Sosial, Porto, Toko)

Sotto mendistribusikan fungsionalitas dan layanannya ke dalam tiga ekosistem utama yang saling terhubung secara real-time:

- **Sosial:** Komunikasi dan interaksi sosial melalui *feed* publik, sistem pertemanan, dan obrolan langsung (*direct messaging*).
- **Porto:** Media pameran karya digital, proyek, dan portofolio profesional yang langsung menyatu dengan identitas profil pengguna.
- **Toko:** Fitur e-commerce terintegrasi untuk transaksi jasa atau produk digital secara langsung, lengkap dengan sistem penawaran kustom (*custom offer* di dalam ruang obrolan) dan pembayaran aman (*escrow*).

---

## Arsitektur Data (Polyglot Persistence Matrix)

Sotto dirancang untuk skalabilitas tinggi dengan menerapkan arsitektur *polyglot persistence*, di mana setiap jenis data disimpan pada basis data yang paling optimal untuk karakteristiknya:

| Basis Data | Peran Utama | Jenis Data yang Disimpan |
| :--- | :--- | :--- |
| **PostgreSQL** | Relational Data (ACID) | Autentikasi, Profil Pengguna, Relasi Pertemanan, Transaksi E-commerce, Metadata Entitas. |
| **ScyllaDB** | High-Throughput NoSQL | Umpan (*Feeds*), Log Interaksi (*Likes/Views*), Riwayat Pesan Obrolan Real-time. |
| **Redis** | Caching & Message Queue | Sesi Pengguna, *Vector Cache* untuk Synergy Engine, Antrean *BullMQ* (Background Jobs). |
| **MinIO / Cloudflare R2** | Object Storage (S3 API) | Berkas Media (Gambar Profil, Lampiran Obrolan, Aset Postingan, Produk Digital). |

---

## Struktur Monorepo (Directory Layout)

Proyek ini dikelola dalam format monorepo dengan pemisahan wilayah kerja (workspace) yang jelas:

```text
sotto/
├── backend/          # Layanan inti API (NestJS, Prisma, GraphQL)
├── frontend/         # Aplikasi antarmuka pengguna (React Router v7, Vite)
├── infrastructure/   # Konfigurasi variabel lingkungan untuk Docker (Dev/Prod)
├── nginx/            # Konfigurasi Reverse Proxy & Gateway (Dev/Prod)
├── development/      # Pusat dokumentasi arsitektur dan panduan pengembangan
├── .github/          # Konfigurasi CI/CD Actions (Linting, Docker Publish)
├── package.json      # Skrip automasi root dan definisi monorepo
├── CLA.md            # Contributor License Agreement
└── README.md         # Berkas ini
```

---

## Perintah Pengembangan Cepat (Development Commands)

Untuk memudahkan navigasi dalam monorepo, Anda dapat menjalankan perintah-perintah berikut langsung dari direktori root (pastikan `pnpm` terpasang):

| Perintah | Deskripsi Aksi |
| :--- | :--- |
| `pnpm dev:hybrid` | Menjalankan infrastruktur kontainer di latar belakang (Docker Compose). |
| `pnpm db:migrate` | Menjalankan migrasi skema database PostgreSQL lokal. |
| `pnpm db:seed` | Mengisi data awal (*seeding*) ke dalam database lokal. |
| `pnpm backend:dev` | Menyalakan server NestJS backend dengan mode *Hot-Reload*. |
| `pnpm frontend:dev` | Menyalakan aplikasi Vite frontend dengan mode *Hot-Reload*. |

> **Catatan:** Seluruh panduan pemasangan yang lebih mendalam, manajemen *webhook*, dan resolusi masalah dapat dibaca secara lengkap di **[Pusat Panduan Pengembangan Lokal (development/README.md)](development/README.md)**.

---

## Lisensi & Kontribusi (CLA)

Repositori ini dilisensikan di bawah **[GNU Affero General Public License v3.0 (AGPLv3)](LICENSE)**. 

Kami menyambut baik segala bentuk kontribusi dari komunitas. Namun, untuk melindungi model bisnis proyek dan menjaga kepastian hukum bagi seluruh ekosistem Sotto, setiap kontributor luar wajib menyetujui **[Contributor License Agreement (CLA)](CLA.md)**. 

Dengan membuat *Pull Request* ke repositori ini, Anda secara otomatis dianggap telah membaca, memahami, dan menyetujui ketentuan yang berlaku di dalam berkas CLA tersebut.
