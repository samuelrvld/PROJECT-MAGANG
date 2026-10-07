import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Booking, AdminNotification, ActivityLog, CategoryType, WalkInBookingInput, AdminUser } from '../types';
import { INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS, INITIAL_ACTIVITIES, INITIAL_ADMINS } from '../data/mockData';
import { 
  type SessionConfig, 
  type IshomaConfig, 
  SESSIONS_CONFIG, 
  DEFAULT_ISHOMA_CONFIG, 
  getStoredSessionsConfig, 
  saveStoredSessionsConfig, 
  getStoredIshomaConfig, 
  saveStoredIshomaConfig, 
  resetStoredScheduleConfig 
} from '../utils/sessionUtils';
import { broadcastSyncEvent, subscribeSyncEvents } from '../utils/cloudSync';
import { supabase } from '../lib/supabase';

export type AppView =
  | 'user-landing'
  | 'user-form'
  | 'user-summary'
  | 'user-qris'
  | 'user-success'
  | 'user-status'
  | 'user-ticket'
  | 'user-mobile-preview'
  | 'user-web-portal'
  | 'user-pitching'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-orders'
  | 'admin-order-detail'
  | 'admin-ticket-view'
  | 'admin-notifications'
  | 'admin-reports'
  | 'admin-settings'
  | 'admin-visitors'
  | 'admin-scan'
  | 'admin-users';

export interface BookingFormData {
  nama: string;
  jumlahOrang: number;
  telepon: string;
  email: string;
  alamat: string;
  kategori: CategoryType;
  tanggalKunjungan: string;
  sesi: string;
}

interface BookingContextType {
  bookings: Booking[];
  notifications: AdminNotification[];
  activities: ActivityLog[];
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  createBooking: (receiptUrl: string) => Booking;
  createWalkInBooking: (input: WalkInBookingInput) => Booking;
  verifyBooking: (id: string) => void;
  rejectBooking: (id: string, reason: string) => void;
  deleteBooking: (id: string) => void;
  checkInBooking: (queryOrId: string, autoVerifyPending?: boolean) => { success: boolean; message: string; booking?: Booking };
  quickVerifyAndCheckIn: (id: string) => { success: boolean; message: string; booking?: Booking };
  undoCheckIn: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  resetAllData: () => void;
  isAdminLoggedIn: boolean;
  admins: AdminUser[];
  currentAdminUser: AdminUser | null;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => AdminUser;
  updateAdmin: (id: string, updated: Partial<AdminUser>) => boolean;
  deleteAdmin: (id: string) => { success: boolean; message: string };
  toggleAdminStatus: (id: string) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  userViewMode: 'web' | 'mobile';
  setUserViewMode: (mode: 'web' | 'mobile') => void;
  myBookings: Booking[];
  myBookingIds: string[];
  addMyBookingId: (id: string) => void;
  removeMyBookingId: (id: string) => void;
  clearAllMyBookings: () => void;
  sessionsConfig: SessionConfig[];
  ishomaConfig: IshomaConfig;
  updateSession: (id: string, updated: Partial<SessionConfig>) => void;
  updateAllSessions: (newSessions: SessionConfig[]) => void;
  updateIshoma: (newIshoma: IshomaConfig) => void;
  resetSchedule: () => void;
  isCloudSyncConnected: boolean;
}

const DEFAULT_FORM_DATA: BookingFormData = {
  nama: '',
  jumlahOrang: 1,
  telepon: '',
  email: '',
  alamat: '',
  kategori: '' as CategoryType,
  tanggalKunjungan: '',
  sesi: '',
};

const viewFromHash = (): AppView => {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const isAuth = localStorage.getItem('blambangan_admin_auth') === 'true';

  if (hash === 'login' || hash === 'admin/login' || hash === 'admin-login') return 'admin-login';
  if (hash === 'admin' || hash.startsWith('admin/')) {
    if (!isAuth) return 'admin-login';
    if (hash === 'admin' || hash === 'admin/dashboard') return 'admin-dashboard';
    if (hash === 'admin/pesanan') return 'admin-orders';
    if (hash === 'admin/detail') return 'admin-order-detail';
    if (hash === 'admin/tiket') return 'admin-ticket-view';
    if (hash === 'admin/notifikasi') return 'admin-notifications';
    if (hash === 'admin/laporan') return 'admin-reports';
    if (hash === 'admin/pengaturan') return 'admin-settings';
    if (hash === 'admin/pengunjung') return 'admin-visitors';
    if (hash === 'admin/scan' || hash === 'admin/validasi' || hash === 'admin/gate') return 'admin-scan';
    if (hash === 'admin/users' || hash === 'admin/petugas' || hash === 'admin/tim' || hash === 'admin-users') return 'admin-users';
    return 'admin-dashboard';
  }
  if (hash === 'booking' || hash === 'booking/form') return 'user-form';
  if (hash === 'booking/ringkasan') return 'user-summary';
  if (hash === 'booking/pembayaran') return 'user-qris';
  if (hash === 'booking/berhasil') return 'user-success';
  if (hash === 'booking/status') return 'user-status';
  if (hash === 'tiket') return 'user-ticket';
  if (hash === 'mobile') return 'user-mobile-preview';
  if (hash === 'portal' || hash === 'tiket-saya') return 'user-web-portal';
  if (hash === 'pitching' || hash === 'video' || hash === 'pitch' || hash === 'video-pitching') return 'user-pitching';
  return 'user-landing';
};

const hashFromView = (view: AppView): string => {
  switch (view) {
    case 'user-landing': return '#/';
    case 'user-form': return '#/booking';
    case 'user-summary': return '#/booking/ringkasan';
    case 'user-qris': return '#/booking/pembayaran';
    case 'user-success': return '#/booking/berhasil';
    case 'user-status': return '#/booking/status';
    case 'user-ticket': return '#/tiket';
    case 'user-mobile-preview': return '#/mobile';
    case 'user-web-portal': return '#/tiket-saya';
    case 'user-pitching': return '#/pitching';
    case 'admin-login': return '#/admin/login';
    case 'admin-dashboard': return '#/admin';
    case 'admin-orders': return '#/admin/pesanan';
    case 'admin-order-detail': return '#/admin/detail';
    case 'admin-ticket-view': return '#/admin/tiket';
    case 'admin-notifications': return '#/admin/notifikasi';
    case 'admin-reports': return '#/admin/laporan';
    case 'admin-settings': return '#/admin/pengaturan';
    case 'admin-visitors': return '#/admin/pengunjung';
    case 'admin-scan': return '#/admin/scan';
    case 'admin-users': return '#/admin/petugas';
    default: return '#/';
  }
};

const mapSupabaseToBooking = (d: any): Booking => ({
  id: d.id,
  nama: d.nama,
  jumlahOrang: Number(d.jumlah_orang) || 1,
  telepon: d.telepon || '-',
  email: d.email || '-',
  alamat: d.alamat || '-',
  kategori: d.kategori || 'Umum',
  hargaPerOrang: Number(d.harga_per_orang) || 7500,
  tanggalKunjungan: d.tanggal_kunjungan || '',
  sesi: d.sesi || '',
  totalPembayaran: Number(d.total_pembayaran) || 7500,
  metodePembayaran: d.metode_pembayaran || 'QRIS',
  nomorTransaksi: d.nomor_transaksi || d.id,
  tanggalPembayaran: d.tanggal_pembayaran || '',
  buktiPembayaranUrl: d.bukti_pembayaran_url || '/assets/sample-receipt.jpg',
  status: d.status || 'Menunggu Verifikasi',
  alasanPenolakan: d.alasan_penolakan || undefined,
  checkInStatus: d.check_in_status || 'Belum Hadir',
  checkInTime: d.check_in_time || undefined,
  createdAt: d.created_at || new Date().toISOString(),
});

const mapBookingToSupabase = (b: Booking) => ({
  id: b.id,
  nama: b.nama,
  jumlah_orang: b.jumlahOrang,
  telepon: b.telepon,
  email: b.email,
  alamat: b.alamat,
  kategori: b.kategori,
  harga_per_orang: b.hargaPerOrang,
  tanggal_kunjungan: b.tanggalKunjungan,
  sesi: b.sesi,
  total_pembayaran: b.totalPembayaran,
  metode_pembayaran: b.metodePembayaran,
  nomor_transaksi: b.nomorTransaksi,
  tanggal_pembayaran: b.tanggalPembayaran,
  bukti_pembayaran_url: b.buktiPembayaranUrl,
  status: b.status,
  alasan_penolakan: b.alasanPenolakan || null,
  check_in_status: b.checkInStatus,
  check_in_time: b.checkInTime || null,
});

const mapSupabaseToAdmin = (d: any): AdminUser => ({
  id: d.id,
  nama: d.nama,
  nim: d.nim || d.nip || '',
  nip: d.nip || d.nim || '',
  prodi: d.prodi || 'D4 Teknologi Rekayasa Perangkat Lunak',
  username: d.username,
  email: d.email,
  pass: d.pass,
  role: d.role,
  status: d.status || 'Aktif',
  terakhirLogin: d.terakhir_login || 'Belum pernah login',
  createdAt: d.created_at || '2026-09-01',
});

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mb_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('mb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('mb_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [activeView, setActiveViewState] = useState<AppView>(viewFromHash);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(() => {
    try {
      const saved = localStorage.getItem('mb_current_booking');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [formData, setFormData] = useState<BookingFormData>(DEFAULT_FORM_DATA);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('blambangan_admin_auth') === 'true';
  });

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  });

  useEffect(() => {
    try {
      localStorage.removeItem('blambangan_view_mode');
    } catch (_) {}

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userViewMode: 'web' | 'mobile' = isDesktop ? 'web' : 'mobile';
  const setUserViewMode = (_mode: 'web' | 'mobile') => {
    // Auto responsive
  };

  const [myBookingIds, setMyBookingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mb_my_booking_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const addMyBookingId = (id: string) => {
    setMyBookingIds(prev => {
      if (prev.includes(id)) return prev;
      const updated = [id, ...prev];
      try {
        localStorage.setItem('mb_my_booking_ids', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const removeMyBookingId = (id: string) => {
    setMyBookingIds(prev => {
      const updated = prev.filter(bId => bId !== id);
      try {
        localStorage.setItem('mb_my_booking_ids', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const clearAllMyBookings = () => {
    setMyBookingIds([]);
    try {
      localStorage.removeItem('mb_my_booking_ids');
    } catch (_) {}
  };

  const [sessionsConfig, setSessionsConfig] = useState<SessionConfig[]>(() => getStoredSessionsConfig());
  const [ishomaConfig, setIshomaConfig] = useState<IshomaConfig>(() => getStoredIshomaConfig());

  const updateSession = (id: string, updated: Partial<SessionConfig>) => {
    setSessionsConfig(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      saveStoredSessionsConfig(next);
      return next;
    });
  };

  const updateAllSessions = (newSessions: SessionConfig[]) => {
    setSessionsConfig(newSessions);
    saveStoredSessionsConfig(newSessions);
  };

  const updateIshoma = (newIshoma: IshomaConfig) => {
    setIshomaConfig(newIshoma);
    saveStoredIshomaConfig(newIshoma);
  };

  const resetSchedule = () => {
    resetStoredScheduleConfig();
    setSessionsConfig(SESSIONS_CONFIG);
    setIshomaConfig(DEFAULT_ISHOMA_CONFIG);
  };

  // Only bookings that belong to this visitor
  const myBookings = bookings.filter(b => 
    myBookingIds.includes(b.id) || (currentBooking && b.id === currentBooking.id)
  );

  // Daftar Administrator Resmi & Manajemen Akun Admin
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('mb_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: any) => a.nama?.includes('Fitria Ayu Pratiwi') || a.nim)) {
          return parsed;
        }
      }
    } catch (_) {}
    return INITIAL_ADMINS;
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('mb_current_admin');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.nama && !parsed.nama.includes('Budi Prasetyo')) {
          return parsed;
        }
      }
    } catch (_) {}
    return INITIAL_ADMINS[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem('mb_admin_users', JSON.stringify(admins));
    } catch (_) {}
  }, [admins]);

  useEffect(() => {
    try {
      if (currentAdminUser) {
        localStorage.setItem('mb_current_admin', JSON.stringify(currentAdminUser));
      } else {
        localStorage.removeItem('mb_current_admin');
      }
    } catch (_) {}
  }, [currentAdminUser]);

  const addAdmin = (newAdminData: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser => {
    const newAdmin: AdminUser = {
      ...newAdminData,
      id: `adm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      terakhirLogin: 'Belum pernah login'
    };
    setAdmins(prev => [newAdmin, ...prev]);

    // Simpan ke Supabase PostgreSQL
    try {
      supabase.from('admin_users').insert({
        id: newAdmin.id,
        nama: newAdmin.nama,
        nim: newAdmin.nim || newAdmin.nip || '',
        nip: newAdmin.nip || newAdmin.nim || '',
        prodi: newAdmin.prodi || 'D4 Teknologi Rekayasa Perangkat Lunak',
        username: newAdmin.username,
        email: newAdmin.email,
        pass: newAdmin.pass,
        role: newAdmin.role,
        status: newAdmin.status,
        terakhir_login: newAdmin.terakhirLogin,
        created_at: newAdmin.createdAt,
      }).then();
    } catch (_) {}

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: currentAdminUser?.nama || 'Superadmin',
      action: `Menambahkan akun admin baru: ${newAdmin.nama} (${newAdmin.role})`,
      target: newAdmin.email,
      timestamp: 'Baru saja'
    };
    setActivities(prev => [newAct, ...prev]);

    return newAdmin;
  };

  const updateAdmin = (id: string, updated: Partial<AdminUser>): boolean => {
    setAdmins(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updated } : a);
      try {
        localStorage.setItem('mb_admin_users', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    if (currentAdminUser && currentAdminUser.id === id) {
      setCurrentAdminUser(prev => {
        const next = prev ? { ...prev, ...updated } : null;
        try {
          if (next) localStorage.setItem('mb_current_admin', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }

    // Update ke Supabase PostgreSQL
    try {
      const updatePayload: Record<string, any> = {};
      if (updated.nama !== undefined) updatePayload.nama = updated.nama;
      if (updated.role !== undefined) updatePayload.role = updated.role;
      if (updated.status !== undefined) updatePayload.status = updated.status;
      if (updated.pass !== undefined) updatePayload.pass = updated.pass;
      if (updated.terakhirLogin !== undefined) updatePayload.terakhir_login = updated.terakhirLogin;
      if (updated.email !== undefined) updatePayload.email = updated.email;
      if (updated.username !== undefined) updatePayload.username = updated.username;
      if (updated.nim !== undefined) updatePayload.nim = updated.nim;
      if (updated.nip !== undefined) updatePayload.nip = updated.nip;

      supabase.from('admin_users').update(updatePayload).eq('id', id).then();
    } catch (_) {}

    const targetAdmin = admins.find(a => a.id === id);
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: currentAdminUser?.nama || 'Superadmin',
      action: `Memperbarui akun petugas: ${targetAdmin?.nama || id} (${updated.status ? `Status diubah ke ${updated.status}` : 'Data diperbarui'})`,
      target: targetAdmin?.email || id,
      timestamp: 'Baru saja'
    };
    setActivities(prev => [newAct, ...prev]);

    // Broadcast ke perangkat lain (HP & Laptop)
    setTimeout(() => {
      const saved = localStorage.getItem('mb_admin_users');
      if (saved) {
        try {
          broadcastSyncEvent({ type: 'UPDATE_ADMINS', admins: JSON.parse(saved) });
        } catch (_) {}
      }
    }, 50);

    return true;
  };

  const deleteAdmin = (id: string): { success: boolean; message: string } => {
    const target = admins.find(a => a.id === id);
    if (!target) return { success: false, message: 'Akun admin tidak ditemukan.' };

    const superadmins = admins.filter(a => a.role === 'Superadmin');
    if (target.role === 'Superadmin' && superadmins.length <= 1) {
      return { success: false, message: 'Gagal! Minimal harus ada 1 Superadmin yang aktif dalam sistem.' };
    }

    setAdmins(prev => prev.filter(a => a.id !== id));
    if (currentAdminUser && currentAdminUser.id === id) {
      setCurrentAdminUser(null);
      setIsAdminLoggedIn(false);
      localStorage.removeItem('blambangan_admin_auth');
      localStorage.removeItem('mb_current_admin');
      setActiveView('admin-login');
    }

    // Hapus dari Supabase PostgreSQL
    try {
      supabase.from('admin_users').delete().eq('id', id).then();
    } catch (_) {}

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: currentAdminUser?.nama || 'Superadmin',
      action: `Menghapus akun admin: ${target.nama} (${target.role})`,
      target: target.email,
      timestamp: 'Baru saja'
    };
    setActivities(prev => [newAct, ...prev]);

    return { success: true, message: `Akun admin ${target.nama} berhasil dihapus.` };
  };

  const toggleAdminStatus = (id: string) => {
    const target = admins.find(a => a.id === id);
    if (!target) return;
    const newStatus = target.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    updateAdmin(id, { status: newStatus });
  };

  const loginAdmin = (inputEmailOrNip: string, pass: string): boolean => {
    const cleanId = inputEmailOrNip.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matchedAdmin = admins.find(
      (a) =>
        (a.email.toLowerCase() === cleanId ||
         a.username.toLowerCase() === cleanId ||
         (a.nip && a.nip.toLowerCase() === cleanId) ||
         (a.nim && a.nim.toLowerCase() === cleanId)) &&
        a.pass === cleanPass
    );

    if (matchedAdmin) {
      if (matchedAdmin.status === 'Nonaktif') {
        alert('Akun admin ini dinonaktifkan oleh Administrator. Hubungi Superadmin.');
        return false;
      }

      const nowStr = `Hari ini, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')} WIB`;
      updateAdmin(matchedAdmin.id, { terakhirLogin: nowStr });
      setCurrentAdminUser({ ...matchedAdmin, terakhirLogin: nowStr });
      setIsAdminLoggedIn(true);
      localStorage.setItem('blambangan_admin_auth', 'true');
      setActiveView('admin-dashboard');
      return true;
    }

    // Fallback for default credentials or NIM login
    if (cleanPass === 'admin123' && (
      cleanId === 'admin@museumblambangan.id' || 
      cleanId === 'petugas@museumblambangan.id' || 
      cleanId === '362358302016' || 
      cleanId === '362358302019' || 
      cleanId === '362358302025' || 
      cleanId === '362358302156' ||
      cleanId === 'fitria_pratiwi' ||
      cleanId === 'syifa_nayla' ||
      cleanId === 'rofi_nazar' ||
      cleanId === 'samuel_saragih'
    )) {
      const defaultUser = admins.find(a => 
        a.nim === cleanId || a.username === cleanId || a.email === cleanId
      ) || INITIAL_ADMINS.find(a => 
        a.nim === cleanId || a.username === cleanId || a.email === cleanId
      ) || INITIAL_ADMINS[0];
      setCurrentAdminUser(defaultUser);
      setIsAdminLoggedIn(true);
      localStorage.setItem('blambangan_admin_auth', 'true');
      setActiveView('admin-dashboard');
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    localStorage.removeItem('blambangan_admin_auth');
    localStorage.removeItem('mb_current_admin');
    setActiveView('admin-login');
  };

  // Sync state with URL hash
  const setActiveView = (view: AppView) => {
    setActiveViewState(view);
    const newHash = hashFromView(view);
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const v = viewFromHash();
      setActiveViewState(v);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('mb_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('mb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mb_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    try {
      if (currentBooking) {
        localStorage.setItem('mb_current_booking', JSON.stringify(currentBooking));
      } else {
        localStorage.removeItem('mb_current_booking');
      }
    } catch (_) {}
  }, [currentBooking]);

  // Sinkronisasi status currentBooking secara otomatis jika bookings diperbarui
  useEffect(() => {
    if (currentBooking) {
      const liveBooking = bookings.find((b) => b.id === currentBooking.id);
      if (
        liveBooking &&
        (liveBooking.status !== currentBooking.status ||
          liveBooking.checkInStatus !== currentBooking.checkInStatus ||
          liveBooking.checkInTime !== currentBooking.checkInTime)
      ) {
        setCurrentBooking(liveBooking);
      }
    }
  }, [bookings, currentBooking]);

  // Sinkronisasi otomatis antar-tab / antar-jendela browser (Cross-Tab Realtime Sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'mb_bookings') {
          const parsed = JSON.parse(e.newValue);
          setBookings(parsed);
        } else if (e.key === 'mb_admin_users') {
          setAdmins(JSON.parse(e.newValue));
        } else if (e.key === 'mb_notifications') {
          setNotifications(JSON.parse(e.newValue));
        } else if (e.key === 'mb_activities') {
          setActivities(JSON.parse(e.newValue));
        } else if (e.key === 'mb_my_booking_ids') {
          setMyBookingIds(JSON.parse(e.newValue));
        } else if (e.key === 'mb_current_booking') {
          setCurrentBooking(JSON.parse(e.newValue));
        }
      } catch (_) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [isCloudSyncConnected, setIsCloudSyncConnected] = useState<boolean>(true);

  // Sinkronisasi Real-time Antar Perangkat (HP <-> Laptop via Cloud Sync Bridge)
  useEffect(() => {
    const unsubscribe = subscribeSyncEvents(
      (payload) => {
        if (!payload || !payload.type) return;

        // 1. Pesanan Baru Diterima dari HP atau perangkat lain
        if (payload.type === 'NEW_BOOKING' && payload.booking) {
          const newB = payload.booking;
          setBookings((prev) => {
            if (prev.some((b) => b.id === newB.id)) return prev;
            const updated = [newB, ...prev];
            try {
              localStorage.setItem('mb_bookings', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          // Notifikasi admin instan di laptop
          const newNotif: AdminNotification = {
            id: `notif-${Date.now()}`,
            title: `Booking baru masuk dari HP (${newB.nama})`,
            bookingId: newB.id,
            nama: newB.nama,
            time: 'Baru saja',
            read: false,
            type: 'booking_baru',
          };
          setNotifications((prev) => {
            const updated = [newNotif, ...prev];
            try {
              localStorage.setItem('mb_notifications', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          const newAct: ActivityLog = {
            id: `act-${Date.now()}`,
            user: `Pengunjung HP (${newB.nama})`,
            action: 'Mengirim reservasi baru via Real-Time Cloud Sync',
            target: newB.id,
            timestamp: 'Baru saja',
          };
          setActivities((prev) => {
            const updated = [newAct, ...prev];
            try {
              localStorage.setItem('mb_activities', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });
        }

        // 2. Verifikasi Tiket dari Laptop diterima di HP
        if (payload.type === 'VERIFY_BOOKING' && payload.bookingId) {
          const targetId = payload.bookingId;
          setBookings((prev) => {
            const updated = prev.map((b) => (b.id === targetId ? { ...b, status: 'Terverifikasi' as const } : b));
            try {
              localStorage.setItem('mb_bookings', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          setCurrentBooking((prev) =>
            prev && prev.id === targetId ? { ...prev, status: 'Terverifikasi' as const } : prev
          );
        }

        // 3. Penolakan Tiket diterima di HP
        if (payload.type === 'REJECT_BOOKING' && payload.bookingId) {
          const targetId = payload.bookingId;
          const reason = payload.reason || 'Ditolak oleh admin';
          setBookings((prev) => {
            const updated = prev.map((b) =>
              b.id === targetId ? { ...b, status: 'Ditolak' as const, alasanPenolakan: reason } : b
            );
            try {
              localStorage.setItem('mb_bookings', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          setCurrentBooking((prev) =>
            prev && prev.id === targetId ? { ...prev, status: 'Ditolak' as const, alasanPenolakan: reason } : prev
          );
        }

        // 4. Check-In Gate diterima di HP
        if (payload.type === 'CHECKIN_BOOKING' && payload.bookingId) {
          const targetId = payload.bookingId;
          const checkInTime = payload.checkInTime || 'Baru saja';
          setBookings((prev) => {
            const updated = prev.map((b) =>
              b.id === targetId ? { ...b, checkInStatus: 'Sudah Masuk' as const, checkInTime } : b
            );
            try {
              localStorage.setItem('mb_bookings', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          setCurrentBooking((prev) =>
            prev && prev.id === targetId ? { ...prev, checkInStatus: 'Sudah Masuk' as const, checkInTime } : prev
          );
        }

        // 5. Update Akun/Role Petugas dari Manajemen Petugas
        if (payload.type === 'UPDATE_ADMINS' && payload.admins) {
          setAdmins(payload.admins);
          try {
            localStorage.setItem('mb_admin_users', JSON.stringify(payload.admins));
          } catch (_) {}
        }
      },
      (connected) => {
        setIsCloudSyncConnected(connected);
      }
    );

    return () => unsubscribe();
  }, []);

  // ── SINKRONISASI DATABASE SUPABASE (POSTGRESQL CLOUD & REALTIME) ──
  useEffect(() => {
    let isMounted = true;

    const initSupabase = async () => {
      // 1. Ambil data bookings dari Supabase
      try {
        const { data: bData, error: bError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bError && bData && isMounted) {
          if (bData.length > 0) {
            const mapped = bData.map(mapSupabaseToBooking);
            setBookings(mapped);
            try {
              localStorage.setItem('mb_bookings', JSON.stringify(mapped));
            } catch (_) {}
          } else {
            // Seed sample bookings ke Supabase jika tabel masih kosong
            const initialPayload = INITIAL_BOOKINGS.map(mapBookingToSupabase);
            await supabase.from('bookings').insert(initialPayload);
          }
        }
      } catch (e) {
        console.warn('[Supabase] Fetch bookings:', e);
      }

      // 2. Ambil data admin_users dari Supabase
      try {
        const { data: aData, error: aError } = await supabase
          .from('admin_users')
          .select('*');

        if (!aError && aData && aData.length > 0 && isMounted) {
          const mapped = aData.map(mapSupabaseToAdmin);
          setAdmins(mapped);
          try {
            localStorage.setItem('mb_admin_users', JSON.stringify(mapped));
          } catch (_) {}
        }
      } catch (e) {
        console.warn('[Supabase] Fetch admins:', e);
      }
    };

    initSupabase();

    // 3. Supabase Realtime Listener (Dua Arah: INSERT, UPDATE, DELETE)
    const channel = supabase
      .channel('supabase-database-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload: any) => {
          if (!isMounted) return;

          if (payload.eventType === 'INSERT' && payload.new) {
            const newB = mapSupabaseToBooking(payload.new);
            setBookings((prev) => {
              if (prev.some((b) => b.id === newB.id)) return prev;
              const updated = [newB, ...prev];
              try {
                localStorage.setItem('mb_bookings', JSON.stringify(updated));
              } catch (_) {}
              return updated;
            });

            // Notifikasi otomatis admin jika ada booking baru
            const newNotif: AdminNotification = {
              id: `notif-${Date.now()}`,
              title: `Booking baru masuk dari HP (${newB.nama})`,
              bookingId: newB.id,
              nama: newB.nama,
              time: 'Baru saja',
              read: false,
              type: 'booking_baru',
            };
            setNotifications((prev) => [newNotif, ...prev]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedB = mapSupabaseToBooking(payload.new);
            setBookings((prev) => {
              const updated = prev.map((b) => (b.id === updatedB.id ? updatedB : b));
              try {
                localStorage.setItem('mb_bookings', JSON.stringify(updated));
              } catch (_) {}
              return updated;
            });
            setCurrentBooking((prev) => (prev && prev.id === updatedB.id ? updatedB : prev));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = payload.old.id;
            setBookings((prev) => prev.filter((b) => b.id !== deletedId));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_users' },
        (payload: any) => {
          if (!isMounted) return;
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedAdm = mapSupabaseToAdmin(payload.new);
            setAdmins((prev) => {
              const updated = prev.map((a) => (a.id === updatedAdm.id ? updatedAdm : a));
              try {
                localStorage.setItem('mb_admin_users', JSON.stringify(updated));
              } catch (_) {}
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getPricePerPerson = (kategori: CategoryType): number => {
    switch (kategori) {
      case 'Pelajar/Mahasiswa':
      case 'Pelajar Rombongan':
      case 'Pelajar':
        return 5000;
      case 'Umum':
        return 7500;
      case 'Mancanegara':
      case 'Luar Negeri':
        return 20000;
      default:
        return 7500;
    }
  };

  const createBooking = (receiptUrl: string): Booking => {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = formData.tanggalKunjungan.replace(/-/g, '');
    const bookingId = `MB-${dateFormatted || '20250815'}-${randomSeq}`;
    const pricePerPerson = getPricePerPerson(formData.kategori);
    const total = pricePerPerson * formData.jumlahOrang;

    const formatDateIndo = (dateStr: string) => {
      if (!dateStr) return '15 Agustus 2025';
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const [y, m, d] = parts;
          const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          const monthName = months[parseInt(m, 10) - 1] || m;
          return `${parseInt(d, 10)} ${monthName} ${y}`;
        }
        return dateStr;
      } catch {
        return dateStr;
      }
    };

    const formattedDate = formatDateIndo(formData.tanggalKunjungan);
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    const newBooking: Booking = {
      id: bookingId,
      nama: formData.nama,
      jumlahOrang: formData.jumlahOrang || 1,
      telepon: formData.telepon,
      email: formData.email,
      alamat: formData.alamat,
      kategori: formData.kategori,
      hargaPerOrang: pricePerPerson,
      tanggalKunjungan: formattedDate,
      sesi: formData.sesi,
      totalPembayaran: total,
      metodePembayaran: 'QRIS',
      nomorTransaksi: `${dateFormatted}-${randomSeq}`,
      tanggalPembayaran: `${formattedDate} ${nowTimeStr} WIB`,
      buktiPembayaranUrl: receiptUrl || '/assets/sample-receipt.jpg',
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setCurrentBooking(newBooking);
    setSelectedBookingId(newBooking.id);
    addMyBookingId(newBooking.id);

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Booking baru menunggu verifikasi',
      bookingId: newBooking.id,
      nama: newBooking.nama,
      time: 'Baru saja',
      read: false,
      type: 'booking_baru',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Pengunjung (' + newBooking.nama + ')',
      action: 'Mengunggah bukti pembayaran',
      target: newBooking.id,
      timestamp: 'Baru saja',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast ke perangkat lain (HP -> Laptop)
    broadcastSyncEvent({ type: 'NEW_BOOKING', booking: newBooking });

    // Simpan ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').insert(mapBookingToSupabase(newBooking)).then();
    } catch (_) {}

    return newBooking;
  };

  const createWalkInBooking = (input: WalkInBookingInput): Booking => {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const today = new Date();
    const dateFormatted = today.toISOString().split('T')[0].replace(/-/g, '');
    const bookingId = `MB-LOKET-${dateFormatted}-${randomSeq}`;
    const pricePerPerson = getPricePerPerson(input.kategori);
    const total = pricePerPerson * (input.jumlahOrang || 1);

    const todayStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
    const nowTimeStr = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const paymentTimestamp = `${todayStr}, ${nowTimeStr} WIB`;

    const newBooking: Booking = {
      id: bookingId,
      nama: input.nama.trim(),
      jumlahOrang: input.jumlahOrang || 1,
      telepon: input.telepon?.trim() || '-',
      email: input.email?.trim() || '-',
      alamat: input.alamat?.trim() || 'Pembelian Langsung di Loket Museum',
      kategori: input.kategori,
      hargaPerOrang: pricePerPerson,
      tanggalKunjungan: input.tanggalKunjungan || todayStr,
      sesi: input.sesi,
      totalPembayaran: total,
      metodePembayaran: input.metodePembayaran,
      nomorTransaksi: `LKT-${dateFormatted}-${randomSeq}`,
      tanggalPembayaran: paymentTimestamp,
      buktiPembayaranUrl: '/assets/sample-receipt.jpg',
      status: 'Terverifikasi',
      checkInStatus: input.langsungCheckIn !== false ? 'Sudah Masuk' : 'Belum Hadir',
      checkInTime: input.langsungCheckIn !== false ? paymentTimestamp : undefined,
      createdAt: today.toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setCurrentBooking(newBooking);
    setSelectedBookingId(newBooking.id);

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Tiket Langsung Loket Diterbitkan',
      bookingId: newBooking.id,
      nama: newBooking.nama,
      time: 'Baru saja',
      read: true,
      type: 'tiket_terbit',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Petugas Loket (POS)',
      action: `Melayani pembelian tiket langsung: ${newBooking.nama} (${newBooking.jumlahOrang} orang - ${newBooking.kategori})`,
      target: newBooking.id,
      timestamp: paymentTimestamp,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast ke perangkat lain
    broadcastSyncEvent({ type: 'NEW_BOOKING', booking: newBooking });

    // Simpan ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').insert(mapBookingToSupabase(newBooking)).then();
    } catch (_) {}

    return newBooking;
  };

  const verifyBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Terverifikasi' } : b))
    );

    if (currentBooking && currentBooking.id === id) {
      setCurrentBooking({ ...currentBooking, status: 'Terverifikasi' });
    }

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Tiket kunjungan telah diterbitkan',
      bookingId: id,
      nama: bookings.find((b) => b.id === id)?.nama || 'Pengunjung',
      time: 'Baru saja',
      read: false,
      type: 'tiket_terbit',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Admin 1 (Administrator)',
      action: 'Memverifikasi pembayaran',
      target: id,
      timestamp: 'Baru saja',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast ke HP pengunjung agar tiket langsung terbit
    broadcastSyncEvent({ type: 'VERIFY_BOOKING', bookingId: id });

    // Update status ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').update({ status: 'Terverifikasi' }).eq('id', id).then();
    } catch (_) {}
  };

  const rejectBooking = (id: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Ditolak', alasanPenolakan: reason } : b))
    );

    if (currentBooking && currentBooking.id === id) {
      setCurrentBooking({ ...currentBooking, status: 'Ditolak', alasanPenolakan: reason });
    }

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pembayaran ditolak',
      bookingId: id,
      nama: bookings.find((b) => b.id === id)?.nama || 'Pengunjung',
      time: 'Baru saja',
      read: false,
      type: 'pembayaran_ditolak',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Admin 1 (Administrator)',
      action: 'Menolak bukti pembayaran',
      target: `${id} - "${reason}"`,
      timestamp: 'Baru saja',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast ke HP pengunjung
    broadcastSyncEvent({ type: 'REJECT_BOOKING', bookingId: id, reason });

    // Update status ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').update({ status: 'Ditolak', alasan_penolakan: reason }).eq('id', id).then();
    } catch (_) {}
  };

  const deleteBooking = (id: string) => {
    const target = bookings.find((b) => b.id === id);
    const targetName = target ? target.nama : id;

    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('mb_bookings', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    if (currentBooking && currentBooking.id === id) {
      setCurrentBooking(null);
    }
    if (selectedBookingId === id) {
      setSelectedBookingId(null);
    }

    // Hapus dari Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').delete().eq('id', id).then();
    } catch (_) {}

    // Add activity log
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Administrator',
      action: `Menghapus data pesanan ${id} (${targetName})`,
      target: id,
      timestamp: 'Baru saja',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Also remove from myBookings if present
    setMyBookingIds((prev) => {
      const updated = prev.filter((bId) => bId !== id);
      try {
        localStorage.setItem('mb_my_booking_ids', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const quickVerifyAndCheckIn = (id: string): { success: boolean; message: string; booking?: Booking } => {
    const clean = id.trim().toLowerCase();
    const found = bookings.find((b) => b.id.toLowerCase() === clean || clean.includes(b.id.toLowerCase()));
    if (!found) {
      return { success: false, message: `Tiket "${id}" tidak ditemukan dalam sistem.` };
    }

    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const todayStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    const checkInTime = `${todayStr}, ${nowTimeStr} WIB`;

    const updatedBooking: Booking = {
      ...found,
      status: 'Terverifikasi',
      checkInStatus: 'Sudah Masuk',
      checkInTime,
    };

    setBookings((prev) => prev.map((b) => (b.id === found.id ? updatedBooking : b)));
    if (currentBooking && currentBooking.id === found.id) {
      setCurrentBooking(updatedBooking);
    }

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Meja Resepsionis',
      action: `Konfirmasi pembayaran & check-in tamu: ${found.nama} (${found.jumlahOrang} orang - ${found.kategori})`,
      target: found.id,
      timestamp: checkInTime,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast ke perangkat lain (HP & Laptop)
    broadcastSyncEvent({ type: 'CHECKIN_BOOKING', bookingId: found.id, checkInTime });

    // Update status ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').update({ status: 'Terverifikasi', check_in_status: 'Sudah Masuk', check_in_time: checkInTime }).eq('id', found.id).then();
    } catch (_) {}

    return {
      success: true,
      message: `Konfirmasi & Check-In Berhasil! Silakan masuk (${found.jumlahOrang} Orang - ${found.kategori}).`,
      booking: updatedBooking,
    };
  };

  const checkInBooking = (queryOrId: string, autoVerifyPending: boolean = false): { success: boolean; message: string; booking?: Booking } => {
    const raw = queryOrId.trim();
    let clean = raw.toLowerCase();
    if (!clean) {
      return { success: false, message: 'Masukkan nomor booking atau nama pengunjung.' };
    }

    let parsedPayload: { id: string; nama: string; tanggal: string; sesi: string } | null = null;

    // Extract Booking info if raw QR code payload is passed (e.g. VERIFIED_TICKET:MB-XXXX:...)
    if (raw.toUpperCase().startsWith('VERIFIED_TICKET:')) {
      const parts = raw.split(':');
      // Format: VERIFIED_TICKET:<booking.id>:<booking.nama>:<booking.tanggalKunjungan>:<booking.sesi>
      if (parts[1]) {
        parsedPayload = {
          id: parts[1].trim(),
          nama: parts[2]?.trim() || 'Pengunjung Museum',
          tanggal: parts[3]?.trim() || '',
          sesi: parts[4] ? parts.slice(4).join(':').trim() : 'Sesi Kunjungan',
        };
        clean = parts[1].trim().toLowerCase();
      }
    } else if (clean.includes(':')) {
      const parts = clean.split(':');
      if (parts[0] === 'verified_ticket' && parts[1]) {
        clean = parts[1].trim();
      }
    }

    const found = bookings.find((b) => {
      const bId = b.id.toLowerCase();
      const bNama = b.nama.toLowerCase();
      return (
        bId === clean ||
        clean.includes(bId) ||
        bId.includes(clean) ||
        bNama.includes(clean) ||
        clean.includes(bNama) ||
        b.telepon.includes(clean)
      );
    });

    // If ticket was generated on another device (e.g. booked on laptop, scanned on phone)
    if (!found && (parsedPayload || clean.startsWith('mb-'))) {
      const targetId = parsedPayload?.id || raw.toUpperCase();
      const targetNama = parsedPayload?.nama || 'Pengunjung Museum';
      const targetTanggal = parsedPayload?.tanggal || new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
      const targetSesi = parsedPayload?.sesi || 'Sesi Kunjungan';

      const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
      const todayStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
      const checkInTime = `${todayStr}, ${nowTimeStr} WIB`;

      const newBooking: Booking = {
        id: targetId,
        nama: targetNama,
        jumlahOrang: 1,
        telepon: '-',
        email: '-',
        alamat: 'Reservasi Online (Gate Sync)',
        kategori: 'Umum',
        hargaPerOrang: 10000,
        tanggalKunjungan: targetTanggal,
        sesi: targetSesi,
        totalPembayaran: 10000,
        metodePembayaran: 'QRIS',
        nomorTransaksi: `SYNC-${Date.now()}`,
        tanggalPembayaran: `${todayStr}, ${nowTimeStr} WIB`,
        buktiPembayaranUrl: '/assets/sample-receipt.jpg',
        status: 'Terverifikasi',
        checkInStatus: 'Sudah Masuk',
        checkInTime,
        createdAt: new Date().toISOString(),
      };

      setBookings((prev) => [newBooking, ...prev]);
      setCurrentBooking(newBooking);

      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        user: 'Gate Scanner (QR)',
        action: `Validasi tiket online: ${targetNama} (${targetId})`,
        target: targetId,
        timestamp: checkInTime,
      };
      setActivities((prev) => [newAct, ...prev]);

      return {
        success: true,
        message: `Tiket Resmi Terverifikasi! Selamat datang, ${targetNama}. Silakan masuk!`,
        booking: newBooking,
      };
    }

    if (!found) {
      return { success: false, message: `Tiket dengan kode/nama "${queryOrId}" tidak ditemukan dalam sistem.` };
    }

    if (found.status === 'Menunggu Verifikasi') {
      if (autoVerifyPending) {
        return quickVerifyAndCheckIn(found.id);
      }
      return { 
        success: false, 
        message: `Tiket ${found.id} (${found.nama}) belum melunasi QRIS / menunggu konfirmasi petugas keuangan.`, 
        booking: found 
      };
    }

    if (found.status === 'Ditolak') {
      return { 
        success: false, 
        message: `Tiket ${found.id} berstatus DITOLAK: ${found.alasanPenolakan || 'Pembayaran tidak valid'}.`, 
        booking: found 
      };
    }

    if (found.checkInStatus === 'Sudah Masuk') {
      return { 
        success: false, 
        message: `PERINGATAN: Tiket ${found.id} (${found.nama}) sudah pernah masuk pada ${found.checkInTime || 'sebelumnya'}!`, 
        booking: found 
      };
    }

    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const todayStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    const checkInTime = `${todayStr}, ${nowTimeStr} WIB`;

    const updatedBooking: Booking = {
      ...found,
      checkInStatus: 'Sudah Masuk',
      checkInTime,
    };

    setBookings((prev) => prev.map((b) => (b.id === found.id ? updatedBooking : b)));
    if (currentBooking && currentBooking.id === found.id) {
      setCurrentBooking(updatedBooking);
    }

    // Record activity log
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Meja Resepsionis',
      action: `Check-in tiket ${found.id}: ${found.nama} (${found.jumlahOrang} orang)`,
      target: found.id,
      timestamp: checkInTime,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Broadcast check-in ke perangkat lain (HP & Laptop)
    broadcastSyncEvent({ type: 'CHECKIN_BOOKING', bookingId: updatedBooking.id, checkInTime });

    // Update check-in ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').update({ check_in_status: 'Sudah Masuk', check_in_time: checkInTime }).eq('id', updatedBooking.id).then();
    } catch (_) {}

    return { 
      success: true, 
      message: `Check-in Berhasil! Silakan masuk (${found.jumlahOrang} Orang - ${found.kategori}).`, 
      booking: updatedBooking 
    };
  };

  const undoCheckIn = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checkInStatus: 'Belum Hadir', checkInTime: undefined } : b))
    );
    if (currentBooking && currentBooking.id === id) {
      setCurrentBooking({ ...currentBooking, checkInStatus: 'Belum Hadir', checkInTime: undefined });
    }

    // Update status kembali ke Supabase PostgreSQL Cloud
    try {
      supabase.from('bookings').update({ check_in_status: 'Belum Hadir', check_in_time: null }).eq('id', id).then();
    } catch (_) {}

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user: 'Petugas Pintu Masuk',
      action: `Membatalkan check-in tiket ${id}`,
      target: id,
      timestamp: 'Baru saja',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetAllData = () => {
    localStorage.removeItem('mb_bookings');
    localStorage.removeItem('mb_notifications');
    localStorage.removeItem('mb_activities');
    localStorage.removeItem('mb_my_booking_ids');
    localStorage.removeItem('mb_admin_users');
    localStorage.removeItem('mb_current_admin');
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    setAdmins(INITIAL_ADMINS);
    setCurrentAdminUser(null);
    setMyBookingIds([]);
    setCurrentBooking(null);
    setSelectedBookingId(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        notifications,
        activities,
        activeView,
        setActiveView,
        selectedBookingId,
        setSelectedBookingId,
        currentBooking,
        setCurrentBooking,
        formData,
        setFormData,
        createBooking,
        createWalkInBooking,
        verifyBooking,
        rejectBooking,
        deleteBooking,
        checkInBooking,
        quickVerifyAndCheckIn,
        undoCheckIn,
        markNotificationAsRead,
        resetAllData,
        isAdminLoggedIn,
        admins,
        currentAdminUser,
        addAdmin,
        updateAdmin,
        deleteAdmin,
        toggleAdminStatus,
        loginAdmin,
        logoutAdmin,
        userViewMode,
        setUserViewMode,
        myBookings,
        myBookingIds,
        addMyBookingId,
        removeMyBookingId,
        clearAllMyBookings,
        sessionsConfig,
        ishomaConfig,
        updateSession,
        updateAllSessions,
        updateIshoma,
        resetSchedule,
        isCloudSyncConnected,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
