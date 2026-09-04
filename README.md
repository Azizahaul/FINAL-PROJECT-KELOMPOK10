# Product Requirements Document (PRD)
## Sistem Pemesanan Lapangan Berbasis AI Chatbot (Nia)

| | |
|---|---|
| **Nama Produk** | Sistem Pemesanan Lapangan — Smart Assistant "Nia" |
| **Jenis Dokumen** | PRD (Product Requirements Document) |
| **Mata Kuliah** | PAW (Pengembangan Aplikasi Web) — Final Project |
| **Kelompok** | Kelompok 10 |
| **Repositori** | github.com/Azizahaul/FINAL-PROJECT-KELOMPOK10 |
| **Drive** | [Link Drive](https://drive.google.com/drive/folders/1uJU0F-iA-Fo2A1soCXdF_mfS8M2FmG_n?usp=sharing) |
| **Versi Dokumen** | 1.0 |
| **Status** | Draft untuk review tim |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang
Pelanggan yang ingin bermain futsal/mini soccer biasanya harus mengecek jadwal ketersediaan lapangan secara manual — melihat kalender satu per satu atau menghubungi pengelola langsung — yang kurang efisien terutama saat mencari slot dadakan. Sistem ini dibangun untuk menyederhanakan proses tersebut lewat **Smart Assistant "Nia"**, chatbot berbasis NLP yang memungkinkan pelanggan mencari ketersediaan lapangan hanya dengan kalimat bahasa sehari-hari, lalu diarahkan langsung ke slot yang sesuai untuk diproses lebih lanjut di halaman pemesanan biasa.

### 1.2 Tujuan Produk
- Mempercepat proses pencarian ketersediaan lapangan lewat percakapan bahasa alami, tanpa perlu menelusuri kalender manual.
- Mengarahkan pelanggan langsung ke slot yang relevan lewat tautan reservasi, sehingga proses booking tetap cepat meski chatbot hanya membantu tahap pencarian.
- Memudahkan pengelola lapangan mengelola jadwal, transaksi, dan validasi pembayaran secara terpusat.
- Menjadi capstone project PAW yang mendemonstrasikan integrasi NLP (Flowise + Gemini API) untuk mengekstrak parameter terstruktur (waktu/tanggal) dari kalimat bebas pengguna.

### 1.3 Target Pengguna
| Peran | Deskripsi |
|---|---|
| **Pelanggan/Pemain** | Bertanya ke chatbot Nia soal ketersediaan lapangan, mengikuti tautan ke halaman pemesanan, melakukan pemesanan & pembayaran |
| **Admin/Operator** | Login, mengelola jadwal lapangan, memvalidasi pemesanan & bukti pembayaran |

---

## 2. Ruang Lingkup (Scope)

### 2.1 In-Scope
- **AI Chatbot (Nia)** — pelanggan bertanya ketersediaan lapangan dengan bahasa sehari-hari
- Integrasi **Flowise AI + Gemini API** untuk NLP: mengekstrak parameter waktu/tanggal dari kalimat pengguna menjadi format query terstruktur (JSON)
- **Automated Database Filtering** — sistem mengecek ketersediaan slot secara real-time berdasarkan hasil ekstraksi NLP
- **Direct Booking Link** — chatbot memberikan tautan yang mengarah ke halaman pemesanan biasa dengan slot yang sudah terisi otomatis sesuai hasil pencarian (chatbot **tidak** menyelesaikan transaksi pemesanan di dalam chat itu sendiri)
- Halaman pemesanan (booking page) reguler — tempat pelanggan menyelesaikan detail pemesanan setelah diarahkan dari chatbot (atau diakses langsung tanpa lewat chatbot)
- Manajemen pemesanan & pembayaran (online/offline — transfer/COD)
- Konfirmasi bukti pembayaran & validasi jadwal bermain oleh admin/operator

### 2.2 Out-of-Scope (untuk versi final project ini)
- **Pemesanan langsung diselesaikan di dalam chat** — chatbot Nia hanya membantu tahap pencarian ketersediaan dan mengarahkan ke halaman booking; proses pengisian detail pemesanan dan pembayaran tetap dilakukan di halaman pemesanan biasa, bukan dalam alur percakapan
- Payment gateway otomatis (pembayaran online real-time) — pembayaran dicatat sebagai transfer manual (upload bukti) atau COD, divalidasi admin
- Aplikasi mobile native
- Multi-cabang/multi-venue dalam satu sistem
- Sistem membership/loyalty pelanggan

---

## 3. Tech Stack

*(Belum disebutkan eksplisit oleh tim — berikut asumsi awal yang perlu dikonfirmasi, konsisten dengan pola project PAW lain)*

| Layer | Teknologi |
|---|---|
| Backend | *(perlu dikonfirmasi tim — Express.js/PHP, dsb.)* |
| Database | *(perlu dikonfirmasi tim)* — menyimpan data lapangan, jadwal/slot, pemesanan, dan riwayat chat |
| Frontend/View | HTML + CSS/Bootstrap, dengan widget chat dan halaman pemesanan reguler (form/kalender slot) |
| Orkestrasi NLP | **Flowise AI** — mengatur alur ekstraksi parameter dari kalimat pengguna |
| AI Engine | **Google Gemini API** — model di balik Flowise untuk memahami bahasa alami dan menghasilkan output terstruktur (JSON) |

> **Catatan arsitektur:** Alur chatbot Nia di project ini punya 2 tahap berbeda yang perlu dipisahkan jelas — (1) **NLP extraction**: kalimat bebas pengguna → parameter terstruktur (tanggal, jam, mungkin jenis lapangan) via Flowise + Gemini, dan (2) **query & redirect**: parameter tadi dipakai untuk query database ketersediaan, lalu sistem mengembalikan tautan ke halaman pemesanan yang sudah pre-filled sesuai slot yang cocok. Chatbot **tidak** perlu memiliki logic pemesanan/transaksi sendiri — cukup logic pencarian dan penyusunan link, karena transaksi tetap ditangani halaman pemesanan reguler (booking page biasa). Ini membuat scope chatbot lebih ringkas dibanding chatbot yang harus menyelesaikan pemesanan sepenuhnya dalam percakapan.

---

## 4. Struktur Tim & Pembagian Kerja

| Anggota | NIM | Kemungkinan Fokus *(draft awal, silakan disesuaikan tim)* |
|---|---|---|
| M Zidane Al Hakim | 20240140084 | Autentikasi & manajemen jadwal lapangan (admin) |
| Nur Natasya Alia | 20240140094 | Chatbot Nia — integrasi Flowise & Gemini API (NLP extraction) |
| Azizah Aulia R Hamid | 20240140103 | Automated database filtering & direct booking link, halaman pemesanan |
| Rachel Nova Sari | 20240140241 | Manajemen pemesanan & pembayaran, validasi admin/operator |

> Catatan: pembagian di atas hanya draft berdasarkan urutan fitur — silakan tim diskusikan ulang siapa pegang bagian mana.

---

## 5. User Stories

| ID | Sebagai | Saya ingin | Agar |
|---|---|---|---|
| US-01 | Pelanggan | Bertanya ke chatbot Nia dengan bahasa sehari-hari soal ketersediaan lapangan | Tidak perlu mencari manual di kalender jadwal |
| US-02 | Pelanggan | Diberi tautan langsung ke slot yang tersedia sesuai pertanyaan saya | Bisa langsung lanjut memesan tanpa mencari ulang |
| US-03 | Pelanggan | Menyelesaikan detail pemesanan di halaman booking biasa | Punya kontrol penuh untuk mengecek/mengubah detail sebelum submit |
| US-04 | Pelanggan | Mengunggah bukti transfer atau memilih COD | Metode pembayaran saya fleksibel sesuai kondisi |
| US-05 | Admin/Operator | Login ke dashboard | Bisa mengelola jadwal dan pemesanan |
| US-06 | Admin/Operator | Mengelola jadwal/slot lapangan | Ketersediaan yang ditampilkan chatbot maupun halaman booking selalu akurat |
| US-07 | Admin/Operator | Memvalidasi bukti pembayaran dan konfirmasi jadwal bermain | Pemesanan yang masuk benar-benar sah sebelum slot dikunci untuk pelanggan tersebut |

---

## 6. Kebutuhan Fungsional (Functional Requirements)

### 6.1 AI Chatbot (Nia) — Pencarian Ketersediaan
- FR-1.1: Chatbot Nia dapat diakses dari halaman utama, tanpa perlu login untuk sekadar bertanya ketersediaan
- FR-1.2: Pelanggan dapat mengetik pertanyaan bebas seputar ketersediaan, misal "Cari lapangan kosong buat besok jam 4 sore"
- FR-1.3: Chatbot **hanya menjawab seputar ketersediaan lapangan** — tidak menerima input pemesanan/transaksi di dalam percakapan (sesuai scope, lihat bagian 2.1)
- FR-1.4: Jika slot yang diminta tidak tersedia, chatbot menampilkan slot alternatif terdekat (tanggal/jam berbeda) jika ada

### 6.2 Integrasi Flowise AI & Gemini API — Ekstraksi Parameter (NLP)
- FR-2.1: Sistem meneruskan kalimat pengguna ke flow yang dikonfigurasi di Flowise, yang memanggil Gemini API untuk memahami maksud kalimat
- FR-2.2: Hasil pemrosesan NLP mengekstrak parameter waktu/tanggal (dan jenis lapangan jika disebutkan) dari kalimat bebas, dikonversi menjadi format **query JSON terstruktur** (misal `{ "tanggal": "2026-09-02", "jam": "16:00", "jenis_lapangan": null }`)
- FR-2.3: Jika parameter yang diekstrak tidak lengkap (misal tanggal disebut tapi jam tidak), chatbot menanyakan klarifikasi sebelum melanjutkan ke pencarian
- FR-2.4: Sistem menangani kasus kalimat yang tidak dapat diekstrak dengan baik (ambigu/di luar topik ketersediaan) dengan pesan fallback yang sopan

### 6.3 Automated Database Filtering & Direct Booking Link
- FR-3.1: Query JSON hasil ekstraksi NLP (FR-2.2) digunakan untuk memfilter data jadwal/slot lapangan di database secara real-time
- FR-3.2: Sistem menampilkan hasil pencarian (slot yang tersedia sesuai kriteria) dalam balasan chatbot, minimal berupa ringkasan (tanggal, jam, lapangan yang tersedia)
- FR-3.3: Chatbot menyertakan **tautan langsung (direct link)** ke halaman pemesanan reguler dengan slot yang dimaksud sudah terisi otomatis (pre-filled), sehingga pelanggan tidak perlu mencari ulang secara manual di halaman booking
- FR-3.4: Jika tidak ditemukan slot yang cocok sama sekali, chatbot menginformasikan hal tersebut tanpa memberi tautan yang tidak valid

### 6.4 Manajemen Pemesanan & Pembayaran (Halaman Booking Reguler)
- FR-4.1: Pelanggan dapat mengakses halaman pemesanan baik langsung (tanpa lewat chatbot) maupun via tautan dari chatbot Nia (dengan slot ter-prefill)
- FR-4.2: Pelanggan mengisi/mengonfirmasi detail pemesanan (nama, kontak, slot, jenis lapangan) di halaman ini
- FR-4.3: Pelanggan memilih metode pembayaran: transfer (unggah bukti) atau COD (bayar di tempat)
- FR-4.4: Setiap pemesanan tersimpan dengan status (menunggu konfirmasi/dikonfirmasi/dibatalkan)
- FR-4.5: Admin/operator dapat meninjau bukti pembayaran yang diunggah dan mengonfirmasi/menolak pemesanan
- FR-4.6: Admin/operator dapat memvalidasi jadwal bermain (memastikan slot benar-benar terkunci untuk pelanggan yang sudah dikonfirmasi)

### 6.5 Manajemen Jadwal Lapangan (Admin)
- FR-5.1: Admin dapat mengatur data lapangan (nama, jenis, harga per slot)
- FR-5.2: Admin dapat mengatur jadwal/slot yang tersedia per lapangan (hari, jam operasional, blokir slot tertentu jika perlu maintenance)
- FR-5.3: Slot yang sudah dikonfirmasi pemesanannya otomatis tidak muncul lagi sebagai "tersedia" di pencarian chatbot maupun halaman booking

---

## 7. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Usability** | Perpindahan dari chatbot ke halaman booking harus mulus — slot yang sudah dicari di chat tidak perlu dicari ulang manual oleh pelanggan (FR-3.3) |
| **Akurasi Ekstraksi NLP** | Ekstraksi tanggal/jam dari kalimat sehari-hari (termasuk istilah relatif seperti "besok", "lusa", "jam 4 sore") harus diuji dengan berbagai variasi kalimat sebelum finalisasi, karena ini menentukan akurasi seluruh alur pencarian |
| **Konsistensi Data Real-Time** | Ketersediaan yang ditampilkan chatbot harus selalu sesuai kondisi database terkini — jangan sampai chatbot merekomendasikan slot yang ternyata baru saja dipesan pelanggan lain |
| **Performance** | Respons chatbot (proses NLP + query database) idealnya di bawah ~5–8 detik (mempertimbangkan ada hop tambahan lewat Flowise), tampilkan loading indicator |
| **Security** | Password admin di-hash, endpoint manajemen jadwal & validasi pembayaran hanya bisa diakses admin yang login, API key Gemini & endpoint Flowise tidak boleh exposed ke client-side |
| **Reliability** | Jika layanan Flowise/Gemini tidak dapat diakses, chatbot menampilkan pesan fallback yang jelas — pelanggan tetap dapat mengakses halaman booking secara manual tanpa bergantung pada chatbot |
| **Reliability (Konkurensi Slot)** | Slot tidak boleh double-booking jika dua pelanggan mengonfirmasi pemesanan pada slot yang sama secara hampir bersamaan — validasi ketersediaan ulang di server-side saat submit pemesanan, bukan hanya mengandalkan hasil pencarian chatbot yang mungkin sudah tidak up-to-date |
| **Maintainability** | Struktur folder backend konsisten (routes/controllers/models/views terpisah); konfigurasi flow di Flowise didokumentasikan agar mudah direplikasi anggota tim lain |
| **Compatibility** | Responsif untuk diakses dari HP maupun desktop |

---

## 8. Skema Data (Ringkasan Entitas)

- **Users (Admin/Operator)**: id, nama, username/email, password (hashed)
- **Fields** *(lapangan)*: id, nama, jenis (futsal/mini soccer), harga_per_slot
- **Schedules** *(jadwal/slot)*: id, field_id, tanggal, jam_mulai, jam_selesai, status (tersedia/terisi/diblokir)
- **Bookings** *(pemesanan)*: id, schedule_id, nama_pelanggan, kontak, metode_pembayaran (transfer/COD), bukti_pembayaran (path file, nullable untuk COD), status (menunggu konfirmasi/dikonfirmasi/dibatalkan), sumber (chatbot/langsung), created_at
- **ChatSessions**: id, session_identifier, created_at
- **ChatMessages**: id, session_id, pesan, role (user/ai), extracted_params (JSON hasil NLP, nullable), timestamp

---

## 9. Alur Utama (User Flow)

### 9.1 Alur Pelanggan — Cari Ketersediaan via Chatbot lalu Booking
1. Pelanggan buka chatbot Nia (tanpa login) → ketik pertanyaan, misal "cari lapangan kosong besok jam 4 sore"
2. Sistem kirim kalimat ke Flowise → Gemini API ekstrak parameter (tanggal, jam) → hasil jadi query JSON
3. Sistem query database jadwal berdasarkan parameter tadi
4. Jika ada slot cocok → chatbot tampilkan ringkasan + **tautan langsung ke halaman booking** dengan slot sudah terisi otomatis
5. Pelanggan klik tautan → diarahkan ke halaman pemesanan reguler dengan detail slot sudah ter-prefill
6. Pelanggan lengkapi data pemesanan (nama, kontak) dan pilih metode pembayaran
7. Pelanggan submit pemesanan → status "menunggu konfirmasi"
8. Admin tinjau bukti pembayaran/COD → konfirmasi pemesanan → slot terkunci resmi untuk pelanggan tersebut

### 9.2 Alur Pelanggan — Booking Langsung (Tanpa Chatbot)
1. Pelanggan buka halaman pemesanan reguler secara langsung
2. Pelanggan pilih lapangan, tanggal, dan jam secara manual dari tampilan jadwal/kalender
3. Lanjut ke proses yang sama seperti langkah 6–8 di atas

### 9.3 Alur Admin/Operator
1. Admin login → dashboard
2. Admin kelola data lapangan & jadwal/slot
3. Admin tinjau pemesanan yang masuk (baik dari chatbot maupun langsung)
4. Admin validasi bukti pembayaran/COD → konfirmasi atau tolak pemesanan
5. Admin pastikan jadwal bermain terkunci dengan benar untuk pemesanan yang sudah dikonfirmasi

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ekstraksi NLP salah menafsirkan tanggal/jam dari kalimat sehari-hari (misal "besok" dihitung dari zona waktu/hari yang salah) | Chatbot memberi tautan ke slot yang salah, pelanggan bingung | Uji dengan berbagai variasi kalimat waktu relatif dan absolut, pastikan referensi tanggal "hari ini" konsisten dengan waktu server saat parsing |
| Slot yang direkomendasikan chatbot sudah dipesan pelanggan lain saat pelanggan sampai di halaman booking (race condition) | Pelanggan kecewa, potensi double-booking jika tidak divalidasi ulang | Validasi ketersediaan slot lagi di server-side saat submit pemesanan (bukan hanya mengandalkan hasil pencarian chatbot yang sudah agak basi), tampilkan pesan jika slot ternyata sudah terisi |
| Flowise (jika di-hosting terpisah) tidak stabil saat demo | Fitur chatbot gagal, tapi pemesanan manual tetap harus bisa jalan | Pastikan halaman booking reguler berfungsi independen dari status Flowise (sesuai NFR Reliability), uji koneksi Flowise jauh-jauh hari sebelum demo |
| Batas scope chatbot (hanya cek ketersediaan, tidak booking langsung) berpotensi disalahpahami tim sebagai "chatbot kurang lengkap" | Anggota tim menambah scope tanpa sadar (misal mencoba bikin booking di chat) sehingga melebar dari rencana awal | Dokumentasikan jelas di awal bahwa fitur ini secara sengaja dibatasi hanya sampai pencarian + link (sesuai deskripsi project), agar development tidak melebar tanpa perlu |
| Tech stack belum disebutkan eksplisit oleh tim | PRD ini masih berisi asumsi yang mungkin tidak sesuai | Tim segera menyepakati dan mengisi bagian 3 sebelum development dimulai |

---

## 11. Kriteria Keberhasilan (Definition of Done)

- Chatbot Nia dapat menerima pertanyaan ketersediaan dalam bahasa sehari-hari dan mengekstrak parameter tanggal/jam dengan akurat lewat Flowise + Gemini API
- Hasil ekstraksi berhasil memfilter data jadwal secara real-time dan chatbot memberikan tautan langsung yang valid ke halaman pemesanan dengan slot ter-prefill
- Pelanggan dapat menyelesaikan pemesanan di halaman booking reguler, baik yang diarahkan dari chatbot maupun diakses langsung
- Sistem mencegah double-booking lewat validasi slot di server-side saat submit pemesanan
- Admin/operator dapat mengelola jadwal lapangan dan memvalidasi bukti pembayaran/COD dengan lancar
- UI responsif di desktop maupun HP
- Repository dapat dijalankan ulang tanpa error oleh dosen penguji (termasuk dokumentasi konfigurasi Flowise, jika relevan)

---

*Dokumen ini adalah PRD untuk Sistem Pemesanan Lapangan Berbasis AI Chatbot (Nia), Kelompok 10. Sesuai arahan tim, chatbot Nia secara sengaja dibatasi hanya membantu pencarian ketersediaan dan memberikan tautan ke halaman pemesanan biasa — proses pemesanan dan pembayaran tetap diselesaikan di halaman booking reguler, bukan di dalam chat. Bagian tech stack belum disebutkan tim secara eksplisit — perlu dikonfirmasi dan diisi sebelum development dimulai. Pembagian tugas masih berupa asumsi/draft — sesuaikan dengan kondisi tim yang sebenarnya.*
