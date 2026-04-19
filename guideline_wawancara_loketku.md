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

**[FOKUS: Pengelolaan Uang & Pencatatan]**

5. "Gimana cara kamu ngecek kalau peserta udah beneran transfer? Pernah ada kendala di bagian ini nggak? (Misal: bukti transfer palsu, mutasi nyangkut, dll)."

6. "Gimana cara kamu ngecatet siapa aja yang udah bayar? Pakai Excel, Google Sheets, atau tulis manual?"

7. "Pernah nggak ada selisih duit pas rekap? Misal di mutasi bank ada 50 transfer, tapi di catatan kamu cuma 48? Gimana cara kamu ngecek-nya?"

8. "Kalau ada peserta nanya 'Kak, saya udah transfer lho kok nggak ada di list?', gimana cara kamu ngecek-nya? Buka mutasi bank satu-satu?"

9. "Berapa lama waktu yang kamu habiskan buat rekap uang tiket dari awal sampai ketemu angka yang pas?"

10. "Kalau diukur dari skala 1 sampai 10 (1 = biasa aja, 10 = bikin stres banget), seberapa mengganggu sih masalah ngurusin tiket **dan duitnya** ini buat kamu dan tim?"

### Sesi 3: Menguji Solusi / Solution Fit (5 Menit)
*Tujuan: Memperkenalkan konsep Loketku dan melihat reaksi mereka terhadap solusi.*

**[DEMO MODE: Tunjukkan prototype langsung]**

7. "Oke, aku tunjukin prototype Loketku yang sudah bisa dipakai. Kamu tinggal masukin nama event, harga tiket, dan kuota. Terus platform ini ngasih kamu satu link."
8. "Peserta tinggal klik link itu, isi nama & email, bayar pakai QRIS atau Virtual Account *(note: untuk demo ini pembayaran masih simulasi)*, dan sistem otomatis ngecek pembayarannya. Kalau sukses, peserta langsung dapat e-ticket (QR Code) yang bisa ditunjukkan di lokasi."
9. "Kamu sebagai panitia tinggal lihat *dashboard* aja siapa yang udah bayar, berapa total uang masuk, dan bisa scan QR code di lokasi untuk check-in."

**[FOKUS: Pain Point Uang & Pencatatan]**

10. "Nah, gimana menurut kamu? Sistem kayak gini bakal ngilangin pusing ngecek mutasi dan rekap manual nggak?"

11. "Di dashboard Loketku, semua uang masuk tercatat otomatis — kamu tinggal lihat berapa total yang udah masuk, siapa aja yang udah bayar, dan berapa yang belum. Nggak perlu buka mutasi bank lagi. Ini ngebantu nggak?"

12. "Dari fitur yang aku tunjukin tadi, bagian mana yang menurut kamu paling ngebantu banget buat panitia?"

13. "Kira-kira, ada nggak alasan yang bikin kamu atau panitia lain *ragu* buat pakai sistem kayak gini? (Misal: takut uangnya nyangkut, gaptek, dll)."

### Sesi 4: Menguji Unique Value Proposition / UVP (3 Menit)
*Tujuan: Menguji daya tarik janji utama produk.*

**[FOKUS: Value Proposition Uang & Pencatatan]**

13. "Platform ini namanya **Loketku**. Janji utama (UVP) kami ke panitia adalah: **'Platform tiket event kampus dengan pencairan dana harian dan pelacakan jualan panitia otomatis. Bebas pusing cek mutasi, uang langsung bisa dipakai buat DP vendor.'**"

14. "Jadi begini: Uang tiket masuk ke sistem Loketku, kamu bisa langsung lihat di dashboard berapa totalnya. Nggak perlu rekap manual. Begitu ada yang bayar, langsung tercatat. Mau tarik dana juga bisa kapan aja, langsung cair ke rekening kamu."

15. "Pas denger kalimat itu, apakah kamu tertarik buat langsung pakai Loketku di event kamu selanjutnya?"

16. "Kenapa tertarik? / Kenapa nggak tertarik?"

17. "Kalau misalnya Loketku ngambil biaya admin Rp 2.000 - Rp 3.000 per tiket (yang dibebankan ke pembeli tiket, bukan ke panitia), menurut kamu itu wajar nggak? Bandingin sama waktu yang kamu hemat buat nggak perlu rekap manual berjam-jam."

### Penutup
"Terima kasih banyak ya [Nama] buat waktunya. *Insight* dari kamu ngebantu banget buat riset aku!"

---

## 🔗 Link Demo Prototype

**URL Production:** https://loketku-mvp.vercel.app/

**Quick Reference:** Buka file `DEMO_WAWANCARA.md` untuk step-by-step demo!

**Credentials Demo:**
- Login organizer: `admin@loketku.com` / `admin123`
- Demo event publik: `/event/demo`

**Catatan:**
- Data tersimpan di localStorage browser — persist sampai clear cache
- **PENTING:** Gunakan browser yang sama dari create → buy → scan
- QR code adalah placeholder CSS (belum generate QR real)
- Payment masih simulasi (untuk production: QRIS/VA)

---

### 📝 Format Catatan Hasil Wawancara (Untuk Laporan Anda)

*Gunakan format ini untuk merangkum hasil dari ke-5 responden Anda nanti.*

*   **Nama Responden:**
*   **Pengalaman Event:**
*   **Validasi Masalah:** (Valid / Tidak Valid) - *Catatan: ...*
*   **Validasi Solusi:** (Sesuai / Tidak Sesuai) - *Catatan: ...*
*   **Validasi UVP:** (Tertarik / Tidak Tertarik) - *Catatan: ...*
*   **Feedback Tambahan / Kekhawatiran Responden:** *Catatan: ...*

---

### 💰 Pain Points Pengelolaan Uang & Pencatatan (Checklist)

*Centang yang disebutkan responden:*

- [ ] Cek mutasi bank manual (buka app bank satu-satu)
- [ ] Bukti transfer palsu/fake
- [ ] Peserta claim udah transfer tapi nggak ada di list
- [ ] Rekap manual pakai Excel/Google Sheets
- [ ] Selisih duit pas rekap
- [ ] Habiskan waktu berjam-jam buat rekap
- [ ] Uang telat cair buat DP vendor
- [ ] Nggak ada sistem pelacakan otomatis
- [ ] Khawatir uang nyangkut di platform
- [ ] Lainnya: _____

**Skala Masalah (1-10):** ___

**Waktu yang Dihabiskan untuk Rekap:** ___ menit/jam
