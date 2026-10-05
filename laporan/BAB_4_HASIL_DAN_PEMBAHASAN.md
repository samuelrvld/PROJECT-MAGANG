# BAB 4: HASIL DAN PEMBAHASAN

## 4.1 Hasil Kegiatan
Selama melaksanakan kegiatan Magang Kerja Industri (MKI) di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi pada unit Museum Blambangan, penulis berhasil merancang dan membangun sistem informasi terpadu yang memadukan dua pilar utama:
1. **Modul Digitalisasi Koleksi (*Musewangi*)**: Sistem katalogisasi dan akses informasi benda cagar budaya berbasis pemindaian QR Code, dilengkapi dengan fitur multibahasa (Bahasa Indonesia, English, dan Basa Osing) serta pemutar narasi suara (*audio deskripsi*).
2. **Modul Pemesanan dan Tiket Elektronik (*Booking Museum*)**: Sistem reservasi tiket daring dengan pembatasan kuota sesi kunjungan, integrasi pembayaran resmi kas daerah (QRIS / Bank Jatim), penerbitan E-Tiket ber-QR Code, ekspor dokumen tiket berformat PDF, serta validasi kehadiran di pintu masuk (*gate check-in scanner*).

Kegiatan ini mentransformasikan metode pelayanan fisik dan pelabelan statis museum konvensional menjadi ekosistem digital yang modern, interaktif, transparan, dan inklusif bagi seluruh lapisan masyarakat dan wisatawan.

---

## 4.2 Pembahasan Sistem Informasi Museum Blambangan
Dalam pengembangan perangkat lunak ini, penulis mengadopsi pendekatan arsitektur *Component-Based Architecture* berbasis pustaka **React 19** dan bahasa pemrograman **TypeScript**. Penerapan arsitektur ini memungkinkan pemisahan logika bisnis (*business logic*), tata kelola data terpusat (*state management*), dan antarmuka visual (*presentation layer*) secara modular, terstruktur, dan memiliki keamanan tipe data tinggi (*strict type safety*).

### 4.2.1 Arsitektur Teknologi Sistem
Arsitektur teknologi yang diimplementasikan pada sistem meliputi:
1. **Frontend Core**: **React 19** dikombinasikan dengan **TypeScript** guna menjamin keandalan kode tanpa kesalahan waktu berjalan (*zero runtime type errors*).
2. **Styling & Tata Letak Responsif**: **Tailwind CSS** dengan konfigurasi warna tematik kebudayaan Banyuwangi, yaitu kombinasi warna *Metallic Navy Blue* (`#081827`, `#14293E`) yang melambangkan kewibawaan dinas dan *Heritage Gold* (`#D4A359`, `#DAB36E`) yang melambangkan keagungan warisan Kerajaan Blambangan.
3. **QR Code Engine**: Pustaka `qrcode.react` untuk merender kode QR secara presisi dalam format Canvas 2D dan Scalable Vector Graphics (SVG), baik untuk stiker koleksi etalase maupun barcode check-in tiket.
4. **QR Code Scanner**: Engine pemindai `jsQR` terintegrasi dengan HTML5 MediaDevices API (`navigator.mediaDevices.getUserMedia`) untuk membaca kode QR langsung dari umpan balik video kamera ponsel/webcam secara *real-time*.
5. **Mesin Narasi Audio (Web Speech & Audio API)**: Memanfaatkan *SpeechSynthesis API* standar peramban web modern yang dipadukan dengan pemutar audio HTML5 untuk menyediakan narasi suara deskripsi sejarah bagi setiap koleksi.
6. **Ekspor Dokumen PDF**: Menggunakan pustaka `jspdf` dan `html2canvas` untuk mengonversi tampilan E-Tiket menjadi berkas dokumen PDF beresolusi cetak tajam.

---

## 4.3 Penjelasan Kode dan Hasil Implementasi

### 4.3.1 Entity Relationship Diagram (ERD) dan Pemodelan Data
Struktur data dirancang untuk mengintegrasikan kebutuhan inventarisasi koleksi cagar budaya dengan transaksi tiket kunjungan.

```
+---------------------------------------------------------------------------------------------------+
|                                 ENTITY RELATIONSHIP DIAGRAM (ERD)                                 |
+---------------------------------------------------------------------------------------------------+

     +-----------------------+                    +---------------------------+
     |   KATEGORI_KOLEKSI    |                    |      KOLEKSI_MUSEUM       |
     +-----------------------+                    +---------------------------+
     | PK id (VARCHAR)       | 1                N | PK id (VARCHAR)           |
     |    nama_kategori      |--------------------| FK kategori_id            |
     |    deskripsi_singkat  |                    |    nomor_register (UNIQUE)|
     |    ikon_simbol        |                    |    nama_koleksi           |
     +-----------------------+                    |    periode_era            |
                                                  |    dimensi_fisik          |
                                                  |    lokasi_ruang_pamer     |
                                                  |    gambar_url             |
                                                  |    deskripsi_id (TEXT)    |
                                                  |    deskripsi_en (TEXT)    |
                                                  |    deskripsi_osing (TEXT) |
                                                  |    audio_file_url         |
                                                  |    qr_identifier (UNIQUE) |
                                                  |    total_scan (INT)       |
                                                  +---------------------------+
                                                                | 1
                                                                |
                                                                | 1
                                                  +---------------------------+
                                                  |     QR_LABEL_ETALASE      |
                                                  +---------------------------+
                                                  | PK label_id               |
                                                  | FK koleksi_id             |
                                                  |    qr_matrix_code         |
                                                  |    format_cetak_ukuran    |
                                                  |    tanggal_generate       |
                                                  +---------------------------+

     +-----------------------+                    +---------------------------+
     |     BOOKING_TIKET     |                    |    LOG_VALIDASI_GERBANG   |
     +-----------------------+                    +---------------------------+
     | PK id (VARCHAR)       | 1                N | PK log_id                 |
     |    nama_pemesan       |--------------------| FK booking_id             |
     |    telepon            |                    |    waktu_checkin          |
     |    email              |                    |    petugas_nip            |
     |    jumlah_orang (INT) |                    |    status_hasil (SUCCESS) |
     |    kategori_tiket     |                    +---------------------------+
     |    tanggal_kunjungan  |
     |    sesi_kunjungan     |
     |    total_bayar (DEC)  |
     |    status_verifikasi  |
     |    status_checkin     |
     |    qr_token_pass      |
     +-----------------------+
```

**Analisis Struktur Data:**
1. **Entitas `KOLEKSI_MUSEUM`**: Menyimpan metadata penting benda sejarah. Atribut `deskripsi_id`, `deskripsi_en`, dan `deskripsi_osing` menampung konten multibahasa, sedangkan `audio_file_url` mereferensikan sumber rekaman suara/panduan audio. Atribut `qr_identifier` menyimpan string terenkripsi yang dicocokkan saat pengunjung melakukan scan.
2. **Entitas `BOOKING_TIKET`**: Mencatat transaksi reservasi pengunjung. Atribut `qr_token_pass` merupakan kode unik (contoh: `MB-20261007-0042`) yang dikonversi menjadi gambar QR Code pada tiket pengunjung.
3. **Entitas `LOG_VALIDASI_GERBANG`**: Menyimpan riwayat pemindaian tiket di pintu masuk oleh petugas loket, memastikan tiket yang sudah berstatus *"Sudah Masuk"* tidak dapat digunakan kembali (*anti-fraud prevention*).

---

### 4.3.2 Implementasi Fitur Digitalisasi Koleksi (*Musewangi*)

#### A. Pembuatan dan Pengelolaan QR Code Koleksi
Untuk setiap koleksi benda sejarah yang terdaftar, sistem secara otomatis menghasilkan QR Code unik. Administrator museum dapat mencetak kartu label QR resmi yang siap dipajang di samping etalase kaca atau pedestal batu pameran.

*Contoh Implementasi Kode Generator QR Koleksi:*
```tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CollectionQRProps {
  collectionId: string;
  registerNumber: string;
  collectionName: string;
}

export const CollectionQRCard: React.FC<CollectionQRProps> = ({
  collectionId,
  registerNumber,
  collectionName
}) => {
  // URL akses instan saat QR dipindai oleh kamera ponsel pengunjung
  const targetUrl = `${window.location.origin}/#/koleksi/${collectionId}`;

  return (
    <div className="p-4 bg-white border-2 border-[#14293E] rounded-xl text-center w-64 shadow-md">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        Museum Blambangan Banyuwangi
      </div>
      <div className="text-xs font-black text-[#14293E] mt-1 mb-2">
        {collectionName}
      </div>
      <div className="p-2 bg-slate-50 inline-block rounded-lg border border-slate-200">
        <QRCodeSVG 
          value={targetUrl} 
          size={160} 
          level="H" 
          includeMargin={true}
        />
      </div>
      <div className="mt-2 text-[10px] text-slate-600 font-mono">
        Reg: {registerNumber}
      </div>
      <div className="text-[9px] text-[#DAB36E] font-semibold mt-1">
        ✦ Pindai untuk Info, Bahasa, & Narasi Audio ✦
      </div>
    </div>
  );
};
```

#### B. Pemindaian QR Code Koleksi (*In-App Web Scanner*)
Pengunjung museum tidak diwajibkan menginstal aplikasi khusus dari Google Play Store atau App Store. Sistem menyediakan modul pemindai berbasis peramban web (*web camera scanner*) menggunakan pustaka `jsQR` yang langsung terhubung dengan sensor kamera belakang *smartphone*.

*Alur Pemindaian Kamera:*
1. Pengunjung menekan tombol **"Pindai QR Koleksi"** di bilah menu.
2. Sistem meminta izin akses kamera melalui `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })`.
3. Kanvas menangkap frame video secara terus-menerus (*animation frame loop*).
4. Ketika pola QR terdeteksi oleh algoritma `jsQR`, sistem mengekstrak kode pengenal koleksi dan otomatis mengarahkan pengunjung ke halaman detail koleksi yang relevan.

#### C. Informasi Koleksi Multibahasa
Guna mendukung visi Banyuwangi sebagai destinasi wisata internasional serta menjaga kelestarian bahasa lokal, setiap koleksi dilengkapi tiga pilihan bahasa:
- **Bahasa Indonesia (ID)**: Bahasa baku nasional untuk masyarakat umum dan pelajar.
- **Bahasa Inggris (EN)**: Bahasa internasional untuk memudahkan pemahaman turis mancanegara.
- **Basa Osing (OS)**: Bahasa daerah suku asli Banyuwangi sebagai media pelestarian kekayaan linguistik dan kearifan lokal.

*Struktur Objek Multibahasa pada Data Koleksi:*
```typescript
export interface MuseumCollection {
  id: string;
  nomorRegister: string;
  nama: string;
  kategori: 'Arkeologi' | 'Historika' | 'Etnografi' | 'Numismatika';
  era: string;
  dimensi: string;
  lokasiRuang: string;
  fotoUrl: string;
  deskripsi: {
    id: string;
    en: string;
    osing: string;
  };
  audioGuideUrl?: string;
}
```

*Contoh Konten Koleksi: Arca Siwa Blambangan*
- **Bahasa Indonesia**: *"Arca Siwa Mahadewa berbahan batu andesit peninggalan Kerajaan Blambangan era pengaruh Majapahit abad ke-14. Ditemukan di kawasan Banyuwangi Selatan dengan atribut trisula dan mahkota jatamakuta."*
- **English**: *"Statue of Shiva the Mahadeva sculpted from andesite stone, dating back to the 14th century Blambangan Kingdom during the Majapahit era. Discovered in Southern Banyuwangi, holding the trishula emblem and wearing a jatamakuta crown."*
- **Basa Osing**: *"Reca Bathara Siwa bahan watu andesit tilas jaman Kraton Blambangan abad kaping patbelas. Ditemukaken ring tlatah Banyuwangi Kidul, nggawa pusaka trisula lan makutha jatamakuta kang dadi lambang kawibawan para luhur."*

#### D. Implementasi Audio Deskripsi Koleksi (*Smart Voice Guide*)
Fitur audio deskripsi dirancang untuk memberikan kemudahan bagi penyandang tunanetra serta menghadirkan pengalaman eksplorasi layaknya didampingi kurator profesional. Sistem mengimplementasikan *Web Speech Synthesis API* yang membaca narasi sesuai bahasa yang sedang dipilih oleh pengunjung.

*Cuplikan Kode Pemutar Audio Deskripsi:*
```tsx
import React, { useState } from 'react';
import { Volume2, Square, Globe } from 'lucide-react';

interface AudioNarrationPlayerProps {
  text: string;
  language: 'id' | 'en' | 'osing';
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  text,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Peramban Anda belum mendukung fitur narasi suara.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Penyesuaian aksen bahasa suara
    utterance.lang = language === 'en' ? 'en-US' : 'id-ID';
    utterance.rate = 0.95; // Kecepatan suara artikulatif
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={handlePlayAudio}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-md ${
        isPlaying 
          ? 'bg-rose-600 text-white animate-pulse' 
          : 'bg-[#14293E] hover:bg-[#0c1a29] text-[#DAB36E]'
      }`}
    >
      {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4" />}
      <span>{isPlaying ? 'Hentikan Narasi' : 'Dengarkan Audio Deskripsi'}</span>
    </button>
  );
};
```

---

### 4.3.3 Implementasi Fitur Tiket Kunjungan (*Booking Museum*)

#### A. Pembuatan QR Code Tiket Kunjungan
Ketika pemesanan tiket telah dinyatakan lunas dan diverifikasi oleh pihak loket, sistem otomatis menghasilkan E-Tiket yang memuat token QR terenkripsi berisi ID Booking, nama pemesan, jumlah rombongan, serta sesi kunjungan.

#### B. Pengelolaan Tiket Elektronik (E-Ticket) & Verifikasi Pembayaran
Petugas loket memiliki panel kendali *Admin Portal* untuk memvalidasi bukti transfer yang diunggah pengunjung. Apabila nominal dan mutasi Bank Jatim / QRIS sesuai, status diubah menjadi *"Terverifikasi"*, memicu penerbitan tiket resmi dan notifikasi visual perayaan (*confetti celebration*).

#### C. Validasi Tiket Berbasis QR Code (*Gate Scanner Check-In*)
Di pintu gerbang masuk museum, petugas mengarahkan kamera scanner ke layar telepon pintar pengunjung. Sistem memproses validasi tiket melalui alur berikut:
1. Sistem membaca muatan QR Code tiket tamu.
2. Melakukan pencarian data pada daftar pesanan aktif.
3. Memeriksa kriteria validitas:
   - Status pembayaran wajib *"Terverifikasi"* (*Lunas*).
   - Tanggal kunjungan harus sesuai dengan hari berjalan.
   - Status kehadiran harus masih *"Belum Hadir"*.
4. Jika seluruh kriteria terpenuhi, sistem memperbarui status pengunjung menjadi *"Sudah Masuk"*, mencatat stempel waktu check-in, dan menampilkan pesan sukses berwarna hijau.
5. Jika tiket sudah pernah digunakan sebelumnya, sistem menampilkan peringatan merah bertuliskan *"Tiket Sudah Pernah Digunakan"* untuk mencegah pemakaian ganda (*double entry*).

#### D. Unduh Tiket Kunjungan Berformat PDF
Pengunjung dapat menyimpan tiket ke perangkat mereka dalam format PDF resmi dengan menekan tombol **"Unduh E-Tiket (PDF)"**.

*Cuplikan Kode Ekspor Tiket ke Dokumen PDF:*
```tsx
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportTicketToPDF = async (ticketElementId: string, bookingId: string) => {
  const element = document.getElementById(ticketElementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Resolusi tinggi retina display
      useCORS: true,
      backgroundColor: '#081827'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5' // Ukuran kartu tiket pas saku (A5)
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`Tiket-Museum-Blambangan-${bookingId}.pdf`);
  } catch (error) {
    console.error('Gagal mencetak dokumen tiket:', error);
  }
};
```

---

### 4.3.4 Pengujian Fungsionalitas Sistem (*Black Box Testing*)
Pengujian fungsionalitas dilakukan menggunakan metode *Black Box Testing* untuk memastikan setiap fungsi bekerja sesuai spesifikasi kebutuhan tanpa menguji struktur internal logika baris kode.

**Tabel 4.1 Hasil Pengujian Modul Musewangi (Digitalisasi Koleksi)**
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1. | Generate QR Code untuk setiap koleksi | QR Code unik terbuat dan memuat tautan menuju detail koleksi | QR Code tampil dan dapat terbaca | **Valid** |
| 2. | Pemindaian QR Code menggunakan kamera web | Kamera mendeteksi QR etalase dan membuka halaman koleksi terkait | Berhasil membuka detail artefak seketika | **Valid** |
| 3. | Pergantian bahasa (Indonesia, English, Osing) | Konten judul dan deskripsi artefak berubah sesuai bahasa yang dipilih | Teks berubah akurat tanpa *reload* halaman | **Valid** |
| 4. | Pemutaran narasi audio (*audio deskripsi*) | Suara narasi terdengar jelas menarasikan deskripsi koleksi | Suara narator berbunyi sesuai bahasa aktif | **Valid** |
| 5. | Penghentian audio narasi secara manual | Audio berhenti seketika saat tombol 'Hentikan Narasi' diklik | Audio berhenti dengan responsif | **Valid** |

**Tabel 4.2 Hasil Pengujian Modul Booking Museum (E-Ticketing)**
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1. | Pemesanan tiket dengan pemilihan sesi | Kuota sesi berkurang dan ringkasan tagihan terhitung otomatis | Kuota terpotong dan total tagihan akurat | **Valid** |
| 2. | Unggah bukti transfer & validasi admin | Status pesanan beralih dari 'Menunggu' menjadi 'Terverifikasi' | Tiket berstatus lunas dan QR tiket terbit | **Valid** |
| 3. | Unduh dokumen E-Tiket ke berkas PDF | Berkas PDF terunduh dengan tampilan tiket, barcode, dan QR tajam | File PDF terunduh rapi dan presisi | **Valid** |
| 4. | Pemindaian QR tiket di gerbang masuk | Tiket terverifikasi valid, status berubah menjadi 'Sudah Masuk' | Muncul notifikasi hijau dan waktu check-in | **Valid** |
| 5. | Pemindaian ulang tiket yang sudah dipakai | Sistem menolak dengan peringatan tiket telah digunakan | Menampilkan peringatan merah pencegahan | **Valid** |
