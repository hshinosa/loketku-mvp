# 🎬 Demo Wawancara - Loketku

**Quick Reference Card untuk Demo Interview**

---

## 🔗 Quick Links

| Halaman | URL | Keterangan |
|---------|-----|------------|
| **Homepage** | https://loketku-mvp.vercel.app/ | Landing page |
| **Login** | https://loketku-mvp.vercel.app/auth/login | Login organizer |
| **Dashboard** | https://loketku-mvp.vercel.app/dashboard/create-event | Create event |
| **Demo Event** | https://loketku-mvp.vercel.app/event/demo | Event sample untuk testing |
| **Scanner** | https://loketku-mvp.vercel.app/dashboard/scanner/demo | Check-in tickets |

---

## 🔐 Credentials

```
Email: admin@loketku.com
Password: admin123
```

---

## 📋 Flow Demo Lengkap (5 Menit)

### Step 1: Login (30 detik)
```
1. Buka: https://loketku-mvp.vercel.app/auth/login
2. Login dengan credentials di atas
3. Redirect ke /dashboard/create-event
```

### Step 2: Create Event (1 menit)
```
1. Isi form:
   - Judul: "Seminar Teknologi 2026"
   - Deskripsi: "Event teknologi tahunan"
   - Tanggal: Pilih tanggal besok
   - Lokasi: "Campus Hall"
   - Harga: 50000
   - Kuota: 100
2. Klik "Buat Event & Generate Link"
3. Copy link event yang muncul
```

### Step 3: Beli Tiket (1 menit)
```
1. Buka link event di tab baru
2. Scroll ke form pembelian
3. Isi:
   - Nama: "Budi Santoso"
   - Email: "budi@example.com"
4. Klik "Beli Tiket Sekarang"
5. **CATAT ID TIKET** yang muncul (format: tkt_xxx)
```

### Step 4: Tampilkan E-Ticket (30 detik)
```
1. Halaman otomatis redirect ke /ticket/[id]
2. Tunjukkan e-ticket dengan QR code placeholder
3. Highlight: "Status: VALID"
```

### Step 5: Check-in dengan Scanner (1 menit)
```
1. Buka: /dashboard/scanner/[event-id]
2. Masukkan ID tiket yang dicatat tadi
3. Klik "Check-in Tiket"
4. ✅ Muncul: "Tiket valid! Berhasil check-in"
5. Tunjukkan nama pembeli: "Budi Santoso"
```

### Step 6: Dashboard Organizer (1 menit)
```
1. Buka: /dashboard/[event-id]
2. Tunjukkan stats:
   - Total Pendapatan: Rp 50.000
   - Tiket Terjual: 1
   - Sisa Tiket: 99
3. Tunjukkan "Daftar Pembeli Terbaru": Budi Santoso
```

---

## ⚡ Quick Demo (2 Menit) - Pakai Demo Event

Kalau waktu sempit, pakai demo event yang sudah ada:

```
1. Buka: https://loketku-mvp.vercel.app/event/demo
2. Beli tiket (nama: "Test", email: "test@test.com")
3. Catat ID tiket
4. Buka: https://loketku-mvp.vercel.app/dashboard/scanner/demo
5. Masukkan ID → Check-in ✅
```

---

## 🎯 Talking Points untuk Interview

### Problem Statement
> "Panitia event kampus masih pakai Google Form + cek mutasi manual. Ribet, rawan salah, dan peserta harus tunggu konfirmasi lama."

### Solution
> "Loketku: platform tiket event dengan pembayaran otomatis. Peserta bayar QRIS/VA → langsung dapat e-ticket. Panitia tinggal lihat dashboard siapa yang udah bayar."

### Unique Value Proposition
> "Bebas pusing cek mutasi. Uang langsung cair ke rekening panitia, bisa dipakai buat DP vendor. Dashboard real-time lacak penjualan."

### Business Model
> "Biaya admin Rp 2.000-3.000 per tiket (dibebankan ke pembeli, bukan panitia)."

---

## 🛠️ Technical Notes

**Storage:** localStorage browser (data persist di browser user)
**Backend:** None - full client-side untuk demo
**Payment:** Simulasi (untuk production: QRIS/VA via payment gateway)
**QR Code:** CSS placeholder (untuk production: generate QR real)

**Limitation Demo:**
- Data hanya ada di browser yang dipakai
- Clear cache = data hilang
- Tidak ada payment gateway real

---

## 📊 Metrics untuk Tunjukkan

Saat interview, highlight:
1. ✅ **Speed:** Create event → live dalam 30 detik
2. ✅ **Simplicity:** 3 langkah dari create sampai jual tiket
3. ✅ **Automation:** Pembayaran otomatis (simulasi)
4. ✅ **Real-time:** Dashboard update instant
5. ✅ **Mobile-friendly:** Responsive di HP

---

## 🆘 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Event tidak muncul | Pastikan create event di browser yang sama |
| Tiket tidak valid | Cek ID tiket - harus sama persis dengan yang di e-ticket |
| Scanner error | Gunakan event ID yang sama saat beli tiket |
| Data hilang | Jangan clear browser cache/localStorage |

---

## 📞 Backup Plan

Kalau demo gagal:
1. Tunjukkan screenshot flow yang sudah dibuat
2. Jelaskan architecture: "Client-side storage untuk demo, production pakai Supabase"
3. Highlight: "Yang penting adalah flow UX - create → buy → check-in semua jalan"

---

**Good luck! 🚀**

*Last updated: $(date)*
