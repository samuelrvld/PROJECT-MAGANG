import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Wifi, 
  Battery, 
  Menu, 
  Home, 
  Ticket, 
  User, 
  Info, 
  PhoneCall, 
  Clock, 
  Calendar,
  ArrowRight,
  Landmark,
  X,
  ChevronLeft,
  Monitor
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { MuseumFeatureModals, type MuseumModalType } from '../common/MuseumFeatureModals';

export const Screen9MobileSimulator: React.FC = () => {
  const { setActiveView, bookings, setUserViewMode } = useBooking();
  const [mobileTab, setMobileTab] = useState<'beranda' | 'booking' | 'tiket' | 'profil'>('beranda');
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<MuseumModalType>(null);

  return (
    <div className="min-h-screen bg-[#EEF2F1] py-4 sm:py-8 px-4 flex flex-col items-center justify-center relative">
      {/* Return to Landing Button */}
      <div className="w-full max-w-[390px] flex justify-between items-center mb-3 text-xs text-slate-500">
        <button
          onClick={() => setActiveView('user-landing')}
          className="flex items-center gap-1 font-semibold text-slate-700 hover:text-[#0F292F]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="font-semibold text-slate-400">Preview Aplikasi Mobile</span>
      </div>

      {/* Phone Mockup Frame matching Figma Screen 9 */}
      <div className="w-[375px] h-[780px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-[#F8FAFA] rounded-[38px] overflow-hidden flex flex-col relative text-slate-800">
          
          {/* iOS Status Bar matching Figma Screen 9 */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-xs font-semibold text-slate-900 z-30 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Header Inside Phone */}
          <div className="px-4 py-2.5 flex items-center justify-between bg-white border-b border-slate-100 z-20">
            <MuseumLogo variant="dark" className="h-6" />
            <button 
              onClick={() => setPhoneMenuOpen(!phoneMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              {phoneMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Phone In-App Menu Drawer matching Figma Features */}
          {phoneMenuOpen && (
            <div className="absolute top-[68px] inset-x-0 z-40 bg-[#0F292F] text-white p-4 shadow-xl border-b border-white/10 space-y-1 text-xs animate-in slide-in-from-top duration-150">
              <div className="text-[10px] font-bold text-[#DAB36E] uppercase tracking-wider px-2 pb-1 border-b border-white/10">
                Menu Aplikasi
              </div>

              <button
                onClick={() => { setMobileTab('beranda'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => { setActiveView('user-form'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Booking Tiket</span>
              </button>

              <button
                onClick={() => { setMobileTab('tiket'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Ticket className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Tiket Saya</span>
              </button>

              <button
                onClick={() => { setActiveModal('koleksi'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Landmark className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Koleksi Museum</span>
              </button>

              <button
                onClick={() => { setActiveModal('informasi'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Informasi & Jadwal</span>
              </button>

              <button
                onClick={() => { setActiveModal('kontak'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Kontak & Lokasi</span>
              </button>

              <button
                onClick={() => { setMobileTab('profil'); setPhoneMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#DAB36E]" />
                <span>Profil</span>
              </button>
            </div>
          )}

          {/* Scrollable Phone Body */}
          <div className="flex-1 overflow-y-auto pb-16 px-4 pt-3 space-y-4">
            
            {mobileTab === 'beranda' && (
              <>
                {/* Hero Card matching Figma Screen 9 */}
                <div className="relative rounded-2xl overflow-hidden shadow-md text-white min-h-[190px] flex flex-col justify-end p-4">
                  <img
                    src="/assets/museum-real-blambangan.jpg"
                    alt="Museum Blambangan Asli"
                    className="absolute inset-0 w-full h-full object-cover object-[center_top]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F292F] via-[#0F292F]/50 to-transparent" />
                  
                  {/* Subtle Gajah Oling Accent in Hero Card */}
                  <div className="absolute -top-3 -right-3 w-20 h-28 opacity-35 pointer-events-none select-none">
                    <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
                  </div>
                  
                  <div className="relative z-10 space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold leading-tight">
                      Booking Kunjungan <br /> Museum Blambangan
                    </h3>
                    <p className="text-[10px] text-slate-200 line-clamp-2">
                      Nikmati pengalaman wisata edukasi bersama kami.
                    </p>
                    <button
                      onClick={() => setActiveView('user-form')}
                      className="mt-1 w-full py-2 bg-[#D8B46E] hover:bg-[#C9A55B] text-[#0F292F] font-bold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>Booking Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick 3 Action Icons matching Figma Screen 9 */}
                <div className="grid grid-cols-3 gap-2.5 text-center py-1">
                  <button
                    type="button"
                    onClick={() => setActiveModal('koleksi')}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">Koleksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('informasi')}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">Informasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('kontak')}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">Kontak</span>
                  </button>
                </div>

                {/* Jadwal Kunjungan Section matching Figma Screen 9 */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#0F292F]" />
                      Jadwal Kunjungan
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-[#0F292F] block">Sesi I</span>
                      <span className="text-[8px] text-slate-500">07:30 - 10:00</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-[#0F292F] text-white">
                      <span className="text-[10px] font-bold block">Sesi II</span>
                      <span className="text-[8px] text-slate-200">10:00 - 12:30</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-[#0F292F] block">Sesi III</span>
                      <span className="text-[8px] text-slate-500">13:30 - 16:00</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {mobileTab === 'tiket' && (
              <div className="py-4 text-center space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Tiket Saya</h4>
                {bookings.length > 0 ? (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-left space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0F292F]">{bookings[0].id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {bookings[0].status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {bookings[0].nama} • {bookings[0].sesi}
                    </div>
                    <button
                      onClick={() => setActiveView('user-ticket')}
                      className="w-full py-1.5 bg-[#0F292F] text-white text-[10px] font-bold rounded-lg"
                    >
                      Buka E-Tiket (Layar 8)
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Belum ada tiket aktif</p>
                )}
              </div>
            )}

            {mobileTab === 'profil' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-200 mx-auto flex items-center justify-center text-slate-500">
                  <User className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Pengunjung Museum</h4>
                <p className="text-[10px] text-slate-500">Museum Blambangan Banyuwangi</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar matching Figma Screen 9 */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between z-30">
            <button
              onClick={() => setMobileTab('beranda')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'beranda' ? 'text-[#0F292F] font-bold' : 'text-slate-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px]">Beranda</span>
            </button>

            <button
              onClick={() => setActiveView('user-form')}
              className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[9px]">Booking</span>
            </button>

            <button
              onClick={() => setMobileTab('tiket')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'tiket' ? 'text-[#0F292F] font-bold' : 'text-slate-400'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span className="text-[9px]">Tiket Saya</span>
            </button>

            <button
              onClick={() => setMobileTab('profil')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'profil' ? 'text-[#0F292F] font-bold' : 'text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px]">Profil</span>
            </button>
          </div>

          {/* iOS Bottom Home Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-40" />
        </div>
      </div>

      {/* Interactive Museum Feature Modals (Koleksi, Informasi, Kontak, Profil) */}
      <MuseumFeatureModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
