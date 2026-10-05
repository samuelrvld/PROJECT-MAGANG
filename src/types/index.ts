export type BookingStatus = 'Menunggu Verifikasi' | 'Terverifikasi' | 'Ditolak';

export type CategoryType = 
  | 'Pelajar/Mahasiswa' 
  | 'Umum' 
  | 'Mancanegara' 
  | 'Pelajar Rombongan'
  | 'Pelajar' 
  | 'Luar Negeri';

export interface Booking {
  id: string; // e.g. "MB-20250815-0012"
  nama: string;
  jumlahOrang: number;
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

export interface AdminNotification {
  id: string;
  title: string;
  bookingId: string;
  nama: string;
  time: string;
  read: boolean;
  type: 'booking_baru' | 'bukti_diterima' | 'pembayaran_ditolak' | 'tiket_terbit';
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

export type MusewangiCategory = 'Arkeologi' | 'Etnografi' | 'Historika' | 'Numismatika' | 'Filologi';

export interface MusewangiArtifact {
  id: string; // e.g. "MW-ARK-001"
  noRegistrasi: string; // e.g. "03.01.MB.1982"
  nama: string;
  kategori: MusewangiCategory;
  era: string;
  lokasiPameran: string;
  dimensi: string;
  gambarUrl: string;
  deskripsiId: string;
  deskripsiEn: string;
  deskripsiOsing: string;
  audioNarrative?: string;
  qrPayload: string; // e.g. "MUSEWANGI:MW-ARK-001"
  createdAt: string;
}

