export type BookingStatus = 'Menunggu Verifikasi' | 'Terverifikasi' | 'Ditolak';

export type CategoryType = 
  | 'Pelajar/Mahasiswa' 
  | 'Umum' 
  | 'Mancanegara' 
  | 'Pelajar Rombongan'
  | 'Pelajar' 
  | 'Luar Negeri'
  | 'Campuran (Dewasa & Mahasiswa)';

export interface Booking {
  id: string; // e.g. "MB-20250815-0012"
  nama: string;
  jumlahOrang: number;
  jumlahDewasa?: number;
  jumlahMahasiswa?: number;
  jumlahMancanegara?: number;
  rincianPengunjung?: string;
  telepon: string;
  email: string;
  alamat: string;
  kategori: CategoryType;
  hargaPerOrang: number;
  tanggalKunjungan: string; // e.g. "15 Agustus 2025"
  sesi: string; // e.g. "Sesi 2 (10.30 - 12.30)"
  totalPembayaran: number;
  metodePembayaran: string; // "QRIS"
  nomorTransaksi: string;
  tanggalPembayaran: string;
  buktiPembayaranUrl: string;
  status: BookingStatus;
  alasanPenolakan?: string;
  checkInStatus?: 'Belum Hadir' | 'Sudah Masuk';
  checkInTime?: string;
  createdAt: string;
}

export type KuratorialCategory = 
  | 'Arkeologi' 
  | 'Etnografi' 
  | 'Numismatika & Heraldika' 
  | 'Filologi' 
  | 'Keramologi' 
  | 'Seni Rupa & Kriya' 
  | 'Teknologi Tradisional' 
  | 'Geologi';

export interface KoleksiItem {
  id: string;
  namaKoleksi: string;
  noRegistrasi: string;
  noRegistrasiLama?: string;
  kodeUnik: string;
  kategori: KuratorialCategory;
  jenisBenda: string;
  tahunPembuatan: string;
  asal: string;
  kondisi: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Konservasi';
  deskripsi: string;
  fotoUrl: string;
  audioGuideUrl?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  bookingId: string;
  nama: string;
  time: string;
  read: boolean;
  type: 'booking_baru' | 'bukti_diterima' | 'pembayaran_ditolak' | 'tiket_terbit' | 'verifikasi_dibatalkan';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface WalkInBookingInput {
  nama: string;
  jumlahOrang: number;
  jumlahDewasa?: number;
  jumlahMahasiswa?: number;
  jumlahMancanegara?: number;
  rincianPengunjung?: string;
  kategori: CategoryType;
  sesi: string;
  metodePembayaran: 'Tunai (Cash Loket)' | 'QRIS Loket';
  telepon?: string;
  email?: string;
  alamat?: string;
  tanggalKunjungan?: string;
  langsungCheckIn?: boolean;
}

export type AdminRole = 'Superadmin' | 'Verifikator' | 'Petugas Loket' | 'Keuangan';

export interface AdminUser {
  id: string;
  nama: string;
  email: string;
  username: string;
  pass: string;
  role: AdminRole;
  nip?: string;
  nim?: string;
  prodi?: string;
  telepon?: string;
  status: 'Aktif' | 'Nonaktif';
  terakhirLogin?: string;
  createdAt: string;
}

