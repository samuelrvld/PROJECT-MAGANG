import React, { Suspense, lazy } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';

// Halaman Pengunjung
import { LandingPage } from './components/user/LandingPage';
import { FormBooking } from './components/user/FormBooking';
import { RingkasanBooking } from './components/user/RingkasanBooking';
import { PembayaranQRIS } from './components/user/PembayaranQRIS';
import { BookingBerhasil } from './components/user/BookingBerhasil';
import { StatusTiket } from './components/user/StatusTiket';
import { TiketKunjungan } from './components/user/TiketKunjungan';
import { UserWebPortal } from './components/user/UserWebPortal';

// Halaman Admin & Fitur Tambahan (Lazy loading)
const SimulatorMobile = lazy(() => import('./components/user/SimulatorMobile').then(m => ({ default: m.SimulatorMobile })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminPesananKunjungan = lazy(() => import('./components/admin/AdminPesananKunjungan').then(m => ({ default: m.AdminPesananKunjungan })));
const AdminDetailPesanan = lazy(() => import('./components/admin/AdminDetailPesanan').then(m => ({ default: m.AdminDetailPesanan })));
const AdminTiketKunjungan = lazy(() => import('./components/admin/AdminTiketKunjungan').then(m => ({ default: m.AdminTiketKunjungan })));
const AdminNotifikasiRiwayat = lazy(() => import('./components/admin/AdminNotifikasiRiwayat').then(m => ({ default: m.AdminNotifikasiRiwayat })));
const AdminLaporan = lazy(() => import('./components/admin/AdminLaporan').then(m => ({ default: m.AdminLaporan })));
const AdminPengaturan = lazy(() => import('./components/admin/AdminPengaturan').then(m => ({ default: m.AdminPengaturan })));
const AdminDataPengunjung = lazy(() => import('./components/admin/AdminDataPengunjung').then(m => ({ default: m.AdminDataPengunjung })));
const AdminScanValidasi = lazy(() => import('./components/admin/AdminScanValidasi').then(m => ({ default: m.AdminScanValidasi })));
const AdminManajemenPetugas = lazy(() => import('./components/admin/AdminManajemenPetugas').then(m => ({ default: m.AdminManajemenPetugas })));
const VideoPitching = lazy(() => import('./components/common/VideoPitching').then(m => ({ default: m.VideoPitching })));

const FallbackLoader: React.FC = () => (
  <div className="min-h-screen bg-[#081827] flex items-center justify-center text-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-[#D4A359] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-300 font-medium">Memuat Halaman...</span>
    </div>
  </div>
);

const MainViewRouter: React.FC = () => {
  const { activeView, isAdminLoggedIn, userViewMode } = useBooking();

  // Route Guard: If accessing any admin screen without login, render AdminLogin
  if (activeView.startsWith('admin-') && activeView !== 'admin-login' && !isAdminLoggedIn) {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <AdminLogin />
      </Suspense>
    );
  }

  // Admin Screens Routing
  if (activeView.startsWith('admin-')) {
    return (
      <Suspense fallback={<FallbackLoader />}>
        {(() => {
          switch (activeView) {
            case 'admin-login':
              return <AdminLogin />;
            case 'admin-dashboard':
              return <AdminDashboard />;
            case 'admin-orders':
              return <AdminPesananKunjungan />;
            case 'admin-order-detail':
              return <AdminDetailPesanan />;
            case 'admin-ticket-view':
              return <AdminTiketKunjungan />;
            case 'admin-notifications':
              return <AdminNotifikasiRiwayat />;
            case 'admin-reports':
              return <AdminLaporan />;
            case 'admin-settings':
              return <AdminPengaturan />;
            case 'admin-visitors':
              return <AdminDataPengunjung />;
            case 'admin-scan':
              return <AdminScanValidasi />;
            case 'admin-users':
              return <AdminManajemenPetugas />;
            default:
              return <AdminDashboard />;
          }
        })()}
      </Suspense>
    );
  }

  // Pemutar Video Pitching
  if (activeView === 'user-pitching') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <VideoPitching />
      </Suspense>
    );
  }

  // Simulator Tampilan Mobile
  if (activeView === 'user-mobile-preview') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <SimulatorMobile />
      </Suspense>
    );
  }

  // Mode Web Desktop:
  // Halaman beranda, daftar tiket, dan detail tiket menggunakan UserWebPortal
  if (userViewMode === 'web') {
    if (activeView === 'user-landing' || activeView === 'user-web-portal' || activeView === 'user-ticket') {
      return <UserWebPortal />;
    }
  }

  // Alur Pemesanan Tiket Pengunjung
  switch (activeView) {
    case 'user-landing':
      return <LandingPage />;
    case 'user-form':
      return <FormBooking />;
    case 'user-summary':
      return <RingkasanBooking />;
    case 'user-qris':
      return <PembayaranQRIS />;
    case 'user-success':
      return <BookingBerhasil />;
    case 'user-status':
      return <StatusTiket />;
    case 'user-ticket':
      return <TiketKunjungan />;
    case 'user-web-portal':
      return <UserWebPortal />;
    default:
      return userViewMode === 'web' ? <UserWebPortal /> : <LandingPage />;
  }
};

export function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans selection:bg-[#0F292F] selection:text-white">
        <MainViewRouter />
      </div>
    </BookingProvider>
  );
}

export default App;
