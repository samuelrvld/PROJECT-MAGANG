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
# BAB 2: GAMBARAN UMUM INSTANSI

## 2.1 Sejarah Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi
Dinas Kebudayaan dan Pariwisata (Disbudpar) Kabupaten Banyuwangi merupakan unsur pelaksana urusan pemerintahan daerah yang mempunyai tanggung jawab penuh dalam penyelenggaraan urusan wajib dan pilihan di bidang kebudayaan dan pariwisata. Perkembangan kelembagaan dinas ini melalui proses penataan organisasi perangkat daerah yang panjang seiring dengan dinamika kebijakan otonomi daerah dan peraturan perundang-undangan nasional.

Sebelum berdiri secara mandiri, urusan kebudayaan di Kabupaten Banyuwangi melekat pada Dinas Pendidikan dan Kebudayaan. Pada era tersebut, pembinaan kebudayaan lebih difokuskan pada ranah pendidikan karakter dan apresiasi seni di lingkungan sekolah. Di sisi lain, urusan pariwisata dikelola secara terpisah oleh dinas yang mengurusi pariwisata dan promosi destinasi. 

Transformasi kelembagaan secara fundamental terjadi pasca diberlakukannya Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah dan Peraturan Pemerintah Nomor 18 Tahun 2016 tentang Perangkat Daerah. Kebijakan ini mengamanatkan penataan perangkat daerah berdasarkan prinsip efisiensi, efektivitas, besaran beban kerja, serta keterikatan fungsi strategis. Mengingat sektor kebudayaan dan pariwisata di Kabupaten Banyuwangi memiliki keterikatan yang sangat eratâ€”di mana kekayaan adat, seni tradisi, dan cagar budaya menjadi fondasi utama daya tarik kepariwisataan daerah (*cultural tourism*)â€”Pemerintah Kabupaten Banyuwangi kemudian menggabungkan kedua sektor tersebut ke dalam satu organisasi perangkat daerah melalui Peraturan Daerah Kabupaten Banyuwangi Nomor 6 Tahun 2020 tentang Pembentukan dan Susunan Perangkat Daerah.

Penataan kelembagaan tersebut disempurnakan lebih lanjut melalui Peraturan Bupati Banyuwangi Nomor 44 Tahun 2024 tentang Kedudukan, Susunan Organisasi, Tugas, dan Fungsi serta Tata Kerja Dinas Kebudayaan dan Pariwisata. Berdasarkan regulasi terkini tersebut, Disbudpar Kabupaten Banyuwangi bertugas membantu Bupati dalam memimpin, mengoordinasikan, dan melaksanakan urusan pemerintahan konkuren bidang kebudayaan dan kepariwisataan yang menjadi kewenangan daerah.

### 2.1.1 Visi Dinas Kebudayaan dan Pariwisata
Visi pembangunan daerah Kabupaten Banyuwangi yang menjadi haluan kerja Dinas Kebudayaan dan Pariwisata adalah:  
**"Mewujudkan Banyuwangi yang Maju, Sejahtera, dan Berkah untuk Semua"**

Visi ini menekankan keberlanjutan pembangunan ekonomi berbasis kerakyatan dengan tetap menjaga kelestarian kearifan lokal, stabilitas sosial, dan daya dukung lingkungan kebudayaan yang inklusif bagi seluruh lapisan masyarakat.

### 2.1.2 Misi Dinas Kebudayaan dan Pariwisata
Berdasarkan visi pembangunan daerah, misi kepala daerah yang secara langsung menjadi penugasan Disbudpar Kabupaten Banyuwangi meliputi:
1. **Mewujudkan pertumbuhan ekonomi Kabupaten Banyuwangi yang mandiri dan berkelanjutan berbasis pariwisata dan ekonomi kreatif.** Misi ini mengarahkan sektor pariwisata menjadi penggerak utama multiplier effect bagi pendapatan daerah dan kesejahteraan masyarakat lokal.
2. **Meningkatkan pelestarian kebudayaan, cagar budaya, dan kearifan lokal.** Misi ini menempatkan kebudayaan tidak sekadar sebagai komoditas tontonan, melainkan sebagai jati diri peradaban Banyuwangi yang wajib dilindungi, dikembangkan, dimanfaatkan, dan dibina secara berkelanjutan.

---

## 2.2 Gambaran Pelaksanaan Tugas Dinas Kebudayaan dan Pariwisata
Dalam menjalankan tugas pokok dan fungsinya, Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi mengintegrasikan tiga tahapan kerja manajerial, yaitu:
1. **Tahap Perencanaan Program**: Penyusunan Rencana Kerja Tahunan (Renja), Rencana Kinerja Tahunan (RKT), serta Dokumen Pelaksanaan Anggaran (DPA) yang diselaraskan dengan Rencana Strategis (Renstra) Disbudpar.
2. **Tahap Pelaksanaan dan Pelayanan Publik**: Implementasi program pelestarian kesenian daerah, pembinaan sanggar, pengelolaan cagar budaya, permuseuman, fasilitasi promosi pariwisata (*Banyuwangi Festival*), dan pelayanan perizinan kebudayaan.
3. **Tahap Monitoring, Evaluasi, dan Pelaporan**: Pengukuran capaian Indikator Kinerja Utama (IKU), evaluasi efektivitas kegiatan, pengawasan pendapatan retribusi daerah, dan pertanggungjawaban akuntabilitas kinerja instansi pemerintah.

Dalam struktur Disbudpar, **Bidang Kebudayaan** memegang peranan krusial dalam inventarisasi kesenian, pelestarian adat tradisi, pendaftaran cagar budaya, serta pembinaan teknis museum daerah.

---

## 2.3 Profil Museum Blambangan dan Penerapan Teknologi Informasi
Museum Blambangan yang berlokasi di Kompleks Dinas Kebudayaan dan Pariwisata (Jl. Jenderal Ahmad Yani No. 78 Banyuwangi) merupakan museum umum tingkat daerah kebanggaan masyarakat Blambangan. Diresmikan pada tanggal 25 Desember 1977, museum ini dinamai berdasarkan nama kerajaan bersejarah yang pernah berjaya di ujung timur Pulau Jawa, yakni Kerajaan Blambangan.

Museum Blambangan menyimpan lebih dari 4.000 koleksi benda bersejarah yang terbagi ke dalam berbagai klasifikasi kebudayaan, antara lain:
- **Koleksi Arkeologi**: Kapak batu neolitikum, beliung persegi, manik-manik purba, dan sarkofagus prasejarah.
- **Koleksi Historika & Relik Kerajaan**: Arca Siwa, relief terakota era Majapahit, prasasti batu, uang kepeng (koleksi numismatika), serta meriam kuno peninggalan VOC.
- **Koleksi Etnografi**: Baju adat Osing, batik Banyuwangi motif klasik (*Gajah Oling*, *Kangkung Setingsing*), perlengkapan tari Gandrung dan Seblang, wayang kulit khas Banyuwangi, serta peralatan pertanian tradisional.

### Penerapan Teknologi Informasi pada Museum Blambangan
Sebagai wujud adaptasi terhadap kemajuan era Industri 4.0 dan Society 5.0, Museum Blambangan berupaya mentransformasikan operasionalnya menuju *Smart Heritage Museum*. Integrasi teknologi informasi yang dikembangkan mencakup dua domain utama:
1. **Digitalisasi Informasi Koleksi (*Musewangi*)**: Penggantian label pameran fisik dengan media informasi digital interaktif. Setiap benda pameran terhubung dengan kode respon cepat (*Quick Response Code / QR Code*). Pengunjung cukup memindai QR Code menggunakan ponsel pintar untuk membuka laman katalog interaktif yang menyediakan informasi mendalam, opsi alih bahasa (multilingual), dan panduan suara (*audio deskripsi*).
2. **Sistem Pemesanan Tiket Daring (*Booking Museum*)**: Penggantian karcis manual dengan sistem e-ticketing berbasis web. Sistem ini memungkinkan pengunjung memesan tiket sesuai tanggal dan sesi kunjungan, melakukan pembayaran digital Pendapatan Asli Daerah (PAD) melalui QRIS atau transfer Bank Jatim, menerima tiket digital berformat PDF yang dilengkapi barcode dan QR Code, serta memverifikasi kehadiran di loket gerbang melalui *gate scanner*.

Penerapan teknologi ini secara nyata meningkatkan akurasi data kunjungan, transparansi keuangan kas daerah, efisiensi waktu pelayanan loket, serta memberikan pengalaman edukasi yang lebih berkesan dan aksesibel bagi wisatawan domestik maupun internasional.

---

## 2.4 Data Pembimbing Lapang
Dalam pelaksanaan Magang Kerja Industri di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi, penulis berada di bawah bimbingan dan arahan langsung dari Pembimbing Lapang:

- **Nama Lengkap**: Eko Ari Bawanto, S.Sn.
- **Nama Panggilan**: Mas Eko
- **NIP**: 19940812 202406 1 002
- **Tempat, Tanggal Lahir**: Banyuwangi, 07 Oktober 1978
- **Alamat**: Labanasem RT.03 / RW.06, Desa Labansukadi, Kec. Kabat, Kabupaten Banyuwangi
- **Agama**: Islam
- **Jenis Kelamin**: Laki-laki
- **Jabatan**: Staf Teknis Bidang Kebudayaan / Pembina Pelestarian Cagar Budaya dan Permuseuman Disbudpar Kabupaten Banyuwangi
- **Nomor Telepon**: 0812-4940-7021
# BAB 3: PELAKSANAAN

Pelaksanaan Magang Kerja Industri (MKI) merupakan bagian integral dari kurikulum Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL), Jurusan Bisnis dan Informatika, Politeknik Negeri Banyuwangi. Kegiatan ini ditempuh pada semester tujuh sebagai wahana bagi mahasiswa untuk mengaplikasikan keilmuan rekayasa perangkat lunak pada lingkungan operasional kerja nyata, memahami tata kelola birokrasi pemerintahan, serta memberikan kontribusi teknologi yang bermanfaat bagi instansi mitra.

---

## 3.1 Waktu dan Tempat Pelaksanaan
Kegiatan Magang Kerja Industri dilaksanakan di lingkungan:
- **Instansi**: Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi (Unit Kerja Bidang Kebudayaan / Pengelola Museum Blambangan).
- **Alamat**: Jl. Jenderal Ahmad Yani No. 78, Kelurahan Taman Baru, Kecamatan Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416.

Selama melaksanakan kegiatan MKI, penulis mengikuti ketentuan jam kerja aparatur sipil di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi sebagaimana tercantum pada tabel berikut:

**Tabel 3.1 Jam Kerja Pelaksanaan Magang Kerja Industri**
| Hari | Jam Masuk Pagi | Jam Istirahat (ISHOMA) | Jam Masuk Siang | Jam Pulang |
| :--- | :---: | :---: | :---: | :---: |
| **Senin** | 07.30 WIB | 12.00 â€“ 13.00 WIB | 13.00 WIB | 16.00 WIB |
| **Selasa** | 07.30 WIB | 12.00 â€“ 13.00 WIB | 13.00 WIB | 16.00 WIB |
| **Rabu** | 07.30 WIB | 12.00 â€“ 13.00 WIB | 13.00 WIB | 16.00 WIB |
| **Kamis** | 07.30 WIB | 12.00 â€“ 13.00 WIB | 13.00 WIB | 16.00 WIB |
| **Jumat** | 07.30 WIB | 11.30 â€“ 13.00 WIB | 13.00 WIB | 16.30 WIB |
| **Sabtu** | Libur | Libur | Libur | Libur |
| **Minggu** | Libur | Libur | Libur | Libur |

Penulis melaksanakan tugas harian dengan total 8 jam kerja efektif per hari. Selain bertugas dalam rekayasa perangkat lunak di ruang kerja bidang kebudayaan, penulis juga melakukan observasi lapangan langsung di ruang pameran Museum Blambangan dan loket tiket gerbang masuk.

---

## 3.2 Jadwal Kegiatan
Pelaksanaan Magang Kerja Industri berlangsung selama kurang lebih 4,5 bulan. Rangkaian aktivitas terbagi ke dalam beberapa fase tahapan sistematis rekayasa perangkat lunak, mulai dari adaptasi lingkungan, analisis proses bisnis permuseuman, perancangan antarmuka dan arsitektur data, pengkodean sistem, integrasi QR Code dan audio deskripsi, hingga evaluasi sistem dan penyusunan laporan.

**Tabel 3.2 Matriks Jadwal Kegiatan Magang Kerja Industri**
| No | Rincian Kegiatan Magang | Bulan I | Bulan II | Bulan III | Bulan IV | Bulan V |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1. | **Pengenalan Lingkungan & Observasi**<br>- Orientasi struktur organisasi Disbudpar<br>- Observasi alur pelayanan tiket loket fisik<br>- Observasi penataan etalase koleksi museum | **XXXX** | | | | |
| 2. | **Analisis Kebutuhan Sistem**<br>- Wawancara pembimbing lapang & kurator<br>- Identifikasi artefak dan data inventaris cagar budaya<br>- Analisis kendala tiket kertas dan transparansi PAD | | **XX** | | | |
| 3. | **Perancangan Sistem & Arsitektur**<br>- Pemodelan Entity Relationship Diagram (ERD)<br>- Perancangan antarmuka pengguna (UI/UX wireframing)<br>- Perancangan alur integrasi QR Code koleksi & tiket | | **XX** | | | |
| 4. | **Implementasi Fitur Musewangi (Koleksi Digital)**<br>- Pembuatan generator QR Code koleksi & kartu label<br>- Implementasi pemindai QR berbasis web kamera<br>- Pembuatan halaman detail koleksi multibahasa<br>- Integrasi fitur pemutar audio deskripsi suara | | | **XXXX** | | |
| 5. | **Implementasi Fitur E-Ticketing (Booking Museum)**<br>- Modul pemesanan tiket dengan pembatasan kuota sesi<br>- Pembayaran resmi QRIS & Bank Jatim<br>- Penerbitan E-Tiket QR & unduh berkas PDF<br>- Modul verifikasi loket dan *gate check-in scanner* | | | | **XXX** | |
| 6. | **Pengujian Sistem & Evaluasi**<br>- Pengujian fungsionalitas (*Black Box Testing*)<br>- Simulasi pemindaian QR di ruang pameran museum<br>- Simulasi validasi tiket gerbang bersama petugas loket | | | | **X** | **XX** |
| 7. | **Penyusunan Laporan & Ujian Magang**<br>- Dokumentasi teknis sistem dan kode program<br>- Bimbingan berkala dengan dosen & pembimbing lapang<br>- Penyusunan draf akhir Laporan Magang Kerja Industri | | | | | **XXXX** |

Keterangan: Tanda **X** merepresentasikan alokasi minggu pengerjaan kegiatan pada setiap bulannya.
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
        âœ¦ Pindai untuk Info, Bahasa, & Narasi Audio âœ¦
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
# BAB 5: PENUTUP

## 5.1 Kesimpulan
Berdasarkan kegiatan Magang Kerja Industri (MKI) yang telah dilaksanakan di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi pada unit Museum Blambangan, serta hasil rancang bangun sistem informasi terpadu, dapat ditarik beberapa kesimpulan sebagai berikut:

1. **Efektivitas Digitalisasi Koleksi (*Musewangi*) Melalui Integrasi QR Code**:  
   Implementasi QR Code pada benda pameran berhasil menjembatani keterbatasan media fisik konvensional. Pengunjung dapat mengakses informasi artefak sejarah secara seketika melalui pemindaian kamera *smartphone* tanpa perlu memasang aplikasi tambahan.
   
2. **Peningkatan Aksesibilitas dan Nilai Budaya Berbasis Multibahasa dan Audio Deskripsi**:  
   Penyediaan fitur multibahasa (Bahasa Indonesia, English, dan Basa Osing) memberikan kemudahan bagi wisatawan mancanegara sekaligus menjadi sarana pelestarian bahasa daerah Banyuwangi. Keberadaan fitur audio deskripsi (*voice narration*) meningkatkan inklusivitas bagi pengunjung tunanetra serta menghadirkan pengalaman eksplorasi museum yang lebih hidup dan interaktif.

3. **Optimalisasi Akuntabilitas dan Efisiensi Loket (*Booking Museum*)**:  
   Sistem tiket elektronik terpadu yang memadukan reservasi berjadwal, kuota sesi harian, pembayaran resmi Pendapatan Asli Daerah (PAD) melalui QRIS dan Bank Jatim, serta penerbitan E-Tiket berformat PDF berhasil mengurangi potensi kesalahan pencatatan manual (*human error*) dan mencegah antrean panjang di loket fisik.

4. **Pencegahan Tiket Palsu dan Validasi Masuk Real-Time**:  
   Pemanfaatan modul *gate check-in scanner* berbasis QR Code di pintu masuk museum mampu memvalidasi keabsahan tiket secara *real-time*, memastikan kepatuhan sesi kunjungan, serta mencegah kecurangan pemakaian tiket berulang (*single-entry validation*).

---

## 5.2 Saran
Demi pengembangan dan penyempurnaan sistem informasi Museum Blambangan di masa mendatang, penulis menyampaikan beberapa saran sebagai berikut:

### 1. Bagi Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi (Museum Blambangan)
- **Implementasi Augmented Reality (AR) & Pemindaian 3D**: Disarankan untuk mengembangkan fitur visualisasi 3D pada koleksi tertentu, sehingga pengunjung dapat mengamati rekonstruksi utuh artefak (seperti candi atau arca) secara interaktif 360 derajat.
- **Integrasi Payment Gateway Otomatis**: Melakukan integrasi langsung dengan *Open API Payment Gateway* resmi Bank Jatim agar verifikasi pembayaran tiket berlangsung otomatis tanpa perlu pemeriksaan manual oleh petugas loket.
- **Penyediaan Perangkat Kios Digital**: Menempatkan *kiosk scanner* atau tablet interaktif di lobi utama bagi pengunjung yang tidak membawa telepon pintar berkamera.

### 2. Bagi Politeknik Negeri Banyuwangi
- **Penguatan Materi Teknologi Aksesibilitas dan Komputasi Visual**: Diharapkan program studi TRPL terus memperkaya kurikulum dengan studi kasus teknologi asistif (*Web Speech API*, pembaca layar) dan pengolahan citra (*QR / Barcode engine*) yang relevan dengan kebutuhan digitalisasi sektor publik.
- **Perluasan Kolaborasi Proyek dengan Instansi Pemerintah**: Menjalin kerja sama berkelanjutan agar produk perangkat lunak hasil magang mahasiswa dapat langsung diadopsi ke lingkungan produksi (*production deployment*) instansi daerah.

### 3. Bagi Mahasiswa
- **Pemahaman Proses Bisnis dan Kebutuhan Pengguna Akhir**: Sebelum merancang perangkat lunak, mahasiswa sangat dianjurkan untuk mendalami proses operasional di lapangan, karena solusi teknis yang baik lahir dari pemahaman masalah pengguna yang mendalam.
- **Penerapan Standar Arsitektur Bersih dan Modular**: Membiasakan diri menulis kode yang terstruktur rapi, berorientasi komponen, dan terdokumentasi dengan baik guna memudahkan proses pemeliharaan sistem jangka panjang (*maintainability*).
# DAFTAR PUSTAKA

Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi. (2024). *Rencana Strategis Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi Tahun 2025â€“2029*. Banyuwangi: Pemerintah Kabupaten Banyuwangi.

Koentjaraningrat. (1985). *Kebudayaan, Mentalitas, dan Pembangunan*. Jakarta: Gramedia Pustaka Utama.

Permana, A. A., Gunawan, R., & Abdussalaam, F. (2022). Penerapan Entity Relationship Diagram (ERD) dalam Perancangan Basis Data Sistem Informasi Perpustakaan. *Jurnal Algoritma*, 19(1), 320â€“329.

Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach* (9th ed.). New York: McGraw-Hill Education.

Pemerintah Kabupaten Banyuwangi. (2020). *Peraturan Daerah Kabupaten Banyuwangi Nomor 6 Tahun 2020 tentang Pembentukan dan Susunan Perangkat Daerah*. Banyuwangi: Sekretariat Daerah.

Pemerintah Kabupaten Banyuwangi. (2024). *Peraturan Bupati Banyuwangi Nomor 44 Tahun 2024 tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Dinas Kebudayaan dan Pariwisata*. Banyuwangi: Bagian Hukum Setda Kabupaten Banyuwangi.

Rici, O. K., & Tan, T. (2024). Implementasi Framework dalam Pengembangan Sistem Informasi Manajemen. *Jurnal Ilmiah Sistem Informasi*, 6(1), 22â€“30.

Thomas, J. W. (2000). *A Review of Research on Project-Based Learning*. San Rafael, CA: The Autodesk Foundation.

W3C. (2023). *Web Speech API Specification*. World Wide Web Consortium. Diakses dari https://www.w3.org/TR/speech-api/

World Tourism Organization. (2021). *Digital Transformation in Heritage Tourism & Museum Management*. Madrid: UNWTO.
