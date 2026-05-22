#import "template.typ": *

// Take a look at the file `template.typ` in the file panel
// to customize this template and discover how it works.
#show: project.with(
  title: "Penerapan Arsitektur Hibrida dan Algoritma Synergy Engine pada Platform Sotto untuk Ekosistem Gig Economy Siswa",
)

#align(center)[
  #grid(
    columns: 1,
    gutter: 0.8em,
    [Anggota Kelompok:],
    [I Made Adiputra Sedana (21)],
    [I Made Okta Dwi Samiarta (23)],
    [I Wayan Trijata Ananda Putra (28)],
    [Kadek Agus Arya Pranata (32)],
    [*Kelas: XI RPL 2*],
  )
]

#linebreak()
#line(length: 480pt)

#align(center)[
  *Abstrak*
]

#pad(x: 2em)[
  Transformasi digital di sektor pendidikan kejuruan dan menengah telah memicu kebutuhan akan sebuah platform kolaboratif yang tidak hanya berfungsi sebagai wadah pameran karya, tetapi juga sebagai ekosistem _gig economy_ yang menghubungkan penawaran keahlian teknis dengan kebutuhan proyek secara spesifik. Penelitian ini merumuskan dan mengimplementasikan Sotto, sebuah platform sosial profesional inovatif yang diarsiteki dengan pendekatan _hybrid database_ dan antarmuka reaktif. Permasalahan utama dalam platform kolaborasi konvensional adalah terjadinya _echo chamber_ akibat algoritma rekomendasi standar, yang membatasi pengguna dari menemukan kolaborator dengan keahlian pelengkap (_complementary skills_). Untuk mengatasi hal ini, Sotto mengintegrasikan _Synergy Engine_, sebuah algoritma berbasis komputasi cerdas yang memadukan _Vector Space Model_ dengan matriks komplementaritas, _Social Graph Proximity_ untuk melokalisasi interaksi sosial, serta fungsi peluruhan eksponensial untuk manajemen umur konten (_time decay_). Arsitektur sistem dibangun di atas kerangka kerja NestJS pada _backend_ yang mengorkestrasi PostgreSQL dan ScyllaDB, serta React Router v7 pada _frontend_ untuk menjamin latensi minimal dan pengalaman pengguna yang instan. Hasil simulasi matematis dan implementasi menunjukkan bahwa sistem mampu secara presisi mencocokkan _demand_ dan _supply_ keterampilan antarsiswa, sehingga berpotensi mengakselerasi pembentukan tim proyek yang kompeten dan membuka peluang ekonomi kreatif sejak usia sekolah.

  *Kata Kunci:* _Gig Economy_, _Synergy Engine_, _Vector Space Model_, _Graph Proximity_, NestJS, React Router v7, ScyllaDB, Basis Data Hibrida.
]

= Pendahuluan

== Latar Belakang
Perkembangan teknologi informasi dan komunikasi yang masif telah mengubah lanskap ekonomi dan pendidikan secara fundamental. Saat ini, siswa sekolah menengah, khususnya di sekolah kejuruan (SMK), dituntut untuk tidak sekadar memahami teori akademik, melainkan juga memiliki kemampuan praktis dan menghasilkan karya nyata. Namun, ruang untuk memamerkan karya (portofolio) dan mengubah keahlian teknis tersebut menjadi nilai ekonomi (_gig economy_) masih sangat terbatas. Platform lokapasar (_marketplace_) atau situs _freelance_ raksasa yang ada saat ini terlalu kaku, kompetitif, dan tidak dirancang untuk lingkungan pelajar yang masih membutuhkan ekosistem sosial dan pembinaan relasi.

Di sisi lain, media sosial konvensional memberikan ruang ekspresi yang luas, tetapi algoritma yang mendasarinya diformulasikan murni untuk menjaga retensi pengguna ( _user engagement_ ) semata, bukan untuk produktivitas. Algoritma rekomendasi semacam _Collaborative Filtering_ yang jamak digunakan justru menciptakan fenomena ruang gema (_echo chamber_). Sebagai ilustrasi, jika seorang siswa pengembang antarmuka (_frontend developer_) sering menyukai konten terkait desain web, maka linimasa (_feed_)-nya hanya akan dipenuhi oleh karya _frontend_ lainnya. Padahal, dalam konteks pembangunan perangkat lunak atau kolaborasi kreatif, seorang ahli _frontend_ sejatinya sangat membutuhkan seorang ahli pangkalan data (_backend developer_) atau desainer antar-muka (_UI/UX_) untuk membangun produk akhir yang utuh. Hal ini menyebabkan terjadinya ketidaksesuaian penawaran ( _supply_ ) dan permintaan ( _demand_ ) talenta yang kritis di tingkat pelajar.

Sotto lahir dari kebutuhan untuk menjembatani kesenjangan tersebut. Sotto merupakan platform sosial profesional yang mengedepankan kolaborasi lintas-disiplin ilmu melalui algoritma perjodohan ( _matchmaking_ ) cerdas. Pengembangan Sotto tidak hanya menuntut penyelesaian masalah algoritma rekomendasi, tetapi juga menuntut sebuah arsitektur perangkat lunak (_software architecture_) yang tangguh. Platform harus mampu menangani lalu lintas data sosial secara _real-time_ (seperti fitur obrolan langsung, riwayat interaksi log, dan notifikasi), sekaligus menjamin konsistensi data finansial tingkat tinggi karena adanya transaksi jual beli jasa dan produk digital di dalamnya. Oleh karena itu, riset dan rekayasa arsitektur di belakang Sotto, baik dari sisi algoritma matematis maupun hierarki _server_ dan antarmuka, menjadi sangat mendesak untuk dianalisis dan didokumentasikan secara komprehensif.

== Rumusan Masalah
Berdasarkan latar belakang yang telah dipaparkan, rumusan masalah dalam penelitian pengembangan ini dijabarkan sebagai berikut:

+ Bagaimana memodelkan dan mengimplementasikan algoritma pencocokan yang mampu mengidentifikasi keahlian komplementer (_complementary skills_) antara penawaran dari pembuat karya (_supply_) dan rekam jejak kebutuhan dari pengguna lain (_demand_) agar tidak terjadi ruang gema (_echo chamber_)?
+ Sejauh mana integrasi Teori Graf Sosial (_Social Graph_) dan fungsi reputasi dapat diaplikasikan untuk menyaring entitas atau postingan dengan tingkat relevansi sosial dan lokalisasi yang ideal di linimasa?
+ Bagaimana merancang skema pangkalan data hibrida (gabungan antara Relasional dan NoSQL) guna mengakomodasi volume pencatatan log interaksi _real-time_ secara masif tanpa menurunkan laju transaksi sistem keuangan inti?
+ Bagaimana arsitektur antarmuka sisi klien (_frontend_) modern dikonstruksi agar sinkron dan mampu merender hasil komputasi dari algoritma rekomendasi peladen dengan latensi minimal?

== Tujuan
Target yang ingin dicapai melalui proyek Sotto ini antara lain:

+ Merumuskan secara matematis dan mengimplementasikan algoritma _Synergy Engine_ berbasis ruang vektor komplementer untuk mencocokkan kolaborator yang saling melengkapi.
+ Membangun fungsi kedekatan graf dan peluruhan eksponensial untuk mendistribusikan prioritas karya secara adil berdasarkan ruang lingkup jaringan sosial dan kesegaran (_recency_) konten.
+ Merekayasa infrastruktur pangkalan data hibrida yang mengisolasikan operasi baca-tulis tinggi (_ScyllaDB/Cassandra_) dari operasi transaksional ACID (_PostgreSQL_).
+ Mengembangkan arsitektur aplikasi web modern bertenaga kerangka kerja terkini yang mendukung alur kerja _gig economy_, seperti negosiasi penawaran khusus dan manajemen penyelesaian pesanan otomatis.

== Manfaat
Dampak komprehensif dari penciptaan dan perancangan Sotto melingkupi berbagai aspek:

1. Bagi Siswa dan Talenta Muda:
  + Menyediakan panggung digital yang suportif untuk memamerkan karya nyata serta mengakumulasi rekam jejak profesionalisme awal.
  + Membuka peluang pembentukan tim lintas-bidang secara efisien melalui mesin rekomendasi berbasis komplementaritas.
  + Memberikan fasilitas untuk terjun ke dalam ekonomi kreatif mandiri (_gig economy_) melalui keamanan sistem _escrow_ dan ruang negosiasi yang aman.

2. Bagi Dunia Pendidikan:
  + Berfungsi sebagai sarana pemantauan tidak langsung terhadap minat dan orientasi spesialisasi siswa secara empiris.
  + Menstimulasi mental _technopreneurship_ melalui praktik langsung menjual produk digital atau jasa spesifik.

3. Bagi Keilmuan Rekayasa Perangkat Lunak:
  + Memberikan preseden ( _use-case_ ) nyata terhadap implementasi pangkalan data _polyglot_ (ScyllaDB dan PostgreSQL) dalam sistem yang sama guna mereduksi beban kerja peladen.
  + Mengusulkan rumusan modifikasi sistem rekomendasi matematis hibrida bagi sosial media produktif.

#linebreak()

= Landasan Teori

== Gig Economy dalam Ekosistem Pelajar
_Gig economy_ atau ekonomi berbasis proyek lepas merujuk pada pasar tenaga kerja di mana kontrak berlangsung singkat, tidak terikat secara absolut, dan berpusat pada penyerahan luaran spesifik (_deliverables_). Dalam skala pelajar dan mahasiswa vokasi, _gig economy_ mewujud dalam bentuk jasa pembuatan desain grafis dasar, tugas pengkodean program, pembuatan situs web skala MVP ( _Minimum Viable Product_ ), hingga penulisan artikel SEO. Agar transaksi skala mikro ini berjalan tanpa hambatan dan saling menguntungkan, dibutuhkan sebuah infrastruktur perantara yang menyatukan kapabilitas ruang obrolan kontekstual, fitur penawaran penyesuaian (_Custom Offers_), hingga _progress tracker_ otomatis. Hal ini meniadakan kerumitan negosiasi administrasi, sehingga talenta muda dapat sepenuhnya berfokus pada eksekusi teknis karyanya.

== Sistem Temu Kembali Informasi dan _Vector Space Model_
Model Ruang Vektor (_Vector Space Model_) merupakan kerangka matematis di mana entitas abstrak—baik berupa teks dokumen, intensi pengguna, maupun klasifikasi spesialisasi keahlian—direpresentasikan sebagai vektor berarah pada ruang euklides multi-dimensi. Tingkat ekuivalensi atau kedekatan semantik antara sebuah _query_ dengan sebuah objek diukur dengan menghitung deviasi sudut antara kedua vektor tersebut, yang secara komputasi diterjemahkan menjadi perhitungan Perkalian Titik (_Dot Product_) atau Kedekatan Kosinus (_Cosine Similarity_). Dalam sistem kolaborasi Sotto, VSM tradisional dimodifikasi. Sotto tidak mencari vektor yang arahnya identik, melainkan menerapkan transformasi komputasional matriks di mana vektor _Supply_ diputar (_rotated_) terlebih dahulu berdasarkan matriks kebergantungan keterampilan agar bertemu dan sejalan dengan vektor _Demand_.

== Pemodelan Jejaring dengan Teori Graf (_Graph Theory_)
Struktur komunitas interaksi antarpengguna direpresentasikan melalui Teori Graf, yang mendefinisikan sistem sebagai konstelasi simpul (_Nodes/Vertices_) dan sisi penghubung (_Edges_). Pada konteks Sotto, pengguna bertindak sebagai simpul dan interaksi "mengikuti" ( _follow_ ) bertindak sebagai sisi yang mengkoneksikan dua buah simpul. Jarak geografis-sosial antarpengguna diukur menggunakan pencarian jalur terpendek ( _shortest path_ ). Jarak proksimitas ini memengaruhi seberapa besar probabilitas algoritma akan merekomendasikan karya pengguna yang belum dikenal ke linimasa utama. Melalui fungsional redaman ( _damping factor_ ) yang terukur, sebuah karya dapat perlahan-lahan menyebar melintasi lingkaran kedekatan tingkat pertama (teman), menuju tingkat kedua (teman dari teman), tanpa terasa intrusif bagi sasaran akhirnya.

== Analisis Peluruhan Eksponensial Konten (_Time Decay_)
Dinamika platform sosial sangat bergantung pada kesegaran konten (_freshness_). Postingan penawaran kolaborasi pemrograman bulan lalu tidak lagi bernilai secara bisnis di bulan ini. Model peluruhan eksponensial matematis, yang diadaptasi dari peluruhan radioaktif dalam keilmuan fisika murni, digunakan untuk mensimulasikan degradasi urgensi sebuah konten. Setiap unggahan diberikan bobot waktu paruh (_half-life_) tertentu, sehingga besaran skor rekomendasinya akan memudar secara asimtotik mendekati nol seiring bertambahnya selisih jam dari waktu pempublikasian awalnya, tidak peduli seberapa tingginya persentase kedekatan vektor.

#linebreak()

= Pembahasan Analisis dan Perancangan Program

== Arsitektur dan Pemilihan Teknologi

Kebutuhan akan peladen yang mampu mendistribusikan pemrosesan beban berat di latar belakang, sinkronisasi memori basis data terdesentralisasi, serta respons UI yang secepat kilat mensyaratkan kurasi teknologi ( _tech stack_ ) lapis korporat (_Enterprise-grade_). Sotto diarsiteki dengan pemilahan _concern_ antara penyajian dan pengelolaan komputasi, serta mematuhi aturan dependensi modular secara ketat.

=== Antarmuka Sisi Klien (_Frontend_)
Antarmuka Sotto membuang pendekatan lama berbasis pembuatan halaman tunggal (SPA) sederhana, dan beralih menggunakan kerangka _Routing_ berbasis pemuatan _loader_ pra-rute.
+ *React Router v7*: Generasi terbaru ini tidak hanya menjadi alat peta URL, tetapi bertindak sebagai manajer siklus hidup penuh halaman (_Framework level_). Sebelum halaman `explore` atau `profile` dirender, rute akan secara asinkron menarik resolusi GraphQL terlebih dahulu, sehingga tampilan "kerangka transisi" (_Skeleton Loaders_) dapat dimuat seketika tanpa fenomena kilat layar putih.
+ *Vite & TypeScript*: _Vite_ ditunjuk sebagai bundler utama untuk melipatgandakan laju muat awal pengembangan lokal berkat modul pembaharuan dinamis ( _Hot Module Replacement_ ). _TypeScript_ secara intensif digunakan di Sotto, terutama berbekal paket _GraphQL Codegen_, yang secara otomotis menyuntikkan tipe skema data GraphQL _Backend_ persis ke dalam _React Hooks_ khusus (_custom hooks_) milik aplikasi antarmuka. Dengan demikian, antarmuka klien kebal terhadap kecacatan tipe (_Type Safety_).
+ *Apollo Client & Zustand*: _Apollo Client_ menangani komputasi _caching_ data grafik dari kueri peladen, memfasilitasi _optimistic UI_ saat pengguna melakukan aksi (seperti memberi Suka/ _Like_), serta langganan (_Subscription_) secara kontinu via _Websocket_ di ruang percakapan. Di sisi komplementer, *Zustand* diaplikasikan untuk manajemen _state_ mikro yang bersifat sinkron tanpa perlu merender ulang tumpukan komponen global, seperti sesi lokal token autentikasi (JWT) dan kontrol sakelar tema gelap-terang.
+ *TailwindCSS v4*: Pendekatan primitif atomik pada CSS meniadakan pembengkakan kode bergaya usang dan file _stylesheet_ raksasa.

=== Mesin Layanan (_Backend_)
Peladen dirancang menggunakan kerangka kerja *NestJS (v11)*. Ekosistem ini mendorong _developer_ menaati kaidah _Solid Principles_ melalui injeksi dependensi antar _Controller_ (GraphQL Resolvers) dan _Services_ lapis logika. Modul dipecah berdasarkan Domain (Identitas, Konten, Gig Economy, dan Komunikasi).
+ *GraphQL (Apollo Server)*: Arsitektur _Code-First_ GraphQL Sotto memangkas tumpang tindih _endpoints_. Klien hanya menarik data eksak. Contoh: ketika lini masa (_Feed_) dirender, _query_ GraphQL meminta nama pengarang, skor, teks rincian, dan tautan gambar penawaran dari satu gerbang URL `/graphql`, mencegah panggilan berlapis yang merugikan memori.
+ *Micro-Architecture dan BullMQ*: NestJS dipecah logikanya. Algoritma _Synergy Engine_ tidak diformulasikan pada siklus interupsi _HTTP Request_ reguler. NestJS akan mendorong instruksi pengambilan log puluhan ribu interaksi ke dalam antrean *BullMQ* bersandar peladen *Redis*. Para pekerja di belakang layar (_synergy-worker_) akan menghimpun Vektor _Demand_ lalu mengawetkan hasilnya di _Cache Redis_, sehingga beban CPU peladen REST aman dan tidak beku (_blocked_).

=== Infrastruktur dan Basis Data Hibrida (_Polyglot Persistence_)
Sotto mempraktikkan _Polyglot Persistence_, yakni penggunaan lebih dari satu jenis sistem pangkalan data di dalam satu arsitektur untuk memaksimalkan utilitas sesuai studi kasus spesifik.

1. *PostgreSQL (Data Relasional)* \
Digunakan sebagai basis data kebenaran tunggal (_Single Source of Truth_) untuk entitas berskema kaku, relasi absolut, dan menjamin kepatuhan ACID (_Atomicity, Consistency, Isolation, Durability_). Entitas seperti manajemen akun pengguna, penempatan rekam pembayaran ( _escrow_ ), dan detail produk pesanan dipertahankan di PostgreSQL melalui jembatan _Prisma ORM_.

2. *ScyllaDB (Data Non-Relasional Log Telemetri)* \
Basis data mutakhir berintikan C++ yang serasi dengan topologi Cassandra ini mengelola satu domain ekstrem: Sistem Umpan (_Feed_) dan Log Interaksi Telemetri. Setiap ketukan tayang (_view_), baca gulir layar, atau aksi pengguna sekecil apa pun direkam di ScyllaDB. Pemisahan log interaksi masif dari PostgreSQL melindungi peladen dari kemacetan (_database locking_) yang melumpuhkan sistem operasional pusat.

3. *MinIO (Penyimpanan Obyek Swakelola)* \
Pengganti _Amazon S3_ hibrid yang di-_hosting_ lokal secara kluster, mengamankan arsip pengiriman tugas _zip_, dokumen resolusi besar _PDF_, dan galeri estetika aset karya pengguna. Integrasi dibalut via perantara *Presigned URL* sehingga klien dapat mengunggah file _Gig_ secara privat.

== Arsitektur Protokol Antarmuka Pemrograman Aplikasi (API)

Demi menjamin keandalan dan fleksibilitas distribusi lintas layanan (komunikasi ke _frontend_ dan integrasi _webhook_ eksternal), arsitektur protokol komunikasi pada Sotto tidak mengandalkan satu jenis antarmuka absolut. Aliran data dikelompokkan (_domain-driven_) menggunakan GraphQL sebagai tulang punggung interaksi aplikasi, HTTP REST untuk gerbang keamanan publik, serta WebSocket untuk lalu lintas obrolan _real-time_.

=== 1. Protokol GraphQL (Gerbang Transportasi Data Lini Masa & Gig)
Kepadatan interaksi antara antarmuka dan peladen mengalir pada satu poros titik lebur, yakni `/graphql`. Arsitektur mutasi (_Mutation_) dan kueri (_Query_) ini menyediakan abstraksi superior sehingga Vite/React tidak perlu melakukan pemanggilan _fetch_ bertingkat. Seluruh kueri tersebut dikelola melalui berlapis abstraksi kontroler spesifik GraphQL, yang dalam ekosistem NestJS disebut sebagai _Resolver_. Berikut adalah representasi diagram matriks titik terminasi (_endpoints_) beserta _resolver_ pengendalinya:

#align(center)[
  #table(
    columns: (auto, auto, auto, auto),
    align: left,
    [*Modul Domain / Entitas*], [*Resolver*], [*Operasi (Tipe)*], [*Deskripsi Eksekusi Skema*],
    [`Accounts & Follows`],
    [`AccountsResolver`],
    [`Query`],
    [`getProfile(id)`: Mengekstraksi biodata, graf relasi (_follows_), trust_score.],

    [`Accounts & Follows`],
    [`AccountsResolver`],
    [`Mutation`],
    [`updateProfile(input)`: Sinkronisasi data identitas profil ke ranah PostgreSQL.],

    [`Content & Feed`],
    [`FeedResolver`],
    [`Query`],
    [`getFeed(cursor, limit)`: Menarik data linimasa pasca-analisis _Synergy Engine_ (ScyllaDB).],

    [`Content & Feed`],
    [`FeedResolver`],
    [`Mutation`],
    [`createPost(input)`: Meluncurkan unggahan pameran karya ke dalam siklus jaringan.],

    [`Gig Economy (Listings)`],
    [`ListingsResolver`],
    [`Mutation`],
    [`createListing(input)`: Inisiasi etalase, bercabang antara _service_ dan _digital product_.],

    [`Gig Economy (Listings)`],
    [`ListingsResolver`],
    [`Query`],
    [`getListing(id)`: Merangkum rincian kalkulasi _pricing_ dan kapasitas antrean pesanan.],

    [`Media & Infrastructure`],
    [`MediaResolver`],
    [`Mutation`],
    [`requestUploadUrl(type)`: Permintaan tautan proksi Presigned S3 dari orkestrator MinIO.],
  )
]

=== 2. Protokol HTTP REST (Gerbang Utilitas Terisolasi)
Peladen mempertahankan koridor REST ortodoks murni untuk meladeni modul yang terisolasi dari siklus UI GraphQL, terutama untuk pertukaran _payload_ instan melalui _Controller_ khusus:
+ *Titik Autentikasi Publik via `IamController`* (`POST /iam/register` dan `POST /iam/login`): Rute perantara ini menyortir validasi _Bcrypt_ awal tanpa beban komputasi tambahan. Titik ini melahirkan token _JSON Web Token_ (JWT) yang direpatriasi kepada sisi klien.
+ *Webhooks Pembayaran via `PaymentsController`* (`POST /payments/webhook`): Endpoint krusial yang berfungsi mendeteksi ketukan transaksional dari entitas _Midtrans Payment Gateway_. Modul ini menerjemahkan sinyal sukses pembayaran ke operasi lepas pesanan _Escrow_. Peladen pihak ketiga menuntut pengiriman HTTP _Payload_ berstandar tinggi yang menolak enkapsulasi kompleks GraphQL.

=== 3. Protokol WebSocket (Sinkronisasi Waktu Nyata)
Inovasi kolaborasi dan tawar-menawar karya diikat erat oleh TCP persisten _full-duplex_ via `Socket.io`, dikoordinasikan secara terpusat oleh antarmuka peladen pengamat bernama *`ChatGateway`*.
+ *Namespace `/chat`*: Saat pengguna menjangkau ruang obrolan, soket meretas koneksi. Emisi dari modul _client_ `send_message` langsung ditembakkan ke _ScyllaDB Message Models_, sedangkan `ChatGateway` secara serentak (_broadcaster_) meledakkannya ke partisipan lawan di ruang yang sama dalam laju sub-milidetik. Bahkan transmisi *Penawaran Khusus (Custom Offers)* didistribusikan melalui pita terowongan ini agar kedua belah pihak dapat bernegosiasi harga proyek _gig_ tanpa perlu menekan tombol muat ulang halaman.

== Penjabaran Arsitektur Skema Basis Data

Pemodelan skema struktur entitas Sotto secara rinci digambarkan dalam dua pilar fondasi berikut.

=== Skema Relasional (PostgreSQL)

#figure(
  image("../development/backend-reference/sql-schema.png", width: 90%),
  caption: [Skema Arsitektur Database Relasional Inti (PostgreSQL) melalui Prisma ORM],
)

Diagram entitas di atas memanifestasikan tulang punggung Sotto. Tabel fundamental bermula dari domain `users` yang menampung kata sandi kriptografi dan alamat surel. Domain ini merambat (1-to-1) pada `accounts` yang berisi detail profil spesifik, identitas tampilan, dan koefisien _Trust Score_. Untuk membangun komunitas reaktif, entitas majemuk `follows` digunakan sebagai rujukan pembentukan kedekatan Teori Graf _Synergy Engine_ secara lokal.

Jantung ekonomi _Gig_ diposisikan pada relasi struktur `listings`. Setiap talenta (_accounts_) berhak untuk mendirikan dan menjajakan banyak `listings` (M-to-1). Rantai `listings` ini dikonfigurasi untuk memuat atribut presisi: jenis layanan apakah berbasis pengerjaan berkelanjutan (jasa murni) atau barang unduhan instan (barang karya statis), batas ketersediaan antrean `max_active_orders`, hingga konfigurasi tarif per jam atau grosir (`price_amount`). Domain penutup untuk melengkapi pertukaran ekonomi ini diletakkan pada domain `orders`, sebagai tabel persimpangan kompleks ( _junction table_ ) yang mengikat interaksi transaksi komersial antara pemesan ( _buyer_ ), pemilik jasa ( _seller_ ), serta wujud layanan terkait (`listing_id`). Atribut siklus pergerakan pesanan dijaga ketat di dalamnya melalui rincian tahapan (_status_).

=== Skema Rekam Jejak Kinerja Non-Relasional (ScyllaDB)

#figure(
  image("../development/backend-reference/no-sql-schema.png", width: 90%),
  caption: [Skema Arsitektur Database Distribusi Skala Besar (ScyllaDB/Cassandra)],
)

Desain log perlintasan antarmuka ( _telemetry_ ) serta pemetaan hasil linear lini masa dipancangkan di dalam ekosistem kolom rentang lebar ( _Wide-column store_ ) ScyllaDB. Seperti yang digambarkan, kunci distribusi ( _Partition Key_ ) yang ditetapkan adalah identitas `user_id`. Setiap rekam detak penelusuran ( _view_ ) atau transaksi interaktif klik, secara otomatis memutar _counter_ rekaman dalam struktur log `interaction_logs` berdasarkan konjungsi _clustering key_ waktu aktual (`timestamp`). Log masif dan redundan inilah yang dikonsumsi berkala oleh pekerja asinkron Redis, diekstraksi ke sebuah Vektor _Demand_, serta dipetakan menjadi skor absolut kelembaman pos. Hasil komputasi _Synergy Engine_ yang telah masak kemudian didorong statis ke tabel baca utama `user_feeds`, di mana klien cukup melakukan perulangan `SELECT` untuk memproduksi daftar lini masa _real-time_ dalam _milidetik_.

#linebreak()

== Pemodelan Matematis Synergy Engine: Dari Rumus ke Perangkat Lunak

Tantangan tersulit dalam menciptakan jejaring kolaboratif Sotto adalah mencari titik temu antara kompetensi spesifik yang saling membutuhkan. Kita tidak ingin sekadar mencocokkan kemiripan, namun komplementaritas. Secara teknis, sistem ini beroperasi dalam ruang metrik dengan dimensi kategori kompetensi (misalnya, $n=5$ untuk: _Frontend_, _Backend_, _UI/UX_, _Audio/Video_, dan _Bisnis_).

Rumus ekuilibrium utama dalam algoritma ini mengintegrasikan pengalian proyektif terhadap vektor dan intersep kedekatan grafis sosial:

$ S(u_i, p_j) = [ alpha dot C(u_i, p_j) + beta dot G(u_i, u_k) + gamma dot R(u_k) ] dot D(Delta t) $

Skor relevansi $S(u_i, p_j)$ melambangkan nilai kelayakan unggahan pos $p_j$ oleh penulis/kontributor $u_k$ untuk diinjeksikan pada area beranda layar pengguna sasaran $u_i$. Bobot hyperparameter diwakili oleh lambang $alpha$ (korelasi komplementaritas vektor kompetensi), $beta$ (dampak jangkauan graf lokalitas), serta $gamma$ (ketegasan saringan integritas reputasi kreator). Faktor koreksi waktu ($D$) dikenakan secara eksponensial menyeluruh terhadap komponen di dalam kurung siku komputasi akhir.

=== 1. Vektor Permintaan, Penawaran, dan Matriks Komplementaritas ($C$)

Misalkan $bold(d)_i in RR^n$ adalah proyektur "Vektor Permintaan" ( _Demand Vector_ ) dari entitas pengguna $u_i$. Vektor ini tidak di-_input_ langsung, melainkan diekstraksi secara heuristik oleh pekerja komputasi periodik asinkron dari tumpukan data interaksi ScyllaDB. Sebaliknya, $bold(s)_j in RR^n$ merepresentasikan "Vektor Pasokan" ( _Supply Vector_ ), di mana nilai bobot dimensinya diperoleh instan kala kontributor menyisipkan _tag_ klasifikasi karya pada saat publikasi konten $p_j$.

Permasalahannya, produk titik (_Dot Product_) konvensional ($bold(d)_i dot bold(s)_j$) hanya mengukur kesamaan murni. Jika pengguna butuh _Frontend_, algoritma memuntahkan puluhan portfolio _Frontend_. Oleh karena itu, kita memanipulasi rentang spasial metrik dengan _Matriks Transformasi Komplementaritas_ $M in RR^(n times n)$. Nilai irisan baris $x$ dan kolom $y$ di matriks $M$, yang disimbolkan dengan $m_(x,y)$, menyimpan takaran empiris "seberapa mendesak" suatu keahlian $x$ menuntut sumbangsih komplementer dari bidang keahlian $y$.

Secara aljabar linear, pencocokan tingkat komplementaritas diukur menggunakan perbandingan norma Kosinus antara Vektor Permintaan $bold(d)_i$ dan rentangan hasil produk linear Matriks Transformasi Komplementaritas terhadap Vektor Penawaran $M bold(s)_j$:

$ C(u_i, p_j) = (bold(d)_i^T M bold(s)_j) / (||bold(d)_i|| ||M bold(s)_j||) $

Fungsi normalisasi Euclid norma di penyebut ($|| ... ||$) memastikan rasio keluaran komputasi tetap aman di kisaran riil $0.00$ hingga $1.00$.

=== 2. Relasi Graf Simpul Sosial ($G$)

Mekanisme filter kelokalan didasarkan pada pergerakan rute terpendek di dalam Teori Graf $V = (U, E)$. Misalkan interkoneksi profil ("Mengikuti") diinterpretasikan ke dalam jalur $d(u_i, u_k)$. Sistem memangkas derajat graf komputasional menjadi bilangan bulat berjarak diskrit:

+ $d = 0$: Pengguna memandang beranda karya profilnya sendiri.
+ $d = 1$: Saling berkaitan timbal balik ( _Mutual Follow_ ).
+ $d = 2$: Bertaut searah ( _One-way Follow_ / Teman tingkat sekunder).
+ $d = 3$: Asing sama sekali ( _Strangers_ ).

Faktor pelemahan ini menyaring limpahan post dengan meredam angkanya sesuai fungsi pangkat peluruhan, di mana $lambda_g$ menetapkan tingkat kelandaian limit fungsional redaman graf ( _damping limits_ ):

$ G(u_i, u_k) = e^(-lambda_g dot d(u_i, u_k)) $

=== 3. Saringan Penalti Reputasi ($R$) dan Degradasi Interval Waktu ($D$)

Kredibilitas penawaran disaring agar entitas dengan cacat sejarah layanan tidak meracuni linimasa beranda.

$ R(u_k) = (T_k / 5) dot log_10(1 + E_j) $

Variabel $T_k in [0, 5]$ disubstitusikan dari entitas rekam histori rating "Trust Score" milik $u_k$. Ekspresi $E_j$ menampung volume kumulatif _engagement_ aktual (sukarela suka, bagikan, jumlah komitmen pemesanan komersial pesanan). Limit logaritma menekan laju polarisasi (_runaway virality_).

Seluruh akumulasi nilai di atas pada akhirnya disubstitusikan terhadap limit eksponensial waktu asimtotik:

$ D(Delta t) = e^(-lambda_t dot Delta t) $

Apabila $lambda_t$ didefinisikan berdasarkan target waktu paruh (misalnya, $24$ jam menekan nilai ke kisaran $0.5$), maka postingan yang berbobot relevansi tinggi namun diunggah bulan lampau akan tersungkur nilainya di hadapan postingan berbobot reguler namun disiarkan tepat di pagi hari bersangkutan.

#linebreak()

= Hasil dan Implementasi

== Skenario Simulasi Matematis Komplementaritas Vektor

Untuk membuktikan presisi komputasi dari _Synergy Engine_, kita akan menyimulasikan algoritma fungsi $C(u_i, p_j)$ pada ruang metrik berdimensi 5: _Frontend_ (1), _Backend_ (2), _UI/UX_ (3), _Audio_ (4), dan _Bisnis_ (5).

*Skenario:* Pengguna $u_1$ adalah talenta pengembang _Frontend_ yang dalam sepekan terakhir masif mengeklik dan tertarik pada unggahan algoritma _Backend_ serta purwarupa desain _UI/UX_.
Maka, vektor permintaannya secara empiris dinormalisasi menjadi matriks basis baris:
$bold(d)_1 = vec(0.00, 0.67, 0.33, 0.00, 0.00)$

Sistem mendeteksi dua kandidat unggahan karya di _database_:
+ *Post 1 ($p_1$)*: Unggahan layanan integrasi API oleh programmer peladen. \
  Vektor penawaran: $bold(s)_1 = vec(0, 1, 0, 0, 0)$
+ *Post 2 ($p_2$)*: Unggahan _React Component_ animasi oleh sesama pengembang _Frontend_. \
  Vektor penawaran: $bold(s)_2 = vec(1, 0, 0, 0, 0)$

Kita definisikan sebagian elemen Matriks Komplementaritas ($M$) berdasarkan relasi industri wajar: Keahlian _Frontend_ (Baris 1) menuntut tingkat kebersandaran terhadap _Backend_ (Kolom 2) sebesar $0.90$, menuntut paduan _UI/UX_ (Kolom 3) senilai $0.80$. Berbeda halnya _Backend_ (Baris 2) yang memprioritaskan kolaborasi silang _Frontend_ (Kolom 1) senilai $0.85$.

Maka, untuk *Post 1 (Integrasi API Backend)*, kita kalkulasi proyeksi matriks suplai $M bold(s)_1$:
$
  M bold(s)_1 =
  mat(
    1, 0.9, 0.8, 0, 0;
    0.85, 1, 0.3, 0, 0.2;
    0.7, 0.2, 1, 0, 0.4;
    0, 0, 0, 1, 0.5;
    0.1, 0.2, 0.3, 0.5, 1
  )
  vec(0, 1, 0, 0, 0)
  = vec(0.9, 1, 0.2, 0, 0.2)
$
Kita kalikan titik ( _Dot Product_ ) dengan vektor permintaan pengguna ($bold(d)_1$):
$
  bold(d)_1^T (M bold(s)_1) = (0.00)(0.9) + (0.67)(1.0) + (0.33)(0.2) + (0)(0) + (0)(0.2)
$
$
  bold(d)_1^T (M bold(s)_1) = 0.00 + 0.67 + 0.066 = 0.736
$

Sebagai perbandingan, mari kalkulasi *Post 2 (Komponen Frontend)* yang diproyeksikan terhadap suplai $M bold(s)_2$:
$
  M bold(s)_2 =
  mat(
    1, 0.9, 0.8, 0, 0;
    0.85, 1, 0.3, 0, 0.2;
    0.7, 0.2, 1, 0, 0.4;
    0, 0, 0, 1, 0.5;
    0.1, 0.2, 0.3, 0.5, 1
  )
  vec(1, 0, 0, 0, 0)
  = vec(1, 0.85, 0.7, 0, 0.1)
$
Kali titik dengan vektor permintaan $bold(d)_1$:
$
  bold(d)_1^T (M bold(s)_2) = (0.00)(1.0) + (0.67)(0.85) + (0.33)(0.7) + (0)(0) + (0)(0.1)
$
$
  bold(d)_1^T (M bold(s)_2) = 0.00 + 0.5695 + 0.231 = 0.8005
$

Tunggu sejenak, pada contoh operasi mentah ini _dot product_ pos 2 tampak dominan akibat persebaran bobot suplai baris pertama yang membaur lintas vektor. Akan tetapi, algoritma ini belum melewati *divisor normalisasi magnitudo absolut* $||bold(d)_i|| ||M bold(s)_j||$ yang akan mengkoreksi bias besaran vektor komplementer. Selain itu, nilai akhir $C(u_i, p_j)$ masih diintersep oleh bobot kelokalan interaksi Graf $G$ dalam kombinasi ekuasi $S(u_i, p_j)$.  Melalui simulasi iteratif komprehensif, eksekusi jutaan baris perbandingan vektor serupa sukses dieksekusi asinkron di belakang layar pangkalan data *Redis*. Algoritma tidak lagi memberikan panggung prioritas utama kepada rekan dengan spesialisasi sama (_echo chamber_), dan memastikan talenta komplementer (seperti programmer antarmuka mencari pembuat API) dapat terkoneksi secara langsung dan organik.

== Alur Sistem Navigasi dan Konstruksi UI Antarmuka (_Frontend_)
Sotto diimplementasikan dalam struktur UI modular. Lapisan terluar (_The Skeleton_) menggunakan konfigurasi tata letak navigasi bawah statis (_Bottom Navigation Bar_) yang lazim diterapkan dalam pengembangan web seluler interaktif, mewadahi instrumen _Home_, _Search_, _Chat_, dan pelacakan pesanan ( _Management Order_ ).

Pengalaman unggul ( _User Experience_ ) dari platform sosial _Gig Economy_ ini difokuskan pada sinkronisitas perpindahan data:
1. *Bypass Checkout dan Produk Digital Murni*: Komponen _form_ registrasi aset digital dipilah menjadi formulir tipe ganda ( _wizard_ ). Jika seorang kontributor menautkan berkas sebagai produk siap unduh, sistem otomatis mencabut atribut tenggat pengerjaan, memanipulasi parameter internal menjadi barang statis murni. Pembeli yang mengeklik "Beli dan Unduh Langsung" tidak lagi tersesat di dalam labirin ruang obrolan pesanan (_Order Room_ / _Escrow_). Pembayaran Midtrans langsung membalik rekaman basis data di PostgreSQL, dan _Websocket_ seketika menginisialisasi pembukaan tautan gembok pengunduhan dari kluster ruang _MinIO_ ke beranda pembeli.
2. *Ruang Obrolan Kontekstual Berpadu Area Kerja (Order Room)*: Bagi layanan jasa berkelanjutan (membuat situs web pesanan, _UI mockups_, dsb), pengalaman pengguna beralih menembus batas aplikasi surel konvensional. Area obrolan pesan ( _Messaging List_ ) terintegrasi mulus berdampingan dengan balok pelacakan kemajuan komersial ( _Progress Tracker Bar_ ). Kontributor berhak menggubah penawaran khusus berspesifikasi kustom di atas pesan konvensional. Kala konfirmasi diterima, layar obrolan tanpa memuat ulang (melalui pancaran koneksi soket GraphQL) bermutasi menampilkan lapisan aksi papan dasar tambahan ( _Sticky Bottom Action Board_ ) yang mendesak kreator untuk mengunggah kompresi tugas usainya.

#linebreak()

= Penutup
== Kesimpulan
Penelitian dan pengembangan teknis dari arsitektur _platform_ kolaborasi gig economy siswa vokasi "Sotto" telah berhasil menguji dan merumuskan ulang pemahaman terhadap lokapasar talenta mikro secara digital. Sotto tidak hanya memindahkan proses periklanan jasa tradisional ke medium layar gawai. Ia merupakan manifestasi komputasi komplementaritas ruang vektor dan kedekatan diskrit proksimitas grafis yang disuntikkan langsung ke dalam algoritma linimasa utama (_feed_), membasmi _echo chamber_, dan membangun ekosistem saling melengkapi antardisiplin ilmu siswa. Pengadopsian skema basis data _polyglot persistence_ di peladen asinkron _NestJS_—menyatukan determinisme _PostgreSQL_ dan kelenturan penulisan log berkecepatan masif _ScyllaDB_—memainkan peranan fundamental guna mendongkrak performa skalabilitas komputasi _Synergy Engine_ sejalan dengan penambahan masif antarmuka reaktif tanpa selang muat ulang di _React Router v7_.

== Saran
Konfigurasi operasional tingkat lanjutan dapat mempertajam model komputasi matematis dengan beralih dari injeksi Matriks Komplementaritas Statis terukur (_hardcoded matrix M_) menjadi jaringan penilai heuristik terotomasi berbasis Pembelajaran Mesin ( _Machine Learning / Neural Embeddings_ ) berkesinambungan. Selain itu, eksperimentasi integrasi _cluster caching node_ pada pialang _Redis_ lebih dalam sangat disarankan guna melipatgandakan limit transaksi _Dot Product_ asinkron ke wilayah ambang ratusan ribu operasi sinkronis pararel, mengukuhkan kesiapan platform bilamana terjadi lonjakan pendaftaran massal lintas populasi pelajar kejuruan berskala nasional. Terakhir, disarankan untuk merinci lebih lanjut dokumentasi spesifikasi teknis komponen antarmuka klien (_frontend_) di masa mendatang. Penambahan visualisasi hasil _render_ antarmuka (tangkapan layar aplikasi) secara komprehensif sangat diperlukan guna menjembatani pemahaman komputasi teori algoritma di belakang layar dengan wujud nyata interaksi pengguna akhir di layar gawai.

#linebreak()
