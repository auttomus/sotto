# Panduan Arsitektur: GraphQL vs REST di Sotto Platform

Dokumen ini memuat perbandingan mendalam, filosofi desain, serta panduan praktis antara **GraphQL (GQL)** dan **REST API** di dalam ekosistem Sotto Monorepo. Sotto memanfaatkan kelebihan dari kedua arsitektur ini secara hibrida (*hybrid approach*) untuk mencapai performa maksimal, integrasi pihak ketiga yang mulus, dan *developer experience* (DX) yang luar biasa.

---

## 🧭 1. Ringkasan Filosofi Hibrida Sotto

Sotto menggunakan pendekatan **"Right Tool for the Right Job"** (Alat yang Tepat untuk Pekerjaan yang Tepat):

*   **GraphQL (90% Utama):** Digunakan untuk seluruh fitur interaksi data inti (Feed, Chat, Pencarian, Transaksi Pesanan, Profil Pengguna, dan Negosiasi). Hal ini dikarenakan aplikasi memerlukan data relasional kompleks yang saling terhubung erat.
*   **REST API (10% Tambahan):** Digunakan khusus untuk operasi non-kueri data interaktif seperti **Unggah Media langsung ke S3/MinIO** (Presigned Upload URLs) dan **Webhooks integrasi luar** (Midtrans Payment Notification) yang menuntut protokol RESTful standar.

---

## 📊 2. Perbandingan Fitur Utama: GraphQL vs REST

| Dimensi Perbandingan | GraphQL (GQL) | REST (Representational State Transfer) |
| :--- | :--- | :--- |
| **Endpoint** | **Satu Endpoint Tunggal:** Seluruh kueri diarahkan ke `/graphql` (POST). | **Banyak Endpoint (Multi-URI):** Menggunakan path unik seperti `/listings/:id`, `/orders`, dll. |
| **Pengambilan Data** | **Deklaratif:** Klien menentukan field apa saja yang diinginkan secara presisi. | **Imperatif:** Server menentukan struktur payload JSON yang dikembalikan. |
| **Over-fetching / Under-fetching** | **Tereliminasi:** Hanya mengambil kolom yang dideklarasikan klien (efisien bandwith). | **Sering Terjadi:** Mengambil field yang tidak diperlukan (*over-fetching*), atau harus hit banyak endpoint (*under-fetching*). |
| **Sistem Tipe data (Type-Safety)** | **Sangat Ketat:** Skema tertulis otomatis (`schema.gql`) sebagai kontrak terpusat. | **Longgar:** Memerlukan Swagger/OpenAPI tambahan agar type-safe di frontend. |
| **Caching** | **Client-Driven Caching:** Mengandalkan normalized client cache (Apollo InMemoryCache). | **HTTP-Level Caching:** Sangat mudah di-cache di level CDN, Varnish, atau browser via header HTTP. |
| **Real-Time** | **Native Subscriptions:** Berjalan di atas WebSocket (`graphql-ws`). | **Polling / SSE:** Harus mengandalkan Server-Sent Events atau Socket.io secara terpisah. |

---

## 🔍 3. Analisis Mendalam Kelebihan & Kekurangan

### A. GraphQL (GQL)

#### Kelebihan 🚀
1. **Solusi Efisiensi Jaringan (Menghilangkan Over/Under-fetching):**
   * *Contoh di Sotto:* Pada halaman Explore, frontend hanya memerlukan `title`, `price`, dan `author.displayName` untuk menampilkan Listing Card. Di GraphQL, kuerinya sangat ramping:
     ```graphql
     query GetListings {
       listings { id title price author { displayName } }
     }
     ```
     Jika menggunakan REST, endpoint `/api/listings` mungkin akan mengembalikan ratusan baris data termasuk deskripsi lengkap, riwayat ulasan, dan detail teknis sekolah yang tidak diperlukan di halaman utama (membuang bandwidth seluler).
2. **Kueri Agregasi Bersarang dalam Satu Roundtrip:**
   * Di halaman detail produk Sotto, kita butuh detail Listing, Profil Penjual (Seller), dan Ulasan (Reviews). Di GraphQL, ini dapat ditarik **dalam 1 HTTP Request** bersarang. Di REST standar, frontend harus memicu 3 request terpisah:
     * `GET /api/listings/:id`
     * `GET /api/accounts/:sellerId`
     * `GET /api/listings/:id/reviews`
3. **Kontrak Skema & TypeScript Auto-Generator:**
   * Setiap perubahan schema di NestJS backend otomatis memperbarui file `/backend/src/schema.gql`. Di frontend, kita menjalankan generator untuk menghasilkan React Hooks bertipe data ketat (`useGetListingQuery`) secara otomatis. Tidak ada lagi kesalahan pengetikan nama kolom!

#### Kekurangan ⚠️
1. **Kompleksitas Caching HTTP:**
   * Karena seluruh request dikirim via metode `POST` ke endpoint tunggal `/graphql`, cache browser bawaan atau CDN tidak dapat membedakan kueri satu dengan kueri lainnya.
2. **Risiko N+1 Database Queries:**
   * Jika tidak ditangani dengan baik menggunakan dataloader (seperti `@nestjs/graphql` DataLoader), query relasional bersarang (misal mengambil komentar untuk setiap post) dapat memicu ratusan kueri terpisah ke database PostgreSQL/ScyllaDB.

---

### B. REST API

#### Kelebihan 🚀
1. **Sangat Mudah Di-cache di Level Edge/CDN:**
   * Metode `GET /api/schools` mengembalikan data yang jarang berubah. Kita dapat menyimpannya di CDN Cloudflare secara instan menggunakan standard HTTP header (`Cache-Control: max-age=3600`).
2. **Kesesuaian Sempurna untuk Webhook & Layanan Luar:**
   * Sistem pembayaran seperti **Midtrans** mengirimkan notifikasi transaksi ke server kita via HTTP POST webhook standar. Midtrans tidak mengerti skema GraphQL; mereka hanya mengirimkan JSON mentah ke endpoint REST kita (`POST /api/payments/webhook`).
3. **Sederhana untuk Unggah Berkas (Streaming/Binary):**
   * Mengirimkan file gambar profil (avatar) atau dokumen portofolio sebagai multipart form data/binary stream jauh lebih efisien dilakukan melalui standard REST endpoint daripada membungkus binary data di dalam GraphQL payload.

#### Kekurangan ⚠️
1. **Siklus Request yang Lambat pada Layar Kompleks:**
   * Halaman dashboard yang menampilkan notifikasi, unread chat count, profil, dan pesanan terbaru akan memaksa perangkat mobile melakukan puluhan koneksi REST secara paralel.
2. **Dokumentasi yang Sering Ketinggalan Jaman:**
   * Memerlukan upaya ekstra untuk menjaga dokumentasi OpenAPI/Swagger tetap sinkron dengan perubahan kode internal controller NestJS.

---

## 🛠️ 4. Studi Kasus Penerapan Riil di Kode Sotto

### Kasus 1: Mengambil Timeline Postingan beserta Komentarnya (GraphQL)
Di dalam `FeedResolver`, kueri GQL mengambil detail post sekaligus replies-nya yang tersimpan secara terdistribusi di database ScyllaDB:

```graphql
# 1 Request untuk menarik seluruh pohon data relasional
query GetPostWithReplies($postId: ID!) {
  post(id: $postId) {
    postId
    content
    createdAt
    authorDisplayName
    replies {
      postId
      content
      authorDisplayName
    }
  }
}
```

### Kasus 2: Notifikasi Pembayaran Midtrans (REST)
Di dalam `payments.controller.ts`, NestJS menyediakan REST endpoint standar agar server Midtrans dapat memicu callback status transaksi secara asinkron:

```typescript
@Controller('payments')
export class PaymentsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post('webhook')
  async handleMidtransWebhook(@Body() payload: any) {
    const { order_id, transaction_status } = payload;
    await this.ordersService.updatePaymentStatus(order_id, transaction_status);
    return { status: 'success' };
  }
}
```

---

## 💡 5. Kesimpulan dan Rekomendasi DX

> [!TIP]
> **Gunakan GraphQL** untuk 95% interaksi UI aplikasi React Router Anda. Manfaatkan generator tipe otomatis (`@graphql-codegen`) agar pengembangan frontend Anda berjalan secepat kilat dengan perlindungan tipe data TypeScript penuh.
>
> **Gunakan REST API** saat Anda mengintegrasikan API pihak ketiga (payment gateway, OAuth provider, mailer webhook) atau merancang sistem pengunggahan media biner langsung (*direct S3 upload*).
