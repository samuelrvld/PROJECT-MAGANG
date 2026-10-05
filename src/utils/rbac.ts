import type { AdminRole } from '../types';
import type { AppView } from '../context/BookingContext';

export interface RoleConfig {
  role: AdminRole;
  title: string;
  badgeColor: string;
  description: string;
  allowedViews: AppView[];
  allowedFeatures: string[];
  restrictedFeatures: string[];
}

export const ROLE_CONFIGS: Record<AdminRole, RoleConfig> = {
  'Superadmin': {
    role: 'Superadmin',
    title: 'Super Administrator & Koordinator',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Akses penuh ke seluruh modul, konfigurasi kuota, waktu ISHOMA, dan manajemen akun staf.',
    allowedViews: [
      'admin-dashboard',
      'admin-orders',
      'admin-order-detail',
      'admin-ticket-view',
      'admin-scan',
      'admin-collections',
      'admin-visitors',
      'admin-reports',
      'admin-users',
      'admin-settings',
      'admin-notifications',
    ],
    allowedFeatures: [
      'Semua modul sistem tanpa batasan',
      'Ubah kuota sesi & jam buka/tutup museum',
      'Tambah, edit, dan nonaktifkan akun petugas',
      'Reset data & konfigurasi operasional'
    ],
    restrictedFeatures: []
  },
  'Verifikator': {
    role: 'Verifikator',
    title: 'Verifikator Pesanan & E-Tiket',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Fokus pada pemeriksaan keabsahan mutasi/bukti transfer QRIS dan penerbitan tiket resmi.',
    allowedViews: [
      'admin-dashboard',
      'admin-orders',
      'admin-order-detail',
      'admin-ticket-view',
      'admin-visitors',
      'admin-notifications',
    ],
    allowedFeatures: [
      'Review dan verifikasi bukti transfer QRIS',
      'Penerbitan e-tiket resmi museum',
      'Tolak pesanan disertai alasan spesifik',
      'Pencarian dan monitoring data wisatawan'
    ],
    restrictedFeatures: [
      'Konfigurasi kuota & jadwal sesi kunjungan',
      'Manajemen akun dan penambahan petugas baru',
      'Pengaturan nomor rekening dan QRIS kas daerah'
    ]
  },
  'Petugas Loket': {
    role: 'Petugas Loket',
    title: 'Petugas Loket & Validasi Gate',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'Bertanggung jawab di garda depan: pemindaian kamera QR check-in gate dan tiket walk-in.',
    allowedViews: [
      'admin-dashboard',
      'admin-orders',
      'admin-scan',
      'admin-order-detail',
      'admin-ticket-view',
      'admin-notifications',
    ],
    allowedFeatures: [
      'Pindai QR tiket via kamera check-in gate masuk',
      'Penerbitan tiket langsung di tempat (Walk-In POS)',
      'Cek status kehadiran wisatawan harian',
      'Pencatatan pembayaran tunai di loket fisik'
    ],
    restrictedFeatures: [
      'Audit dan ekspor laporan keuangan PAD',
      'Perubahan konfigurasi sistem dan kuota harian',
      'Manajemen akun staf administrator'
    ]
  },
  'Keuangan': {
    role: 'Keuangan',
    title: 'Bagian Keuangan & Kurasi Budaya',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Mengelola pembukuan pendapatan retribusi daerah (PAD) dan pendataan katalog artefak cagar budaya.',
    allowedViews: [
      'admin-dashboard',
      'admin-visitors',
      'admin-reports',
      'admin-collections',
      'admin-notifications',
    ],
    allowedFeatures: [
      'Ekspor laporan retribusi kunjungan (Excel / PDF)',
      'Rekap transaksi harian, bulanan, dan tahunan',
      'Katalogisasi & digitalisasi cagar budaya Musewangi',
      'Pencetakan label QR akrilik showcase museum'
    ],
    restrictedFeatures: [
      'Pemindaian kamera gate masuk (dipegang Petugas Loket)',
      'Konfigurasi jadwal shift dan kuota pengunjung',
      'Penghapusan akun staf dan mutasi hak akses'
    ]
  }
};

export const hasPermission = (role: AdminRole | undefined, viewId: AppView): boolean => {
  if (!role) return false;
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedViews.includes(viewId);
};

export interface MatrixRow {
  modul: string;
  deskripsi: string;
  superadmin: boolean;
  verifikator: boolean;
  petugasLoket: boolean;
  keuangan: boolean;
}

export const PERMISSION_MATRIX: MatrixRow[] = [
  {
    modul: 'Verifikasi Pesanan & Bukti Bayar',
    deskripsi: 'Memvalidasi struk transfer dan menerbitkan E-Tiket QR',
    superadmin: true,
    verifikator: true,
    petugasLoket: false,
    keuangan: false,
  },
  {
    modul: 'Validasi & Pindai QR Gate Masuk',
    deskripsi: 'Scanner kamera gerbang masuk untuk check-in pengunjung',
    superadmin: true,
    verifikator: false,
    petugasLoket: true,
    keuangan: false,
  },
  {
    modul: 'Tiket Langsung Loket (Walk-In POS)',
    deskripsi: 'Menerbitkan tiket tunai bagi pengunjung yang datang langsung',
    superadmin: true,
    verifikator: true,
    petugasLoket: true,
    keuangan: false,
  },
  {
    modul: 'Kurasi Koleksi Musewangi & Cetak Label',
    deskripsi: 'Manajemen narasi cagar budaya dan label akrilik etalase',
    superadmin: true,
    verifikator: false,
    petugasLoket: false,
    keuangan: true,
  },
  {
    modul: 'Laporan Rekap Retribusi & Ekspor PAD',
    deskripsi: 'Download rekap PDF/Excel pendapatan daerah dan grafik',
    superadmin: true,
    verifikator: false,
    petugasLoket: false,
    keuangan: true,
  },
  {
    modul: 'Pengaturan Sesi, Jam Buka & Kuota',
    deskripsi: 'Konfigurasi batasan kuota per sesi dan waktu ISHOMA',
    superadmin: true,
    verifikator: false,
    petugasLoket: false,
    keuangan: false,
  },
  {
    modul: 'Manajemen Petugas & Hak Akses Akun',
    deskripsi: 'Mendaftarkan, mengedit, dan menonaktifkan akun staf',
    superadmin: true,
    verifikator: false,
    petugasLoket: false,
    keuangan: false,
  },
];
