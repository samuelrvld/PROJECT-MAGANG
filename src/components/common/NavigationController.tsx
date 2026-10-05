import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { AppView } from '../../context/BookingContext';
import { 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  RotateCcw, 
  Layers, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const NavigationController: React.FC = () => {
  const { activeView, setActiveView, resetAllData } = useBooking();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isUserView = activeView.startsWith('user');
  const isAdminView = activeView.startsWith('admin');

  const figmaScreens = [
    { id: 'user-landing', label: '1. Landing / Booking Museum', group: 'Alur Pengunjung' },
    { id: 'user-form', label: '2. Form Data Pengunjung (1/5)', group: 'Alur Pengunjung' },
    { id: 'user-summary', label: '3. Ringkasan Pesanan (2/5)', group: 'Alur Pengunjung' },
    { id: 'user-qris', label: '4. Pembayaran QRIS (3/5)', group: 'Alur Pengunjung' },
    { id: 'user-success', label: '6. Booking Berhasil (Menunggu)', group: 'Alur Pengunjung' },
    { id: 'user-status', label: '7. Notifikasi / Status Verifikasi', group: 'Alur Pengunjung' },
    { id: 'user-ticket', label: '8. Tiket Kunjungan (E-Ticket)', group: 'Alur Pengunjung' },
    { id: 'user-mobile-preview', label: '9. Tampilan di Aplikasi / Mobile', group: 'Tampilan Device' },
    { id: 'user-web-portal', label: '10. Tampilan di Link / Web (Tiket Saya)', group: 'Tampilan Device' },
    { id: 'admin-dashboard', label: 'Admin 1. Dashboard Admin', group: 'Panel Admin' },
    { id: 'admin-orders', label: 'Admin 2. Pesanan Kunjungan', group: 'Panel Admin' },
    { id: 'admin-scan', label: 'Admin 3. Validasi & Pindai QR Tiket', group: 'Panel Admin' },
    { id: 'admin-order-detail', label: 'Admin 4. Detail Pesanan & Bukti', group: 'Panel Admin' },
    { id: 'admin-ticket-view', label: 'Admin 7. Tiket Kunjungan (Printable)', group: 'Panel Admin' },
    { id: 'admin-notifications', label: 'Admin 8. Notifikasi & Riwayat', group: 'Panel Admin' },
    { id: 'admin-reports', label: 'Admin 9. Laporan & Grafik', group: 'Panel Admin' },
    { id: 'admin-settings', label: 'Admin 10. Pengaturan Sistem', group: 'Panel Admin' },
    { id: 'admin-visitors', label: 'Admin. Data Pengunjung', group: 'Panel Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F292F] text-white border-b border-[#1A3D46] px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Figma Project Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E5A93C] flex items-center justify-center font-bold text-[#0F292F] text-sm shadow">
            MB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wide text-sm sm:text-base">MUSEUM BLAMBANGAN</span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Figma 100% Match
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden md:block">
              Sistem Booking Online & Verifikasi Admin Sesuai Desain
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-[#091A1E] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveView('user-landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              isUserView && activeView !== 'user-mobile-preview' && activeView !== 'user-web-portal'
                ? 'bg-[#18434D] text-[#E5A93C] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Booking</span>
          </button>

          <button
            onClick={() => setActiveView('user-mobile-preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'user-mobile-preview'
                ? 'bg-[#18434D] text-[#E5A93C] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App (No.9)</span>
          </button>

          <button
            onClick={() => setActiveView('user-web-portal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeView === 'user-web-portal'
                ? 'bg-[#18434D] text-[#E5A93C] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Web Tiket Saya (No.10)</span>
          </button>

          <button
            onClick={() => setActiveView('admin-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              isAdminView
                ? 'bg-[#10B981] text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>
        </div>

        {/* Quick Figma Jump Dropdown & Reset */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 bg-[#18434D] hover:bg-[#1f5663] text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="hidden sm:inline">Pilih Halaman Figma</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Lompat Langsung ke Desain:
              </div>
              {figmaScreens.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as AppView);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 flex items-center justify-between transition-colors ${
                    activeView === item.id ? 'bg-emerald-50 text-emerald-800 font-bold' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.group}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            title="Reset data ke default Figma"
            onClick={resetAllData}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
