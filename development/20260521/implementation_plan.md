# Sotto Frontend — Implementation Plan

## Konteks

Backend ~80% siap (16 modul NestJS, full GraphQL schema, codegen hooks ready). Frontend ~15% (UI shell mock data, zero backend connection). Plan ini membawa frontend dari mock → production-ready, fase demi fase.

> [!IMPORTANT]
> Setiap fase bergantung pada fase sebelumnya. Fase 0 & 1 = **blocker** — tanpa ini, semua route = dead UI.

---

## Fase 0: Foundation Fix

> Infrastruktur dasar: state management, API layer, cleanup.

- [ ] **0.1** Install Zustand (`npm install zustand`)
- [ ] **0.2** Buat `core/store/useAuthStore.ts`
  - State: `token`, `user` (id, username, displayName, avatarUrl), `isAuthenticated`
  - Actions: `login(token, user)`, `logout()`, `setUser(user)`
  - Persist ke `localStorage`
- [ ] **0.3** Buat `core/store/useThemeStore.ts`
  - State: `isDark`
  - Actions: `toggleTheme()`, `initTheme()`
  - Sync dgn `document.documentElement.classList` + `localStorage.theme`
- [ ] **0.4** Buat `core/apollo/client.ts`
  - `HttpLink` → `VITE_GRAPHQL_URL`
  - `authLink` → inject `Authorization: Bearer <token>` dari `useAuthStore`
  - `InMemoryCache` dgn type policies dasar
- [ ] **0.5** Wire `ApolloProvider` ke `root.tsx`
- [ ] **0.6** Refactor dark mode dari `_main.tsx` → pakai `useThemeStore`
  - Hapus `isDark` state + `toggleTheme` fn di `_main.tsx`
  - `TopHeader` & `DesktopSidebar` baca dari store
- [ ] **0.7** Hapus 5 dead files (0-byte):
  - `components/layout/Button.tsx`
  - `components/layout/Modal.tsx`
  - `components/layout/Skeleton.tsx`
  - `components/ui/BottomNavbar.tsx`
  - `components/ui/TopHeader.tsx`
- [ ] **0.8** Buat `core/constants/ROUTES.ts`
  - Semua path string sebagai constants
- [ ] **0.9** Tambah `hide-scrollbar` utility ke `app.css`
- [ ] **0.10** Buat `.env` dgn variabel lengkap:
  - `VITE_GRAPHQL_URL`, `VITE_WS_URL`, `VITE_MINIO_PUBLIC_URL`, `VITE_IAM_BASE_URL`
- [ ] **0.11** Buat `core/utils/formatCurrency.ts` & `core/utils/formatDate.ts`

---

## Fase 1: Auth Flow

> Gerbang masuk app. Tanpa ini, semua query GraphQL gagal (JWT required).

- [ ] **1.1** Buat `features/auth/components/LoginForm.tsx`
  - Email + password input, show/hide toggle
  - Logo + tagline header
  - Submit → REST `POST /iam/login` → simpan token ke `useAuthStore`
  - Error handling: toast merah
  - Link ke `/register`
- [ ] **1.2** Buat `features/auth/components/RegisterWizard.tsx`
  - Step 1: Email, password, konfirmasi password (strength indicator)
  - Step 2: Display name, username (real-time check), sekolah (autocomplete `searchSchools`), jurusan
  - Step 3: Avatar upload (opsional) via `requestUploadUrl`
  - Submit → REST `POST /iam/register` → auto-login → redirect feed
- [ ] **1.3** Wire `routes/login.tsx` → render `LoginForm`
- [ ] **1.4** Wire `routes/register.tsx` → render `RegisterWizard`
- [ ] **1.5** Buat auth guard di `_main.tsx`
  - Cek `useAuthStore.isAuthenticated`
  - Jika false → redirect `/login`
- [ ] **1.6** Buat `features/auth/hooks/useLogin.ts` & `useRegister.ts`
  - Handle REST call, error parsing, token storage

---

## Fase 2: Feed — Koneksi Backend

> Layar utama. Ganti mock data → real GraphQL.

- [ ] **2.1** Buat `features/feed/api/feed.graphql` (`.graphql` source files utk codegen)
- [ ] **2.2** Wire `_main._index.tsx` → `useGetFeedQuery`
  - Replace `MOCK_POSTS` dgn real data
  - Map `PostModel` fields → `PostCard` props
- [ ] **2.3** Refactor `PostCard` props → match `PostModel` schema
  - Avatar URL: resolve dari `authorAvatarObjectKey` + `VITE_MINIO_PUBLIC_URL`
  - Timestamp: `formatDate(createdAt)` → "2 jam yang lalu"
- [ ] **2.4** Buat `components/ui/Skeleton.tsx`
  - `PostCardSkeleton` variant (3 stacked pulse blocks)
  - Show saat `loading === true`
- [ ] **2.5** Buat empty state utk feed kosong
  - Ilustrasi SVG + "Belum ada karya. Mulai unggah portofoliomu!"
- [ ] **2.6** Error state handling (toast merah saat GraphQL error)
- [ ] **2.7** Implementasi infinite scroll / load more

---

## Fase 3: Profile — Koneksi Backend

> Profil sendiri + profil publik orang lain.

- [ ] **3.1** Refactor `_main.profile.tsx` → pindahkan 240 LOC ke `features/profile/components/`
  - `HeroSection.tsx` (cover, avatar, bio, stats)
  - `ProfileTabs.tsx` (penawaran, pengalaman)
  - `ListingCard.tsx` (reusable)
- [ ] **3.2** Wire profil sendiri → `useGetMyProfileQuery`
- [ ] **3.3** Buat route `_main.profile.$username.tsx` → `useGetUserProfileQuery`
- [ ] **3.4** Wire listings tab → `useGetListingsByAccountQuery` (codegen: `listingsByAccount`)
- [ ] **3.5** Implementasi follow/unfollow
  - `useFollowUserMutation` / `useUnfollowUserMutation`
  - Optimistic update pada follower count
- [ ] **3.6** Buat `features/profile/components/EditProfileForm.tsx`
  - Display name, bio, jurusan, avatar upload
  - Wire → `useUpdateProfileMutation`
- [ ] **3.7** Avatar upload flow → `requestUploadUrl` → PUT file ke MinIO → `updateProfile(avatarObjectKey)`

---

## Fase 4: Listing Detail (Halaman Baru)

> Jembatan browsing → transaksi. Route belum ada, harus dibuat dari nol.

- [ ] **4.1** Tambah route ke `routes.ts`: `route("listing/:id", "routes/_main.listing.$id.tsx")`
- [ ] **4.2** Buat `routes/_main.listing.$id.tsx`
  - Wire → `useGetListingDetailQuery`
- [ ] **4.3** Buat `features/listings/components/ListingDetail.tsx`
  - Image slider (carousel horizontal dgn dots indicator)
  - Judul, harga, deskripsi lengkap
  - Info penjual (avatar, nama, trust score, link ke profil)
  - Tags
- [ ] **4.4** Sticky bottom action bar — branching:
  - Jasa → `[Chat Penjual]` (trigger `createConversation` dgn `listing_id` context)
  - Produk Digital → `[Chat Penjual]` (kecil) + `[Beli & Unduh]` (besar, hijau)
  - Badge: "Akses Instan" (produk digital) / "Estimasi X Hari" (jasa)
- [ ] **4.5** Skeleton loader utk detail page
- [ ] **4.6** "Fully Booked" overlay jika `max_active_orders` tercapai

---

## Fase 5: Create Wizard — Penyelesaian

> Saat ini hanya portfolio form yg partial. Perlu listing wizard + real upload.

- [ ] **5.1** Wire portfolio upload → `requestUploadUrl` + PUT → `confirmUpload` + `createPost`
  - Progress bar saat upload
  - Character counter real (0/500)
- [ ] **5.2** Tag autocomplete → `useSearchTagsQuery` (debounced)
  - Dropdown suggestion, klik utk tambah, `[X]` utk hapus
- [ ] **5.3** Listing wizard — handle `"penawaran"` type selection
  - Step 1: Type switcher (Jasa / Produk Digital) — sudah ada
  - Step 2 (Jasa): Judul, kategori, harga (currency mask), estimasi hari, max orders
  - Step 2 (Digital): Judul, harga, file upload (ZIP/PDF) ke MinIO
  - Step 3: Deskripsi + galeri thumbnail
  - Submit → `useCreateListingMutation`
- [ ] **5.4** Buat `features/listings/store/useCreateListingStore.ts` (Zustand lokal utk wizard state)
- [ ] **5.5** Handle `"pengalaman"` type (sederhana: text post dgn tag khusus)

---

## Fase 6: Chat — Real-time

> WebSocket integration. Kompleksitas tinggi.

- [ ] **6.1** Wire `_main.chats.tsx` → `useGetConversationsQuery`
  - Replace mock data
  - Resolve avatar dari `avatarObjectKey`
  - Show `lastMessageContent` + unread indicator
- [ ] **6.2** Fix route → `workspace.chat.$conversationId.tsx` dgn dynamic param
- [ ] **6.3** Wire chat room → `useGetMessagesQuery(conversationId)`
- [ ] **6.4** Buat `features/chat/hooks/useChatSocket.ts`
  - Socket.io connection ke `VITE_WS_URL`
  - Event: `sendMessage`, `newMessage`, `typing`
  - Auto-reconnect
- [ ] **6.5** Implementasi send message (text) via WebSocket
- [ ] **6.6** Implementasi send attachment (file/image)
  - `requestUploadUrl` → PUT → send message dgn media ref
- [ ] **6.7** Custom offer creation (seller-side)
  - `[+ Buat Penawaran]` button → modal/form → `useCreateOfferMutation`
- [ ] **6.8** Accept/Reject offer (buyer-side)
  - `useAcceptOfferMutation` → navigate ke checkout
  - `useRejectOfferMutation`
- [ ] **6.9** Contextual banner: tampilkan listing info jika conversation punya context

---

## Fase 7: Orders & Checkout

> State machine transaksi. Escrow flow.

- [ ] **7.1** Wire `_main.orders.tsx` → `useGetMyOrdersQuery`
  - Tab filter: Semua / Pembelian / Penjualan (role param)
  - Status filter
- [ ] **7.2** Fix route → `workspace.order.$orderId.tsx` dgn dynamic param
- [ ] **7.3** Wire order detail → `useGetOrderDetailQuery`
  - Dynamic progress tracker berdasarkan `status`
  - Action board berubah per status + role
- [ ] **7.4** Order room messaging area (klarifikasi §16 user-flow)
  - Chat area di tengah, input/action board di bawah
  - File card utk deliverables
- [ ] **7.5** Buat `features/orders/components/CheckoutSummary.tsx`
  - Order breakdown, biaya admin, total
  - Security badge (escrow info)
  - Trigger: dari accept offer ATAU dari "Beli & Unduh" (digital product)
  - `[Lanjut ke Pembayaran]` → `useCreateOrderMutation` → redirect Midtrans
- [ ] **7.6** Buat `features/orders/components/ReviewModal.tsx`
  - 5 star interactive rating
  - Optional text area
  - Submit → `useCreateReviewMutation`
  - Trigger: otomatis muncul setelah "Pesanan Selesai"
- [ ] **7.7** Wire status mutations
  - `useAdvanceOrderStatusMutation` (seller kirim hasil → status maju)
  - `useCancelOrderMutation`

---

## Fase 8: Polish & Missing Screens

> Fitur pendukung, UX polish, animasi.

- [ ] **8.1** Notification system
  - Buat `features/notifications/components/NotificationDrawer.tsx`
  - Wire → `useGetNotificationsQuery` + `markNotificationAsRead`
  - Unread count badge di bell icon + bottom nav
- [ ] **8.2** "Koleksi Saya" — Digital Library tab di profil
  - List purchased digital products
  - Download via presigned URL
- [ ] **8.3** Search results page
  - Mixed results: accounts + listings + posts
  - Filter chips
  - Wire → `searchAccounts` + `searchListings`
- [ ] **8.4** Explore page — wire trending/recommended dari backend
- [ ] **8.5** Post detail page (`/post/:postId`)
  - Full post + komentar inline
- [ ] **8.6** Comment bottom sheet
  - Komentar list + input
- [ ] **8.7** Listing management (seller)
  - Edit/delete/pause dari profil
  - Popover menu per listing card
- [ ] **8.8** Toast notification system (sukses/error feedback)
- [ ] **8.9** Framer Motion animations
  - Page transitions
  - Card hover/press effects
  - FAB animation
  - Bottom sheet slide
- [ ] **8.10** Skeleton loaders utk semua halaman
  - Feed, profile, chat list, order list, listing detail
- [ ] **8.11** Empty states dgn ilustrasi SVG utk semua halaman kosong

---

## Verification Plan

### Per Fase
- Typecheck: `npm run typecheck` pass tanpa error
- Dev server: `npm run dev` → halaman render tanpa crash
- Manual test: navigasi semua route, verifikasi data tampil

### End-to-End (Post Fase 7)
- Register → Login → Browse Feed → View Profile → View Listing → Chat → Create Offer → Accept → Checkout → Order Room → Review → Trust Score update
- Digital Product flow: Browse → Buy Instant → Download dari Koleksi

### Browser Test
- Mobile viewport (375px) — bottom nav, responsive layout
- Desktop viewport (1440px) — sidebar, max-width content

---

## Open Questions

> **Q1:** Midtrans belum di-setup → **Fase 7.5 checkout di-mock** (UI lengkap, tapi tombol "Lanjut ke Pembayaran" tampilkan placeholder/toast "Pembayaran belum tersedia"). Wire ke Midtrans nanti saat backend ready.

> **Q2:** ScyllaDB sudah running ✅ → Feed & chat langsung pakai real queries, tidak perlu fallback.

> **Q3:** Eksekusi **strict sequential** 0→1→2→3→4→5→6→7→8. Setiap fase selesai dulu sebelum lanjut.
