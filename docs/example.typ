#import "template.typ": *

// Take a look at the file `template.typ` in the file panel
// to customize this template and discover how it works.
#show: project.with(
  title: "Digitalisasi Konsultasi Pendidikan: Analisis Komputasi Minat Bakat Siswa Menggunakan Model Holland Codes pada Aplikasi PILAR",
)

#align(center)[
  #grid(
    columns: 1,
    gutter: 0.8em,
    [Anggota Kelompok:],
    [Alfonda Frederick Karmacenna Ritonga (01)],
    [I Komang Widi Astawa Jaya (20)],
    [Ida Bagus Mas Candra Wibawa (30)],
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
  Ketidaksesuaian pemilihan program studi di jenjang perguruan tinggi merupakan permasalahan yang berdampak pada keberlanjutan akademik dan efektivitas karier siswa. Penelitian ini bertujuan untuk mengembangkan sebuah sistem pendukung keputusan bernama PILAR (Pilihan Arah dan Rekomendasi) yang mampu memetakan potensi diri siswa secara objektif. Sistem ini menggunakan model psikometrik _Holland Codes_ (RIASEC) untuk mengekstraksi profil minat pengguna melalui instrumen kuesioner digital. Proses rekomendasi dijalankan menggunakan algoritma _Cosine Similarity_ untuk menghitung kedekatan vektor antara profil minat pengguna dengan karakteristik kurikulum dari berbagai program studi yang telah dipetakan. Sistem ini diimplementasikan menggunakan arsitektur web modern yang menjamin skalabilitas dan performa pemrosesan data secara _real-time_. Hasil penelitian menunjukkan bahwa integrasi antara landasan teori psikologi dan analisis komputasi vektor dapat memberikan hierarki rekomendasi jurusan yang presisi, sehingga diharapkan dapat membantu siswa dalam merencanakan masa depan akademik secara sistematis.

  *Kata Kunci:* RIASEC, _Holland Codes_, Sistem Pendukung Keputusan, _Cosine Similarity_, Rekomendasi Jurusan, PILAR.
]

= Pendahuluan

== Latar Belakang
Transisi pendidikan dari tingkat menengah atas menuju jenjang pendidikan tinggi merupakan fase kritis dalam perkembangan akademik siswa. Beragamnya opsi yang tersedia pascakelulusan seringkali menimbulkan ambiguitas dalam pengambilan keputusan. Berdasarkan riset yang dilakukan oleh _Indonesia Career Center Network_ (ICCN) pada tahun 2017, ditemukan fakta empiris bahwa 87% mahasiswa di Indonesia merasa mengambil program studi yang tidak sesuai dengan minat mereka. Tingginya angka ketidaksesuaian jurusan ini umumnya disebabkan oleh kurangnya pemahaman diri yang komprehensif, pengaruh subjektif dari lingkungan sekitar, serta keterbatasan instrumen pemetaan minat yang saintifik. Di sisi lain, metode bimbingan konvensional melalui konseling tatap muka di sekolah seringkali terkendala oleh rasio jumlah guru Bimbingan dan Konseling (BK) dan siswa yang tidak seimbang, sehingga pendampingan menjadi kurang optimal. Oleh karena itu, penelitian ini bertujuan untuk mengembangkan sebuah sistem perangkat lunak yang mampu melakukan analisis komputasional guna memberikan rekomendasi peminatan program studi yang selaras dengan profil kognitif pengguna secara efisien dan objektif.

Proyek ini dinamakan PILAR (Pilihan Arah dan Rekomendasi). Nama ini mencerminkan fungsi utama aplikasi:
- Pilihan Arah: Melambangkan fase di mana siswa menentukan kelanjutan studi menuju perguruan tinggi.
- Rekomendasi: Menunjukkan bahwa aplikasi ini merupakan sistem yang memberikan saran berdasarkan analisis data potensi dan minat pengguna.

== Rumusan Masalah
Rumusan masalah yang dapat dipaparkan berdasarkan latar belakang tersebut adalah sebagai berikut:

+ Faktor-faktor apa yang menyebabkan tingginya tingkat ketidaksesuaian mahasiswa terhadap program studi yang telah dipilih?
+ Bagaimana merancang sebuah instrumen asesmen yang mampu memetakan potensi dan minat bakat siswa secara objektif sebelum fase pemilihan program studi?
+ Sejauh mana efektivitas metode bimbingan konvensional dalam memfasilitasi pengambilan keputusan akademik secara komprehensif?
+ Bagaimana arsitektur sistem informasi yang optimal untuk menghasilkan rekomendasi program studi berakurasi tinggi berdasarkan _input_ pengguna?
+ Pendekatan algoritmik apa yang paling efisien untuk diterapkan pada sistem rekomendasi peminatan tersebut?

== Tujuan
Target yang ingin dicapai dari proyek ini antara lain:

+ Mengembangkan instrumen identifikasi potensi dan minat siswa secara digital.
+ Membangun sistem rekomendasi cerdas yang selaras dengan profil minat pengguna.
+ Menurunkan probabilitas ketidaksesuaian pemilihan program studi di perguruan tinggi.
+ Mewujudkan transformasi digital pada layanan konsultasi dan bimbingan pendidikan.

== Manfaat
Dampak positif dari proyek ini untuk pihak:

1. Bagi Pengguna:
  - Meningkatkan keyakinan dalam pengambilan keputusan akademik melalui hasil analisis data yang objektif.
  - Meningkatkan efisiensi proses pencarian relevansi antara profil minat individu dengan ketersediaan program studi.

2. Bagi Institusi Pendidikan:
  - Menyediakan instrumen pendukung bagi Guru Bimbingan Konseling dalam mengarahkan orientasi pendidikan tinggi siswa.
  - Berkontribusi pada peningkatan rasio keselarasan kompetensi lulusan dengan pilihan perguruan tinggi.

3. Bagi Pengembang:
  - Mengimplementasikan konsep rekayasa perangkat lunak dalam memecahkan permasalahan nyata di sektor pendidikan.
  - Memperkuat kapasitas komputasional dalam mentransformasi data psikometri menjadi keluaran rekomendasi yang sistematis.

4. Bagi Masyarakat Luas:
  - Mendukung pembentukan sumber daya manusia profesional yang sejalan dengan profil minat dan kompetensi inti mereka.

#linebreak()

= Landasan Teori

== Perancangan dan Implementasi Sistem Rekomendasi Program Studi Berbasis Algoritma Vektor RIASEC

Penyusunan sistem rekomendasi pendidikan ini merupakan sebuah proses multidisiplin yang mengintegrasikan rekayasa perangkat lunak, ilmu data, dan psikometrik. Untuk mencapai tingkat presisi yang optimal, perancangan sistem ini dibagi ke dalam tiga domain utama: metodologi pengumpulan data empiris, pembangunan infrastruktur teknologi, serta pemodelan matematis algoritma rekomendasi.

=== Metodologi Pengumpulan Data dan Pemetaan Program Studi

Tahap fundamental dalam perancangan sistem ini adalah pengumpulan dan pemrosesan data institusi pendidikan tinggi. Untuk memfasilitasi proses pendataan yang terukur dan terstruktur pada fase awal pengembangan, ruang lingkup data dibatasi secara geografis pada wilayah Provinsi Bali. Pembatasan skala ini diimplementasikan secara intensional guna mengeliminasi risiko eskalasi volume data yang tidak terkendali (_data overload_) apabila pemetaan langsung dieksekusi pada seluruh entitas perguruan tinggi di Indonesia.

Proses seleksi menghasilkan 20 institusi pendidikan tinggi di Bali yang dipilih secara strategis untuk memenuhi variasi tipologi perguruan tinggi, yang mencakup Universitas Negeri, Universitas Swasta, Institut, dan Politeknik. Melalui penelusuran dan ekstraksi data secara manual dari portal resmi masing-masing institusi tersebut, kami mengidentifikasi dan memetakan 107 Fakultas yang menaungi total 430 Program Studi.

Setiap entitas program studi yang telah dipetakan selanjutnya melalui tahap kuantifikasi profil minat berdasarkan tipologi RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional). Mengingat besarnya volume data yang mencakup ratusan entitas program studi, proses anotasi metrik awal diakselerasi menggunakan instrumen Large Language Model (LLM). Model kecerdasan buatan berbasis pemrosesan bahasa alami ini dikonfigurasi melalui rekayasa prompt yang ketat untuk meninjau orientasi kurikulum masing-masing program studi. Output dari proses ini menghasilkan matriks skalar pada rentang 0 hingga 7. Guna mereduksi bias halusinasi model dan memastikan tingkat reliabilitas data, sistem mengeksekusi teknik komputasi ansambel (ensemble computation), di mana nilai final didapatkan melalui agregasi nilai rata-rata dari beberapa iterasi inferensi independen.

Pendekatan ini memungkinkan kami mengeksekusi pelabelan data awal secara masif dan terstandarisasi, sebelum himpunan keluaran tersebut kami teruskan pada tahapan inspeksi dan kalibrasi manual untuk mengesahkan presisi serta validitas akhirnya. Berikut adalah representasi skema penyisipan data pada entitas basis data:

#block[
  ```sql
  INSERT INTO `fakultas` (`id_fakultas`, `nama_fakultas`, `id_univ`, `r_score`, `i_score`, `a_score`, `s_score`, `e_score`, `c_score`) VALUES
  (1,   'Kedokteran', 2, 3.20, 6.90, 0.80, 6.50, 2.10, 5.80),
  (2,   'Ekonomi dan Bisnis', 2, 1.40, 4.60, 2.80, 4.80, 6.90, 6.60),
  (3,   'Ilmu Budaya', 2, 1.50, 4.80, 6.70, 6.10, 2.40, 1.80),
  (4,   'Hukum', 2, 1.00, 6.60, 2.20, 4.80, 6.50, 6.10),
  (5,   'Teknik', 2, 6.90, 6.40, 1.80, 1.40, 4.00, 5.50)```]

Rentang skala penilaian yang digunakan didasarkan pada standar metrik O*NET (_Occupational Information Network_). O*NET adalah sebuah pangkalan data okupasi komprehensif yang dikembangkan dan dikelola secara berkelanjutan oleh Departemen Tenaga Kerja Amerika Serikat (_U.S. Department of Labor_). Pangkalan data ini menyediakan metrik standar untuk berbagai atribut evaluasi, termasuk kecocokan minat berbasis RIASEC. Standar asli dari O*NET menggunakan skala nilai yang berkisar dari 1 hingga 7. Namun, dalam komputasi sistem ini, dilakukan modifikasi ekspansi skala menjadi $0$ hingga $7$. Modifikasi batas bawah menjadi nol ini dilakukan secara intensional guna memperlebar variansi jangkauan nilai (_range_) dan mengakomodasi normalisasi komputasi matematis pada tahapan kalkulasi algoritma.

=== Sintesis dan Perancangan Instrumen Kuesioner

Bersamaan dengan proses pemetaan basis data, perancangan antarmuka (_User Interface_) sistem juga mulai dikembangkan. Setelah kerangka visual terbentuk, langkah esensial berikutnya adalah perumusan instrumen asesmen RIASEC yang akan disajikan pada antarmuka.

Item-item pertanyaan pada instrumen asesmen minat ini tidak dikonstruksi secara arbitrer, melainkan disintesis dari dua referensi akademik institusional yang terstandar, yaitu:

1. *Hawaii State Department of Education (Hawaii Public Schools)* \
  Dokumen ini digunakan sebagai parameter acuan utama karena instrumen tersebut dipublikasikan secara langsung oleh otoritas pendidikan resmi dan dirancang spesifik untuk diimplementasikan pada populasi siswa di tingkat pendidikan menengah. Hal ini memberikan kerangka dasar pertanyaan yang ekuivalen dan sangat relevan dengan kapasitas kognitif kelompok usia target sistem.

2. *Counseling Services, University of New Orleans* \
  Sebagai instrumen komparatif, referensi ini diintegrasikan karena menyajikan variasi butir pertanyaan dari perspektif institusi pendidikan tinggi. Referensi ini memastikan bahwa asesmen memiliki validitas untuk mengukur transisi psikologis dan kesiapan akademik siswa menuju lingkungan universitas.

Proses perancangan instrumen dari kedua sumber tersebut diorkestrasi melalui tahapan struktural. Tahap awal difokuskan pada agregasi dan penyaringan butir pertanyaan untuk mengeliminasi redundansi. Dari tahap ini didapat 60 pertanyaan total, dari 10 pertanyaan bagi setiap metrik RIASEC. Tahap kedua mencakup translasi linguistik secara presisi dari Bahasa Inggris ke dalam Bahasa Indonesia.

Tahap final adalah proses kontekstualisasi. Butir pertanyaan yang telah diterjemahkan dikalibrasi kembali dengan karakteristik sosiokultural, lingkungan belajar, serta parameter pemahaman kognitif siswa SMA dan SMK. Mengingat tujuan absolut dari instrumen ini adalah memfasilitasi pemilihan program studi di jenjang pendidikan tinggi, modifikasi sintaksis dilakukan secara ketat untuk memastikan bahwa setiap pertanyaan secara akurat mengukur probabilitas keberhasilan akademik dan preferensi belajar teoritis di dalam ekosistem perguruan tinggi.

#linebreak()

= Pembahasan Analisis dan Perancangan Program
== Arsitektur dan Pemilihan Teknologi

Bagian ini merinci alasan di balik pemilihan setiap teknologi yang digunakan dalam pengembangan Sistem PILAR. Pemilihan didasarkan pada prinsip efisiensi, skalabilitas, dan kemudahan pemeliharaan.

=== _Frontend_
- *React.js*: Dipilih karena arsitektur berbasis komponennya yang memungkinkan penggunaan kembali kode (_code reusability_) dan ekosistem pustaka (_library_) yang luas. Ini sangat membantu dalam membangun antarmuka kuesioner yang interaktif.
- *Vite*: Sebagai _build tool_ modern, Vite menawarkan kecepatan pengembangan yang jauh lebih tinggi dibandingkan Webpack tradisional, terutama melalui fitur _Hot Module Replacement_ (HMR) yang instan.
- *TypeScript*: Digunakan untuk menambahkan _static typing_ pada JavaScript. Hal ini krusial untuk mencegah kesalahan sistem (_bug_) di sisi klien, terutama saat menangani struktur data kompleks seperti pemetaan Program Studi dan skor RIASEC.
- *TailwindCSS*: Pendekatan _utility-first_ memungkinkan pengembangan antarmuka yang estetis dan responsif secara cepat tanpa harus menulis banyak baris CSS kustom yang sulit dipelihara.

=== _Backend_
- *Python*: Merupakan bahasa standar untuk pemrosesan data dan komputasi ilmiah. Keunggulannya dalam menangani operasi matematika (seperti kalkulasi _Cosine Similarity_) menjadikannya pilihan utama untuk mesin rekomendasi PILAR.
- *FastAPI*: Dipilih karena performanya yang tinggi (berbasis Starlette dan Pydantic) serta kemampuannya menghasilkan dokumentasi API (Swagger UI) secara otomatis. Hal ini mempercepat integrasi antara _Frontend_ dan _Backend_.
- *SQLModel*: Pustaka (_library_) ini dipilih karena menggabungkan kekuatan SQLAlchemy (ORM) dan Pydantic (validasi data). Ini memungkinkan penggunaan satu model tunggal untuk skema database sekaligus skema validasi API, sehingga mengurangi redundansi kode.

=== _Database_
- *MySQL*: Sebagai sistem manajemen basis data relasional (RDBMS) yang matang dan stabil. Versi 8.0 mendukung tipe data JSON secara efisien, yang sangat berguna bagi PILAR untuk menyimpan _snapshot_ jawaban kuesioner tanpa harus membuat skema tabel yang terlalu kaku.

=== Infrastruktur
- *Docker*: Menjamin konsistensi lingkungan pengembangan (_environment consistency_). Dengan Docker, risiko masalah "berjalan di komputer saya tapi tidak di server" dapat minimalkan.
- *Docker Compose*: Memungkinkan orkestrasi seluruh layanan (_Frontend_, _Backend_, _Database_) melalui satu file konfigurasi tunggal. Hal ini menyederhanakan proses _deployment_ dan _scaling_ layanan di masa depan.

== Pemodelan atau Perancangan Matematis Sistem Rekomendasi Penjurusan Berbasis Vektor RIASEC

=== Definisi Ruang Vektor Pengguna dan Jurusan
Sistem ini beroperasi di dalam ruang vektor enam dimensi yang mewakili tipologi kepribadian Holland Codes (RIASEC). Pada tahap pengumpulan data, sistem menangkap _input_ pengguna melalui kuesioner yang terdiri dari 10 pertanyaan independen untuk setiap dimensi kepribadian $i in {R, I, A, S, E, C}$.

Setiap pertanyaan, yang direpresentasikan sebagai $q_(i,j)$ (di mana $j$ adalah indeks pertanyaan dari 1 hingga 10), memiliki rentang nilai $0 <= q_(i,j) <= 100$. Nilai akumulasi mentah untuk setiap dimensi ($S_i$) didapatkan dengan menjumlahkan seluruh respons pada dimensi tersebut melalui persamaan:

$ S_i = sum_(j=1)^(10) q_(i,j) $

Sehingga menghasilkan rentang nilai akumulasi $0 <= S_i <= 1000$. Sebagai instrumen pembanding, sistem juga menarik Vektor Jurusan ($vec(M)$) dari basis data terpusat, di mana setiap dimensinya ($M_i$) diekstraksi dari standar modifikasi O*NET dengan rentang nilai desimal $0 <= M_i <= 7$.

=== Tahap Pra-Pemrosesan dan Normalisasi Skala
Meskipun algoritma pencocokan utama kebal terhadap perbedaan besaran skalar, arsitektur _Data Science_ yang terstandardisasi mensyaratkan kedua vektor beroperasi dalam ruang metrik yang ekuivalen. Sistem melakukan normalisasi linear ganda:

1. *Vektor Pengguna Ternormalisasi ($vec(U)$):*
  $ U_i = S_i / 10 $

  #linebreak()

2. *Vektor Jurusan Ternormalisasi ($vec(M)'$):*
  $ M'_i = (M_i / 7) times 100 $

Melalui proses transformasi ini, seluruh variabel dari kedua sumber data kini terkalibrasi secara presisi ke dalam metrik $0$ hingga $100$.

=== Kalkulasi Kedekatan Vektor (_Cosine Similarity_)
Sistem mengeksekusi algoritma _Cosine Similarity_ untuk mengkalkulasi tingkat kecocokan profil minat pengguna ($vec(U)$) dengan karakteristik ideal sebuah jurusan ($vec(M)'$).

Tahapan komputasi diawali dengan menghitung perkalian titik (_Dot Product_):
$ vec(U) dot vec(M)' = sum_(i=1)^(6) (U_i times M'_i) $

Sebagai faktor pembagi, sistem mengkalkulasi magnitudo (panjang Euclidean) dari masing-masing vektor:
$ ||vec(U)|| = sqrt(sum_(i=1)^(6) U_i^2) quad "dan" quad ||vec(M)'|| = sqrt(sum_(i=1)^(6) (M'_i)^2) $

=== Formulasi Skor Akhir dan Pemeringkatan
Skor probabilitas kemiripan antara pengguna dan suatu program studi diformulasikan sebagai berikut:

$ "Similarity"(vec(U), vec(M)') = (vec(U) dot vec(M)') / (||vec(U)|| times ||vec(M)'||) $

Fungsi tersebut menghasilkan koefisien desimal dalam rentang $0$ hingga $1$. Sistem kemudian mengonversi koefisien ini ke dalam format persentase (dikalikan $100%$). Hasil keluaran disortir secara menurun (_descending array_) untuk menampilkan hierarki rekomendasi yang paling presisi.

= Hasil dan Implementasi

== Skenario Pengujian Sistem
Untuk memvalidasi fungsionalitas algoritma _Cosine Similarity_ pada aplikasi PILAR, dilakukan simulasi pengujian terhadap antarmuka pengguna. Pengujian ini bertujuan untuk membuktikan bahwa sistem dapat memproses _input_ mentah dari kuesioner menjadi rekomendasi program studi yang relevan dan menampilkannya secara interaktif.

Misalkan seorang pengguna mengisi instrumen asesmen dengan profil kecenderungan minat RIASEC yang tersebar, dengan nilai dominan pada bidang Investigatif (I) dan Konvensional (C). Untuk mendemonstrasikan akurasi pemeringkatan, vektor profil pengguna ($vec(U)$) akan dikomparasikan dengan dua program studi:
1. *Magister Perencanaan Wilayah & Perdesaan* ($vec(M)'_1$) - Program studi yang relevan dengan profil pengguna.
2. *Pendidikan Seni Drama Tari dan Musik* ($vec(M)'_2$) - Program studi dengan fokus yang bertolak belakang sebagai kasus pembanding.

Berikut adalah proses kalkulasi matematis _Cosine Similarity_ untuk Prodi 1 (Perencanaan Wilayah & Perdesaan):

#align(center)[
  #table(
    columns: 4,
    align: center,
    [*Dimensi*], [*Pengguna ($U_i$)*], [*Perencanaan Wilayah ($M'_{1_i}$)*], [*$U_i times M'_{1_i}$*],
    [R], [65], [64.29], [4178.85],
    [I], [97], [88.57], [8591.29],
    [A], [62], [49.57], [3073.34],
    [S], [69], [78.57], [5421.33],
    [E], [52], [58.14], [3023.28],
    [C], [77], [67.57], [5202.89],
    [*Total / Mag.*],
    [*$||vec(U)|| approx 175.70$*],
    [*$||vec(M)'_1|| approx 168.98$*],
    [*$vec(U) dot vec(M)'_1 = 29490.98$*],
  )
]

Tingkat kecocokan untuk Prodi 1:
$ "Similarity"_1 = 29490.98 / (175.70 times 168.98) = 29490.98 / 29689.79 = 0.9933 $
Hasil: *99.33%*

Sebagai perbandingan, berikut adalah kalkulasi untuk Prodi 2 (Seni Drama Tari dan Musik):

#align(center)[
  #table(
    columns: 4,
    align: center,
    [*Dimensi*], [*Pengguna ($U_i$)*], [*Seni Drama Tari ($M'_{2_i}$)*], [*$U_i times M'_{2_i}$*],
    [R], [65], [28.57], [1857.05],
    [I], [97], [42.86], [4157.42],
    [A], [62], [92.86], [5757.32],
    [S], [69], [78.57], [5421.33],
    [E], [52], [35.71], [1856.92],
    [C], [77], [21.43], [1650.11],
    [*Total / Mag.*],
    [*$||vec(U)|| approx 175.70$*],
    [*$||vec(M)'_2|| approx 138.51$*],
    [*$vec(U) dot vec(M)'_2 = 20700.15$*],
  )
]

Tingkat kecocokan untuk Prodi 2:
$ "Similarity"_2 = 20700.15 / (175.70 times 138.51) = 20700.15 / 24336.21 = 0.8506 $
Hasil: *85.06%*

Komparasi ini secara empiris membuktikan sensitivitas algoritma. Sistem berhasil memberikan tingkat kecocokan hampir sempurna (99.33%) pada Magister Perencanaan Wilayah & Perdesaan yang memiliki orientasi Investigatif tinggi, dan menempatkan program studi Seni pada hierarki yang lebih rendah (85.06%) karena sama sekali tidak selaras dengan dominasi profil pengguna. Proses perhitungan matematis ini dieksekusi secara masif oleh sistem untuk seluruh 430 program studi guna menghasilkan peringkat rekomendasi secara _real-time_.

== Tampilan Hasil Analisis
Berdasarkan masukan vektor tersebut, sistem berhasil menyajikan hierarki program studi dengan tingkat kecocokan tertinggi secara visual.

#figure(
  image("result_example.png", width: 50%),
  caption: [Tangkapan layar antarmuka hasil analisis dan rekomendasi aplikasi PILAR],
)

Tangkapan layar di atas mengonfirmasi bahwa arsitektur komputasi (_backend_) dan implementasi antarmuka (_frontend_) telah berintegrasi dengan sempurna. Sistem tidak hanya mengkalkulasi kecocokan matematis, tetapi juga menampilkannya dalam format hierarkis (Universitas $->$ Fakultas $->$ Program Studi) beserta persentase kecocokannya, sehingga mudah diinterpretasikan oleh siswa.

#linebreak()

= Penutup
== Kesimpulan
Berdasarkan serangkaian proses perancangan, komputasi, dan pengujian yang telah dilakukan, dapat disimpulkan bahwa Sistem Pendukung Keputusan PILAR telah berhasil direalisasikan. Integrasi antara model psikometrik RIASEC dengan algoritma _Cosine Similarity_ terbukti mampu mengkalkulasi tingkat ekuivalensi antara profil minat pengguna dan karakteristik kurikulum secara presisi dan objektif. Hal ini dibuktikan melalui skenario pengujian di mana algoritma berhasil membedakan dan memberikan hierarki peringkat yang akurat pada program studi yang relevan maupun yang bertolak belakang dengan _input_ pengguna. Secara keseluruhan, aplikasi ini efektif dalam mendigitalisasi layanan bimbingan pendidikan, sehingga diharapkan dapat meminimalkan margin risiko ketidaksesuaian pemilihan jurusan bagi para calon mahasiswa di masa mendatang.

== Saran
Meskipun sistem PILAR telah mencapai target fungsionalnya, terdapat beberapa aspek yang dapat disempurnakan untuk penelitian dan pengembangan selanjutnya:
1. Memperluas cakupan pemetaan program studi dan perguruan tinggi yang saat ini terbatas di Provinsi Bali menjadi berskala nasional.
2. Mengintegrasikan parameter tambahan di luar minat bakat, seperti nilai akademik riil siswa (nilai rapor) atau proyeksi kebutuhan industri, guna menghasilkan rekomendasi yang jauh lebih holistik dan komprehensif.

#linebreak()

= Daftar Pustaka
1. Indonesia Career Center Network (ICCN). (2017). _Laporan Riset Evaluasi Kesesuaian Pendidikan dan Pekerjaan Lulusan Perguruan Tinggi_. Jakarta: ICCN.
2. Hawaii State Department of Education. (n.d.). _RIASEC Inventory: Career and Technical Education_. Diakses dari https://hawaiipublicschools.org/DOE%20Forms/CTE/RIASEC.pdf
3. Counseling Services, University of New Orleans. (n.d.). _Career Assessment: Holland Codes_. New Orleans: UNO.
4. National Center for O*NET Development. (n.d.). _O*NET 25.2 Database - Interests_. Diakses dari https://www.onetcenter.org/dictionary/25.2/excel/interests.html
