# LAPORAN MAGANG KERJA INDUSTRI (MKI)

**RANCANG BANGUN FITUR DIGITALISASI KOLEKSI DAN INTEGRASI QR CODE PADA SISTEM INFORMASI DI MUSEUM BLAMBANGAN BANYUWANGI**

---

### Disusun Oleh:
**SAMUEL RIVALDO SARAGIH**  
**NIM. 362358302156**

---

**PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK**  
**JURUSAN BISNIS DAN INFORMATIKA**  
**POLITEKNIK NEGERI BANYUWANGI**  
**2026**

---

## HALAMAN PENGESAHAN

**LAPORAN MAGANG KERJA INDUSTRI**  
**RANCANG BANGUN FITUR DIGITALISASI KOLEKSI DAN INTEGRASI QR CODE PADA SISTEM INFORMASI DI MUSEUM BLAMBANGAN BANYUWANGI**

**Oleh:**  
**SAMUEL RIVALDO SARAGIH**  
**NIM. 362358302156**

Telah diperiksa dan disetujui oleh pembimbing pada tanggal: [Tanggal Pengesahan]

| Pembimbing Lapang | Dosen Pembimbing |
| :---: | :---: |
| <br><br><br>**Eko Ari Bawanto, S.Sn.**<br>NIP. 19940812 202406 1 002 | <br><br><br>**Alfin Hidayat, S.T., M.T.**<br>NIP. 19901005 201404 1 002 |

<br>

**Mengetahui,**

| Ketua Jurusan Bisnis dan Informatika | Koordinator Program Studi TRPL |
| :---: | :---: |
| <br><br><br>**Mohamad Dimyati Ayatullah, S.T., M.Kom.**<br>NIPPPK. 19760122 202121 1 001 | <br><br><br>**Dianni Yusuf, S.Kom., M.Kom.**<br>NIPPPK. 19840305 202121 2 004 |

---

## KATA PENGANTAR

Puji syukur kehadirat Allah SWT atas segala limpahan rahmat, hidayah, dan karunia-Nya, sehingga penulis dapat menyelesaikan Laporan Magang Kerja Industri (MKI) ini tepat pada waktunya. Laporan ini disusun berdasarkan hasil perancangan dan pengembangan perangkat lunak dengan judul **"Rancang Bangun Fitur Digitalisasi Koleksi dan Integrasi QR Code pada Sistem Informasi di Museum Blambangan Banyuwangi"**.

Penyusunan laporan ini dimaksudkan untuk memenuhi salah satu syarat kelulusan mata kuliah Magang Kerja Industri pada Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak, Jurusan Bisnis dan Informatika, Politeknik Negeri Banyuwangi. Laporan ini merupakan hasil dari kegiatan praktik kerja, pengamatan, analisis kebutuhan, serta implementasi sistem yang penulis laksanakan selama masa magang di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi, khususnya pada Unit Pelaksana Museum Blambangan.

Penulis menyadari bahwa keberhasilan pelaksanaan magang dan penyusunan laporan ini tidak terlepas dari bimbingan, arahan, serta dukungan moril maupun materiil dari berbagai pihak. Oleh karena itu, pada kesempatan ini penulis menyampaikan ucapan terima kasih yang sebesar-besarnya kepada:
1. Bapak M. Shofiul Amin, S.T., M.T., selaku Direktur Politeknik Negeri Banyuwangi.
2. Bapak Mohamad Dimyati Ayatullah, S.T., M.Kom., selaku Ketua Jurusan Bisnis dan Informatika Politeknik Negeri Banyuwangi.
3. Ibu Dianni Yusuf, S.Kom., M.Kom., selaku Koordinator Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak.
4. Bapak Taufik Rohman, M.Si., selaku Kepala Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi yang telah memberikan kesempatan serta fasilitas kepada penulis untuk melaksanakan kegiatan magang.
5. Bapak Alfin Hidayat, S.T., M.T., selaku Dosen Pembimbing yang telah meluangkan waktu, tenaga, dan membimbing penulis dengan penuh kesabaran dalam penyusunan laporan ini.
6. Bapak Eko Ari Bawanto, S.Sn., selaku Pembimbing Lapang di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi yang senantiasa memberikan bimbingan teknis, arahan lapangan, dan wawasan dalam perancangan sistem informasi museum.
7. Seluruh jajaran staf dan pengelola Museum Blambangan Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi atas kerja sama, keramahan, dan ilmu yang diberikan selama kegiatan magang.
8. Kedua orang tua dan keluarga tercinta yang tiada henti memberikan doa, motivasi, serta kasih sayang yang tulus kepada penulis.
9. Rekan-rekan seperjuangan mahasiswa Program Studi Teknologi Rekayasa Perangkat Lunak Politeknik Negeri Banyuwangi yang senantiasa saling mendukung dan bertukar pikiran.

Penulis menyadari bahwa laporan ini masih memiliki kekurangan baik dari segi isi maupun teknik penyajiannya. Oleh karena itu, saran dan kritik yang membangun sangat penulis harapkan demi penyempurnaan di masa yang akan datang. Akhir kata, semoga laporan ini dapat memberikan manfaat nyata bagi pembaca, civitas akademika, serta pengembangan teknologi informasi di lingkungan instansi kebudayaan dan permuseuman.

Banyuwangi, [Bulan Tahun]  
Penulis,  

<br>
**Samuel Rivaldo Saragih**
NIM. 362358302156

---

# BAB 1: PENDAHULUAN

## 1.1 Latar Belakang Masalah
Politeknik Negeri Banyuwangi merupakan salah satu perguruan tinggi negeri vokasi yang berfokus pada pembentukan sumber daya manusia profesional dengan penguasaan keterampilan terapan (*hard skill*) serta kemampuan komunikasi dan interpersonal (*soft skill*) yang adaptif terhadap kebutuhan industri. Pada Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL), kurikulum diselenggarakan dengan mengedepankan pendekatan *Project Based Learning* (PBL). Model pembelajaran ini menuntut mahasiswa untuk mengintegrasikan pemahaman teoretis ke dalam pemecahan masalah riil melalui perancangan, pengembangan, dan pengujian produk perangkat lunak. Sebagaimana dikemukakan oleh Thomas (2000), "pembelajaran berbasis proyek mampu memperdalam pemahaman mahasiswa serta menghubungkan fondasi akademik dengan praktik profesional di dunia kerja nyata". Oleh karena itu, Magang Kerja Industri (MKI) menjadi pilar kurikulum yang sangat esensial bagi mahasiswa TRPL untuk mengimplementasikan kompetensi rekayasa perangkat lunak secara langsung pada instansi pemerintah maupun industri.

Dinas Kebudayaan dan Pariwisata (Disbudpar) Kabupaten Banyuwangi, yang berlokasi di Jl. Jenderal Ahmad Yani No. 78 Banyuwangi, mengemban tugas pokok menyelenggarakan urusan pemerintahan daerah di bidang kebudayaan dan pariwisata. Mengacu pada Rencana Strategis (Renstra) Disbudpar Kabupaten Banyuwangi, pelestarian cagar budaya dan pengelolaan permuseuman merupakan prioritas strategis dalam menjaga identitas peradaban daerah sekaligus mendukung ekosistem pariwisata berbasis budaya (*heritage tourism*). Salah satu unit vital di bawah naungan Disbudpar adalah Museum Blambangan, yang menyimpan lebih dari 4.000 koleksi benda bersejarah meliputi artefak masa prasejarah, peninggalan Kerajaan Blambangan dan Majapahit, era kolonial, hingga kekayaan etnografi masyarakat Osing.

Keberadaan benda cagar budaya tersebut menuntut pengelolaan informasi yang akurat dan mudah diakses masyarakat luas. Koentjaraningrat (1985) menegaskan bahwa pelestarian nilai budaya tidak dapat berlangsung optimal tanpa dukungan data dan dokumentasi yang valid. Dalam praktiknya di Museum Blambangan, penyampaian informasi koleksi kepada pengunjung selama ini masih mengandalkan label fisik konvensional (kartu kertas/akrilik) yang ditempel pada etalase dan pedestal pameran. Metode konvensional ini memiliki beberapa kelemahan mendasar:
1. **Keterbatasan Ruang dan Muatan Informasi**: Luas label fisik yang sangat terbatas hanya mampu memuat nama benda, nomor registrasi singkat, dan deskripsi ringkas, sehingga latar belakang sejarah, filosofi, serta narasi budaya tidak tersampaikan secara utuh.
2. **Ketiadaan Dukungan Multibahasa**: Informasi yang tercetak hanya tersedia dalam Bahasa Indonesia, menimbulkan kendala pemahaman bagi wisatawan mancanegara yang berkunjung.
3. **Keterbatasan Aksesibilitas**: Pengunjung penyandang disabilitas (khususnya tunanetra) dan pengunjung yang membutuhkan metode belajar auditori belum terfasilitasi karena belum tersedianya panduan audio (*audio guide*).
4. **Proses Layanan Tiket Konvensional**: Transaksi loket kunjungan masih banyak dilakukan secara manual menggunakan karcis cetak, yang berisiko memperpanjang antrean, menyulitkan pengendalian batas kuota sesi kunjungan harian, dan rentan terhadap inkonsistensi pencatatan Pendapatan Asli Daerah (PAD).

Untuk mengatasi permasalahan tersebut, dibutuhkan transformasi digital pada sistem pelayanan dan edukasi Museum Blambangan melalui pemanfaatan teknologi *Quick Response Code* (QR Code). QR Code memiliki kapasitas penyimpanan data yang tinggi, kemampuan koreksi kesalahan (*error correction*), serta dapat dipindai secara cepat dan fleksibel menggunakan kamera telepon pintar (*smartphone*) pengunjung tanpa memerlukan instalasi aplikasi khusus.

Melalui program Magang Kerja Industri, penulis merancang dan membangun **Fitur Digitalisasi Koleksi (*Musewangi*) dan Integrasi QR Code pada Sistem Informasi di Museum Blambangan Banyuwangi**, yang disinergikan dengan modul pemesanan tiket digital (*Booking Museum*). Melalui fitur *Musewangi*, setiap koleksi dilengkapi dengan QR Code unik yang ditempel pada etalase pameran; ketika dipindai, sistem menyajikan antarmuka detail digital interaktif yang dilengkapi fitur multibahasa (Bahasa Indonesia, Inggris, dan Basa Osing) serta pemutar narasi suara (*audio deskripsi*). Sementara itu, modul *Booking Museum* memfasilitasi reservasi tiket secara daring dengan kontrol kuota sesi, pembayaran terintegrasi kas daerah (QRIS/Bank Jatim), penerbitan E-Tiket ber-QR Code yang dapat diunduh dalam format PDF, serta sistem validasi gerbang (*gate check-in scanner*) di pintu masuk museum.

Integrasi menyeluruh ini diharapkan dapat meningkatkan mutu pelayanan publik, memperluas literasi sejarah bagi generasi muda dan wisatawan internasional, mewujudkan tata kelola tiket yang transparan dan akuntabel, serta mendukung visi Pemerintah Kabupaten Banyuwangi dalam percepatan transformasi digital daerah.

---

## 1.2 Rumusan Masalah
Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam laporan magang ini adalah:
1. Bagaimana merancang dan mengimplementasikan fitur digitalisasi koleksi (*Musewangi*) pada Sistem Informasi Museum Blambangan Banyuwangi yang menyajikan detail artefak sejarah, dukungan informasi multibahasa, dan narasi audio deskripsi?
2. Bagaimana merancang sistem pembuatan, pengelolaan, dan pemindaian QR Code koleksi sebagai media penghubung antara benda pameran fisik di museum dengan basis data digital?
3. Bagaimana mengintegrasikan modul pemesanan tiket (*Booking Museum*) berbasis QR Code yang memfasilitasi penerbitan e-ticket, pengunduhan berkas PDF, serta validasi tiket di pintu masuk secara *real-time*?

---

## 1.3 Tujuan
Tujuan dari pelaksanaan magang dan perancangan sistem ini adalah:
1. Menghasilkan modul digitalisasi koleksi (*Musewangi*) yang mampu menyajikan informasi komprehensif mengenai benda cagar budaya Museum Blambangan secara interaktif dalam berbagai bahasa (Indonesia, Inggris, dan Osing) beserta pemutar audio deskripsi suara.
2. Mengimplementasikan generator QR Code dinamis untuk pelabelan etalase koleksi serta fitur pemindai QR berbasis peramban web (*web camera scanner*) yang memudahkan pengunjung mengakses data koleksi seketika.
3. Membangun modul *Booking Museum* yang mengintegrasikan pembuatan QR Code tiket kunjungan, pengelolaan E-Ticket, ekspor tiket berformat PDF, serta antarmuka verifikasi *gate check-in* untuk mencegah duplikasi tiket dan mempermudah operasional loket.

---

## 1.4 Manfaat
Pelaksanaan kegiatan magang dan perancangan sistem ini diharapkan memberikan manfaat bagi pihak-pihak terkait sebagai berikut:

### 1.4.1 Manfaat Bagi Dinas Kebudayaan dan Pariwisata (Museum Blambangan)
1. Memodernisasi sarana edukasi museum menjadi lebih interaktif, inklusif, dan berdaya saing internasional melalui penyajian koleksi digital multibahasa dan audio pemandu.
2. Meningkatkan akuntabilitas, transparansi, dan efisiensi manajemen pendapatan tiket kunjungan melalui sistem reservasi daring dan validasi QR Code yang terintegrasi.
3. Mempermudah petugas museum dalam menginventarisasi, memperbarui, dan mencetak label QR Code koleksi benda sejarah.

### 1.4.2 Manfaat Bagi Politeknik Negeri Banyuwangi
1. Memperkuat kemitraan strategis dan link and match antara perguruan tinggi vokasi dengan instansi pemerintah daerah.
2. Menguji dan mengimplementasikan kurikulum Program Studi Sarjana Terapan TRPL terhadap permasalahan operasional dan rekayasa perangkat lunak nyata.
3. Menjadi referensi pustaka dan rujukan akademik mengenai perancangan sistem informasi kebudayaan berbasis teknologi web modern dan QR Code.

### 1.4.3 Manfaat Bagi Mahasiswa
1. Mengasah kompetensi teknis dalam rekayasa perangkat lunak *full-stack*, perancangan UI/UX, integrasi engine QR Code, manipulasi canvas, serta implementasi *Web Speech API*.
2. Memperoleh pengalaman praktis dalam menganalisis kebutuhan operasional birokrasi pemerintahan dan mengkonversinya menjadi solusi perangkat lunak yang solutif.
3. Meningkatkan kemampuan *problem solving*, komunikasi profesional, dan adaptasi kerja di lingkungan Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi.

---

## 1.5 Batasan Masalah
Agar pembahasan dalam laporan ini tetap terfokus dan terarah sesuai lingkup penugasan magang, maka ditetapkan batasan masalah sebagai berikut:
1. Sistem dikembangkan berbasis aplikasi web responsif menggunakan pustaka **React 19**, bahasa pemrograman **TypeScript**, serta kerangka kerja antarmuka **Tailwind CSS**.
2. Lingkup fitur **Musewangi (Digitalisasi Koleksi)** meliputi:
   - Pembuatan dan pengelolaan data serta QR Code koleksi benda sejarah Museum Blambangan.
   - Fitur pemindaian (*scanner*) QR Code koleksi menggunakan kamera peramban web (*HTML5 camera API / jsQR*).
   - Tampilan detail informasi koleksi digital yang mencakup nama, masa/era sejarah, dimensi, kategori, ruang pamer, dan narasi sejarah.
   - Penyajian informasi multibahasa dengan tiga opsi bahasa: Bahasa Indonesia, Bahasa Inggris (*English*), dan Basa Osing Banyuwangi.
   - Fitur pemutar audio deskripsi koleksi yang menarasikan teks sejarah (*audio tour guide*).
3. Lingkup fitur **Booking Museum (Tiket Kunjungan)** meliputi:
   - Pemesanan tiket masuk secara daring dengan pembagian sesi kunjungan dan kontrol kapasitas kuota.
   - Pembayaran resmi Pendapatan Asli Daerah (PAD) melalui QRIS dan transfer Bank Jatim.
   - Penerbitan E-Tiket ber-QR Code unik dan pengunduhan berkas tiket berformat PDF menggunakan pustaka `jspdf` dan `html2canvas`.
   - Modul validasi dan pemindaian QR Code tiket di gerbang masuk (*gate check-in*) oleh petugas loket untuk verifikasi status kehadiran pengunjung.
4. Pengelolaan data sistem dan status transaksi diimplementasikan menggunakan manajemen *state* terpusat (*React Context API*) yang tersinkronisasi dengan penyimpanan lokal terstruktur (*structured local storage*) untuk menjamin persistensi data selama demonstrasi dan pengujian operasional.
