import React from 'react';
import { useBooking } from '../../context/BookingContext';
import type { AppView } from '../../context/BookingContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut,
  Calendar,
  ExternalLink,
  ChevronRight,
  Clock,
  Menu,
  X,
  QrCode,
  Compass,
  UserCheck,
  Lock
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { hasPermission } from '../../utils/rbac';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { activeView, setActiveView, bookings, notifications, logoutAdmin, currentAdminUser, isCloudSyncConnected } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pendingCount = bookings.filter((b) => b.status === 'Menunggu Verifikasi').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const adminName = currentAdminUser?.nama || 'Petugas Loket';
  const adminRole = currentAdminUser?.role || 'Admin Operasional';
  const adminInitials = adminName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const [rbacDeniedMsg, setRbacDeniedMsg] = React.useState<string | null>(null);

  const handleMenuClick = (item: { id: AppView; label: string }) => {
    const isAllowed = hasPermission(currentAdminUser?.role, item.id);
    if (!isAllowed) {
      setRbacDeniedMsg(`Akses Dibatasi: Modul "${item.label}" khusus untuk peran yang berwenang (Role Anda saat ini: ${adminRole}).`);
      setTimeout(() => setRbacDeniedMsg(null), 4000);
      return;
    }
    setActiveView(item.id);
    setMobileMenuOpen(false);
  };

  interface MenuCategory {
    categoryTitle: string;
    items: {
      id: AppView;
      label: string;
      subtitle: string;
      icon: React.ReactNode;
      badge?: number;
    }[];
  }

  const menuSections: MenuCategory[] = [
    {
      categoryTitle: 'Operasional Loket',
      items: [
        { 
          id: 'admin-dashboard', 
          label: 'Dashboard', 
          subtitle: 'Ringkasan & Statistik',
          icon: <LayoutDashboard className="w-3.5 h-3.5" /> 
        },
        { 
          id: 'admin-orders', 
          label: 'Pesanan Kunjungan', 
          subtitle: 'Verifikasi & Tiket Masuk',
          icon: <ClipboardList className="w-3.5 h-3.5" />,
          badge: pendingCount > 0 ? pendingCount : undefined 
        },
        { 
          id: 'admin-scan', 
          label: 'Validasi & Pindai QR', 
          subtitle: 'Scanner Kamera Gate Masuk',
          icon: <QrCode className="w-3.5 h-3.5" /> 
        },
      ]
    },
    {
      categoryTitle: 'Data & Keuangan',
      items: [
        { 
          id: 'admin-visitors', 
          label: 'Data Pengunjung', 
          subtitle: 'Basis Data Wisatawan',
          icon: <Users className="w-3.5 h-3.5" /> 
        },
        { 
          id: 'admin-reports', 
          label: 'Laporan Retribusi', 
          subtitle: 'Rekap Transaksi & PAD',
          icon: <BarChart3 className="w-3.5 h-3.5" /> 
        },
      ]
    },
    {
      categoryTitle: 'Sistem & Tim Petugas',
      items: [
        { 
          id: 'admin-users', 
          label: 'Manajemen Petugas', 
          subtitle: 'Tim Pengembang TRPL & Akses',
          icon: <UserCheck className="w-3.5 h-3.5" /> 
        },
        { 
          id: 'admin-settings', 
          label: 'Pengaturan Sistem', 
          subtitle: 'Sesi, Kuota, Tarif & QRIS',
          icon: <Settings className="w-3.5 h-3.5" /> 
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800 selection:bg-[#081827] selection:text-white">
      {/* Mobile Topbar for Phones (< 768px) */}
      <div className="md:hidden bg-[#0F2236] text-white px-4 py-3 border-b border-[#1B3654] sticky top-0 z-40 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <MuseumLogo variant="white" className="h-7" />
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            Admin Loket
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('admin-notifications')}
            className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Toggle Menu Admin"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4A359]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer for Admin (Slide-In with Metallic Blue Theme) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden print:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-in Drawer from Left */}
          <aside className="fixed top-0 bottom-0 left-0 w-[300px] max-w-[85vw] bg-gradient-to-b from-[#051829] via-[#092C48] to-[#04121F] text-white z-50 flex flex-col justify-between shadow-2xl p-5 border-r border-[#153E66] animate-in slide-in-from-left duration-250 relative overflow-hidden">
            {/* Top-Right Gajah Oling Motif */}
            <div className="absolute -top-4 -right-4 w-32 h-32 opacity-20 pointer-events-none select-none transform rotate-12">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
            </div>

            {/* Bottom-Right Gajah Oling Motif */}
            <div className="absolute -right-6 -bottom-6 w-44 h-44 opacity-25 pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
            </div>

            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto">
              {/* Header inside drawer */}
              <div className="pb-3.5 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <MuseumLogo variant="white" className="h-8" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4A359] transition-colors cursor-pointer"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#E3C693]/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                  <span>Dinas Kebudayaan & Pariwisata Banyuwangi</span>
                </div>
              </div>

              {/* Menu Navigation Berdasarkan Kategori */}
              <div className="space-y-3">
                {menuSections.map((sec) => (
                  <div key={sec.categoryTitle} className="space-y-1">
                    <div className="text-[9.5px] font-black tracking-widest text-[#D4A359]/85 uppercase px-2 py-0.5">
                      {sec.categoryTitle}
                    </div>

                    <nav className="space-y-1 text-xs">
                      {sec.items.map((item) => {
                        const isActive = activeView === item.id || 
                          (item.id === 'admin-orders' && (activeView === 'admin-order-detail' || activeView === 'admin-ticket-view'));
                        const isPermitted = hasPermission(currentAdminUser?.role, item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMenuClick(item)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-inner'
                                : !isPermitted
                                ? 'text-slate-400 opacity-60 hover:opacity-95 hover:bg-white/5'
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 text-left">
                              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#D4A359]/20 text-[#D4A359]' : 'bg-white/5 text-slate-400'}`}>
                                {item.icon}
                              </div>
                              <div>
                                <span className="block font-bold leading-tight">{item.label}</span>
                                <span className="text-[9.5px] text-slate-400 block leading-none">{item.subtitle}</span>
                              </div>
                            </div>

                            {!isPermitted ? (
                              <span className="p-1 rounded bg-white/5 text-slate-400" title="Akses Dibatasi">
                                <Lock className="w-3 h-3 text-slate-400" />
                              </span>
                            ) : item.badge !== undefined ? (
                              <span className="bg-[#D4A359] text-[#092C48] text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>

              {/* Pratinjau Portal Web Pengunjung */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setActiveView('user-web-portal'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 text-xs font-semibold cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4A359]" />
                    <span>Lihat Portal Pengunjung</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Footer in Drawer */}
            <div className="pt-4 border-t border-white/10 space-y-2 relative z-10 shrink-0">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0F2D4A] border border-[#D4A359]/40 flex items-center justify-center text-[#D4A359] font-black text-xs">
                    {adminInitials}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-white block truncate max-w-[120px]">{adminName}</span>
                    <span className="text-[9.5px] text-slate-400 block">{adminRole}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { logoutAdmin(); setMobileMenuOpen(false); }}
                  className="text-red-400 hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar Desktop Admin */}
      <aside className="hidden md:flex w-72 lg:w-80 h-screen fixed top-0 bottom-0 left-0 bg-gradient-to-b from-[#081827] via-[#102B48] to-[#061422] text-white flex-col justify-between shrink-0 p-3.5 lg:p-4 border-r border-[#1C4268]/60 shadow-2xl overflow-y-auto overflow-x-hidden z-40 select-none print:hidden">
        {/* Ornamen Gajah Oling Atas */}
        <div className="absolute -top-6 -right-6 w-36 h-36 opacity-[0.09] pointer-events-none select-none transform rotate-12">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
        </div>

        {/* Ornamen Gajah Oling Bawah */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.07] pointer-events-none select-none transform -rotate-12">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
        </div>

        <div className="space-y-3 relative z-10">
          {/* Logo Museum */}
          <div className="pt-1 pb-3 border-b border-white/10 relative">
            <div className="flex items-center justify-between">
              <MuseumLogo variant="white" className="h-9 sm:h-10 w-auto" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#E3C693] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                <span>Panel Petugas & Admin</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 tracking-wider">
                ONLINE
              </span>
            </div>
          </div>

          {/* Section: Menu Navigasi Manajemen Petugas Berdasarkan Kategori */}
          <div className="space-y-3">
            {menuSections.map((sec) => (
              <div key={sec.categoryTitle} className="space-y-1">
                <div className="px-2 py-0.5 flex items-center justify-between">
                  <span className="text-[9.5px] font-black tracking-widest text-[#D4A359]/80 uppercase">
                    {sec.categoryTitle}
                  </span>
                </div>

                <nav className="space-y-1 text-xs">
                  {sec.items.map((item) => {
                    const isActive = activeView === item.id || 
                      (item.id === 'admin-orders' && (activeView === 'admin-order-detail' || activeView === 'admin-ticket-view'));
                    const isPermitted = hasPermission(currentAdminUser?.role, item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleMenuClick(item)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-inner'
                            : !isPermitted
                            ? 'text-slate-400 opacity-55 hover:opacity-90 hover:bg-white/5'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-left">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            isActive
                              ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                              : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                          }`}>
                            {item.icon}
                          </div>
                          <div>
                            <span className="block font-bold leading-tight text-xs">{item.label}</span>
                            <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5">{item.subtitle}</span>
                          </div>
                        </div>

                        {!isPermitted ? (
                          <span className="p-1 rounded bg-white/5 text-slate-400 flex items-center gap-1 text-[9.5px]" title="Akses Dibatasi Peran">
                            <Lock className="w-3 h-3 text-slate-400" />
                          </span>
                        ) : item.badge !== undefined ? (
                          <span className="bg-[#D4A359] text-[#092C48] text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                            {item.badge}
                          </span>
                        ) : isActive ? (
                          <span className="text-[#D4A359] text-xs font-bold">◆</span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Quick Shortcut: View User Web Portal */}
          <div>
            <button
              type="button"
              onClick={() => setActiveView('user-web-portal')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group text-xs border border-white/5"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold leading-tight">Web Pengunjung</span>
                  <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Pratinjau Portal Publik</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Section: Compact Operational Status & Petugas Profile (Always Visible & Never Cut Off!) */}
        <div className="pt-3 border-t border-white/10 space-y-2 relative z-10 shrink-0">
          {/* Operational Status Compact Card */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-[#D4A359]/30 shadow-md space-y-1.5 text-left relative overflow-hidden">

            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 relative z-10">
              <span className="flex items-center gap-1.5 text-[#F3E2C4]">
                <Clock className="w-3 h-3 text-[#D4A359]" />
                Operasional Loket
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/25">
                ● Buka Melayani
              </span>
            </div>
            <div className="text-[10px] text-slate-300 space-y-0.5 relative z-10">
              <div className="flex justify-between">
                <span>Shift Aktif:</span>
                <span className="font-semibold text-white">07:30 – 16:00 WIB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Lokasi:</span>
                <span className="text-[#D4A359] font-medium">Meja Tiket Utama</span>
              </div>
            </div>
          </div>

          {/* Admin Profile & Logout Bar */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-[#0F2D4A] border border-[#D4A359]/40 flex items-center justify-center text-[#D4A359] font-black text-xs shadow-xs">
                  {adminInitials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#081827]" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-bold text-white block truncate max-w-[150px]">{adminName}</span>
                <span className="text-[9.5px] text-slate-400 block">{adminRole}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
              title="Keluar / Logout Petugas"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-72 lg:ml-80 flex-1 flex flex-col min-h-screen overflow-x-hidden w-full print:ml-0 print:min-h-0 print:p-0 print:overflow-visible">
        {/* Header Atas */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 sticky top-0 z-20 print:hidden">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Real-time Cloud Sync Status (HP <-> Laptop) */}
            <div 
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                isCloudSyncConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title="Koneksi Real-time Cloud Sync aktif (HP dan Laptop otomatis sinkron)"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudSyncConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[11px] font-bold">
                {isCloudSyncConnected ? 'Cloud Sync: Terhubung' : 'Sync: Siap'}
              </span>
            </div>

            {/* Date Display */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">
                {new Intl.DateTimeFormat('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }).format(new Date())}
              </span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveView('admin-notifications')}
              className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Notifikasi & Riwayat"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4 pb-24 md:pb-6">
          {rbacDeniedMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{rbacDeniedMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setRbacDeniedMsg(null)}
                className="text-rose-500 hover:text-rose-800 p-1 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </main>

        {/* ================= MOBILE BOTTOM NAVIGATION BAR (Phones Only) ================= */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#092238]/95 backdrop-blur-md border-t border-[#1C3E60] px-3 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.3)] print:hidden">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => handleMenuClick({ id: 'admin-dashboard', label: 'Dashboard' })}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'admin-dashboard'
                ? 'text-[#E5C287] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Beranda</span>
          </button>

          {/* 2. Pesanan */}
          <button
            type="button"
            onClick={() => handleMenuClick({ id: 'admin-orders', label: 'Pesanan' })}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeView === 'admin-orders' || activeView === 'admin-order-detail' || activeView === 'admin-ticket-view'
                ? 'text-[#E5C287] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ClipboardList className="w-4 h-4 mb-0.5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#D4A359] text-[#092C48] rounded-full text-[8.5px] font-black flex items-center justify-center shadow-xs">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Pesanan</span>
          </button>

          {/* 3. CENTER HIGHLIGHT: Scan QR Gate Masuk */}
          <button
            type="button"
            onClick={() => handleMenuClick({ id: 'admin-scan', label: 'Validasi QR' })}
            className="flex flex-col items-center -mt-5 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 border-2 ${
              activeView === 'admin-scan'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-white shadow-emerald-500/40 ring-2 ring-emerald-400'
                : 'bg-gradient-to-br from-[#D4A359] to-[#996F2A] text-[#092238] border-[#FBEAC9] shadow-black/40'
            }`}>
              <QrCode className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className={`text-[10px] font-black mt-0.5 ${
              activeView === 'admin-scan' ? 'text-emerald-400' : 'text-[#E5C287]'
            }`}>
              Scan QR
            </span>
          </button>

          {/* 4. Petugas (Tim TRPL) */}
          <button
            type="button"
            onClick={() => handleMenuClick({ id: 'admin-users', label: 'Petugas' })}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'admin-users'
                ? 'text-[#E5C287] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Petugas</span>
          </button>

          {/* 5. Menu Drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              mobileMenuOpen ? 'text-[#E5C287] font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
