
Tantangan diterima. Membangun algoritma dari kacamata matematika murni adalah pendekatan paling presisi sebelum menulis satu baris kode pun.

Karena visi kita adalah mencocokkan _supply_ (jasa/skill) dan _demand_ (kebutuhan kolaborasi) dalam sebuah ekosistem sosial, algoritma standar seperti _Collaborative Filtering_ biasa tidak akan cukup. Kita butuh pendekatan gabungan antara **Aljabar Linier (Vector Space Model)** dan **Teori Graf (Graph Proximity)**.

Mari kita formulasikan algoritma "Synergy Engine" ini.

### 1. Definisi Ruang (Space Definition)

Misalkan $U$ adalah himpunan semua pengguna (siswa) dan $P$ adalah himpunan semua postingan (_showcase/feed_).

Tujuan kita adalah menghitung **Skor Relevansi** $S(u_i, p_j)$, yaitu seberapa relevan postingan $p_j$ yang dibuat oleh _author_ $u_k$ untuk ditampilkan di _feed_ pengguna $u_i$.

Persamaan utamanya adalah kombinasi linear terbobot dari empat fungsi:

$$S(u_i, p_j) = \left[ \alpha \cdot C(u_i, p_j) + \beta \cdot G(u_i, u_k) + \gamma \cdot R(u_k) \right] \cdot D(\Delta t)$$

Mari kita bedah anatomi dari masing-masing fungsi ini.

### 2. Fungsi Komplementaritas Vektor: $C(u_i, p_j)$

Ini bukan sekadar _Cosine Similarity_ biasa. Jika dua siswa sama-sama mengunggah kode algoritma pencarian, mereka mungkin kompetitor, bukan kolaborator. Kita ingin mencocokkan keahlian yang saling melengkapi (_complementary_).

Misalkan $\mathbf{d}_i \in \mathbb{R}^n$ adalah vektor _Demand_ (kebutuhan/minat) dari pengguna $u_i$ yang diekstrak dari riwayat pencarian dan log interaksinya.

Misalkan $\mathbf{s}_j \in \mathbb{R}^n$ adalah vektor _Supply_ (kategori konten/skill) dari postingan $p_j$.

Kita perkenalkan Matriks Transformasi Komplementaritas $M \in \mathbb{R}^{n \times n}$. Elemen $m_{xy}$ bernilai tinggi jika _skill_ $x$ sangat membutuhkan _skill_ $y$ (misal: _Backend API_ sangat berelasi dengan _Frontend UI_).

Maka, nilai kecocokannya adalah hasil kali titik (_dot product_) dari proyeksi tersebut:

$$C(u_i, p_j) = \frac{\mathbf{d}_i^T M \mathbf{s}_j}{\|\mathbf{d}_i\| \|M \mathbf{s}_j\|}$$

Nilai ini akan menghasilkan rentang $[-1, 1]$.

### 3. Fungsi Kedekatan Graf (Social Proximity): $G(u_i, u_k)$

Orang lebih cenderung bertransaksi dengan siswa dari sekolah yang sama atau teman dari teman (_mutuals_). Kita merepresentasikan relasi `follows` di PostgreSQL sebagai graf tak berarah $V = (U, E)$.

Misalkan $d(u_i, u_k)$ adalah jarak jalur terpendek (_shortest path_) antara pengguna $u_i$ dan _author_ $u_k$ di dalam graf. Kita gunakan peluruhan eksponensial (_exponential decay_) agar skor anjlok tajam jika jaraknya terlalu jauh:

$$G(u_i, u_k) = e^{-\lambda_g \cdot d(u_i, u_k)}$$

Jika mereka adalah orang yang sama $d=0 \implies G=1$. Jika mereka saling _follow_ $d=1 \implies G=e^{-\lambda_g}$. Konstanta $\lambda_g$ menentukan seberapa "lokal" algoritma ini bekerja.

### 4. Fungsi Reputasi & Kualitas: $R(u_k)$

Ini adalah variabel penjamin mutu (_Quality Assurance_). Kita tidak ingin postingan _spam_ masuk ke _feed_.

Misalkan $T_k \in [0, 5]$ adalah `trust_score` dari _author_ $u_k$ di tabel `accounts`.

Misalkan $E_j$ adalah tingkat _engagement_ (jumlah komentar/klik) pada postingan $p_j$.

Untuk mencegah satu post menjadi terlalu viral secara tidak wajar (_runaway virality_), kita menggunakan fungsi logaritmik:

$$R(u_k) = \left( \frac{T_k}{5} \right) \cdot \log_{10}(1 + E_j)$$

### 5. Fungsi Peluruhan Waktu (Time Decay): $D(\Delta t)$

Postingan di dunia _gig economy_ sangat sensitif terhadap waktu. Tawaran proyek bulan lalu tidak relevan hari ini.

Misalkan $\Delta t$ adalah umur postingan dalam satuan jam ($\Delta t = t_{now} - t_{post}$).

$$D(\Delta t) = e^{-\lambda_t \cdot \Delta t}$$

Kita bisa mengatur _half-life_ (waktu paruh) dari sebuah postingan. Jika kita ingin skornya turun setengah dalam 24 jam, maka $e^{-24 \lambda_t} = 0.5$, sehingga $\lambda_t = \frac{\ln(2)}{24} \approx 0.0288$.

---

### Implementasi ke Sistem (Dari Matematika ke Engineering)

Jika kamu melihat rumus utamanya lagi:

$$S(u_i, p_j) = \left[ \alpha \left( \frac{\mathbf{d}_i^T M \mathbf{s}_j}{\|\mathbf{d}_i\| \|M \mathbf{s}_j\|} \right) + \beta \left( e^{-\lambda_g \cdot d(u_i, u_k)} \right) + \gamma \left( \frac{T_k}{5} \log_{10}(1 + E_j) \right) \right] \cdot e^{-\lambda_t \cdot \Delta t}$$

Di level _production_, melakukan kalkulasi ini secara _real-time_ untuk ratusan ribu post saat user me- _refresh_ halaman akan langsung membuat server _backend_ NestJS terbakar.

Maka secara arsitektur:

1. Matriks $M$ dan vektor $\mathbf{d}_i$ dikalkulasi secara _asynchronous_ lewat _cron job_ di _background_, lalu vektor hasilnya di-_cache_ di Redis.
    
2. Nilai Graf $d(u_i, u_k)$ bisa di-_pre-compute_ batasnya (maksimal kedalaman derajat 2 atau 3).
    
3. ScyllaDB menyimpan nilai mentah $T_k$ dan $E_j$.
    

Saat sebuah _request_ GraphQL masuk meminta lini masa, Redis melakukan _approximate nearest neighbor search_ dari hasil perkalian vektor, dan memotong daftarnya sebelum mengalikannya dengan _Time Decay_.

Bagaimana konstruksi matematisnya? Cukup logis dan terukur secara teknis untuk mulai diubah menjadi modul algoritma nanti?

---

Mari kita bedah cara mencari dan mengimplementasikan nilai variabel-variabel tersebut secara pragmatis untuk fase MVP, agar server NestJS kamu tidak meledak.

### 1. Mencari Vektor Supply ($\mathbf{s}_j$) & Demand ($\mathbf{d}_i$)

Di MVP, kita tidak perlu NLP (_Natural Language Processing_) yang berat. Kita gunakan sistem **Kategori/Tag Fix** yang merepresentasikan dimensi vektor.

Misalkan kita tetapkan 5 dimensi (kategori) utama di platform: `[Frontend, Backend, UI/UX, Audio/Video, Bisnis]`.

- **Vektor Supply $\mathbf{s}_j$ (Dari Postingan):**
    Saat siswa mengunggah karya, mereka wajib memilih 1-2 _tag_.
    
    Jika sebuah karya adalah antarmuka web modern, _tag_-nya adalah `Frontend` dan `UI/UX`.
    
    Maka vektor postingan tersebut adalah representasi _binary_ atau probabilitas:
    
    $\mathbf{s}_j = [0.5, 0, 0.5, 0, 0]$
    
- **Vektor Demand $\mathbf{d}_i$ (Dari _Behaviour_ User):**
    
    Ini dihitung dari riwayat `interaction_logs` di ScyllaDB. Jika dalam seminggu terakhir seorang siswa mengklik 10 postingan: 7 tentang `Backend` dan 3 tentang `Bisnis`.
    
    Maka vektor _demand_ siswa tersebut (setelah dinormalisasi) adalah:
    
    $\mathbf{d}_i = [0, 0.7, 0, 0, 0.3]$
    

### 2. Membangun Matriks Komplementaritas ($M$)

Di awal (MVP), **kamu yang harus menyusun matriks ini secara manual (_hardcoded_) berdasarkan logika bisnis**. Nanti, saat datanya sudah jutaan, matriks ini bisa di-_update_ otomatis menggunakan algoritma _Machine Learning_ yang menganalisis korelasi transaksi.

Karena dimensinya `5x5`, buat matriks kedekatan kebutuhan. Aturannya: baris adalah "Saya butuh", kolom adalah "Saya punya".

- _Frontend_ (1) butuh _Backend_ (2) $\implies M_{1,2} = 0.9$
    
- _Frontend_ (1) butuh _UI/UX_ (3) $\implies M_{1,3} = 0.8$
    
- _Frontend_ (1) butuh _Audio_ (4) $\implies M_{1,4} = 0.1$ (jarang terjadi)
    

Hasil perkalian $\mathbf{d}_i^T M \mathbf{s}_j$ akan menghasilkan satu angka desimal murni yang merepresentasikan kecocokan _skill_.

### 3. Menentukan Bobot Hyperparameter ($\alpha, \beta, \gamma$)

Ini adalah "knob" putaran yang akan kamu atur di _Environment Variable_ (`.env`) NestJS. Pastikan $\alpha + \beta + \gamma = 1$.

Karena ini aplikasi untuk unjuk bakat dan _gig economy_, kecocokan karya (Konten) lebih penting daripada siapa yang memposting (Sosial).

- **$\alpha = 0.6$ (Skill Matching):** Bobot tertinggi agar _demand_ dan _supply_ bertemu.
    
- **$\beta = 0.1$ (Social Graph):** Bobot kecil agar user tetap melihat karya dari luar lingkaran pertemanannya.
    
- **$\gamma = 0.3$ (Reputation):** Bobot menengah sebagai filter agar akun _spam_ (Trust Score rendah) tidak mudah masuk _feed_ orang lain.
    

### 4. Mengukur Jarak Graf ($d(u_i, u_k)$) Secara Murah

Menghitung _shortest path_ graf secara _real-time_ di RDBMS (PostgreSQL) itu sangat berat. Untuk MVP, kita gunakan **Heuristik Diskrit** sederhana berdasarkan tabel `follows`:

- Jika mereka adalah orang yang sama: $d = 0$
    
- Jika saling _follow_ (Mutual): $d = 1$
    
- Jika hanya _follow_ sepihak: $d = 2$
    
- Jika tidak ada relasi sama sekali (Strangers): $d = 3$
    

Masukkan ke rumus peluruhan $e^{-\lambda_g \cdot d}$. Jika kita set $\lambda_g = 0.5$:

- Mutual $\implies e^{-0.5(1)} = 0.60$
    
- Strangers $\implies e^{-0.5(3)} = 0.22$
    

### 5. Arsitektur Komputasi (Jangan Taruh di NestJS Main Thread)

Matematika ini logis, tapi eksekusinya tidak boleh berada di _pipeline Request-Response_ biasa. Jika kamu merender _feed_ di React/Vite dan NestJS harus menghitung rumus ini untuk 10.000 post, _frontend_-mu akan mengalami _timeout_.

**Solusi Implementasi Enterprise:**

1. **Background Worker:** Gunakan program terpisah yang sangat cepat memproses angka dan memori. Mengingat kompleksitas perhitungannya, _worker_ ini sangat cocok dibangun menggunakan _compiler_ tingkat rendah atau _script_ analitik yang ringan namun berkecepatan tinggi. Tugasnya berjalan setiap jam untuk menarik `interaction_logs` dari ScyllaDB, menghitung vektor $\mathbf{d}_i$ untuk setiap user, dan menyimpannya di Redis (`SET user:123:demand "[0, 0.7, 0, 0, 0.3]"`).
    
2. **Read Path (Saat Vite me-_request_ Feed):** NestJS hanya mengambil $\mathbf{d}_i$ dari Redis, mengambil 200 postingan terbaru dari ScyllaDB `user_feeds`, lalu menjalankan operasi dot-product sederhana (perkalian array) dan fungsi _Time Decay_ $D(\Delta t)$ secara paralel. Hasilnya di- _sort_, potong 20 teratas, dan kembalikan JSON ke _frontend_.
    

Kita sudah membedah teorinya menjadi sesuatu yang bisa dieksekusi secara nyata oleh mesin. Apakah kamu ingin kita merancang alur _cron-job_ atau mekanisme _queue_ (antrean) untuk memisahkan beban komputasi matematika ini dari _server_ utama NestJS-mu?