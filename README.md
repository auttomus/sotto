# 🚀 Sotto - Multi-service Platform

Sistem sosial media terdistribusi dengan pendekatan *Polyglot Persistence* (PostgreSQL, ScyllaDB, Redis, MinIO) menggunakan NestJS di backend, React Router v7 & Vite di frontend, dan diorkestrasi menggunakan Docker & Nginx.

> [!IMPORTANT]
> **Pastiin pakai pnpm dan bukan npm, yarn, dll.**
> Bacalah folder [development](file:///home/auttomus/Documents/Code/PROJECT/sotto/development) untuk referensi pengembangan yang lebih detail dan pemberian konteks kepada AI.

---

## 🛠️ Cara Build Frontend & Backend (Setiap Ada Update)

Ketika Anda melakukan perubahan kode di frontend maupun backend, gunakan langkah-langkah berikut untuk memperbarui aplikasi:

### 1. Menggunakan Docker (Rekomendasi)
Jika aplikasi dijalankan di dalam kontainer Docker, Anda harus mem-build ulang image agar perubahan kode terbaru diterapkan.

*   **Build & Jalankan Semua Service Sekaligus:**
    ```bash
    docker compose up --build -d
    ```
*   **Build Service Tertentu Saja (Lebih Cepat):**
    *   **Backend:**
        ```bash
        docker compose build backend
        docker compose up -d backend
        ```
    *   **Frontend:**
        ```bash
        docker compose build frontend
        docker compose up -d frontend
        ```

### 2. Menjalankan Secara Lokal (Tanpa Docker / Untuk Testing & Development)
Jika Anda ingin mem-build langsung di mesin lokal tanpa kontainer (misalnya untuk memvalidasi error tipe data / kompilasi):

*   **Backend (NestJS):**
    ```bash
    cd backend
    pnpm install
    pnpm prisma generate
    pnpm run build
    ```
*   **Frontend (Vite / React Router v7):**
    ```bash
    cd frontend
    pnpm install
    pnpm run build
    ```

---

## 🐳 Panduan Initial Setup Docker

Ikuti langkah-langkah berikut untuk menjalankan seluruh ekosistem Sotto menggunakan Docker untuk pertama kalinya:

### Langkah 1: Siapkan Environment Variables (`.env`)
Salin template berkas `.env.example` dari masing-masing folder ke `.env`:
1.  **Backend:**
    ```bash
    cp backend/.env.example backend/.env
    ```
2.  **Frontend:**
    ```bash
    cp frontend/.env.example frontend/.env
    ```
*(Konfigurasi environment utama untuk Docker sudah terpusat di [infrastructure/.env.docker](file:///home/auttomus/Documents/Code/PROJECT/sotto/infrastructure/.env.docker))*

### Langkah 2: Jalankan Kontainer Docker
Gunakan Docker Compose untuk membangun dan menjalankan seluruh layanan (database, minio, backend, frontend, nginx):
```bash
docker compose up -d --build
```

### Langkah 3: Jalankan Migrasi Database (Prisma)

> [!WARNING]
> **SANGAT TIDAK DIREKOMENDASIKAN** menjalankan migrasi dari dalam kontainer backend (`docker compose exec backend pnpm prisma migrate dev`). Kontainer backend menggunakan build khusus *production* yang menghapus dependensi development (seperti Prisma CLI), sehingga `pnpm` akan mencoba menginstal ulang seluruh *node_modules* dan menyebabkan error.

Karena berkas `docker-compose.override.yml` otomatis mengekspos port Postgres (`5432`) ke *host* (mesin lokal Anda), **pilihan terbaik dan wajib digunakan untuk development adalah menjalankan migrasi langsung dari terminal lokal Anda:**

```bash
# 1. Buka terminal baru (jangan di dalam Docker) dan masuk ke backend
cd backend

# 2. Pastikan semua dependensi terinstal di lokal
pnpm install

# 3. Jalankan migrasi dan isi data awal (seeding)
pnpm prisma migrate dev
pnpm prisma db seed
```

> [!TIP]
> Dengan menjalankan migrasi dari lokal, `Prisma Client` akan dibuat di dalam folder `node_modules` lokal Anda. Ini memastikan fitur *autocompletion* (IntelliSense) dan TypeScript di IDE (seperti VS Code) Anda dapat membaca perubahan skema database terbaru dengan sempurna.

---

## 🌐 Konfigurasi Port & Reverse Proxy (Nginx)

Sotto menggunakan **Nginx** sebagai pintu masuk utama (Reverse Proxy) untuk mengarahkan trafik ke frontend dan backend secara aman dan menghindari masalah CORS.

| Service | Port Internal (Docker) | Port Eksternal (Host) | Keterangan |
| :--- | :---: | :---: | :--- |
| **Nginx (Frontend Entrypoint)** | `80` | `8080` | **Akses Utama Aplikasi (http://localhost:8080)** |
| **Backend (NestJS)** | `3000` | `3000` | GraphQL (`/graphql`), REST (`/api`, `/iam`), WebSocket (`/socket.io`) |
| **Frontend (React Router)** | `3000` | - | Diposisikan di belakang Nginx |
| **PostgreSQL** | `5432` | `5432` | Database Relasional Utama (melalui *dev-override*) |
| **MinIO Console** | `9001` | `9001` | Object Storage Console UI |

> [!WARNING]
> **PENTING:** Bila menggunakan Nginx, maka **port frontend utama berada di `8080`**.
> Anda harus membuka **`http://localhost:8080`** di browser Anda untuk mengakses aplikasi. Trafik API dan WebSocket akan secara otomatis di-proxy oleh Nginx ke service backend secara internal.