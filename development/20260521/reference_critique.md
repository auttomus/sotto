# Kritik Referensi Frontend Sotto

## Metode

Walk-through setiap user journey end-to-end (register → browse → transact → review), cocokkan dgn:
- `initial-prompt.md` (visi)
- `schema.gql` (23 mutations, 20 queries)
- Prisma schema (14 model)

## Gap yang Ditemukan

### user-flow.md — 8 Alur Hilang

| # | Alur Hilang | Kenapa Kritis | Backend Ready? |
|---|-------------|---------------|----------------|
| 8 | **Login UI** | Gerbang masuk app. Initial prompt: "Arya membuat akun". Zero spec | ✅ `POST /iam/login` |
| 9 | **Register Wizard** | 3-step: akun → identitas → avatar. `searchSchools` utk dropdown | ✅ `POST /iam/register` + `searchSchools` |
| 10 | **Notification Drawer** | Bell icon disebut di §2A, tapi 0 spec isi laci. 4 tipe notif ada di backend | ✅ `notifications(cursor, take)` + `markNotificationAsRead` + `markAllNotificationsAsRead` |
| 11 | **Edit Profile** | Settings icon ada di profil, tapi 0 spec form edit | ✅ `updateProfile(input)` + `requestUploadUrl` |
| 12 | **Comment Bottom Sheet** | §2 PostCard sebut "menampilkan bottom sheet komentar" tapi 0 spec isi | ⚠️ Partial — `createPost(inReplyToPostId)` ada, tapi query komentar per-post belum eksplisit |
| 13 | **Post Detail Page** | Tap post di feed → ??? Tak ada halaman detail + komentar inline | ⚠️ Butuh route `/post/:postId` |
| 14 | **Search Results** | Explore punya search input, tapi 0 spec tampilan hasil | ✅ `searchAccounts(query)` + `searchListings(query, tagIds)` |
| 15 | **Listing Management** | Seller buat listing, tapi 0 spec edit/delete/pause | ✅ `updateListing(id, input)` + `deleteListing(id)` |
| 16 | **Order Room Chat Area** | §6 bilang "mirip obrolan" tapi hanya spec tracker + action, 0 messaging area | ✅ `messages(conversationId)` |

### structure-reference.md — 5 Gap

| # | Gap | Detail |
|---|-----|--------|
| 1 | **Routes tak lengkap** | `/chats`, `/orders`, `/listing/:id`, `/profile/:username`, `/post/:postId` hilang dari tree |
| 2 | **Workspace routes statis** | `/workspace/chat` harusnya `/workspace/chat/:conversationId`, idem order |
| 3 | **Env vars tak lengkap** | Hanya `VITE_GRAPHQL_URL`. Hilang: `VITE_WS_URL`, `VITE_MINIO_PUBLIC_URL`, `VITE_IAM_BASE_URL` |
| 4 | **Store files abstrak** | `useAuthStore.ts` dan `useThemeStore.ts` disebut komentar tapi tak ada di tree |
| 5 | **Feature `notifications/` hilang** | Backend punya modul notifications lengkap, frontend tree tak punya domain ini |

## Apa yang Ditambahkan

### [user-flow.md](file:///home/okuta/Documents/sotto/development/frontend-reference/user-flow.md)

Ditambah 9 section baru (§8–§16) di akhir file dgn header **"TAMBAHAN: Alur yang Hilang dari Referensi Asli"**:

```diff:user-flow.md
### 1. Sistem Navigasi Utama (The Skeleton)

Aplikasi ini dibungkus oleh tata letak utama yang memiliki **Bottom Navigation Bar** statis di bagian bawah layar.

- **Atom Navigation Icons:**
  - `[Icon: Home]` $\rightarrow$ Beranda / Feed.
  - `[Icon: Search]` $\rightarrow$ Eksplorasi & Pencarian Spesifik.
  - `[Icon: Chat]` $\rightarrow$ Kotak Masuk Pesan (Dilengkapi atom _Red Dot Badge_ jika ada `is_read = false`).
  - `[Icon: Clipboard]` $\rightarrow$ Manajemen Order (Untuk memantau pesanan aktif).
  - `[Icon: User]` $\rightarrow$ Profil Pribadi.

---

### 2. Tampilan Menu Beranda (Feed Timeline)

Ini adalah layar pertama setelah _login_, digerakkan oleh algoritma _Synergy Engine_.

**A. Header Navigation (Sticky Top)**

- **App Logo Text** (Kiri atas).
- **Search Input Field:** _Placeholder_ "Cari karya atau spesialisasi...".
- **Notification Bell Icon:** Dengan _Red Dot Badge_. Menuju ke laci notifikasi.

**B. Feed Component (React Router v7 Infinite Scroll Loader)**
Ini adalah daftar vertikal (_list_) yang berisi _Card_ portofolio. Kita bedah **Satu Card Postingan (Organism)**:

- **Card Header (Author Info):**
  - `[Avatar Image]` (Bundar, bersumber dari URL MinIO).
  - `[Text: Display Name]` (Contoh: "Kadek Agus").
  - `[Badge: School Name]` (Teks kecil ber- _background_ abu-abu: "SMK Negeri 1 Denpasar - RPL").
  - `[Text: Timestamp]` (Contoh: "2 jam yang lalu").
- **Card Body (Content):**
  - `[Text: Description]` (Paragraf penjelasan karya).
  - `[Tag Pills]` (Kumpulan atom dengan _background_ warna, misal: `#Rust`, `#Vite`, `#Frontend`).
  - `[Media Box]` (Bisa _single image_ statis atau _carousel slider_ horizontal jika _array_ foto > 1).
- **Card Attachment (Jika postingan menautkan Listing Jasa):**
  - Sebuah _box_ kecil di bawah foto yang bisa di-klik. Berisi _Thumbnail_ kecil, `[Text: Jasa Pembuatan Web MVP]`, dan `[Text: Rp 150.000]`.
- **Card Footer (Action Bar):**
  - `[Button: Heart/Like]` (Dengan _counter_ angka di sebelahnya).
  - `[Button: Comment]` (Menampilkan _modal_ bawah/ _bottom sheet_ untuk komentar).
  - `[Button: Share]`.

---

### 3. Tampilan Profil Publik (Public Persona)

Layar saat seseorang menekan avatar siswa lain.

**A. Hero Section & Biodata**

- `[Image: Cover Background]` (Header persegi panjang).
- `[Image: Avatar]` (Besar, posisinya memotong garis _cover background_).
- `[Text: Display Name]` & `[Text: @username]`.
- `[Badge: Trust Score]` (Ikon Bintang dengan angka, misal: $\star$ 4.8).
- `[Text: Follower Count]` & `[Text: Following Count]`.
- **Action Row:**
  - `[Button: Follow]` (Warna utama/Primary).
  - `[Button: Message]` (Warna sekunder/Outline).

**B. Content Tabs (Sticky Navigation)**
Terdiri dari dua _tab_ yang bisa di- _swipe_:

- **Tab 1: Portofolio (Grid View)** $\rightarrow$ Kumpulan kotak-kotak _thumbnail_ gambar (seperti _feed_ Instagram profil).
- **Tab 2: Etalase / Listings (List View)** $\rightarrow$ Daftar penawaran jasa.

**C. Komponen Listing Card (Di dalam Tab Etalase):**

- `[Image: Thumbnail Jasa]`.
- `[Text: Judul Jasa]`.
- `[Text: Harga (Misal: Mulai dari Rp 50.000)]`.
- `[Text: Estimasi Waktu (Misal: 3 Hari)]`.
- **Dynamic State Atom:** Jika perhitungan antrean penuh (Sesuai `max_active_orders` di PostgreSQL), muncul lapisan gelap (_overlay_) bertuliskan `[Badge: Fully Booked / Penuh]`.

---

### 4. Tampilan Detail Jasa & Pre-Sales

Layar saat satu _Listing Card_ diklik.

- `[Image Slider]` (Foto portofolio spesifik jasa tersebut).
- `[Text: Judul Ekstra Besar]`.
- `[Text: Harga Utama]`.
- `[Text: Deskripsi Lengkap]`.
- **Sticky Bottom Action Bar:** Mengambang di paling bawah layar agar selalu terlihat.
  - `[Button Utama: Chat Penjual]` (Memicu API GraphQL `createConversation` dengan `listing_id`).

---

### 5. Tampilan Ruang Obrolan (The Contextual Chat)

Layar obrolan _real-time_ yang menarik data dari ScyllaDB.

**A. Chat Header**

- `[Button: Back]`, `[Avatar]`, `[Text: Nama Lawan Bicara]`.

**B. Contextual Banner (Opsional)**

- Jika obrolan ini berasal dari klik layar Detail Jasa, akan ada kotak kecil di bawah Header bertuliskan: _"Menanyakan tentang: [Nama Jasa]"_.

**C. Message List (Area Scroll)**

- **Atom Chat Bubble (Teks Biasa).**
- **Atom Custom Offer Card (Penawaran Khusus):**
  - _Card UI_ ber- _border_ tebal di dalam obrolan.
  - `[Text: Penawaran Harga Spesial]`.
  - `[Text: Rp 200.000 - 5 Hari Pengerjaan]`.
  - `[Text: Deskripsi kesepakatan]`.
  - _Role Logic:_ Jika pembeli yang melihat kartu ini, muncul `[Button: Tolak]` dan `[Button: Terima & Bayar]`.

**D. Input Area (Bottom)**

- `[Button: Attachment/Klip]` (Buka galeri/kamera).
- `[Input Field: Ketik pesan...]`.
- `[Button: Send]`.
- **Spesial untuk Penjual:** Ada satu tombol ekstra di pinggir input berupa `[Button: + Buat Penawaran]`.

---

### 6. Tampilan Ruang Kerja Proyek (Order Room)

Mirip dengan Ruang Obrolan, tapi ini adalah area eksekusi pasca-pembayaran.

**A. Order Header (Sangat Krusial)**

- Di bawah nama lawan bicara, terdapat **Progress Tracker Bar**.
- Terdapat 4 atom lingkaran (_steps_): `[Dibayar] - [Dikerjakan] - [Review] - [Selesai]`. Warnanya berubah otomatis sesuai `status` di tabel `orders`.

**B. Action Board (Sticky Bottom, menggantikan text input di momen tertentu)**

- **Jika Status = Dikerjakan:**
  - Untuk Penjual: Muncul `[Button: Kirim Hasil Kerja]` (Meminta unggah _file_ dari _device_).
- **Jika Status = Menunggu Review:**
  - Untuk Pembeli: Muncul `[Button: Minta Revisi]` (Mengembalikan status jadi dikerjakan) dan `[Button: Pesanan Selesai]` warna hijau terang.

---

### 7. Tampilan Modal Ulasan (Review Popup)

Muncul otomatis setelah pembeli menekan "Pesanan Selesai".

- `[Text: Bagaimana hasil kerja Kadek?]`
- `[Interactive Atom: 5 Ikon Bintang]` (Berubah warna saat diklik untuk menentukan skor).
- `[Text Area: Tuliskan pengalamanmu (Opsional)]`.
- `[Button: Kirim Ulasan]`.

---

### Pemetaan Layar "Di Antara" (In Between)

#### 1. Layar Pembuatan Karya (Create Post / Upload)

Layar ini adalah jantung dari _Synergy Engine_. Harus dirancang agar pengguna bisa mengunggah progres karya mereka (entah itu tangkapan layar kode atau desain UI) dalam waktu kurang dari 30 detik.

- **Trigger:** _Floating Action Button_ (FAB) dengan ikon `+` di layar Beranda.
- **A. Media Input Area (Top):**
  - `[Box Uploader Interaktif]`: Klik untuk buka galeri, atau _drag-and-drop_. Jika gambar sudah dipilih, muncul _preview_ dengan tombol kecil `[x]` di pojok untuk menghapus/mengganti.
- **B. Form Area:**
  - `[Text Area: Ceritakan karyamu...]` (Maksimal 500 karakter, ada penghitung atomik di pojok bawah: `0/500`).
  - `[Tag Input Field]`: Ini krusial. Saat _user_ mengetik "Rea", muncul _dropdown_ _autocomplete_ dari _database_ (misal: `#React`, `#ReactRouter`). Ini mencegah _typo_ yang bisa merusak matriks pencarian algoritma.
- **C. Action Bar (Bottom):**
  - `[Button: Batal]` & `[Button: Unggah Karya]`.
  - **Transition State:** Saat tombol ditekan, tombol berubah menjadi _disabled_ dan menampilkan _spinner_ kecil bertuliskan `"Mengunggah ke server..."` (menunggu respon MinIO dan ScyllaDB).

#### 2. Layar Pembuatan Jasa (Create Listing Wizard)

# Bagian ini mengalami perubahan! Harap baca bagian yang di bawah

Karena datanya banyak, layar ini tidak boleh berupa satu _form_ raksasa yang mengintimidasi. Gunakan konsep _Wizard_ (Langkah Bertahap).

- **Header:** `[Progress Bar: Langkah 1 dari 3]`.
- **Step 1: Informasi Dasar**
  - `[Input: Judul Jasa]`.
  - `[Dropdown: Kategori Jasa]` (Ditarik dari tabel `tags`).
  - `[Button: Lanjut]`.
- **Step 2: Harga & Kapasitas**
  - `[Input: Harga (Rp)]` (Harus menggunakan _masking_ otomatis agar memunculkan titik pemisah ribuan).
  - `[Input: Estimasi Pengerjaan (Hari)]`.
  - `[Input: Maksimal Antrean (max_active_orders)]` dengan atom tombol `[-]` dan `[+]`.
- **Step 3: Deskripsi & Galeri**
  - `[Text Area: Jelaskan detail layananmu]`.
  - `[Multiple Image Uploader]`: Tempat menaruh portofolio spesifik jasa ini.
- **Action:** `[Button: Terbitkan Jasa]`.

#### 3. Layar Transisi Pembayaran (_Checkout Summary_)

Sebelum _user_ dilempar ke UI Midtrans/Xendit, aplikasi harus merangkum kesepakatan untuk mencegah penipuan.

- **Trigger:** Mengklik "Terima & Bayar" dari _Custom Offer_ di dalam obrolan.
- **A. Order Breakdown Card:**
  - `[Text: Detail Pesanan]`.
  - `[Item Row: Nama Jasa]`.
  - `[Item Row: Harga Kesepakatan (Misal Rp 150.000)]`.
  - `[Item Row: Biaya Platform/Admin (Misal Rp 2.500)]`.
  - `[Divider Line]`.
  - `[Text Bold: Total Pembayaran (Rp 152.500)]`.
- **B. Security Badge:**
  - `[Icon: Gembok]` dan tulisan kecil _"Dana akan ditahan aman oleh sistem dan baru diteruskan ke penjual setelah hasil kerja kamu terima."_
- **C. Action:** `[Button Utama: Lanjut ke Pembayaran]`.

#### 4. "Ghost" States (Empty, Loading, Error)

Ini adalah "layar di antara" yang sering diabaikan _developer_ hingga H-1 _launching_.

- **A. Skeleton Loaders (Transisi Memuat Data):**
  - Saat React Router v7 sedang menarik data GraphQL, jangan gunakan _spinner_ bulat di tengah layar (itu UI kuno).
  - Gunakan **Skeleton Card**: Blok abu-abu beranimasi _pulse_ (berkedip halus) yang bentuknya menyerupai layout asli. Untuk _feed_, tampilkan 3 kotak abu-abu bertumpuk. Ini memberi ilusi bahwa aplikasi bekerja sangat cepat.
- **B. Empty States (Saat Data Nol):**
  - **Di Layar Obrolan Kosong:** Jangan tampilkan layar putih. Pasang `[Ilustrasi SVG: Surat Kosong]` dengan teks _"Belum ada obrolan. Mulai tawarkan jasamu atau sapa seseorang!"_
  - **Di Profil tanpa Jasa:** `"Siswa ini belum menawarkan jasa apa pun."`
- **C. Toast Notifications (Feedback Instan):**
  - Komponen kecil yang melayang sebentar di atas/bawah layar lalu menghilang.
  - Skenario Sukses: _Toast Hijau_ `"Karya berhasil diunggah!"`
  - Skenario Error: _Toast Merah_ `"Gagal mengirim pesan. Periksa koneksi internet."`

---

### 1. Perombakan Layar Pembuatan Jasa/Produk (Create Listing Wizard)

Langkah pertama sekarang harus bertindak sebagai "Saklar Utama" yang mengubah bentuk _form_ selanjutnya.

- **Step 1: Pemilihan Tipe (The Switcher)**
  - `[Header: Apa yang ingin kamu tawarkan?]`
  - `[Card Button A: Jasa / Service]` $\rightarrow$ "Tawarkan keahlianmu, kerjakan berdasarkan pesanan."
  - `[Card Button B: Produk Digital]` $\rightarrow$ "Jual karya jadimu. Pembeli bisa langsung mengunduh setelah membayar."
- _(Jika pengguna memilih Produk Digital, form berubah drastis)_
- **Step 2: Detail Produk & Upload File (Khusus Produk Digital)**
  - `[Input: Judul Produk]` & `[Input: Harga (Rp)]`.
  - **Penting:** _Input_ "Waktu Pengerjaan" dan "Maksimal Antrean" **dihilangkan (disembunyikan)**. Sebagai gantinya, paksa atribut `is_unlimited = true` di _background_.
  - `[Box Uploader: Unggah File Produk (ZIP/PDF)]` $\rightarrow$ Ini adalah jantungnya. Penjual langsung mengunggah aset aslinya (misal: `source_code.zip`) ke MinIO saat membuat _listing_.
- **Step 3: Deskripsi & Galeri**
  - Sama seperti Jasa (untuk foto _thumbnail_ di _Feed/Profile_).

---

### 2. Tampilan Detail Produk (Instant Buy Mode)

Saat pembeli (misal: Melani) mengklik _listing_ yang bertipe Produk Digital, UI harus mendorong transaksi instan tanpa perlu repot _chat_ negosiasi.

- **Pembeda Visual di Card/Detail:**
  - `[Badge: Akses Instan]` berwarna hijau terang (menggantikan teks "Estimasi 3 Hari").
  - `[Text: File Size (Misal: 15 MB .ZIP)]`.
- **Sticky Bottom Action Bar (Berubah):**
  - Jika Jasa: `[Button: Chat Penjual]`.
  - Jika Produk Digital: `[Button Sekunder: Chat Penjual]` (ukuran kecil di kiri, untuk tanya-tanya) dan **`[Button Utama: Beli & Unduh Langsung]`** (ukuran besar).

---

### 3. Alur Pembayaran yang Dipangkas (The "Bypass" Flow)

Ini adalah UI/UX transisi yang sepenuhnya mengabaikan konsep "Escrow" dan "Order Room".

1.  **Checkout:** Pembeli menekan "Beli & Unduh Langsung". Muncul _Order Breakdown_.
2.  **Payment:** Pembayar via Midtrans.
3.  **Transisi State (Backend Magic):** Saat Webhook NestJS menerima status _Success_:
    - Tidak perlu bikin `chat room` tipe order.
    - Status di tabel `orders` langsung lompat ke `completed`.
    - Uang dari pembeli (setelah dipotong admin) **langsung** masuk ke dompet penjual tanpa ditahan (_no escrow_).

---

### 4. Layar Baru: "Koleksi Saya" (Digital Library)

Karena produk digital tidak diserahkan melalui _chat room_ proyek, pengguna butuh satu layar khusus untuk melihat dan mengunduh semua produk yang pernah mereka beli.

- **Akses:** Melalui menu Profil $\rightarrow$ Tab `[Koleksi Saya] / [Pembelian]`.
- **Isi Layar (List Component):**
  - `[Thumbnail Produk]`.
  - `[Text: Judul Produk]`.
  - `[Text: Dibeli pada 12 Mei 2026]`.
  - `[Button Utama: Unduh File]` $\rightarrow$ Tombol ini memanggil NestJS untuk meminta _Presigned URL_ dari MinIO, lalu memicu _download_ otomatis di _browser_ pembeli.
  - `[Button: Beri Ulasan]`.
===
### 1. Sistem Navigasi Utama (The Skeleton)

Aplikasi ini dibungkus oleh tata letak utama yang memiliki **Bottom Navigation Bar** statis di bagian bawah layar.

- **Atom Navigation Icons:**
  - `[Icon: Home]` $\rightarrow$ Beranda / Feed.
  - `[Icon: Search]` $\rightarrow$ Eksplorasi & Pencarian Spesifik.
  - `[Icon: Chat]` $\rightarrow$ Kotak Masuk Pesan (Dilengkapi atom _Red Dot Badge_ jika ada `is_read = false`).
  - `[Icon: Clipboard]` $\rightarrow$ Manajemen Order (Untuk memantau pesanan aktif).
  - `[Icon: User]` $\rightarrow$ Profil Pribadi.

---

### 2. Tampilan Menu Beranda (Feed Timeline)

Ini adalah layar pertama setelah _login_, digerakkan oleh algoritma _Synergy Engine_.

**A. Header Navigation (Sticky Top)**

- **App Logo Text** (Kiri atas).
- **Search Input Field:** _Placeholder_ "Cari karya atau spesialisasi...".
- **Notification Bell Icon:** Dengan _Red Dot Badge_. Menuju ke laci notifikasi.

**B. Feed Component (React Router v7 Infinite Scroll Loader)**
Ini adalah daftar vertikal (_list_) yang berisi _Card_ portofolio. Kita bedah **Satu Card Postingan (Organism)**:

- **Card Header (Author Info):**
  - `[Avatar Image]` (Bundar, bersumber dari URL MinIO).
  - `[Text: Display Name]` (Contoh: "Kadek Agus").
  - `[Badge: School Name]` (Teks kecil ber- _background_ abu-abu: "SMK Negeri 1 Denpasar - RPL").
  - `[Text: Timestamp]` (Contoh: "2 jam yang lalu").
- **Card Body (Content):**
  - `[Text: Description]` (Paragraf penjelasan karya).
  - `[Tag Pills]` (Kumpulan atom dengan _background_ warna, misal: `#Rust`, `#Vite`, `#Frontend`).
  - `[Media Box]` (Bisa _single image_ statis atau _carousel slider_ horizontal jika _array_ foto > 1).
- **Card Attachment (Jika postingan menautkan Listing Jasa):**
  - Sebuah _box_ kecil di bawah foto yang bisa di-klik. Berisi _Thumbnail_ kecil, `[Text: Jasa Pembuatan Web MVP]`, dan `[Text: Rp 150.000]`.
- **Card Footer (Action Bar):**
  - `[Button: Heart/Like]` (Dengan _counter_ angka di sebelahnya).
  - `[Button: Comment]` (Menampilkan _modal_ bawah/ _bottom sheet_ untuk komentar).
  - `[Button: Share]`.

---

### 3. Tampilan Profil Publik (Public Persona)

Layar saat seseorang menekan avatar siswa lain.

**A. Hero Section & Biodata**

- `[Image: Cover Background]` (Header persegi panjang).
- `[Image: Avatar]` (Besar, posisinya memotong garis _cover background_).
- `[Text: Display Name]` & `[Text: @username]`.
- `[Badge: Trust Score]` (Ikon Bintang dengan angka, misal: $\star$ 4.8).
- `[Text: Follower Count]` & `[Text: Following Count]`.
- **Action Row:**
  - `[Button: Follow]` (Warna utama/Primary).
  - `[Button: Message]` (Warna sekunder/Outline).

**B. Content Tabs (Sticky Navigation)**
Terdiri dari dua _tab_ yang bisa di- _swipe_:

- **Tab 1: Portofolio (Grid View)** $\rightarrow$ Kumpulan kotak-kotak _thumbnail_ gambar (seperti _feed_ Instagram profil).
- **Tab 2: Etalase / Listings (List View)** $\rightarrow$ Daftar penawaran jasa.

**C. Komponen Listing Card (Di dalam Tab Etalase):**

- `[Image: Thumbnail Jasa]`.
- `[Text: Judul Jasa]`.
- `[Text: Harga (Misal: Mulai dari Rp 50.000)]`.
- `[Text: Estimasi Waktu (Misal: 3 Hari)]`.
- **Dynamic State Atom:** Jika perhitungan antrean penuh (Sesuai `max_active_orders` di PostgreSQL), muncul lapisan gelap (_overlay_) bertuliskan `[Badge: Fully Booked / Penuh]`.

---

### 4. Tampilan Detail Jasa & Pre-Sales

Layar saat satu _Listing Card_ diklik.

- `[Image Slider]` (Foto portofolio spesifik jasa tersebut).
- `[Text: Judul Ekstra Besar]`.
- `[Text: Harga Utama]`.
- `[Text: Deskripsi Lengkap]`.
- **Sticky Bottom Action Bar:** Mengambang di paling bawah layar agar selalu terlihat.
  - `[Button Utama: Chat Penjual]` (Memicu API GraphQL `createConversation` dengan `listing_id`).

---

### 5. Tampilan Ruang Obrolan (The Contextual Chat)

Layar obrolan _real-time_ yang menarik data dari ScyllaDB.

**A. Chat Header**

- `[Button: Back]`, `[Avatar]`, `[Text: Nama Lawan Bicara]`.

**B. Contextual Banner (Opsional)**

- Jika obrolan ini berasal dari klik layar Detail Jasa, akan ada kotak kecil di bawah Header bertuliskan: _"Menanyakan tentang: [Nama Jasa]"_.

**C. Message List (Area Scroll)**

- **Atom Chat Bubble (Teks Biasa).**
- **Atom Custom Offer Card (Penawaran Khusus):**
  - _Card UI_ ber- _border_ tebal di dalam obrolan.
  - `[Text: Penawaran Harga Spesial]`.
  - `[Text: Rp 200.000 - 5 Hari Pengerjaan]`.
  - `[Text: Deskripsi kesepakatan]`.
  - _Role Logic:_ Jika pembeli yang melihat kartu ini, muncul `[Button: Tolak]` dan `[Button: Terima & Bayar]`.

**D. Input Area (Bottom)**

- `[Button: Attachment/Klip]` (Buka galeri/kamera).
- `[Input Field: Ketik pesan...]`.
- `[Button: Send]`.
- **Spesial untuk Penjual:** Ada satu tombol ekstra di pinggir input berupa `[Button: + Buat Penawaran]`.

---

### 6. Tampilan Ruang Kerja Proyek (Order Room)

Mirip dengan Ruang Obrolan, tapi ini adalah area eksekusi pasca-pembayaran.

**A. Order Header (Sangat Krusial)**

- Di bawah nama lawan bicara, terdapat **Progress Tracker Bar**.
- Terdapat 4 atom lingkaran (_steps_): `[Dibayar] - [Dikerjakan] - [Review] - [Selesai]`. Warnanya berubah otomatis sesuai `status` di tabel `orders`.

**B. Action Board (Sticky Bottom, menggantikan text input di momen tertentu)**

- **Jika Status = Dikerjakan:**
  - Untuk Penjual: Muncul `[Button: Kirim Hasil Kerja]` (Meminta unggah _file_ dari _device_).
- **Jika Status = Menunggu Review:**
  - Untuk Pembeli: Muncul `[Button: Minta Revisi]` (Mengembalikan status jadi dikerjakan) dan `[Button: Pesanan Selesai]` warna hijau terang.

---

### 7. Tampilan Modal Ulasan (Review Popup)

Muncul otomatis setelah pembeli menekan "Pesanan Selesai".

- `[Text: Bagaimana hasil kerja Kadek?]`
- `[Interactive Atom: 5 Ikon Bintang]` (Berubah warna saat diklik untuk menentukan skor).
- `[Text Area: Tuliskan pengalamanmu (Opsional)]`.
- `[Button: Kirim Ulasan]`.

---

### Pemetaan Layar "Di Antara" (In Between)

#### 1. Layar Pembuatan Karya (Create Post / Upload)

Layar ini adalah jantung dari _Synergy Engine_. Harus dirancang agar pengguna bisa mengunggah progres karya mereka (entah itu tangkapan layar kode atau desain UI) dalam waktu kurang dari 30 detik.

- **Trigger:** _Floating Action Button_ (FAB) dengan ikon `+` di layar Beranda.
- **A. Media Input Area (Top):**
  - `[Box Uploader Interaktif]`: Klik untuk buka galeri, atau _drag-and-drop_. Jika gambar sudah dipilih, muncul _preview_ dengan tombol kecil `[x]` di pojok untuk menghapus/mengganti.
- **B. Form Area:**
  - `[Text Area: Ceritakan karyamu...]` (Maksimal 500 karakter, ada penghitung atomik di pojok bawah: `0/500`).
  - `[Tag Input Field]`: Ini krusial. Saat _user_ mengetik "Rea", muncul _dropdown_ _autocomplete_ dari _database_ (misal: `#React`, `#ReactRouter`). Ini mencegah _typo_ yang bisa merusak matriks pencarian algoritma.
- **C. Action Bar (Bottom):**
  - `[Button: Batal]` & `[Button: Unggah Karya]`.
  - **Transition State:** Saat tombol ditekan, tombol berubah menjadi _disabled_ dan menampilkan _spinner_ kecil bertuliskan `"Mengunggah ke server..."` (menunggu respon MinIO dan ScyllaDB).

#### 2. Layar Pembuatan Jasa (Create Listing Wizard)

# Bagian ini mengalami perubahan! Harap baca bagian yang di bawah

Karena datanya banyak, layar ini tidak boleh berupa satu _form_ raksasa yang mengintimidasi. Gunakan konsep _Wizard_ (Langkah Bertahap).

- **Header:** `[Progress Bar: Langkah 1 dari 3]`.
- **Step 1: Informasi Dasar**
  - `[Input: Judul Jasa]`.
  - `[Dropdown: Kategori Jasa]` (Ditarik dari tabel `tags`).
  - `[Button: Lanjut]`.
- **Step 2: Harga & Kapasitas**
  - `[Input: Harga (Rp)]` (Harus menggunakan _masking_ otomatis agar memunculkan titik pemisah ribuan).
  - `[Input: Estimasi Pengerjaan (Hari)]`.
  - `[Input: Maksimal Antrean (max_active_orders)]` dengan atom tombol `[-]` dan `[+]`.
- **Step 3: Deskripsi & Galeri**
  - `[Text Area: Jelaskan detail layananmu]`.
  - `[Multiple Image Uploader]`: Tempat menaruh portofolio spesifik jasa ini.
- **Action:** `[Button: Terbitkan Jasa]`.

#### 3. Layar Transisi Pembayaran (_Checkout Summary_)

Sebelum _user_ dilempar ke UI Midtrans/Xendit, aplikasi harus merangkum kesepakatan untuk mencegah penipuan.

- **Trigger:** Mengklik "Terima & Bayar" dari _Custom Offer_ di dalam obrolan.
- **A. Order Breakdown Card:**
  - `[Text: Detail Pesanan]`.
  - `[Item Row: Nama Jasa]`.
  - `[Item Row: Harga Kesepakatan (Misal Rp 150.000)]`.
  - `[Item Row: Biaya Platform/Admin (Misal Rp 2.500)]`.
  - `[Divider Line]`.
  - `[Text Bold: Total Pembayaran (Rp 152.500)]`.
- **B. Security Badge:**
  - `[Icon: Gembok]` dan tulisan kecil _"Dana akan ditahan aman oleh sistem dan baru diteruskan ke penjual setelah hasil kerja kamu terima."_
- **C. Action:** `[Button Utama: Lanjut ke Pembayaran]`.

#### 4. "Ghost" States (Empty, Loading, Error)

Ini adalah "layar di antara" yang sering diabaikan _developer_ hingga H-1 _launching_.

- **A. Skeleton Loaders (Transisi Memuat Data):**
  - Saat React Router v7 sedang menarik data GraphQL, jangan gunakan _spinner_ bulat di tengah layar (itu UI kuno).
  - Gunakan **Skeleton Card**: Blok abu-abu beranimasi _pulse_ (berkedip halus) yang bentuknya menyerupai layout asli. Untuk _feed_, tampilkan 3 kotak abu-abu bertumpuk. Ini memberi ilusi bahwa aplikasi bekerja sangat cepat.
- **B. Empty States (Saat Data Nol):**
  - **Di Layar Obrolan Kosong:** Jangan tampilkan layar putih. Pasang `[Ilustrasi SVG: Surat Kosong]` dengan teks _"Belum ada obrolan. Mulai tawarkan jasamu atau sapa seseorang!"_
  - **Di Profil tanpa Jasa:** `"Siswa ini belum menawarkan jasa apa pun."`
- **C. Toast Notifications (Feedback Instan):**
  - Komponen kecil yang melayang sebentar di atas/bawah layar lalu menghilang.
  - Skenario Sukses: _Toast Hijau_ `"Karya berhasil diunggah!"`
  - Skenario Error: _Toast Merah_ `"Gagal mengirim pesan. Periksa koneksi internet."`

---

### 1. Perombakan Layar Pembuatan Jasa/Produk (Create Listing Wizard)

Langkah pertama sekarang harus bertindak sebagai "Saklar Utama" yang mengubah bentuk _form_ selanjutnya.

- **Step 1: Pemilihan Tipe (The Switcher)**
  - `[Header: Apa yang ingin kamu tawarkan?]`
  - `[Card Button A: Jasa / Service]` $\rightarrow$ "Tawarkan keahlianmu, kerjakan berdasarkan pesanan."
  - `[Card Button B: Produk Digital]` $\rightarrow$ "Jual karya jadimu. Pembeli bisa langsung mengunduh setelah membayar."
- _(Jika pengguna memilih Produk Digital, form berubah drastis)_
- **Step 2: Detail Produk & Upload File (Khusus Produk Digital)**
  - `[Input: Judul Produk]` & `[Input: Harga (Rp)]`.
  - **Penting:** _Input_ "Waktu Pengerjaan" dan "Maksimal Antrean" **dihilangkan (disembunyikan)**. Sebagai gantinya, paksa atribut `is_unlimited = true` di _background_.
  - `[Box Uploader: Unggah File Produk (ZIP/PDF)]` $\rightarrow$ Ini adalah jantungnya. Penjual langsung mengunggah aset aslinya (misal: `source_code.zip`) ke MinIO saat membuat _listing_.
- **Step 3: Deskripsi & Galeri**
  - Sama seperti Jasa (untuk foto _thumbnail_ di _Feed/Profile_).

---

### 2. Tampilan Detail Produk (Instant Buy Mode)

Saat pembeli (misal: Melani) mengklik _listing_ yang bertipe Produk Digital, UI harus mendorong transaksi instan tanpa perlu repot _chat_ negosiasi.

- **Pembeda Visual di Card/Detail:**
  - `[Badge: Akses Instan]` berwarna hijau terang (menggantikan teks "Estimasi 3 Hari").
  - `[Text: File Size (Misal: 15 MB .ZIP)]`.
- **Sticky Bottom Action Bar (Berubah):**
  - Jika Jasa: `[Button: Chat Penjual]`.
  - Jika Produk Digital: `[Button Sekunder: Chat Penjual]` (ukuran kecil di kiri, untuk tanya-tanya) dan **`[Button Utama: Beli & Unduh Langsung]`** (ukuran besar).

---

### 3. Alur Pembayaran yang Dipangkas (The "Bypass" Flow)

Ini adalah UI/UX transisi yang sepenuhnya mengabaikan konsep "Escrow" dan "Order Room".

1.  **Checkout:** Pembeli menekan "Beli & Unduh Langsung". Muncul _Order Breakdown_.
2.  **Payment:** Pembayar via Midtrans.
3.  **Transisi State (Backend Magic):** Saat Webhook NestJS menerima status _Success_:
    - Tidak perlu bikin `chat room` tipe order.
    - Status di tabel `orders` langsung lompat ke `completed`.
    - Uang dari pembeli (setelah dipotong admin) **langsung** masuk ke dompet penjual tanpa ditahan (_no escrow_).

---

### 4. Layar Baru: "Koleksi Saya" (Digital Library)

Karena produk digital tidak diserahkan melalui _chat room_ proyek, pengguna butuh satu layar khusus untuk melihat dan mengunduh semua produk yang pernah mereka beli.

- **Akses:** Melalui menu Profil $\rightarrow$ Tab `[Koleksi Saya] / [Pembelian]`.
- **Isi Layar (List Component):**
  - `[Thumbnail Produk]`.
  - `[Text: Judul Produk]`.
  - `[Text: Dibeli pada 12 Mei 2026]`.
  - `[Button Utama: Unduh File]` $\rightarrow$ Tombol ini memanggil NestJS untuk meminta _Presigned URL_ dari MinIO, lalu memicu _download_ otomatis di _browser_ pembeli.
  - `[Button: Beri Ulasan]`.

---

### TAMBAHAN: Alur yang Hilang dari Referensi Asli

> Bagian di bawah ini ditambahkan setelah audit menyeluruh terhadap setiap perjalanan pengguna dari awal hingga akhir, dan dicocokkan dengan skema GraphQL backend yang sudah jadi. Semua alur di bawah ini memiliki dukungan API backend (`schema.gql`) namun tidak memiliki spesifikasi UI.

---

### 8. Tampilan Login (Gerbang Masuk)

Layar pertama yang muncul jika pengguna belum terautentikasi. Harus cepat, sederhana, dan meyakinkan.

- **A. Header Visual:**
  - `[App Logo: Sotto]` (Besar, tengah, di atas form).
  - `[Text Tagline]`: _"Panggung Digital untuk Talenta Siswa"_ (Satu baris pendek di bawah logo).

- **B. Form Area:**
  - `[Input: Email]` (Placeholder: "Email sekolah atau pribadi").
  - `[Input: Password]` (Dengan tombol `[Icon: Eye]` untuk show/hide).
  - `[Button Utama: Masuk]` (Full width, warna primary).
  - `[Text Link: Lupa kata sandi?]` (Di bawah tombol, ukuran kecil — **MVP: bisa diabaikan** dulu, tapi tampilannya harus ada).

- **C. Register CTA:**
  - `[Divider: "atau"]`
  - `[Text: Belum punya akun?]` `[Text Link Bold: Daftar Sekarang]` $\rightarrow$ Navigasi ke `/register`.

- **API:** REST `POST /iam/login` → simpan JWT ke `localStorage` / `httpOnly cookie`.

---

### 9. Tampilan Registrasi (Wizard Multi-Step)

Registrasi _tidak boleh_ berupa satu form raksasa. Gunakan wizard agar tidak mengintimidasi siswa baru.

- **Header:** `[Progress Bar: Langkah 1 dari 3]`.

- **Step 1: Akun Dasar**
  - `[Input: Email]`.
  - `[Input: Password]` (Dengan indikator kekuatan: Lemah/Sedang/Kuat).
  - `[Input: Konfirmasi Password]`.
  - `[Button: Lanjut]`.

- **Step 2: Identitas Profesional**
  - `[Input: Display Name]` (Placeholder: "Nama yang ingin ditampilkan").
  - `[Input: Username]` (Dengan prefix `@`, _real-time availability check_ — panggil `searchAccounts` query).
  - `[Dropdown Autocomplete: Asal Sekolah]` (Ditarik dari query `searchSchools`). Saat user mengetik "SMK N", dropdown muncul.
  - `[Input: Jurusan]` (Placeholder: "Contoh: RPL, DKV, Akuntansi").
  - `[Button: Lanjut]`.

- **Step 3: Foto Profil (Opsional)**
  - `[Avatar Uploader]`: Area lingkaran besar, klik untuk pilih foto. Jika belum ada foto, tampilkan inisial dari display name.
  - `[Text: Kamu bisa menambahkan foto nanti]`.
  - `[Button Utama: Mulai Menjelajah]` $\rightarrow$ Langsung masuk ke feed.

- **API:** REST `POST /iam/register` → auto-login → redirect ke feed.

---

### 10. Tampilan Laci Notifikasi (Notification Drawer)

**Trigger:** Menekan ikon lonceng di Header. Bisa berupa _bottom sheet_ (mobile) atau _dropdown panel_ (desktop).

- **A. Header Laci:**
  - `[Text: Notifikasi]`.
  - `[Text Link: Tandai Semua Dibaca]` $\rightarrow$ Panggil `markAllNotificationsAsRead`.

- **B. Daftar Notifikasi (Scrollable):**
  Setiap item notifikasi memiliki struktur:
  - `[Avatar Pengirim]` (Dari `fromAccountId`).
  - `[Text: Nama Pengirim]` + `[Text: Aksi]`.
  - `[Text: Timestamp]` (Relatif: "5 menit lalu").
  - `[Dot Indicator]`: Titik biru kecil jika `is_read = false`.

  Tipe-tipe notifikasi dan teks yang muncul:
  - **FOLLOW:** _"**Melani Putri** mulai mengikutimu"_ → Tap menuju profil Melani.
  - **ORDER_UPDATE:** _"**Kadek Agus** mengirimkan hasil kerja untuk pesanan #ORD-982"_ → Tap menuju `/workspace/order/:id`.
  - **NEW_MESSAGE:** _"**Budi Santoso** mengirimkan pesan baru"_ → Tap menuju `/workspace/chat/:id`.
  - **MENTION:** _"**Wayan Surya** menyebutmu dalam postingan"_ → Tap menuju post detail.

- **C. Empty State:**
  - `[Ilustrasi SVG: Lonceng Tidur]` + _"Belum ada notifikasi. Mulai unggah karya atau ikuti seseorang!"_

- **API:** Query `notifications(cursor, take)` + Mutation `markNotificationAsRead(id)`.

---

### 11. Tampilan Edit Profil

**Trigger:** Menekan ikon gear/settings di halaman profil pribadi.

- **A. Avatar Editor:**
  - `[Image: Avatar saat ini]` dengan overlay `[Icon: Kamera]` saat di-hover/tap.
  - Tap → buka file picker → upload ke MinIO via `requestUploadUrl` → `updateProfile(avatarObjectKey)`.

- **B. Form Fields:**
  - `[Input: Display Name]` (Pre-filled dari data saat ini).
  - `[Input: Username]` (Pre-filled, _grayed out / read-only_ di MVP — perubahan username kompleks).
  - `[Text Area: Bio]` (Maks 160 karakter, dengan penghitung `0/160`).
  - `[Input: Jurusan]`.
  - `[Dropdown: Sekolah]` (Autocomplete seperti saat registrasi).

- **C. Action Bar (Sticky Bottom):**
  - `[Button: Simpan Perubahan]`.
  - **Transition State:** Tombol berubah jadi loading spinner saat menunggu respon `updateProfile`.

- **API:** Mutation `updateProfile(input: UpdateProfileInput!)`.

---

### 12. Tampilan Komentar (Comment Bottom Sheet)

**Trigger:** Menekan tombol komentar di PostCard footer.

- **A. Sheet Header:**
  - `[Text: Komentar]` + `[Drag Handle]` (garis pendek abu-abu di atas, bisa di-swipe untuk tutup).

- **B. Daftar Komentar (Scrollable):**
  Setiap komentar:
  - `[Avatar]` + `[Display Name]` + `[Timestamp]`.
  - `[Text: Isi komentar]`.
  - `[Button Mini: Balas]` (Mengisi mention di input field).

- **C. Input Area (Sticky Bottom di dalam Sheet):**
  - `[Avatar User Saat Ini]` (kecil, di kiri).
  - `[Input: Tulis komentar...]`.
  - `[Button: Kirim]`.

- **Catatan Implementasi:** Komentar disimpan di ScyllaDB sebagai `Post` dengan `inReplyToPostId` yang merujuk ke postingan induk. Query menggunakan `feed` dengan filter parent, atau butuh query baru di backend.

---

### 13. Tampilan Detail Post

**Trigger:** Menekan area teks/konten di PostCard (bukan tombol like/comment/share).

Layar ini menampilkan postingan secara penuh beserta komentar _inline_, tanpa perlu _bottom sheet_.

- **A. Post Penuh:**
  - Struktur identik dengan PostCard di feed, tapi tanpa batas `line-clamp` pada teks deskripsi.
  - Semua gambar carousel bisa di-scroll horizontal penuh.
  - _Attached Listing_ box tetap bisa diklik menuju detail listing.

- **B. Komentar Section (Di bawah postingan):**
  - Separator: `[Divider]` + `[Text: Komentar (34)]`.
  - Daftar komentar vertikal (seperti X/Twitter replies).
  - `[Input: Tambahkan komentar...]` (Sticky bottom).

- **URL:** `/post/:postId` (Route baru yang dibutuhkan).

---

### 14. Tampilan Hasil Pencarian (Search Results)

**Trigger:** Mengetik query di search bar (TopHeader atau Explore page) lalu submit.

- **A. Search Header:**
  - `[Input: Query yang diketik]` (Dengan tombol `[X]` untuk clear).
  - `[Filter Chips]`: `Semua` | `Talenta` | `Jasa` | `Karya` — bisa di-tap untuk filter tipe hasil.

- **B. Mixed Results List:**
  Hasil pencarian menampilkan campuran tiga tipe dalam satu daftar terurut relevansi:

  - **Tipe: Talenta (Account):**
    - `[Avatar]` + `[Display Name]` + `[School Badge]` + `[Button: Ikuti]`.
    - Tap → ke profil publik.

  - **Tipe: Jasa/Produk (Listing):**
    - `[Thumbnail]` + `[Judul]` + `[Harga]` + `[Badge: Jasa / Produk Digital]`.
    - Tap → ke listing detail.

  - **Tipe: Karya (Post):**
    - PostCard yang diperkecil (_compact variant_): avatar + nama + satu baris teks + thumbnail media.
    - Tap → ke post detail.

- **C. Empty State:**
  - `[Ilustrasi SVG: Kaca Pembesar Sedih]` + _"Tidak ditemukan hasil untuk \"[query]\". Coba kata kunci lain."_

- **API:** Query `searchAccounts(query)`, `searchListings(query, tagIds)`. Post search belum ada di backend — butuh query baru atau gunakan kombinasi tag + content filter.

---

### 15. Tampilan Manajemen Listing (Seller Dashboard)

**Trigger:** Di halaman profil sendiri, setiap listing card di tab "Penawaran & Produk" memiliki tombol `[⋮ More]` yang membuka _popover_ menu.

- **A. Popover Menu:**
  - `[Edit Penawaran]` → Buka wizard edit dengan data pre-filled.
  - `[Nonaktifkan]` → Ubah status listing ke `PAUSED` (listing tidak muncul di pencarian tapi tidak dihapus).
  - `[Hapus]` → Konfirmasi dialog: _"Penawaran yang sudah dihapus tidak bisa dikembalikan. Lanjutkan?"_ dengan `[Button: Batal]` dan `[Button Danger: Hapus]`.

- **B. Edit Wizard:**
  - Identik dengan Create Listing Wizard, tapi semua field sudah terisi.
  - Action: `[Button: Simpan Perubahan]` menggantikan "Terbitkan Jasa".

- **C. Status Indicator di Listing Card:**
  - Listing dengan status `PAUSED`: overlay gelap + `[Badge: Dinonaktifkan]` di thumbnail.
  - Listing dengan status `DRAFT`: overlay + `[Badge: Draf]`.

- **API:** Mutation `updateListing(id, input)`, `deleteListing(id)`.

---

### 16. Area Obrolan di Dalam Order Room (Klarifikasi)

> Referensi asli (Bagian 6) menyebutkan Order Room "mirip dengan Ruang Obrolan" tapi hanya mendeskripsikan Progress Tracker dan Action Board. Bagian ini mengklarifikasi area pesan yang juga ada di dalam Order Room.

Order Room sebenarnya memiliki **dua zona** dalam satu layar:

- **Zona Atas: Progress Tracker** (seperti yang sudah dideskripsikan di Bagian 6).

- **Zona Tengah: Area Chat Terbatas**
  - Sama persis dengan Message List di Ruang Obrolan (Bagian 5C), tapi dengan konteks:
    - Semua pesan hanya terkait deliverables pesanan ini.
    - `[Contextual Banner]` bertuliskan: _"Pesanan #ORD-982 — Jasa Pembuatan Web Company Profile MVP"_.
  - Penjual bisa mengirim file hasil kerja melalui attachment (`[Klip]` → upload ke MinIO).
  - Pesan file hasil kerja memiliki UI khusus: `[File Card: nama_file.zip — 14.2 MB]` + `[Button: Unduh]`.

- **Zona Bawah: Input Area ATAU Action Board** (bergantian sesuai status)
  - Jika status = `IN_PROGRESS`: Tampilkan input pesan biasa + tombol attachment.
  - Jika status = `COMPLETED` atau `CANCELLED`: Input area di-_disable_ atau diganti teks: _"Pesanan ini sudah selesai."_
  - Action Board (Kirim Hasil / Review) overlay di atas input saat status membutuhkannya.
```

### [structure-reference.md](file:///home/okuta/Documents/sotto/development/frontend-reference/structure-reference.md)

3 area diperbarui:
1. `core/` — apollo files eksplisit, store files eksplisit, hooks konkret
2. `features/` — tambah `notifications/` domain
3. `routes/` — tambah 6 route baru dgn dynamic params, env vars lengkap

```diff:structure-reference.md
```
sotto/frontend/
├── public/                 # Aset statis publik (favicon, manifest.json untuk PWA)
├── app/                    # 1. KONFIGURASI ROOT APLIKASI (Menggantikan folder 'src/')
│   ├── root.tsx            # Pembungkus utama aplikasi (Providers: Apollo, Context)
│   ├── routes.ts           # Definisi pemetaan URL React Router v7 secara terpusat
│   ├── app.css             # Global CSS (Tailwind entry, custom variables)
│   │
│   ├── assets/             # 2. ASET STATIS APLIKASI
│   │   ├── images/         # Placeholder, ilustrasi SVG kosong
│   │   └── fonts/
│   │
│   ├── core/               # 3. PENGATURAN INFRASTRUKTUR & UTILITAS GLOBAL
│   │   ├── apollo/         # Konfigurasi Apollo Client & generated.ts dari codegen
│   │   ├── store/          # Zustand global store (misal: useAuthStore.ts, useThemeStore.ts)
│   │   ├── utils/          # Fungsi murni (formatCurrency.ts, formatDate.ts, cn.ts untuk Tailwind)
│   │   ├── constants/      # Variabel statis global (ROUTES.ts, ERROR_MESSAGES.ts)
│   │   └── hooks/          # Custom hooks global (useDebounce.ts, useWindowSize.ts)
│   │
│   ├── components/         # 4. KOMPONEN UI GLOBAL (Dumb/Presentation Components) Komponen yang di bawah cuma contoh, nanti lihat kebutuhan.
│   │   ├── ui/             # Komponen atomik (Bisa pakai Shadcn UI atau buat sendiri)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/         # Komponen pembungkus struktur halaman
│   │       ├── MainLayout.tsx  # Layout dengan Bottom Navigation
│   │       ├── TopHeader.tsx
│   │       └── BottomNav.tsx
│   │
│   ├── features/           # 5. DOMAIN BISNIS (Smart Components & Logika Spesifik)
│   │   │                   # Setiap map di sini bersifat independen (terisolasi)
│   │   │
│   │   ├── auth/           # Domain: Autentikasi & Registrasi
│   │   │   ├── api/        # Mutasi & Kueri GraphQL spesifik Auth (login.graphql)
│   │   │   ├── components/ # Komponen UI spesifik (LoginForm.tsx, RegisterWizard.tsx)
│   │   │   └── hooks/      # Hooks bisnis (useLogin.ts)
│   │   │
│   │   ├── listings/       # Domain: Gig Economy (Jasa & Produk Digital)
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   ├── ListingCard.tsx
│   │   │   │   └── wizard/ # Form multi-step (StepType.tsx, StepPricing.tsx)
│   │   │   ├── store/      # Zustand lokal khusus untuk state form wizard yang kompleks
│   │   │   └── utils/      # Logika perhitungan harga khusus
│   │   │
│   │   ├── feed/           # Domain: Timeline & Postingan Portofolio
│   │   │   ├── api/
│   │   │   ├── components/ # PostCard.tsx, CreatePostModal.tsx
│   │   │   └── hooks/      # useInfiniteFeed.ts (untuk pagination GraphQL)
│   │   │
│   │   ├── chat/           # Domain: Obrolan & Negosiasi
│   │   │   ├── api/
│   │   │   ├── components/ # ChatBubble.tsx, CustomOfferCard.tsx
│   │   │   └── hooks/      # useChatSocket.ts (Logika realtime)
│   │   │
│   │   ├── orders/         # Domain: Ruang Kerja & Pembayaran
│   │   │   ├── api/
│   │   │   ├── components/ # ProgressTracker.tsx, CheckoutSummary.tsx, ReviewModal.tsx
│   │   │   └── types/      # Tipe data pesanan spesifik
│   │   │
│   │   └── profile/        # Domain: Profil Publik & Koleksi Pribadi
│   │       ├── api/
│   │       ├── components/ # HeroSection.tsx, DigitalLibraryCard.tsx
│   │       └── hooks/
│   │
│   └── routes/             # 6. PENYUSUN HALAMAN (RRv7 File-based Routing Conventions)
│       │                   # HANYA berisi loader data dan memanggil UI dari folder features/
│       ├── _main.tsx       # Layout Route (Pembungkus dengan MainLayout & BottomNav)
│       ├── _main._index.tsx# URL: "/" -> Halaman Home/Feed
│       ├── _main.explore.tsx# URL: "/explore" -> Halaman Pencarian
│       ├── _main.profile.tsx# URL: "/profile" -> Halaman Profil
│       ├── login.tsx       # URL: "/login" -> Rute Publik
│       ├── register.tsx    # URL: "/register"
│       ├── workspace.chat.tsx # URL: "/workspace/chat" -> Layar penuh tanpa BottomNav
│       ├── workspace.order.tsx
│       └── workspace.create.tsx
│
├── .env                    # Variabel lingkungan Vite (VITE_GRAPHQL_URL)
├── codegen.ts              # Konfigurasi GraphQL Code Generator
├── react-router.config.ts  # Konfigurasi bawaan RR v7 (menentukan letak folder app/)
├── tailwind.config.ts      # Konfigurasi Tailwind v4
├── tsconfig.json           # Aturan ketat TypeScript
├── vite.config.ts          # Konfigurasi Vite
└── package.json
```

- **Aturan Impor (The Dependency Rule):**
  - Folder `components/` **TIDAK BOLEH** mengimpor apa pun dari folder `features/`. (Komponen UI dasar harus "bodoh" dan tidak tahu urusan bisnis).
  - Folder `features/` boleh mengimpor dari `components/` dan `core/`.
  - Antar _feature_ (misal `feed/` dan `listings/`) sebaiknya seminimal mungkin saling mengimpor untuk menghindari _circular dependency_ (ketergantungan melingkar).
- **Mengapa `pages/` dipisah dari `features/`?**
  Halaman (`pages/`) bertugas sebagai perekat (lem). File di dalam `pages/` hanya berisi sedikit kode, biasanya hanya mengambil komponen dari `features/` dan merangkainya. Ini membuat React Router v7 lebih mudah membaca struktur _routing_ aplikasimu.
- **Pengelolaan Data GraphQL (`api/` di dalam setiap fitur):**
  Di sinilah kamu akan meletakkan fail kueri seperti `createListing.graphql`. Kamu bisa menggunakan _codegen_ (seperti `@graphql-codegen/cli`) untuk secara otomatis menghasilkan _React Hooks_ (`useCreateListingMutation`) dari fail tersebut, sehingga timmu tinggal memanggil fungsinya.

  Untuk API nanti dibuat berbarengan dengan backend
===
```
sotto/frontend/
├── public/                 # Aset statis publik (favicon, manifest.json untuk PWA)
├── app/                    # 1. KONFIGURASI ROOT APLIKASI (Menggantikan folder 'src/')
│   ├── root.tsx            # Pembungkus utama aplikasi (Providers: Apollo, Context)
│   ├── routes.ts           # Definisi pemetaan URL React Router v7 secara terpusat
│   ├── app.css             # Global CSS (Tailwind entry, custom variables)
│   │
│   ├── assets/             # 2. ASET STATIS APLIKASI
│   │   ├── images/         # Placeholder, ilustrasi SVG kosong
│   │   └── fonts/
│   │
│   ├── core/               # 3. PENGATURAN INFRASTRUKTUR & UTILITAS GLOBAL
│   │   ├── apollo/         # Konfigurasi Apollo Client & generated.ts dari codegen
│   │   │   ├── client.ts   # Inisialisasi ApolloClient (link, cache, auth header injection)
│   │   │   ├── base-types.ts # Tipe dasar dari codegen
│   │   │   └── generated.ts  # Hooks & dokumen dari codegen (auto-generated, jangan edit manual)
│   │   ├── store/          # Zustand global store
│   │   │   ├── useAuthStore.ts   # Token JWT, data user login, actions: login/logout/refresh
│   │   │   └── useThemeStore.ts  # Dark/light mode state, toggleTheme action
│   │   ├── utils/          # Fungsi murni (formatCurrency.ts, formatDate.ts, cn.ts untuk Tailwind)
│   │   ├── constants/      # Variabel statis global (ROUTES.ts, ERROR_MESSAGES.ts)
│   │   └── hooks/          # Custom hooks global
│   │       ├── useDebounce.ts    # Debounce input (search autocomplete)
│   │       └── useMediaUpload.ts # Shared hook: requestUploadUrl → upload file → confirmUpload
│   │
│   ├── components/         # 4. KOMPONEN UI GLOBAL (Dumb/Presentation Components) Komponen yang di bawah cuma contoh, nanti lihat kebutuhan.
│   │   ├── ui/             # Komponen atomik (Bisa pakai Shadcn UI atau buat sendiri)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/         # Komponen pembungkus struktur halaman
│   │       ├── MainLayout.tsx  # Layout dengan Bottom Navigation
│   │       ├── TopHeader.tsx
│   │       └── BottomNav.tsx
│   │
│   ├── features/           # 5. DOMAIN BISNIS (Smart Components & Logika Spesifik)
│   │   │                   # Setiap map di sini bersifat independen (terisolasi)
│   │   │
│   │   ├── auth/           # Domain: Autentikasi & Registrasi
│   │   │   ├── api/        # Mutasi & Kueri GraphQL spesifik Auth (login.graphql)
│   │   │   ├── components/ # Komponen UI spesifik (LoginForm.tsx, RegisterWizard.tsx)
│   │   │   └── hooks/      # Hooks bisnis (useLogin.ts)
│   │   │
│   │   ├── listings/       # Domain: Gig Economy (Jasa & Produk Digital)
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   ├── ListingCard.tsx
│   │   │   │   └── wizard/ # Form multi-step (StepType.tsx, StepPricing.tsx)
│   │   │   ├── store/      # Zustand lokal khusus untuk state form wizard yang kompleks
│   │   │   └── utils/      # Logika perhitungan harga khusus
│   │   │
│   │   ├── feed/           # Domain: Timeline & Postingan Portofolio
│   │   │   ├── api/
│   │   │   ├── components/ # PostCard.tsx, CreatePostModal.tsx
│   │   │   └── hooks/      # useInfiniteFeed.ts (untuk pagination GraphQL)
│   │   │
│   │   ├── chat/           # Domain: Obrolan & Negosiasi
│   │   │   ├── api/
│   │   │   ├── components/ # ChatBubble.tsx, CustomOfferCard.tsx
│   │   │   └── hooks/      # useChatSocket.ts (Logika realtime)
│   │   │
│   │   ├── orders/         # Domain: Ruang Kerja & Pembayaran
│   │   │   ├── api/
│   │   │   ├── components/ # ProgressTracker.tsx, CheckoutSummary.tsx, ReviewModal.tsx
│   │   │   └── types/      # Tipe data pesanan spesifik
│   │   │
│   │   ├── notifications/  # Domain: Notifikasi In-App
│   │   │   ├── api/
│   │   │   ├── components/ # NotificationDrawer.tsx, NotificationItem.tsx
│   │   │   └── hooks/      # useUnreadCount.ts (polling atau subscription)
│   │   │
│   │   └── profile/        # Domain: Profil Publik & Koleksi Pribadi
│   │       ├── api/
│   │       ├── components/ # HeroSection.tsx, DigitalLibraryCard.tsx, EditProfileForm.tsx
│   │       └── hooks/
│   │
│   └── routes/             # 6. PENYUSUN HALAMAN (RRv7 File-based Routing Conventions)
│       │                   # HANYA berisi loader data dan memanggil UI dari folder features/
│       ├── _main.tsx       # Layout Route (Pembungkus dengan MainLayout & BottomNav)
│       ├── _main._index.tsx# URL: "/" -> Halaman Home/Feed
│       ├── _main.explore.tsx# URL: "/explore" -> Halaman Pencarian
│       ├── _main.chats.tsx # URL: "/chats" -> Kotak Masuk Pesan
│       ├── _main.orders.tsx# URL: "/orders" -> Daftar Order
│       ├── _main.profile.tsx# URL: "/profile" -> Halaman Profil Sendiri
│       ├── _main.profile.$username.tsx # URL: "/profile/:username" -> Profil Publik Orang Lain
│       ├── _main.listing.$id.tsx       # URL: "/listing/:id" -> Detail Jasa/Produk
│       ├── _main.post.$postId.tsx      # URL: "/post/:postId" -> Detail Postingan + Komentar
│       ├── login.tsx       # URL: "/login" -> Rute Publik
│       ├── register.tsx    # URL: "/register"
│       ├── workspace.chat.$conversationId.tsx # URL: "/workspace/chat/:conversationId" -> Layar penuh tanpa BottomNav
│       ├── workspace.order.$orderId.tsx       # URL: "/workspace/order/:orderId"
│       └── workspace.create.tsx               # URL: "/workspace/create"
│
├── .env                    # Variabel lingkungan Vite:
│                           #   VITE_GRAPHQL_URL=http://localhost:3000/graphql
│                           #   VITE_WS_URL=ws://localhost:3000 (Socket.io chat)
│                           #   VITE_MINIO_PUBLIC_URL=http://localhost:9000 (CDN base untuk objek publik)
│                           #   VITE_IAM_BASE_URL=http://localhost:3000/iam (REST auth endpoints)
├── codegen.ts              # Konfigurasi GraphQL Code Generator
├── react-router.config.ts  # Konfigurasi bawaan RR v7 (menentukan letak folder app/)
├── tailwind.config.ts      # Konfigurasi Tailwind v4
├── tsconfig.json           # Aturan ketat TypeScript
├── vite.config.ts          # Konfigurasi Vite
└── package.json
```

- **Aturan Impor (The Dependency Rule):**
  - Folder `components/` **TIDAK BOLEH** mengimpor apa pun dari folder `features/`. (Komponen UI dasar harus "bodoh" dan tidak tahu urusan bisnis).
  - Folder `features/` boleh mengimpor dari `components/` dan `core/`.
  - Antar _feature_ (misal `feed/` dan `listings/`) sebaiknya seminimal mungkin saling mengimpor untuk menghindari _circular dependency_ (ketergantungan melingkar).
- **Mengapa `pages/` dipisah dari `features/`?**
  Halaman (`pages/`) bertugas sebagai perekat (lem). File di dalam `pages/` hanya berisi sedikit kode, biasanya hanya mengambil komponen dari `features/` dan merangkainya. Ini membuat React Router v7 lebih mudah membaca struktur _routing_ aplikasimu.
- **Pengelolaan Data GraphQL (`api/` di dalam setiap fitur):**
  Di sinilah kamu akan meletakkan fail kueri seperti `createListing.graphql`. Kamu bisa menggunakan _codegen_ (seperti `@graphql-codegen/cli`) untuk secara otomatis menghasilkan _React Hooks_ (`useCreateListingMutation`) dari fail tersebut, sehingga timmu tinggal memanggil fungsinya.

  Untuk API nanti dibuat berbarengan dengan backend
```

## Apa yang TIDAK Ditambahkan (& Kenapa)

| Alur | Alasan Skip |
|------|-------------|
| Wallet / Saldo Penjual | Backend `payments/` punya `wallet.service.ts` tapi belum ada query GraphQL utk wallet balance. Ini backend-first task, bukan frontend ref gap |
| Share Flow | Tombol share di PostCard → cukup pakai native Web Share API / copy link. Tak butuh spec UI khusus |
| Media Carousel Swipe | §2 PostCard sudah menyebutkan "carousel slider horizontal jika array > 1" — cukup jelas, tinggal impl |
| Onboarding / Welcome | Nice-to-have. MVP bisa langsung masuk feed post-register |
| Forgot Password | Disebut di §8 Login sbg "MVP: bisa diabaikan dulu" — benar, backend belum support |
