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
