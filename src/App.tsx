import React, { Suspense, lazy } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';

// User Flow Screens (Critical for immediate visitor experience)
import { Screen1Landing } from './components/user/Screen1Landing';
import { Screen2FormData } from './components/user/Screen2FormData';
import { Screen3Ringkasan } from './components/user/Screen3Ringkasan';
import { Screen4PembayaranQRIS } from './components/user/Screen4PembayaranQRIS';
import { Screen6BookingBerhasil } from './components/user/Screen6BookingBerhasil';
import { Screen7StatusVerifikasi } from './components/user/Screen7StatusVerifikasi';
import { Screen8TiketKunjungan } from './components/user/Screen8TiketKunjungan';
import { UserWebPortal } from './components/user/UserWebPortal';

// Admin & Simulator Flow Screens (Loaded on-demand only when accessed, keeping visitor bundle ultra-light)
const Screen9MobileSimulator = lazy(() => import('./components/user/Screen9MobileSimulator').then(m => ({ default: m.Screen9MobileSimulator })));
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
const AdminKoleksiMusewangi = lazy(() => import('./components/admin/AdminKoleksiMusewangi').then(m => ({ default: m.AdminKoleksiMusewangi })));
const AdminManajemenPetugas = lazy(() => import('./components/admin/AdminManajemenPetugas').then(m => ({ default: m.AdminManajemenPetugas })));
const UserMusewangiDashboard = lazy(() => import('./components/user/UserMusewangiDashboard').then(m => ({ default: m.UserMusewangiDashboard })));
const ScreenPitchingVideo = lazy(() => import('./components/common/ScreenPitchingVideo').then(m => ({ default: m.ScreenPitchingVideo })));

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
            case 'admin-collections':
              return <AdminKoleksiMusewangi />;
            case 'admin-users':
              return <AdminManajemenPetugas />;
            default:
              return <AdminDashboard />;
          }
        })()}
      </Suspense>
    );
  }

  // Musewangi Smart Heritage Guide & Audio Tour
  if (activeView === 'user-musewangi') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <UserMusewangiDashboard />
      </Suspense>
    );
  }

  // Pitching Video Theater & Presentation
  if (activeView === 'user-pitching') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <ScreenPitchingVideo />
      </Suspense>
    );
  }

  // If user explicitly asks for Mobile Simulator preview
  if (activeView === 'user-mobile-preview') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <Screen9MobileSimulator />
      </Suspense>
    );
  }

  // In Desktop Web Mode:
  // For landing, ticket list, and ticket detail, render the full UserWebPortal (Figma Screen 10)
  if (userViewMode === 'web') {
    if (activeView === 'user-landing' || activeView === 'user-web-portal' || activeView === 'user-ticket') {
      return <UserWebPortal />;
    }
  }

  // Mobile & Step Flow Screens
  switch (activeView) {
    case 'user-landing':
      return <Screen1Landing />;
    case 'user-form':
      return <Screen2FormData />;
    case 'user-summary':
      return <Screen3Ringkasan />;
    case 'user-qris':
      return <Screen4PembayaranQRIS />;
    case 'user-success':
      return <Screen6BookingBerhasil />;
    case 'user-status':
      return <Screen7StatusVerifikasi />;
    case 'user-ticket':
      return <Screen8TiketKunjungan />;
    case 'user-web-portal':
      return <UserWebPortal />;
    default:
      return userViewMode === 'web' ? <UserWebPortal /> : <Screen1Landing />;
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
