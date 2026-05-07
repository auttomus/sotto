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
