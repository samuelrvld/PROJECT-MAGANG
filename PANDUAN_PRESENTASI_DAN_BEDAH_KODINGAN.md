# 🎓 PANDUAN LENGKAP & CONTEKAN PRESENTASI PROYEK MAGANG
## SISTEM INFORMASI & E-TICKETING MUSEUM BLAMBANGAN BANYUWANGI (MUSEWANGI)
**Tim Pengembang TRPL Poliwangi:**
1. Fitria Nur Aini (Project Manager & UI/UX Specialist)
2. Syifa'ul Qolbi (Frontend Developer & System Integrator)
3. Ahmad Rofi Ridho (Backend Developer & Database Architect)
4. Samuel Christian H. (Lead Developer & Mobile Specialist)

---

## 🗂️ 1. PETA STRUKTUR FOLDER (Cara Menjelaskannya ke Penguji)

Jika ditanya dosen/penguji: *"Coba jelaskan struktur folder proyek Anda!"*, Anda cukup menjawab:
> *"Aplikasi ini dibangun menggunakan arsitektur modular berbasis React dengan pembagian folder yang sangat rapi:"*

1. **`src/components/user/` (Layar Khusus Pengunjung)**
   * `UserWebPortal.tsx` ➔ Portal utama pengunjung (Beranda, etalase museum, pencarian tiket).
   * `Screen2FormData.tsx` ➔ Formulir pemesanan tiket (isi nama, pilih kategori, pilih tanggal & sesi).
   * `Screen3Ringkasan.tsx` ➔ Halaman ringkasan & cek ulang rincian pesanan.
   * `Screen4PembayaranQRIS.tsx` ➔ Halaman barcode QRIS resmi & upload bukti transfer.
   * `Screen6BookingBerhasil.tsx` ➔ Konfirmasi pembayaran berhasil dikirim.
   * `Screen7StatusVerifikasi.tsx` ➔ Halaman menunggu verifikasi petugas atau status tiket aktif.
   * `UserMusewangiDashboard.tsx` ➔ Katalog digital cagar budaya & label edukasi sejarah.

2. **`src/components/admin/` (Layar Khusus Petugas & Manajemen)**
   * `AdminLayout.tsx` ➔ Kerangka sidebar mewah (desktop) dan bilah navigasi bawah (mobile).
   * `AdminDashboard.tsx` ➔ Ringkasan statistik pengunjung harian & grafik retribusi.
   * `AdminScanValidasi.tsx` ➔ **Fitur Gate Masuk:** Scanner kamera HP untuk memindai QR code tiket pengunjung.
   * `AdminPesananKunjungan.tsx` ➔ Tabel daftar semua pesanan pengunjung.
   * `AdminDetailPesanan.tsx` ➔ Halaman verifikasi bukti transfer QRIS dan tombol terbitkan tiket.
   * `AdminManajemenPetugas.tsx` ➔ Manajemen akun & pembagian hak akses (RBAC) tim TRPL.
   * `AdminLaporan.tsx` ➔ Rekapitulasi laporan keuangan & Pendapatan Asli Daerah (PAD).

3. **`src/components/common/` (Komponen Bersama)**
   * `ModernTicketPass.tsx` ➔ Mesin pencetak E-Tiket PDF A4 300 DPI & generate barcode QR.
   * `ScreenPitchingVideo.tsx` ➔ Pemutar video presentasi proyek magang interaktif.
   * `MuseumLogo.tsx` & `GajahOlingMotif.tsx` ➔ Logo resmi & motif ornamen khas Banyuwangi.

4. **`src/context/BookingContext.tsx` (Otak / Pengelola Data Global)**
   * Menyimpan data pemesanan, data akun petugas, notifikasi, dan perpindahan halaman (`activeView`).

5. **`src/utils/` (Fungsi Bantuan Teknis)**
   * `audioEffects.ts` ➔ Pembuat efek suara scanner supermarket (*pip!*) dan buzzer penolakan.
   * `sessionUtils.ts` ➔ Pengatur kuota sesi pagi/siang dan pencegahan hari libur.
   * `rbac.ts` ➔ Pengatur hak akses (Role-Based Access Control) petugas loket.

---

## 🎯 2. CARA MENJALANKAN & MENUNJUKKAN PROYEK SAAT PRESENTASI

Ada 2 cara yang bisa Anda tunjukkan ke dosen/penguji:

### A. Membuka Versi Live Online (Rekomendasi Utama)
Tunjukkan langsung di browser laptop atau HP Anda:
👉 **`https://museum-blambangan-banyuwangi.netlify.app`**

### B. Menjalankan di Laptop Sendiri (Localhost)
1. Buka terminal (PowerShell atau VS Code).
2. Ketik perintah:
   ```bash
   npm run dev
   ```
3. Buka browser di alamat:
   👉 **`http://localhost:5173`**

---

## 💬 3. JAWABAN JITU ATAS PERTANYAAN POPULER PENGUJI / DOSEN

### ❓ Pertanyaan 1: *"Bagaimana alur kerja sistem ini dari awal sampai akhir?"*
> **Jawaban Anda:**  
> *"Alurnya terbagi menjadi dua sisi yang saling terhubung:*  
> 1. **Sisi Pengunjung:** Pengunjung membuka web, memilih kategori tiket (Pelajar/Umum/Mancanegara), memilih tanggal dan sesi kuota kunjungan, lalu membayar melalui QRIS resmi. Pengunjung akan menerima e-tiket digital lengkap dengan QR Code unik.  
> 2. **Sisi Petugas:** Petugas gate membuka menu **Scan QR** menggunakan kamera HP. Saat QR tiket pengunjung disorot, sistem membaca kode unik, memvalidasi keasliannya, membunyikan suara beep kasir, dan langsung mencatat pengunjung 'Sudah Masuk'."*

---

### ❓ Pertanyaan 2: *"Bagaimana cara kerja fitur Scan QR kameranya?"*
> **Jawaban Anda:**  
> *"Kami menggunakan kombinasi teknologi modern:*  
> 1. **Native BarcodeDetector API:** Memanfaatkan akselerasi perangkat keras ponsel (iOS 17+ dan Chrome Android) sehingga kamera bisa mengenali QR code di layar laptop hanya dalam 1–2 milidetik.  
> 2. **Fallback jsQR:** Jika dibuka di browser lama, sistem otomatis beralih ke algoritma jsQR berbasis canvas yang di-downscale agar tidak membebani memori HP.  
> 3. **Format Payload:** QR tiket berisi kode verifikasi `VERIFIED_TICKET:<ID>:<NAMA>:<TANGGAL>:<SESI>` yang secara otomatis disinkronkan oleh sistem."*

---

### ❓ Pertanyaan 3: *"Kenapa memilih teknologi React dan Tailwind CSS?"*
> **Jawaban Anda:**  
> *"Karena React menggunakan konsep komponen modular (*reusable components*), sehingga antarmuka pengunjung dan admin dapat dikembangkan secara terstruktur. Dipadukan dengan Tailwind CSS dan Vite, aplikasi ini sangat ringan, cepat saat dimuat (*single-page application*), serta responsif di semua jenis ukuran layar HP, tablet, maupun laptop."*

---

### ❓ Pertanyaan 4: *"Di mana data pemesanan disimpan saat ini?"*
> **Jawaban Anda:**  
> *"Pada fase demonstrasi dan pengujian operasional saat ini, data disimpan menggunakan State Management terpusat (`BookingContext`) yang disinkronkan ke `localStorage` browser. Untuk tahap implementasi lanjutan di server dinas, arsitektur ini sudah siap dihubungkan ke REST API backend (seperti Laravel/MySQL) melalui endpoint yang telah dirancang."*

---

### ❓ Pertanyaan 5: *"Bagaimana sistem mencegah kebocoran tiket atau pemakaian ulang?"*
> **Jawaban Anda:**  
> *"Setiap tiket memiliki status unik: `Belum Hadir` dan `Sudah Masuk`. Jika ada pengunjung yang mencoba menscan tiket yang sama untuk kedua kalinya, sistem scanner akan langsung menolak dan membunyikan alarm buzzer kegagalan dengan pesan peringatan bahwa tiket sudah pernah digunakan sebelumnya."*

---

## 🎬 4. MENUNJUKKAN VIDEO PITCHING SAAT PRESENTASI
Jika penguji meminta video perkenalan proyek:
1. Anda bisa memutar file video langsung dari laptop:  
   📁 `D:\PROJECT MAGANG\video_pitching_museum_blambangan.mp4`
2. Atau klik menu **"🎬 Video Pitching"** di dalam website Anda (`#/pitching`).
