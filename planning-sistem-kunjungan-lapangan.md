# Planning: Sistem Penjadwalan Kunjungan Lapangan Multi-Sektor

## 1. Ringkasan Proyek

**Tujuan:**
Mengatasi masalah petugas lapangan yang kesulitan menentukan prioritas kunjungan akibat jadwal yang tidak terstruktur, serta masalah klien yang merasa tidak mendapat kejelasan/estimasi kunjungan sehingga merasa instansi kurang bisa diandalkan.

**Karakteristik utama:**
Satu sistem yang dapat digunakan lintas sektor (kesehatan/homecare, servis elektronik, utilitas, survei properti, inspeksi, dll) melalui master data yang konfigurabel — bukan dihardcode per sektor.

**Target pengguna utama:**
- Petugas lapangan — butuh jadwal yang jelas urutan prioritasnya
- Klien/pemohon — butuh kejelasan status & estimasi waktu kunjungan
- Admin/koordinator — mengatur jadwal, master data, dan memonitor seluruh kunjungan

---

## 2. Fitur Final

### 🟢 Fitur Inti (MVP)

1. **Manajemen Jadwal Kunjungan**
   - Admin membuat & mengatur jadwal kunjungan
   - Pengurutan prioritas otomatis berdasarkan skor gabungan **waktu (urgensi)** dan **lokasi (jarak)**, dengan bobot yang dapat diatur berbeda per jenis layanan
   - Reschedule / pembatalan kunjungan
   - Deteksi bentrok jadwal petugas

2. **Status Kunjungan Real-time**
   - Petugas update status: belum berangkat → OTW → tiba di lokasi → selesai/gagal
   - Klien dapat memeriksa status kunjungan tanpa perlu login (via kode tiket/link)
   - Alasan terstruktur jika kunjungan gagal/tertunda

3. **Master Data Lintas Sektor**
   - Jenis layanan/kunjungan (nama, estimasi durasi, bobot prioritas waktu vs lokasi)
   - Kualifikasi/spesialisasi petugas (perawat, teknisi AC, surveyor, dll — dapat ditambah bebas)
   - Template checklist/formulir laporan berbeda per jenis layanan

4. **Manajemen Pengguna & Role**
   - Role: Admin, Petugas Lapangan, Klien
   - Profil petugas (kualifikasi, area kerja)

5. **Notifikasi**
   - Ke petugas: assignment baru
   - Ke klien: konfirmasi jadwal, reminder H-1, info petugas OTW
   - Ke admin: kunjungan gagal/terlambat

### 🟡 Fitur Lapisan Kedua

6. **Monitoring & Pelaporan**
   - Dashboard admin (progres kunjungan harian, siapa sedang di mana)
   - Riwayat kunjungan per petugas/klien
   - Statistik sederhana per jenis layanan
   - Export laporan (PDF/Excel)

7. **Laporan Hasil Kunjungan**
   - Pengisian checklist dinamis sesuai jenis layanan
   - Upload foto/bukti, tanda tangan digital klien

### 🔵 Fitur Pembeda (opsional)

8. **Lokasi & Peta** — tampilan lokasi kunjungan di peta, estimasi rute harian petugas
9. **Penanganan Kasus Khusus** — reassignment darurat, penyisipan kunjungan mendadak ke jadwal yang sudah ada

---

## 3. Logika Prioritas Kunjungan

Setiap kunjungan mendapat **skor prioritas gabungan** dari dua faktor:
- Seberapa mendesak kunjungan (dari sisi waktu)
- Seberapa dekat lokasinya dari kunjungan sebelumnya (dari sisi lokasi)

Bobot masing-masing faktor diatur **per jenis layanan** (field `bobot_waktu` dan `bobot_lokasi` pada tabel `jenis_layanan`), sehingga satu sistem bisa menyesuaikan prioritas berbeda-beda per sektor. Contoh:
- Sektor kesehatan (homecare) → bobot waktu besar, bobot lokasi kecil
- Sektor servis rumah tangga → bobot waktu kecil, bobot lokasi besar

Pendekatan ini sejalan dengan konsep SPK (Sistem Pendukung Keputusan) sederhana, mirip metode SAW (Simple Additive Weighting): setiap kriteria diberi bobot, lalu dihitung skor gabungan untuk menentukan urutan.

---

## 4. Struktur Database

### `users`
Data akun semua pengguna (admin, petugas, klien yang punya akun).

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| nama | varchar | |
| email | varchar | untuk login |
| password | varchar | |
| role | enum | admin / petugas / klien |
| no_telepon | varchar | untuk notifikasi WA/SMS |
| created_at, updated_at | timestamp | |

### `petugas_profil`
Data tambahan khusus petugas.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| user_id | bigint (FK → users) | |
| area_kerja | varchar | wilayah tugas |
| latitude, longitude | decimal | lokasi terakhir diketahui |

### `kualifikasi`
Master data jenis keahlian petugas.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| nama_kualifikasi | varchar | contoh: "Perawat", "Teknisi AC" |

### `petugas_kualifikasi`
Tabel penghubung many-to-many petugas ↔ kualifikasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| petugas_id | bigint (FK → petugas_profil) | |
| kualifikasi_id | bigint (FK → kualifikasi) | |

### `jenis_layanan`
Master data jenis kunjungan — jantung fleksibilitas lintas sektor.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| nama_layanan | varchar | contoh: "Kunjungan Perawat", "Servis AC" |
| estimasi_durasi | int | dalam menit |
| bobot_waktu | decimal | contoh: 0.7 (70%) |
| bobot_lokasi | decimal | contoh: 0.3 (30%) |
| kualifikasi_id | bigint (FK → kualifikasi) | keahlian yang dibutuhkan |

### `klien`
Data pemohon/pelanggan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| nama | varchar | |
| no_telepon | varchar | untuk notifikasi |
| alamat | text | |
| latitude, longitude | decimal | lokasi kunjungan |
| data_tambahan | json | field khusus sektor (misal data medis), fleksibel tanpa ubah struktur tabel |

### `kunjungan`
Tabel inti sistem — jadwal & status kunjungan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| klien_id | bigint (FK → klien) | |
| petugas_id | bigint (FK → petugas_profil) | nullable, kosong jika belum di-assign |
| jenis_layanan_id | bigint (FK → jenis_layanan) | |
| jadwal_mulai | datetime | |
| skor_prioritas | decimal | hasil hitungan otomatis (waktu + lokasi) |
| status | enum | menunggu / dijadwalkan / otw / tiba / selesai / gagal |
| alasan_gagal | varchar | diisi jika status = gagal |
| kode_tiket | varchar | unik, dipakai klien untuk cek status tanpa login |
| created_at, updated_at | timestamp | |

### `notifikasi`
Riwayat notifikasi terkirim.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| user_id / klien_id | bigint (FK) | penerima |
| kunjungan_id | bigint (FK → kunjungan) | notifikasi terkait kunjungan mana |
| jenis_notifikasi | varchar | contoh: "assignment_baru", "reminder_h1", "petugas_otw" |
| pesan | text | |
| status_kirim | enum | terkirim / gagal |
| created_at | timestamp | |

### Relasi Antar Tabel

```
users ──┬── petugas_profil ──┬── petugas_kualifikasi ── kualifikasi
         │                    │
         │                    └── (dipakai di) kunjungan
         │
jenis_layanan ──── kualifikasi (butuh keahlian apa)
         │
         └──── kunjungan ──┬── klien
                             │
                             └── notifikasi
```

**Alur singkat:** klien minta layanan → sistem cek `jenis_layanan` yang dipilih (termasuk bobot prioritas) → sistem cari petugas dengan `kualifikasi` sesuai → tercatat sebagai satu baris di `kunjungan` → setiap perubahan status memicu catatan baru di `notifikasi`.

*(Catatan: tabel untuk fitur lapisan kedua — laporan hasil kunjungan & checklist dinamis — akan dirancang terpisah saat fitur tersebut mulai dikerjakan.)*

---

## 5. Tech Stack Final

| Layer | Tools |
|---|---|
| Bahasa | JavaScript |
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Autentikasi | JWT (jsonwebtoken) + bcrypt |
| Real-time | Socket.io |
| Notifikasi Email | Nodemailer |
| Notifikasi WhatsApp | Fonnte / Wablas |
| Peta (opsional) | Leaflet.js |
| API | REST API |
| Database lokal | PostgreSQL (via installer resmi atau Docker); Laragon hanya dipakai untuk menjalankan PostgreSQL bila diperlukan |

---

## 6. Urutan Pengerjaan yang Disarankan

1. Fitur inti (1–5) hingga benar-benar berjalan dan dapat didemokan dengan minimal 2 skenario sektor berbeda (misal kesehatan + servis elektronik)
2. Fitur lapisan kedua (6–7)
3. Fitur pembeda (8–9), dikerjakan jika waktu masih memungkinkan
