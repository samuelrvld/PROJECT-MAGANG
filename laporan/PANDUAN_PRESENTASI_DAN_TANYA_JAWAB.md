# 🎯 PANDUAN PRESENTASI & KUNCI JAWABAN UJIAN MAGANG KERJA INDUSTRI (MKI)

**Nama:** Samuel Rivaldo Saragih  
**NIM:** 362358302156  
**Judul:** Rancang Bangun Fitur Digitalisasi Koleksi dan Integrasi QR Code pada Sistem Informasi di Museum Blambangan Banyuwangi  
**Program Studi:** Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) - Politeknik Negeri Banyuwangi  

---

## 💡 Hapus Rasa Takut: Fakta tentang Ujian Magang
1. **Dosen tidak menyuruh Anda menghafal ribuan baris kode.**
2. Dosen hanya ingin tahu 3 hal mendasar:
   - **Masalah nyata apa** yang ada di Museum Blambangan?
   - **Solusi perangkat lunak apa** yang Anda bangun?
   - **Bagaimana cara kerja sistem** tersebut saat dipakai pengunjung dan petugas?
3. Anda yang paling tahu sistem ini karena Anda yang mengoperasikan dan mengujinya!

---

## 🎙️ 1. Template Pembukaan Presentasi (Cukup 2 Menit)

> *"Selamat pagi/siang kepada Bapak/Ibu Dosen Penguji dan Dosen Pembimbing.*  
> *Perkenalkan saya **Samuel Rivaldo Saragih**, NIM **362358302156**, mahasiswa Sarjana Terapan TRPL.*  
> 
> *Hari ini saya mempresentasikan hasil Magang Kerja Industri di **Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi**, khususnya pada unit **Museum Blambangan**, dengan judul:*  
> **'Rancang Bangun Fitur Digitalisasi Koleksi dan Integrasi QR Code pada Sistem Informasi di Museum Blambangan Banyuwangi'**.*  
> 
> *Fokus utama proyek saya adalah mentransformasikan dua layanan utama museum menjadi berbasis digital:*  
> 1. *Pertama, **Musewangi** — yaitu digitalisasi koleksi cagar budaya menggunakan QR Code, informasi 3 bahasa, dan panduan suara audio.*  
> 2. *Kedua, **Booking Museum** — yaitu pemesanan tiket daring resmi kas daerah dengan penerbitan E-Tiket ber-QR Code, unduh PDF, dan pemindaian di pintu masuk.*  
> 
> *Berikut akan saya jelaskan latar belakang, cara kerja, dan hasil implementasinya."*

---

## ❓ 2. Bocoran 7 Pertanyaan Dosen Penguji & Cara Menjawabnya

### ❓ Pertanyaan 1: "Kenapa kamu mengambil judul ini? Masalah apa yang ada di Museum Blambangan?"
👉 **Jawaban Anda:**
> *"Terima kasih atas pertanyaannya, Bapak/Ibu Penguji. Di Museum Blambangan ada dua kendala operasional yang saya temukan:*  
> *1. **Di ruang pameran**: Informasi benda sejarah masih memakai label kertas/akrilik kecil. Tulisannya terbatas, hanya bahasa Indonesia, dan tidak ramah bagi tunanetra karena belum ada suara pemandu.*  
> *2. **Di loket tiket**: Karcis masih manual, antrean menumpuk, dan pencatatan kas daerah belum transparan secara real-time.*  
> *Oleh karena itu, saya mengintegrasikan teknologi **QR Code** sebagai jembatan: satu QR Code untuk membuka data koleksi di etalase, dan satu QR Code untuk tiket masuk pengunjung."*

---

### ❓ Pertanyaan 2: "Jelaskan apa itu fitur 'Musewangi' dan apa saja isinya?"
👉 **Jawaban Anda:**
> *"Fitur **Musewangi** adalah portal digitalisasi koleksi cagar budaya Museum Blambangan. Isinya ada 5 hal utama:*  
> *1. **Generator QR Code**: Admin bisa membuat dan mencetak stiker QR resmi untuk ditempel di etalase atau pedestal batu koleksi.*  
> *2. **Scanner Kamera Web**: Pengunjung cukup scan QR etalase pakai kamera HP tanpa perlu download aplikasi dari Play Store.*  
> *3. **Detail Koleksi Lengkap**: Menampilkan foto HD, nama artefak, nomor register cagar budaya, era sejarah (seperti masa Majapahit/Blambangan), dan dimensinya.*  
> *4. **Multibahasa**: Pengunjung bisa ganti bahasa ke **Bahasa Indonesia**, **English** (untuk turis luar negeri), atau **Basa Osing** (pelestarian bahasa asli Banyuwangi).*  
> *5. **Audio Deskripsi**: Ada tombol narasi suara (*audio tour guide*) yang membacakan kisah sejarahnya secara otomatis. Ini sangat membantu pengunjung difabel/tunanetra."*

---

### ❓ Pertanyaan 3: "Bagaimana cara kerja fitur tiket di 'Booking Museum'?"
👉 **Jawaban Anda:**
> *"Alurnya sangat sederhana dan terstruktur:*  
> *1. Pengunjung pilih tanggal, sesi kunjungan (pagi/siang/sore), dan kategori tiket (Pelajar, Umum, Mancanegara).*  
> *2. Pengunjung membayar via **QRIS resmi atau Bank Jatim** ke rekening kas Disbudpar Banyuwangi.*  
> *3. Petugas loket memverifikasi bukti bayar di dashboard admin.*  
> *4. E-Tiket ber-QR Code otomatis terbit dan bisa **diunduh dalam bentuk PDF**.*  
> *5. Di pintu masuk museum, petugas scan QR tiket tamu menggunakan modul **Gate Scanner**. Jika valid, status berubah menjadi 'Sudah Masuk'."*

---

### ❓ Pertanyaan 4: "Bagaimana sistem kamu mencegah kecurangan tiket (tiket palsu atau dipakai dua kali)?"
👉 **Jawaban Anda:**
> *"Sistem menerapkan prinsip **Single-Entry Enforcement**:*  
> *Setiap tiket memiliki ID Booking unik dan kode token QR yang berbeda. Saat petugas memindai tiket di pintu masuk, sistem mengecek 3 hal:*  
> *1. Apakah status pembayaran sudah **LUNAS (Terverifikasi)**?*  
> *2. Apakah tanggal kunjungan sesuai dengan hari ini?*  
> *3. Apakah status check-in masih **'Belum Hadir'**?*  
> *Jika sudah pernah di-scan, status langsung terkunci menjadi **'Sudah Masuk'**. Jika tiket itu di-scan lagi, scanner akan memunculkan alarm merah: **'Tiket Sudah Pernah Digunakan'**."*

---

### ❓ Pertanyaan 5: "Teknologi apa yang kamu pakai di frontend dan kenapa?"
👉 **Jawaban Anda:**
> *"Saya menggunakan **React 19** dengan **TypeScript** dan **Tailwind CSS**:*  
> *1. **React 19 & TypeScript**: Memberikan arsitektur komponen modular dan pengecekan tipe data yang ketat (*Strict Mode*), sehingga meminimalkan error saat runtime.*  
> *2. **Tailwind CSS**: Untuk tampilan antarmuka modern bernuansa lokal Banyuwangi (perpaduan warna Metallic Navy Blue dan Heritage Gold).*  
> *3. **qrcode.react & jsQR**: Untuk generate dan scan QR Code.*  
> *4. **jspdf & html2canvas**: Untuk mengonversi tampilan tiket digital menjadi berkas PDF ukuran saku.*  
> *5. **Web Speech Synthesis API**: Untuk mesin pembaca audio deskripsi koleksi."*

---

### ❓ Pertanyaan 6: "Bagaimana suara audio deskripsi bisa berjalan tanpa perlu rekaman MP3 manual untuk ribuan koleksi?"
👉 **Jawaban Anda:**
> *"Sistem memanfaatkan **Web Speech Synthesis API**, yaitu teknologi bawaan browser modern.*  
> *Sistem mengambil data teks deskripsi koleksi sesuai bahasa yang sedang aktif, lalu mengeksekusi perintah suara (`window.speechSynthesis.speak`). Dengan begitu, audio otomatis menyesuaikan bahasa (aksen Indonesia atau Inggris), hemat memori server, dan tidak perlu merekam file audio manual satu per satu."*

---

### ❓ Pertanyaan 7: "Apa manfaat nyata proyek ini bagi Dinas Kebudayaan dan Pariwisata Banyuwangi?"
👉 **Jawaban Anda:**
> *"Manfaatnya ada dua sisi:*  
> *1. **Bagi Edukasi & Pengunjung**: Menjadikan Museum Blambangan berstandar internasional karena informasi koleksi menjadi interaktif, bisa dibaca dalam bahasa asing maupun bahasa Osing, serta ramah disabilitas.*  
> *2. **Bagi Instansi & Loket**: Pendapatan tiket kas daerah tercatat rapi, kuota pengunjung per sesi terkontrol agar museum tidak over-capacity, dan petugas loket tidak repot merobek karcis manual lagi."*

---

## 🌟 3. Tips Sikap Saat Ujian:
1. **Tatap mata penguji dengan tenang.** Jangan terburu-buru menjawab; beri jeda 2 detik untuk menarik napas.
2. Jika ada istilah teknis yang lupa, jelaskan fungsinya secara logika, contoh:  
   *"Secara fungsi, modul ini bertugas memeriksa apakah tiketnya masih aktif atau sudah kadaluwarsa, Pak/Bu."*
3. **Pegang kartu sakti**: Anda membawa inovasi nyata untuk pelestarian budaya Banyuwangi. Dosen akan sangat mengapresiasi kepekaan Anda terhadap budaya lokal (*Basa Osing*) dan aksesibilitas ramah disabilitas (*Audio Deskripsi*).
