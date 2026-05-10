```
sotto/backend/
├── prisma/
│   ├── schema.prisma            // Skema database PostgreSQL (Polyglot: data relasional saja)
│   └── seed.ts                  // Skrip penyuntik data awal (schools, tags/categories, test users)
├── src/
│   ├── main.ts                  // Titik masuk utama (Entry point), setup validasi global
│   ├── app.module.ts            // Modul orkestrator yang mengimpor seluruh modul fitur
│   │
│   ├── common/                  // Logika lintasan (Cross-cutting concerns) yang dipakai di mana saja
│   │   ├── decorators/          // Contoh: @CurrentUser(), @Public()
│   │   ├── filters/             // Contoh: prisma-exception.filter.ts (mengubah error database jadi HTTP 400)
│   │   ├── guards/              // Contoh: jwt-auth.guard.ts (penjaga gerbang API)
│   │   ├── interceptors/        // Contoh: logging.interceptor.ts, bigint-serialize.interceptor.ts
│   │   ├── scalars/             // Custom GraphQL scalars: BigInt, Decimal, DateTime
│   │   └── pagination/          // DTO dan logika standar untuk cursor-based pagination
│   │
│   ├── prisma/                  // Jembatan ORM PostgreSQL
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── infrastructure/          // Adaptor untuk layanan pihak ketiga (Eksternal)
│   │   ├── minio/               // Modul khusus untuk MinIO Client S3 (Presigned URLs, bucket ops)
│   │   │   ├── minio.module.ts
│   │   │   └── minio.service.ts
│   │   ├── scylla/              // Modul koneksi Cassandra/ScyllaDB untuk data kecepatan tinggi
│   │   │   ├── scylla.module.ts //   (posts, messages, user_feeds, interaction_logs)
│   │   │   └── scylla.service.ts
│   │   ├── redis/               // Modul koneksi Redis untuk caching, session, vector cache Synergy Engine
│   │   │   ├── redis.module.ts
│   │   │   └── redis.service.ts
│   │   └── bull/                // Modul antrian (Queue) untuk background jobs & cron scheduling
│   │       └── bull.module.ts   //   Digunakan oleh synergy-worker, media processing, notifikasi
│   │
│   └── modules/                 // INTI BISNIS (Domain Modules)
│       │
│       │  ══════════════════════════════════════════
│       │  IDENTITY & SOCIAL
│       │  ══════════════════════════════════════════
│       │
│       ├── iam/                 // Identity & Access Management (Autentikasi)
│       │   ├── iam.module.ts
│       │   ├── iam.controller.ts   // REST: /iam/register, /iam/login (public endpoints)
│       │   ├── iam.service.ts
│       │   ├── strategies/      // Logika validasi JWT (jwt.strategy.ts)
│       │   └── dto/             // RegisterDto, LoginDto
│       │
│       ├── accounts/            // Profil Publik & Graf Sosial (Follow/Unfollow)
│       │   ├── accounts.module.ts
│       │   ├── accounts.resolver.ts  // GraphQL: getProfile, updateProfile, follow, unfollow
│       │   ├── accounts.service.ts   // CRUD profil, update follower/following counts
│       │   ├── follows.service.ts    // Follow/unfollow logic, mutual detection
│       │   ├── models/          // AccountModel (GraphQL ObjectType)
│       │   └── dto/             // UpdateProfileInput, FollowInput
│       │
│       │  ══════════════════════════════════════════
│       │  CONTENT & DISCOVERY (Pilar 1: Panggung Pameran)
│       │  ══════════════════════════════════════════
│       │
│       ├── feed/                // Postingan Karya & Timeline (ScyllaDB-driven)
│       │   ├── feed.module.ts
│       │   ├── feed.resolver.ts     // GraphQL: getFeed, createPost, likePost, commentPost
│       │   ├── feed.service.ts      // CRUD posts di ScyllaDB, fan-out ke user_feeds
│       │   ├── models/         // PostModel (GraphQL ObjectType)
│       │   └── dto/            // CreatePostInput
│       │   Note: Feed read path memanggil synergy.service untuk ranking.
│       │         Feed write path menulis ke ScyllaDB posts + fan-out ke user_feeds.
│       │
│       ├── synergy/             // Synergy Engine — Algoritma Ranking Feed
│       │   ├── synergy.module.ts
│       │   ├── synergy.service.ts          // Orchestrator: combine C + G + R × D, return ranked list
│       │   ├── vector.service.ts           // Build s_j dari tags, read d_i dari Redis cache
│       │   ├── graph-proximity.service.ts  // Query follows → compute distance heuristik (0/1/2/3)
│       │   ├── reputation.service.ts       // Compute R(u_k) dari trust_score + engagement count
│       │   ├── constants/
│       │   │   └── complementarity-matrix.ts  // Hardcoded M (5×5) untuk MVP
│       │   └── dto/
│       │   Note: Tidak melakukan komputasi berat sendiri.
│       │         Membaca vektor d_i yang sudah di-cache di Redis oleh synergy-worker.
│       │         Menjalankan dot-product ringan + time decay saat request masuk.
│       │
│       ├── synergy-worker/      // Background Worker untuk Komputasi Vektor Demand
│       │   ├── synergy-worker.module.ts
│       │   ├── demand-vector.processor.ts  // Bull queue processor: aggregate interaction_logs → d_i
│       │   ├── graph-cache.processor.ts    // Pre-compute follow distances (depth ≤ 3)
│       │   └── synergy-cron.service.ts     // @Cron: jadwalkan job setiap jam
│       │   Note: Menarik interaction_logs dari ScyllaDB secara batch.
│       │         Menghitung vektor demand per user, cache ke Redis.
│       │         TIDAK BOLEH berjalan di main request thread.
│       │
│       ├── analytics/           // Pencatat Interaksi (interaction_logs writer)
│       │   ├── analytics.module.ts
│       │   ├── analytics.resolver.ts    // GraphQL mutation: trackEvent(action, targetId)
│       │   └── analytics.service.ts     // Tulis ke ScyllaDB interaction_logs
│       │   Note: Dipanggil frontend setiap kali user view_post, click_service, like_post.
│       │         Data ini menjadi bahan baku vektor d_i di synergy-worker.
│       │
│       ├── search/              // Eksplorasi & Pencarian
│       │   ├── search.module.ts
│       │   ├── search.resolver.ts    // GraphQL: search(query, filters)
│       │   └── search.service.ts     // Full-text search across listings + accounts + posts
│       │   Note: Cross-DB query (PostgreSQL + ScyllaDB).
│       │         Tag-based filtering via tagged_objects.
│       │
│       │  ══════════════════════════════════════════
│       │  GIG ECONOMY (Pilar 2: Pasar Keahlian)
│       │  ══════════════════════════════════════════
│       │
│       ├── listings/            // Etalase Jasa & Produk Digital
│       │   ├── listings.module.ts
│       │   ├── listings.resolver.ts  // GraphQL: createListing, getListing, updateListing, deleteListing
│       │   ├── listings.service.ts   // CRUD + type branching (SERVICE vs DIGITAL_PRODUCT)
│       │   ├── models/          // ListingModel, ListingType enum (GraphQL)
│       │   └── dto/             // CreateListingInput (wizard steps), UpdateListingInput
│       │   Note: Digital Product → is_unlimited=true, delivery_time_days=null.
│       │         Service → max_active_orders enforced, auto-pause when full.
│       │
│       ├── orders/              // State Machine Transaksi (Gig Economy Core)
│       │   ├── orders.module.ts
│       │   ├── orders.resolver.ts
│       │   ├── orders.service.ts       // Mutasi status: Pending → In Progress → Completed
│       │   ├── reviews.service.ts      // Pemberian ulasan pasca-order, update trust_score
│       │   ├── models/          // OrderModel, ReviewModel
│       │   └── dto/
│       │   Note: Optimistic locking via lock_version.
│       │         Digital Product orders langsung skip ke COMPLETED.
│       │         Service orders melalui full state machine.
│       │
│       ├── payments/            // Gateway Pembayaran & Escrow
│       │   ├── payments.module.ts
│       │   ├── payments.controller.ts  // REST (bukan GraphQL): Midtrans webhook receiver
│       │   ├── escrow.service.ts       // Hold dana, release setelah order completed
│       │   ├── wallet.service.ts       // Saldo penjual, riwayat transaksi
│       │   └── dto/
│       │   Note: Webhook HARUS REST (Midtrans POST ke URL fixed).
│       │         Service order → escrow hold → release on completion.
│       │         Digital Product → bypass escrow, langsung transfer.
│       │         Platform fee (admin cut) dihitung di checkout.
│       │
│       ├── negotiations/        // Sistem Penawaran Khusus (Custom Offers)
│       │   ├── negotiations.module.ts
│       │   ├── negotiations.resolver.ts  // GraphQL: createOffer, acceptOffer, rejectOffer
│       │   └── negotiations.service.ts   // CRUD custom_offers, status transitions
│       │   Note: Custom Offer dibuat di dalam chat context.
│       │         Accept → trigger order creation + checkout flow.
│       │
│       │  ══════════════════════════════════════════
│       │  COMMUNICATION (Pilar 3: Ruang Negosiasi)
│       │  ══════════════════════════════════════════
│       │
│       ├── chat/                // Komunikasi Waktu Nyata (WebSockets)
│       │   ├── chat.module.ts
│       │   ├── chat.gateway.ts       // Socket.io gateway: koneksi realtime
│       │   ├── chat.service.ts       // Penyimpanan pesan ke ScyllaDB, conversation management
│       │   ├── models/          // MessageModel, ConversationModel
│       │   └── dto/
│       │   Note: Conversation metadata di PostgreSQL.
│       │         Message payload di ScyllaDB (high-throughput).
│       │         Contextual banner: listing_id terbawa dari detail jasa.
│       │
│       │  ══════════════════════════════════════════
│       │  SUPPORTING MODULES
│       │  ══════════════════════════════════════════
│       │
│       ├── notifications/       // Sistem Notifikasi In-App
│       │   ├── notifications.module.ts
│       │   ├── notifications.resolver.ts  // GraphQL: getNotifications, markAsRead
│       │   └── notifications.service.ts   // CRUD, unread count, polymorphic target
│       │
│       ├── media/               // Orkestrasi Upload (Shared across modules)
│       │   ├── media.module.ts
│       │   ├── media.resolver.ts      // GraphQL: requestUploadUrl, confirmUpload
│       │   └── media.service.ts       // Presigned URL generation, media_attachments CRUD, blurhash
│       │   Note: MinIO adapter di infrastructure/ → media module orchestrate.
│       │         Dipanggil oleh feed (post images), listings (gallery + digital product file),
│       │         chat (attachments), accounts (avatar, cover).
│       │
│       ├── tags/                // Kategori & Tag Management
│       │   ├── tags.module.ts
│       │   ├── tags.resolver.ts       // GraphQL: searchTags (autocomplete), getTags
│       │   └── tags.service.ts        // CRUD tags + tagged_objects polymorphic
│       │   Note: Tags juga berfungsi sebagai DIMENSI VEKTOR untuk Synergy Engine.
│       │         MVP: 5 kategori utama (Frontend, Backend, UI/UX, Audio/Video, Bisnis)
│       │         di-hardcode sebagai dimensi. Tag lain = label display saja.
│       │         Penambahan kategori baru = resize matriks M → harus terkontrol.
│       │
│       └── schools/             // Master Data Sekolah
│           ├── schools.module.ts
│           ├── schools.resolver.ts    // GraphQL: searchSchools (dropdown register), getSchool
│           └── schools.service.ts     // Lookup, admin CRUD, domain verification
│
├── .env                         // Variabel lingkungan (DATABASE_URL, JWT_SECRET, MINIO_*, REDIS_*,
│                                //   SYNERGY_ALPHA, SYNERGY_BETA, SYNERGY_GAMMA, SYNERGY_LAMBDA_G,
│                                //   SYNERGY_LAMBDA_T, MIDTRANS_SERVER_KEY, dll.)
├── codegen.ts                   // (Opsional) GraphQL Code Generator config
├── tsconfig.json
├── nest-cli.json
├── vite.config.ts               // (Jika pakai Vitest untuk testing)
└── package.json
```

---

## Aturan Arsitektur

### Aturan Impor (Dependency Rule)

- `common/` → tidak impor dari `modules/` atau `infrastructure/`
- `infrastructure/` → tidak impor dari `modules/` (adapter murni)
- `modules/` → boleh impor dari `common/`, `infrastructure/`, dan `prisma/`
- Antar-module: **minimize coupling**. Jika module A butuh module B, inject via `forwardRef()` atau shared service.

### Aturan Protokol API

- **GraphQL** (default): Semua modul domain menggunakan Resolver + GraphQL mutations/queries.
- **REST** (pengecualian): Hanya untuk endpoint yang **harus** REST:
  - `iam/` → register/login (simple auth, tidak perlu GraphQL overhead)
  - `payments/` → Midtrans webhook receiver (external service POST ke fixed URL)

### Aturan Database

- **PostgreSQL** (via Prisma): Data relasional, ACID-critical (users, accounts, listings, orders, follows, conversations metadata, media_attachments, tags, schools, notifications, custom_offers).
- **ScyllaDB** (via cassandra driver): Data high-throughput, time-series (posts, messages, user_feeds, interaction_logs).
- **Redis**: Caching, session, Synergy Engine vector cache (`user:{id}:demand`, `post:{id}:supply`), engagement counters, Bull queue backend.
- **MinIO**: Object storage (gambar, video, file digital product).

### Aturan Synergy Engine

1. **Komputasi berat** (demand vector aggregation) → `synergy-worker/` via Bull queue + cron, **TIDAK** di main request thread.
2. **Read path** (feed ranking) → `synergy/` membaca cached vectors dari Redis, menjalankan dot-product + time decay ringan.
3. **Interaction tracking** → `analytics/` menulis ke ScyllaDB setiap user action. Data ini = bahan baku vektor demand.
4. **Hyperparameter** ($\alpha$, $\beta$, $\gamma$, $\lambda_g$, $\lambda_t$) → Environment Variable, bisa di-tune tanpa redeploy.
5. **Matriks komplementaritas M** → Hardcoded 5×5 di MVP. Upgrade ke ML-driven saat data cukup.
