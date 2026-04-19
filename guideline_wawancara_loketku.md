# 📋 Guideline Validasi Ide: Loketku (Micro-Ticketing)

**Dokumen ini berisi panduan lengkap untuk melakukan wawancara validasi *Problem-Solution Fit* untuk ide startup "Loketku" (Platform Micro-Ticketing untuk Event Kampus/Komunitas).**

## 🎯 Tujuan Validasi
1. Membuktikan bahwa masalah pengelolaan tiket manual (Google Form + Cek Mutasi) benar-benar dirasakan dan menyakitkan bagi panitia event kecil.
2. Memastikan solusi yang ditawarkan (Loketku) relevan dan menyelesaikan masalah tersebut.
3. Menguji apakah *Unique Value Proposition* (UVP) cukup kuat untuk membuat target pengguna mau mencoba produk ini.

## 👥 Kriteria Responden (Minimal 5 Orang)
Pastikan responden yang Anda wawancarai memenuhi kriteria berikut agar *insight* yang didapat valid:
*   **Wajib:** Pernah menjadi panitia acara (kampus, komunitas, gigs, workshop) dalam 1-2 tahun terakhir.
*   **Wajib:** Pernah terlibat langsung dalam divisi Ticketing, Registrasi, Bendahara, atau Ketua Pelaksana.
*   **Nilai Plus:** Pernah menggunakan metode manual (Google Form + WhatsApp) untuk menjual tiket.

## ⚙️ Aturan Main Wawancara (Do's & Don'ts)
* **DO:** Biarkan responden bercerita lebih banyak (aturan 80/20: mereka bicara 80%, Anda 20%).
* **DO:** Gali emosi mereka saat menceritakan masalah (tanyakan "kenapa itu menyebalkan?").
* **DON'T:** Jangan langsung "menjual" ide Loketku di awal. Gali masalahnya dulu.
* **DON'T:** Jangan arahkan jawaban mereka (hindari pertanyaan *leading* seperti "Pasti capek kan cek mutasi manual?").

## 💻 Demo Prototype (Untuk Wawancara)
**PENTING:** MVP yang tersedia adalah **click-through prototype** tanpa integrasi pembayaran nyata. Gunakan untuk menunjukkan flow, bukan untuk transaksi real.

**Flow Demo yang Tersedia:**
1. Login organizer: `admin@loketku.com` / `admin123`
2. Create event → dapat link publik
3. Buka link publik → simulasi beli tiket (tanpa pembayaran)
4. Tampil e-ticket dengan QR code
5. Dashboard organizer: lihat stats penjualan
6. Scanner: simulasi check-in QR code

**Cara Sampaikan ke Responden:**
> "Ini adalah prototype yang bisa kamu klik. Untuk demo hari ini, pembayaran kami simulasi saja — tapi flow-nya sama seperti produk final yang akan terintegrasi QRIS/VA."

---

# 🎤 Script & Daftar Pertanyaan Wawancara

*Gunakan script ini secara berurutan saat mewawancarai responden.*

### Sesi 1: Pemanasan & Kualifikasi (2-3 Menit)
*Tujuan: Memastikan responden sesuai kriteria dan membuat mereka nyaman.*

1. "Halo [Nama], boleh ceritakan sedikit pengalaman kamu waktu jadi panitia event [Sebutkan event yang pernah mereka buat]? Waktu itu kamu di divisi apa?"
2. "Di event itu, sistem penjualan tiket atau pendaftarannya pakai cara apa? (Misal: Google Form, jual langsung, atau platform lain?)"

### Sesi 2: Menggali Masalah / Problem Validation (5-7 Menit)
*Tujuan: Memvalidasi apakah masalah yang kita asumsikan benar-benar terjadi dan seberapa parah dampaknya.*

3. "Waktu ngurusin tiket pakai cara [sebutkan cara mereka di pertanyaan 2], coba ceritain dong proses dari awal orang daftar sampai mereka dapat tiketnya itu gimana?"
4. "Dari semua proses itu, bagian mana yang menurut kamu paling ribet, capek, atau membuang waktu?"
5. *(Jika mereka tidak menyebutkan soal pembayaran)* "Gimana cara kamu ngecek kalau peserta udah beneran transfer? Pernah ada kendala di bagian ini nggak? (Misal: bukti transfer palsu, mutasi nyangkut, dll)."
6. "Kalau diukur dari skala 1 sampai 10 (1 = biasa aja, 10 = bikin stres banget), seberapa mengganggu sih masalah ngurusin tiket manual ini buat kamu dan tim?"

### Sesi 3: Menguji Solusi / Solution Fit (5 Menit)
*Tujuan: Memperkenalkan konsep Loketku dan melihat reaksi mereka terhadap solusi.*

**[DEMO MODE: Tunjukkan prototype langsung]**

7. "Oke, aku tunjukin prototype Loketku yang sudah bisa dipakai. Kamu tinggal masukin nama event, harga tiket, dan kuota. Terus platform ini ngasih kamu satu link."
8. "Peserta tinggal klik link itu, isi nama & email, bayar pakai QRIS atau Virtual Account *(note: untuk demo ini pembayaran masih simulasi)*, dan sistem otomatis ngecek pembayarannya. Kalau sukses, peserta langsung dapat e-ticket (QR Code) yang bisa ditunjukkan di lokasi."
9. "Kamu sebagai panitia tinggal lihat *dashboard* aja siapa yang udah bayar, berapa tiket terjual, dan bisa scan QR code di lokasi untuk check-in."
10. "Menurut kamu, apakah sistem seperti ini bakal menyelesaikan masalah-masalah yang kamu ceritain tadi?"
11. "Dari fitur yang aku tunjukin tadi, bagian mana yang menurut kamu paling ngebantu banget buat panitia?"
12. "Kira-kira, ada nggak alasan yang bikin kamu atau panitia lain *ragu* buat pakai sistem kayak gini? (Misal: takut uangnya nyangkut, gaptek, dll)."

### Sesi 4: Menguji Unique Value Proposition / UVP (3 Menit)
*Tujuan: Menguji daya tarik janji utama produk.*

13. "Platform ini namanya **Loketku**. Janji utama (UVP) kami ke panitia adalah: **'Platform tiket event kampus dengan pencairan dana harian dan pelacakan jualan panitia otomatis. Bebas pusing cek mutasi, uang langsung bisa dipakai buat DP vendor.'**"
14. "Pas denger kalimat itu, apakah kamu tertarik buat langsung pakai Loketku di event kamu selanjutnya?"
15. "Kenapa tertarik? / Kenapa nggak tertarik?"
16. "Kalau misalnya Loketku ngambil biaya admin Rp 2.000 - Rp 3.000 per tiket (yang dibebankan ke pembeli tiket, bukan ke panitia), menurut kamu itu wajar nggak?"

### Penutup
"Terima kasih banyak ya [Nama] buat waktunya. *Insight* dari kamu ngebantu banget buat riset aku!"

---

## 🔗 Link Demo Prototype

**URL Production:** https://loketku-mvp.vercel.app/

**Credentials Demo:**
- Login organizer: `admin@loketku.com` / `admin123`
- Demo event publik: `/event/demo`

**Catatan:**
- Data tersimpan di memory — hilang jika Vercel restart
- Untuk wawancara, buat event baru setiap kali demo
- QR code adalah placeholder CSS (belum generate QR real)

---

### 📝 Format Catatan Hasil Wawancara (Untuk Laporan Anda)

*Gunakan format ini untuk merangkum hasil dari ke-5 responden Anda nanti.*

*   **Nama Responden:**
*   **Pengalaman Event:**
*   **Validasi Masalah:** (Valid / Tidak Valid) - *Catatan: ...*
*   **Validasi Solusi:** (Sesuai / Tidak Sesuai) - *Catatan: ...*
*   **Validasi UVP:** (Tertarik / Tidak Tertarik) - *Catatan: ...*
*   **Feedback Tambahan / Kekhawatiran Responden:** *Catatan: ...*
