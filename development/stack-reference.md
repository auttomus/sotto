Sistem sosial media ini dibangun menggunakan pendekatan arsitektur _microservices_ terdistribusi dan _Polyglot Persistence_ (penggunaan berbagai jenis basis data sesuai fungsionalitas spesifik). Pemilihan tumpukan teknologi ( _tech stack_ ) didasarkan pada kebutuhan akan performa tinggi, skalabilitas horizontal, efisiensi komputasi, dan konsistensi pengembangan.

**1. Lapisan Antarmuka Pengguna (Frontend Presentation Layer)**

- **Vite, ReactJS, & React Router v7:** Sistem _frontend_ dibangun menggunakan pustaka ReactJS yang berjalan di atas _build tool_ Vite. Pemilihan Vite ditujukan untuk mempercepat waktu kompilasi modul ( _Hot Module Replacement_ ) selama fase pengembangan. React Router v7 diimplementasikan untuk menangani navigasi _Client-Side Routing_ , yang secara signifikan mereduksi beban pemrosesan pada _server_ dengan menghindari _full-page reload_ , serta menekan biaya komputasi.
- **Tailwind CSS v4:** Diimplementasikan sebagai kerangka kerja CSS berbasis _utility-first_ . Pendekatan ini memungkinkan pengembangan antarmuka (UI) yang adaptif dan kompleks secara terpusat di dalam komponen, sekaligus mengoptimalkan performa pemuatan halaman melalui eliminasi kode CSS yang tidak terpakai ( _dead-code elimination_ ).

**2. Lapisan Komputasi & API (Backend & Orchestration Layer)**

- **NestJS:** Berperan sebagai kerangka kerja _backend_ utama. NestJS dipilih karena arsitektur modularnya yang secara _native_ mendukung implementasi _microservices_ . Penggunaan bahasa TypeScript menjaga konsistensi ekosistem secara _isomorphic_ dengan _frontend_ . Pendekatan _stateful_ dari Node.js ini memitigasi isu kebocoran memori ( _memory leak_ ) dan menekan _overhead_ siklus komputasi yang sering ditemukan pada infrastruktur _stateless_ konvensional.
- **GraphQL:** Digunakan sebagai orkestrator API ( _Backend for Frontend_ ) untuk menggantikan arsitektur REST konvensional. GraphQL memberikan fleksibilitas bagi _client_ untuk mendikte struktur data secara spesifik, sehingga secara efektif mengeliminasi anomali efisiensi jaringan berupa _over-fetching_ (pengiriman beban data berlebih) dan _under-fetching_ (kebutuhan pemanggilan _endpoint_ berulang).

**3. Lapisan Komunikasi Asinkron (Event & Message Broker Layer)**

- **RabbitMQ:** Difungsikan sebagai _Message Broker_ untuk menangani antrean tugas asinkron ( _task queuing_ ). Operasi komputasi berat, seperti kompresi media (video/gambar) dan pengiriman email notifikasi, didelegasikan ke RabbitMQ agar tidak memblokir respon utas utama ( _main thread_ ) pada API Gateway.

  #(Belum digunakan biar ga repot, tapi bisa dipakai sewaktu-waktu

- **Apache Kafka:** Diimplementasikan sebagai platform _Event Streaming_ terdistribusi. Kafka bertugas menelan log kejadian bervolume masif ( _high-throughput event logs_ ) secara _real-time_ , seperti riwayat klik pengguna, pelacakan navigasi, dan distribusi _News Feed_ . Data dari Kafka ini menjadi fondasi bagi analitik sistem dan algoritma distribusi konten.

  #(Belum digunakan biar ga repot, tapi bisa dipakai sewaktu-waktu)

**4. Lapisan Persistensi Data (Storage & Polyglot Database Layer)**

- **PostgreSQL:** Bertindak sebagai basis data relasional (RDBMS) utama untuk menangani data terstruktur yang membutuhkan kepatuhan integritas ACID (Atomicity, Consistency, Isolation, Durability). PostgreSQL secara eksklusif mengelola entitas kritikal seperti kredensial autentikasi, profil pengguna, relasi pertemanan inti, dan data transaksional.
- **ScyllaDB:** Diadopsi sebagai basis data NoSQL berarsitektur _wide-column_ . ScyllaDB mengeksploitasi efisiensi _thread-per-core_ berdasar bahasa C++, menjadikannya mampu memberikan _throughput_ tulis/baca masif dengan latensi sub-milidetik. Database ini difokuskan untuk menangani data bervolume ekstrem dan tidak terstruktur, seperti matriks interaksi (jumlah _likes_ ), riwayat kolom komentar, dan _log_ percakapan langsung ( _chat_ ).
- **Redis:** Digunakan sebagai penyimpanan struktur data _in-memory_ (berjalan di atas RAM). Redis bertugas sebagai lapisan _caching_ untuk mereduksi beban kueri repetitif pada basis data primer (PostgreSQL/ScyllaDB) dan mengelola manajemen sesi pengguna dengan waktu respons sub-milidetik.
- **MinIO:** Diimplementasikan sebagai arsitektur _Object Storage_ hibrida yang kompatibel dengan protokol Amazon S3. MinIO bertanggung jawab atas penyimpanan persisten objek media tidak terstruktur (gambar profil, unggahan video pengguna) dan menjaga paritas konfigurasi antara lingkungan lokal dan _cloud_ .

**5. Lapisan Manajemen Trafik (Gateway & Proxy Layer)**

- **Nginx:** Difungsikan sebagai _Reverse Proxy_ dan penyedia aset statis tingkat tepi ( _edge_ ). Nginx bertindak sebagai gerbang pembatas (Layer 7) yang mengisolasi _port_ arsitektur internal dari paparan jaringan publik internet. Selain itu, Nginx memfasilitasi terminasi SSL (HTTPS) dan mencegah komunikasi jaringan langsung antara klien dan _microservices_ internal demi keamanan.

**6. Lapisan Infrastruktur & Penyebaran (DevOps & Cloud Infrastructure)**

- **Docker:** Platform kontainerisasi utama yang mengenkapsulasi setiap servis komputasi beserta dependensinya. Docker mengamankan paritas lingkungan ( _environment parity_ ), mengeliminasi anomali "bekerja di mesin lokal namun gagal di produksi", dan menyatukan ekosistem pengembangan lintas kolaborator.
- **Oracle Cloud Infrastructure (OCI):** **Pada fase awal pengembangan** hingga _staging_ , arsitektur di- _deploy_ di atas infrastruktur Oracle Cloud. OCI menyediakan instans komputasi fleksibel yang ramah secara operasional ( _cost-effective_ **Dalam artian gratis**) untuk menguji skalabilitas awal dari ekosistem kontainer dan basis data sebelum sistem mencapai traksi beban lalu lintas penuh.
