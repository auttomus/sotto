# Sotto — Eksplorasi Menyeluruh & Rencana Pengembangan Frontend (Update 23 Mei 2026)

## 1. Status Aktual & Progres Implementasi Frontend

Berdasarkan eksplorasi pada codebase saat ini, telah terjadi **kemajuan yang sangat signifikan** dibandingkan dengan status eksplorasi sebelumnya (21 Mei 2026). Struktur dasar sudah terbangun, dan integrasi awal antara Frontend dan Backend telah berjalan.

### 1.1 Foundation & Infrastructure (✅ Selesai)
- **State Management**: Zustand sudah diimplementasi dengan sangat baik (`useAuthStore`, `useThemeStore`, `useToastStore`).
- **API Client**: `ApolloProvider` telah dikonfigurasi di `client.ts` dengan HttpLink & AuthLink (menyuntikkan Bearer token), serta terintegrasi di `root.tsx`.
- **Routing**: Menggunakan React Router v7 (Framework Mode) dengan struktur layout yang modular di `routes.ts`. Route parameters sudah dinamis (`/listing/:id`, `/workspace/chat/:conversationId`, `/profile/:username`).
- **Codegen**: `@graphql-codegen` (`generated.ts` dan `base-types.ts`) sudah diekstrak ke dalam folder `core/apollo/`, memungkinkan pemisahan antara schema type dan react hooks.

### 1.2 Status Fitur
| Fitur | Status | Detail Implementasi |
|-------|--------|---------------------|
| **Auth** | 🟡 Hampir Selesai | `LoginForm` dan `RegisterWizard` sudah dibuat. Guard di `_main.tsx` sudah aktif mengalihkan *unauthenticated user* ke `/login`. |
| **Feed** | ✅ Selesai | Integrasi `useInfiniteFeed` dengan API. Mendukung infinite scroll menggunakan IntersectionObserver dan optimisasi Apollo cache. |
| **Profile** | ✅ Selesai | Mengambil data via `useGetMyProfileQuery` dan `useGetListingsByAccountQuery`. Data dinamis & `ProfileLayout` modular. |
| **Listings** | 🟡 Berjalan | Halaman Detail Listing (`_main.listing.$id.tsx`) menggunakan `useGetListingDetailQuery` dan `ListingDetail`. |
| **Chat** | 🟢 Terintegrasi | `workspace.chat.$conversationId.tsx` menggunakan `useGetMessagesQuery` + WebSockets (`useChatSocket`) untuk real-time messaging dan optimistic UI. |
| **Create** | 🟡 Berjalan | `workspace.create.tsx` dan wizard steps sudah memiliki struktur komponen, tapi integrasi untuk *upload* belum komplit. |
| **Orders** | 🟡 Berjalan | Route `_main.orders.tsx` dan `workspace.order.$orderId.tsx` sudah terdefinisi. |

---

## 2. Refactoring & Code Cleaning (Apa yang Harus Dibenahi)

Meski banyak fitur sudah terkoneksi, ada beberapa hal yang perlu di-refactor demi *maintainability* jangka panjang:

### 2.1 File & Folder Organization
- **Hapus Placeholder**: Di beberapa folder (`features/chat/components`, `features/orders/components`) masih ada file `[placeholder]` atau direktori kosong. Hapus agar tidak menjadi *noise*.
- **Pindahkan Logic ke Custom Hooks**: Komponen yang cukup kompleks seperti `workspace.chat` memiliki inline *optimistic logic*. Ekstrak logika ini ke dalam `features/chat/hooks/useChatRoom.ts`.
- **Rapikan GraphQL Documents**: Pindahkan kueri-kueri GraphQL yang saat ini masih tercecer ke dalam folder masing-masing domain (contoh: `features/orders/api/orders.graphql`, `features/feed/api/feed.graphql`) agar bisa digenerate oleh codegen tanpa bentrok.

### 2.2 UI & UX Improvements
- **Standardisasi Error Handling**: Saat ini error state (seperti jika data Profile tidak ada) di-handle per halaman. Kita butuh komponen `ui/EmptyState.tsx` dan `ui/ErrorState.tsx` yang bisa dipakai berulang kali.
- **Konsistensi Skeleton**: Skeleton sudah dipakai di Feed dan ListingDetail. Pastikan Skeleton juga digunakan pada navigasi Explore dan Orders untuk memperhalus UX saat *Network Delay*.

---

## 3. Rencana Implementasi Penuh (Wiring Backend & Frontend)

Untuk mencapai versi *stable full implementation*, fokus berikutnya adalah:

### Fase 1: Sistem Upload Media (Krusial)
Saat ini *Media Upload* belum tersambung utuh.
1. Buat custom hook `useUploadMedia.ts`.
2. Flow: Panggil Mutasi `requestUploadUrl` (GraphQL) -> Dapatkan Pre-Signed URL MinIO -> Eksekusi `PUT` request ke MinIO -> Panggil `confirmUpload` -> Dapatkan Media URL.
3. Terapkan pada: **Avatar Profile**, **Attachments Chat**, dan **Post/Listing Gallery**.

### Fase 2: Checkout & Order Flow
1. Selesaikan implementasi "Beli" pada `ListingDetail`.
2. Wire up GraphQL mutasi `createOrder` yang memicu API escrow dan payments (webhook backend).
3. Buat halaman *Order Status Tracking* pada `workspace.order.$orderId.tsx` dengan memanfaatkan subskripsi WebSocket (atau polling ringan) jika order sudah dibayar.

### Fase 3: Fitur Negosiasi & Custom Offer
1. Di ruang `workspace.chat`, tambahkan fitur untuk *Seller* mengirim "Penawaran Custom".
2. Wire mutasi `createNegotiation` dari Backend.
3. *Buyer* dapat mengklik tombol "Terima" pada Card Chat yang memicu sistem checkout baru untuk harga negosiasi.

### Fase 4: Explore & Search Integration
1. Ganti *mock data* pada halaman `_main.explore.tsx` dengan GraphQL hooks dari `searchListings` (Public) dan `searchAccounts`.
2. Integrasikan Filter kategori yang ada di backend.

### Fase 5: Notifikasi & Analytics
1. Notifikasi *real-time* via WebSocket untuk Like, Comment, Order Status, dan Chat baru. Panggil `useGetNotificationsQuery` untuk riwayat notifikasi.
2. Analytics (Opsional untuk peluncuran, namun penting). Tampilkan view count pada Listing dari module Analytics GraphQL.

---

## 4. Kesimpulan Strategis

Tim telah berhasil menyeberangi *gap* paling sulit: **Wiring Infrastructure Frontend**. Dengan Apollo terhubung ke NestJS beserta Auth token di headers, sebagian besar pekerjaan sekarang hanyalah:
1. Menambahkan form state.
2. Memanggil mutasi.
3. Me-refresh cache / memperbarui Zustand.

Langkah berikutnya yang paling mendesak adalah memastikan **flow unggah file ke MinIO** dan **alur Checkout (Pembayaran)** bisa berjalan dari ujung ke ujung.
