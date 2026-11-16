import type { KoleksiItem, KuratorialCategory } from '../types';

export const KURATORIAL_CATEGORIES: { name: KuratorialCategory; desc: string; color: string; badge: string }[] = [
  { 
    name: 'Arkeologi', 
    desc: 'Benda purbakala era klasik candi, prasasti, dan arca peninggalan peradaban Hindu-Buddha.',
    color: 'from-amber-600 to-amber-800',
    badge: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  { 
    name: 'Etnografi', 
    desc: 'Benda budaya, senjata tradisional, dan perlengkapan adat suku Osing & Blambangan.',
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  { 
    name: 'Seni Rupa & Kriya', 
    desc: 'Kain batik tulis motif khas Banyuwangi, ukiran kayu, dan mahakarya kriya bersejarah.',
    color: 'from-purple-600 to-purple-800',
    badge: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  { 
    name: 'Filologi', 
    desc: 'Manuskrip kuno, naskah daun lontar, dan babad beraksara Kawi & Pegon.',
    color: 'from-emerald-600 to-emerald-800',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  { 
    name: 'Keramologi', 
    desc: 'Guci, piring, dan keramik impor peninggalan jalur sutra maritim Selat Bali.',
    color: 'from-cyan-600 to-cyan-800',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  { 
    name: 'Numismatika & Heraldika', 
    desc: 'Mata uang kuno, gobog wayang, dan lambang kekuasaan kerajaan masa lampau.',
    color: 'from-yellow-600 to-yellow-800',
    badge: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  { 
    name: 'Teknologi Tradisional', 
    desc: 'Peralatan pertanian agraris kuno, alat tenun, dan teknologi nelayan pesisir.',
    color: 'from-rose-600 to-rose-800',
    badge: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  { 
    name: 'Geologi', 
    desc: 'Batuan vulkanik, fosil alam, dan keanekaragaman geologis kawasan Ijen Geopark.',
    color: 'from-slate-600 to-slate-800',
    badge: 'bg-slate-100 text-slate-800 border-slate-300'
  },
];

export const INITIAL_KOLEKSI: KoleksiItem[] = [
  {
    id: 'kol-1',
    namaKoleksi: 'Keris Luk 13 Dhapur Sengkelat Era Blambangan',
    noRegistrasi: 'MB-ETN-2024-001',
    noRegistrasiLama: '003/BWI/2020',
    kodeUnik: 'keris-luk-13-sengkelat',
    kategori: 'Etnografi',
    jenisBenda: 'Senjata Tradisional Pusaka',
    tahunPembuatan: 'Abad ke-16 Masehi',
    asal: 'Macanputih, Kabat, Banyuwangi (Era Prabu Tawangalun)',
    kondisi: 'Baik',
    deskripsi: 'Keris bersejarah dengan pamor Beras Wutah peninggalan era puncak kejayaan Kerajaan Blambangan abad ke-16. Bilah keris berbahan besi meteorit dengan warangka kayu timoho lamen ukiran khas pesisir timur Jawa.',
    fotoUrl: '/assets/koleksi/koleksi-keris-sengkelat.png',
    audioGuideUrl: 'Narasi Sejarah Keris Sengkelat Luk 13 Blambangan'
  },
  {
    id: 'kol-2',
    namaKoleksi: 'Stupika Muncar',
    noRegistrasi: '006/ BWI/ 2026',
    noRegistrasiLama: 'MB-ARK-006',
    kodeUnik: 'stupika-muncar',
    kategori: 'Arkeologi',
    jenisBenda: 'Stupa Miniatur Terakota Religius',
    tahunPembuatan: 'Abad ke-14 Masehi',
    asal: 'Gumuk Klinting, Muncar, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Stupika tanah liat terakota peninggalan era klasik Hindu-Buddha di kawasan Muncar. Berfungsi sebagai sarana persembahyangan dan tanda ziarah suci keagamaan masa Kerajaan Blambangan.',
    fotoUrl: '/assets/koleksi/koleksi-stupika.png',
    audioGuideUrl: 'Narasi Sejarah Stupika Gumuk Klinting'
  },
  {
    id: 'kol-3',
    namaKoleksi: 'Dhyani Bodhisattva Muncar',
    noRegistrasi: '001/ BWI/ 2026',
    noRegistrasiLama: 'MB-ARK-001',
    kodeUnik: 'dhyani-bodhisattva-muncar',
    kategori: 'Arkeologi',
    jenisBenda: 'Tablet Terakota Religius',
    tahunPembuatan: 'Abad ke-14 Masehi',
    asal: 'Tambakrejo, Muncar, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Tablet tanah liat berbentuk oval yang menggambarkan Dhyani Bodhisattva duduk di atas singgasana teratai (Padmasana) dalam posisi Ardhaparyanka dengan sikap tangan Waramudra peninggalan era Majapahit-Blambangan.',
    fotoUrl: '/assets/koleksi/koleksi-dhyani-bodhisattva.png',
    audioGuideUrl: 'Narasi Sejarah Dhyani Bodhisattva Muncar'
  },
  {
    id: 'kol-4',
    namaKoleksi: 'Arca Dewa Siliragung',
    noRegistrasi: '86/BWI/2015',
    noRegistrasiLama: 'MB-ARK-086',
    kodeUnik: 'arca-dewa-siliragung',
    kategori: 'Arkeologi',
    jenisBenda: 'Arca Batu Andesit Klasik',
    tahunPembuatan: 'Abad ke-14 Masehi',
    asal: 'Gumuk Kancil, Siliragung, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Arca Dewa berbahan batu andesit vulkanik dengan pahatan halus atribut kedewaan klasik Hindu peninggalan peradaban Blambangan selatan.',
    fotoUrl: '/assets/koleksi/koleksi-arca-dewa.png',
    audioGuideUrl: 'Narasi Arca Dewa Andesit Gumuk Kancil'
  },
  {
    id: 'kol-5',
    namaKoleksi: 'Kain Batik Tulis Motif Gajah Oling Klasik',
    noRegistrasi: 'MB-SRK-2024-004',
    noRegistrasiLama: '012/BWI/2021',
    kodeUnik: 'batik-tulis-gajah-oling-klasik',
    kategori: 'Seni Rupa & Kriya',
    jenisBenda: 'Tekstil Tradisional Adat',
    tahunPembuatan: 'Tahun 1910',
    asal: 'Desa Adat Kemiren, Glagah, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Kain batik tulis tradisional tertua khas Banyuwangi dengan pewarnaan alami kulit pohon soga dan indigo. Motif Gajah Oling melambangkan kebesaran dan rasa syukur kepada Sang Maha Pencipta (Sing Eling).',
    fotoUrl: '/assets/koleksi/koleksi-batik-gajah-oling.png',
    audioGuideUrl: 'Narasi Filosofi Motif Batik Gajah Oling'
  },
  {
    id: 'kol-6',
    namaKoleksi: 'Naskah Lontar Babad Blambangan',
    noRegistrasi: 'MB-FIL-2024-003',
    noRegistrasiLama: '008/BWI/2019',
    kodeUnik: 'naskah-lontar-babad-blambangan',
    kategori: 'Filologi',
    jenisBenda: 'Manuskrip Kuno Bersejarah',
    tahunPembuatan: 'Tahun 1772 Masehi',
    asal: 'Temenggungan, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Naskah kuno berbahan daun lontar dengan aksara Jawa Kawi yang mendokumentasikan babak perjuangan Wong Agung Wilis dan Perang Puputan Bayu tahun 1771 melawan VOC Belanda.',
    fotoUrl: '/assets/koleksi/koleksi-naskah-lontar.png',
    audioGuideUrl: 'Narasi Naskah Lontar Babad Blambangan'
  },
  {
    id: 'kol-7',
    namaKoleksi: 'Guci Seladon Dinasti Ming Abad ke-16',
    noRegistrasi: 'MB-KRM-2024-005',
    noRegistrasiLama: '015/BWI/2018',
    kodeUnik: 'guci-seladon-dinasti-ming',
    kategori: 'Keramologi',
    jenisBenda: 'Keramik Stoneware Kuno',
    tahunPembuatan: 'Abad ke-16 Dinasti Ming',
    asal: 'Perairan Grajagan, Purwoharjo, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Guci keramik stoneware berglasir hijau seladon peninggalan jalur sutra maritim Selat Bali era Dinasti Ming, dihiasi motif ukir timbul naga dan bunga peony.',
    fotoUrl: '/assets/koleksi/koleksi-guci-seladon.png',
    audioGuideUrl: 'Narasi Jalur Sutra Maritim Guci Seladon'
  },
  {
    id: 'kol-8',
    namaKoleksi: 'Mata Uang Kuno Gobog Wayang Blambangan',
    noRegistrasi: 'MB-NUM-2024-006',
    noRegistrasiLama: '020/BWI/2022',
    kodeUnik: 'gobog-wayang-blambangan',
    kategori: 'Numismatika & Heraldika',
    jenisBenda: 'Mata Uang Perunggu Kuno',
    tahunPembuatan: 'Abad ke-15 Masehi',
    asal: 'Situs Keraton Macanputih, Kabat, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Mata uang perunggu tradisional bermotif relief tokoh pewayangan dan aksara sandi kerajaan, digunakan sebagai alat tukar resmi dan sarana upacara ritual adat.',
    fotoUrl: '/assets/koleksi/koleksi-gobog-wayang.png',
    audioGuideUrl: 'Narasi Mata Uang Gobog Wayang Blambangan'
  },
  {
    id: 'kol-9',
    namaKoleksi: 'Patung Royo Blonyo Kuno',
    noRegistrasi: '009/ BWI/ 2026',
    noRegistrasiLama: 'MB-ETN-009',
    kodeUnik: 'patung-royo-blonyo',
    kategori: 'Etnografi',
    jenisBenda: 'Patung Kayu Pengantin Tradisional',
    tahunPembuatan: 'Abad ke-19',
    asal: 'Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Patung Royo Blonyo ini melambangkan keharmonisan rumah tangga, kesuburan, serta kemakmuran, dan sering kali diasosiasikan sebagai wujud dari Dewa Wisnu dan Dewi Sri. Diletakkan di ruang tengah (sentong) rumah tradisional.',
    fotoUrl: '/assets/koleksi/koleksi-patung-royo-blonyo.png',
    audioGuideUrl: 'Narasi Filosofi Patung Royo Blonyo'
  },
  {
    id: 'kol-10',
    namaKoleksi: 'Bata Merah Kuno Keraton Macanputih',
    noRegistrasi: '002/ BWI/ 2026',
    noRegistrasiLama: 'MB-SRK-002',
    kodeUnik: 'bata-merah-kuno-macanputih',
    kategori: 'Seni Rupa & Kriya',
    jenisBenda: 'Struktur Arsitektur Benteng Kuno',
    tahunPembuatan: 'Abad ke-15 Masehi',
    asal: 'Situs Keraton Macanputih, Kabat, Banyuwangi',
    kondisi: 'Baik',
    deskripsi: 'Bata merah kuno berukuran tebal dengan teknik pembakaran tradisional, peninggalan struktur benteng pertahanan dan istana Keraton Macanputih masa kejayaan Prabu Tawangalun.',
    fotoUrl: '/assets/koleksi/koleksi-bata-merah.png',
    audioGuideUrl: 'Narasi Benteng Bata Merah Macanputih'
  }
];
