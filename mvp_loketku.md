# 🚀 Rancangan Minimum Viable Product (MVP): Loketku

**Visi MVP:** Membangun alur paling inti dari pembuatan event hingga *check-in* peserta dengan intervensi manual seminimal mungkin. Kita menggunakan prinsip **YAGNI (You Aren't Gonna Need It)** — hanya membangun fitur yang benar-benar menyelesaikan masalah utama responden.

---

## 💎 Bagaimana MVP Ini Mewujudkan UVP?

**UVP Kita:** *"Platform tiket event kampus dengan **pencairan dana harian** dan **pelacakan jualan panitia otomatis**. Bebas pusing cek mutasi, uang langsung bisa dipakai buat DP vendor."*

MVP ini dirancang secara spesifik untuk membuktikan UVP tersebut melalui pilar utama:

1. **"Pencairan dana harian"** diwujudkan melalui **Daily Payout System**. Mengatasi masalah terbesar panitia yang butuh uang tunai sebelum hari H untuk membayar vendor.
2. **"Pelacakan jualan panitia otomatis"** diwujudkan melalui **Referral Tracking & Leaderboard**. Menghilangkan kerepotan merekap target jualan masing-masing anggota panitia.
3. **"Bebas pusing cek mutasi dan rekap Excel"** diwujudkan melalui **Automated Payment (QRIS)** dan **Auto E-Ticket**. Sistem yang bekerja merekap data dan memverifikasi pembayaran, bukan manusia.

---

## 🎯 Pemetaan Masalah vs Fitur MVP

| Masalah Utama (Pain Points) | Fitur Solusi di MVP |
| :--- | :--- |
| Uang tiket tertahan di platform sampai event selesai, padahal butuh untuk DP vendor | **Daily Payout System:** Integrasi *payment gateway* (seperti Xendit xenPlatform) yang memungkinkan dana penjualan tiket cair ke rekening panitia setiap hari (atau H+1). |
| Pusing merekap target jualan tiket masing-masing anggota panitia | **Referral Tracking & Leaderboard:** Setiap panitia bisa membuat *link* unik (misal: `loketku.com/pensi?ref=budi`). *Dashboard* otomatis menampilkan peringkat penjualan tiap panitia. |
| Bikin form pendaftaran ribet (Google Form) | **Instant Event Page:** Form sederhana (Nama Event, Harga, Kuota, Poster) yang langsung menghasilkan *link* unik. |
| Cek mutasi manual & rawan bukti transfer palsu | **Automated Payment (QRIS/VA):** Pembeli bayar, status otomatis berubah jadi "Lunas" tanpa perlu *upload* struk. |
| Rekap data peserta & kirim tiket satu-satu | **Auto E-Ticket & Dashboard:** Sistem otomatis mengirim email berisi QR Code tiket ke pembeli. |
| *Check-in* hari H pakai kertas/absen manual | **Web-based QR Scanner:** Fitur *scanner* sederhana di dalam web/aplikasi panitia untuk *scan* tiket peserta saat acara berlangsung. |

---

## 🔄 User Flow (Alur Pengguna) MVP

### 1. Alur Panitia (Event Creator)
1. **Daftar/Login** menggunakan Email/Google.
2. **Buat Event:** Mengisi detail dasar (Nama, Tanggal, Lokasi, Harga Tiket, Kuota) dan mendaftarkan rekening pencairan.
3. **Generate Referral Links:** Ketua panitia membagikan *link* utama, atau anggota panitia men-*generate* *link* unik mereka sendiri.
4. **Monitor:** Membuka *dashboard* untuk melihat tiket terjual, *leaderboard* panitia, dan total dana yang siap dicairkan hari itu.
5. **Hari H (Check-in):** Membuka menu *Scanner* di HP panitia untuk memindai QR Code peserta yang datang.

### 2. Alur Pembeli (Ticket Buyer)
1. **Buka Link:** Mengklik *link* event (bisa *link* utama atau *link referral* panitia).
2. **Isi Data:** Memasukkan Nama, Email, dan No. WhatsApp.
3. **Bayar:** Memilih metode pembayaran (Fokus MVP: QRIS saja agar cepat dan murah).
4. **Terima Tiket:** Mendapatkan email konfirmasi berisi E-Ticket (QR Code).
5. **Hari H:** Menunjukkan QR Code di email kepada panitia untuk di-*scan*.

---

## 🚫 Out of Scope (TIDAK Dimasukkan di MVP)
*Untuk menjaga MVP tetap ramping dan cepat diluncurkan, fitur-fitur ini ditunda ke fase selanjutnya:*
1. **Fitur Seating/Pilih Kursi:** Terlalu kompleks untuk event kampus/gigs yang biasanya *free standing*.
2. **Aplikasi Mobile (Android/iOS) untuk Pembeli:** Cukup berbasis Web (Mobile-Responsive) agar pembeli tidak perlu repot *download* aplikasi hanya untuk beli 1 tiket.
3. **Sistem Promo/Diskon/Voucher yang Rumit:** Fokus ke harga *flat* atau *early bird* sederhana dulu.
4. **Custom Domain untuk Event:** Cukup menggunakan *sub-path* dari domain utama Loketku.
5. **Fitur Refund Otomatis:** Jika ada *refund*, dilakukan secara manual oleh panitia di luar sistem untuk sementara waktu.

---

## 🛠️ Rekomendasi Tech Stack (Untuk Tahap Development Nanti)
*   **Frontend:** Astro + React + TailwindCSS (Sangat cepat, SEO friendly, dan interaktif di bagian yang dibutuhkan).
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage) - Sangat cepat untuk membangun MVP.
*   **Payment Gateway:** Midtrans atau Xendit (Dukungan QRIS dan *split payment/routing* yang sangat baik).
*   **Email Service:** Resend atau SendGrid (Untuk pengiriman E-Ticket).
