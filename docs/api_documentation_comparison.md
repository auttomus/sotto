# Bruno vs. Postman: Analisis Perbandingan & Implementasi Dokumentasi API

Pertanyaan besar bagi developer modern saat ini: **Mana yang lebih mudah dan nyaman didokumentasikan serta dipelihara secara jangka panjang, Bruno atau Postman?**

Secara singkat: **Bruno jauh lebih mudah, bersih, dan menyenangkan untuk didokumentasikan, terutama dalam lingkungan kerja tim (Git-friendly).**

Di bawah ini adalah perbandingan mendalam beserta **implementasi nyata kodenya** menggunakan endpoint autentikasi Sotto (`POST /iam/login`).

---

## 1. Implementasi Nyata Kode Dokumentasi API

Untuk membuktikannya, mari kita lihat bagaimana satu endpoint yang sama (`POST /iam/login` dengan validasi email/password dan test script) direpresentasikan dalam format file kedua tools ini.

### A. Implementasi Bruno (`login.bru`)
Bruno menggunakan format markup text sendiri bernama **Bru Markup Language (`.bru`)**. Format ini didesain agar mudah dibaca manusia (*human-readable*) dan ditulis secara langsung menggunakan teks editor biasa.

```bru
meta {
  name: Login User
  type: http
  seq: 1
}

post {
  url: {{base_url}}/iam/login
  body: json
  auth: none
}

body:json {
  {
    "email": "user@sotto.id",
    "password": "SuperSecretPassword123"
  }
}

tests {
  test("Status code should be 200", function() {
    res.getStatus().to.equal(200);
  });
  
  test("Should return access token", function() {
    const data = res.getBody();
    expect(data.accessToken).to.be.a('string');
  });
}
```

> [!TIP]
> **Keunggulan Kode Bruno:**
> - Sangat bersih dan ringkas (hanya ~25 baris teks biasa).
> - File didefinisikan **per request**, bukan digabung dalam satu file raksasa.
> - Mudah dimengerti secara langsung tanpa aplikasi khusus. Anda bisa menulis atau mengedit file ini langsung di VS Code.

---

### B. Implementasi Postman (`sotto.postman_collection.json`)
Postman merepresentasikan koleksi request dalam satu file JSON raksasa yang sangat kompleks, sarat dengan *generated IDs*, metadata internal, dan struktur *deeply nested* (bertingkat-tingkat). Berikut adalah representasi untuk endpoint yang **sama persis**:

```json
{
  "info": {
    "_postman_id": "8b5d3c8a-bf94-4f0e-9271-bfdcd8cf024d",
    "name": "Sotto IAM API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login User",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Should return access token\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.accessToken).to.be.a('string');",
              "});"
            ],
            "type": "text/javascript",
            "packages": {}
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@sotto.id\",\n  \"password\": \"SuperSecretPassword123\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/iam/login",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "iam",
            "login"
          ]
        }
      },
      "response": []
    }
  ]
}
```

> [!WARNING]
> **Kelemahan Kode Postman:**
> - Struktur JSON sangat rumit dan penuh dengan *escape character* (seperti `\n` dan `\"` di dalam body request).
> - Menulis atau mengedit file ini secara manual hampir mustahil; Anda dipaksa menggunakan GUI Postman.
> - Semua request disimpan dalam **satu file koleksi tunggal**. Jika koleksi Anda berisi 50 request, ukuran JSON-nya bisa mencapai ribuan baris, membuatnya mustahil untuk dipreview saat melakukan *Code Review*.

---

## 2. Perbandingan Fitur Utama

| Kriteria | Bruno 🐶 | Postman 🧡 |
| :--- | :--- | :--- |
| **Format Penyimpanan** | Plain-text `.bru` (Satu file untuk setiap satu request). | JSON raksasa tunggal untuk seluruh koleksi. |
| **Git Version Control** | **Sangat Baik.** Diff sangat bersih karena berformat teks biasa. Tidak ada merge conflict yang tak masuk akal. | **Sangat Buruk.** Perubahan kecil (seperti merapikan spasi) memicu perubahan ID otomatis yang memicu konflik Git raksasa. |
| **Kemudahan Edit Manual** | Sangat mudah. Cukup buka VS Code atau teks editor favorit Anda. | Sulit dan berisiko merusak struktur JSON koleksi jika diedit manual. |
| **Kolaborasi Tim** | Berbagi lewat Git Repository. Perubahan API langsung dilacak bersama source code proyek. | Harus sinkron lewat Cloud Postman (butuh akun/tim berbayar untuk kolaborasi yang nyaman). |
| **Scripting & Test** | Menggunakan Javascript standar tanpa batasan sandbox yang ketat. | Menggunakan sandbox Javascript milik Postman (`pm.*`). |
| **Privacy & Security** | Data tetap lokal di komputer Anda (Local-first). Sangat aman untuk API internal perusahaan. | Data diunggah ke cloud Postman secara default. |
| **Lisensi & Ketergantungan** | Open-source (MIT), sepenuhnya gratis, tanpa paksaan cloud lock-in. | Freemium, makin ke sini makin membatasi fitur offline dan memaksa langganan cloud. |

---

## 3. Analisis Mengapa Bruno "Lebih Enak" untuk Didokumentasikan

### 1. Kolaborasi Git Berbasis Folder (Folder-based Git Collaboration)
Di Bruno, struktur folder di API client Anda merepresentasikan struktur folder asli di komputer Anda. 
Jika Anda membuat folder bernama `iam` dan file request bernama `login.bru`, struktur penyimpanannya di repository adalah:
```text
collection/
├── iam/
│   ├── login.bru
│   └── register.bru
└── bruno.json
```
Siapapun dalam tim Anda yang melakukan `git pull` akan langsung mendapatkan dokumentasi terbaru dan bisa langsung menjalankannya tanpa perlu mengimpor file secara manual dari web Postman.

### 2. Diffs yang Sangat Jelas Saat Code Review
Jika ada perubahan tipe data (misal: penambahan field baru `username` di body request), perbandingannya di Git Pull Request akan terlihat sebersih ini:

```diff
 body:json {
   {
     "email": "user@sotto.id",
     "password": "SuperSecretPassword123",
+    "username": "sottodev"
   }
 }
```

Bandingkan dengan Postman yang akan menghasilkan puluhan baris diff JSON acak akibat perubahan auto-generated metadata dan format string ter-escape.

### 3. Ekosistem Terbuka
Bruno menyimpan segala sesuatunya dalam format yang terbuka. Jika Anda ingin melakukan perubahan massal (*bulk edit*), Anda tinggal menggunakan fitur *Find and Replace* bawaan VS Code pada folder `.bru` Anda. Di Postman, Anda harus melakukan klik manual satu per satu pada GUI mereka atau menulis skrip parser JSON yang rumit.

---

## Kesimpulan: Pemenangnya adalah Bruno! 🎉

Bagi tim developer modern yang mengedepankan kolaborasi berbasis Git, kecepatan, kesederhanaan, dan kebebasan, **Bruno adalah pemenangnya**. 

Bruno menghilangkan seluruh frustrasi yang biasanya hadir saat mengelola dokumentasi API dengan Postman (seperti keharusan masuk akun cloud, batasan workspace gratis, dan konflik Git). Dengan format `.bru` yang elegan, dokumentasi API Anda sekarang menjadi **bagian integral dari source code** yang terdokumentasi dan ter-track secara alami di Git.
