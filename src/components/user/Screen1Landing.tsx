import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  GraduationCap,
  Calendar,
  Ticket,
  QrCode,
  Home,
  Landmark,
  Info,
  PhoneCall,
  User,
  Monitor,
  Clock,
  ChevronRight
} from 'lucide-react';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { OmprokGandrung } from '../common/OmprokGandrung';
import { SiluetPenariGandrung } from '../common/SiluetPenariGandrung';
import { MuseumLogo } from '../common/MuseumLogo';
import { MuseumFeatureModals, type MuseumModalType } from '../common/MuseumFeatureModals';
import { SocialMediaIconRow } from '../common/SocialMediaLinks';

export const Screen1Landing: React.FC = () => {
  const { setActiveView, setUserViewMode } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<MuseumModalType>(null);

  const heroSlides = [
    {
      src: '/assets/slide-1-gedung-museum-hd.jpg',
      title: 'Gedung Utama Museum Blambangan',
      caption: 'Tampak Depan & Papan Nama Ikonik Museum',
      position: 'object-[center_48%]',
    },
    {
      src: '/assets/slide-2-candi-macan-putih-hd.jpg',
      title: 'Koleksi Arkeologi Candi Macan Putih',
      caption: 'Artefak Purbakala & Sejarah Blambangan',
      position: 'object-center',
    },
    {
      src: '/assets/slide-3-galeri-sejarah-hd.jpg',
      title: 'Galeri Foto Banyuwangi Tempo Doeloe',
      caption: 'Arsip Dokumentasi & Memori Bersejarah',
      position: 'object-center',
    },
    {
      src: '/assets/slide-4-lingga-yoni-hd.jpg',
      title: 'Peninggalan Arca Klasik Lingga-Yoni',
      caption: 'Koleksi Benda Cagar Budaya & Prasasti',
      position: 'object-[center_45%]',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-[#081523] sm:bg-[#E8EDF5] flex justify-center items-start sm:py-6 sm:px-4">
      {/* 100% Edge-to-Edge on mobile, Centered Card on desktop */}
      <div className="w-full max-w-full sm:max-w-[420px] md:max-w-md min-h-screen sm:min-h-[800px] bg-gradient-to-b from-[#081827] via-[#102B48] to-[#081523] text-white flex flex-col justify-between relative overflow-hidden sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-[#224A72]/40 select-none">
        
        {/* Background Rotating Slideshow: Displays all 4 authentic museum photos with smooth crossfade & Ken Burns effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {heroSlides.map((slide, idx) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover ${slide.position || 'object-center'} transition-opacity duration-1000 ease-in-out ${
                activeSlide === idx ? 'opacity-100 animate-kenburns scale-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Metallic Blue Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 via-45% to-[#081523]" />
        </div>

        {/* Top Header: Logo (left) + Hamburger Icon (right) */}
        <header className="relative z-20 px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MuseumLogo variant="white" className="h-8" />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen && !activeModal ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
          </button>
        </header>

        {/* Slide-In Navigation Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
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
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1.5 text-[10.5px] text-[#E3C693] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                      <span>Kab. Banyuwangi</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#4A90E2] bg-[#4A90E2]/15 px-2 py-0.5 rounded-full border border-[#4A90E2]/30 tracking-wider">
                      DISBUDPAR
                    </span>
                  </div>
                </div>

                {/* Nav Items */}
                <nav className="space-y-1.5 text-xs font-semibold">
                  <div className="flex items-center justify-between px-2.5 py-1">
                    <span className="text-[10px] font-black tracking-widest text-[#D4A359] uppercase">
                      Menu Utama
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Layanan E-Tiket</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setActiveView('user-landing'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-sm text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold leading-tight">Beranda</span>
                        <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Halaman Utama</span>
                      </div>
                    </div>
                    <span className="text-[#D4A359] text-xs font-bold">◆</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveView('user-form'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold leading-tight">Booking Tiket</span>
                        <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Pilih Jadwal & Sesi</span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveView('user-web-portal'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold leading-tight">Tiket Saya</span>
                        <span className="text-[10px] text-slate-400 block leading-none mt-0.5">E-Tiket & QR Code</span>
                      </div>
                    </div>
                  </button>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="flex items-center justify-between px-2.5 py-1">
                      <span className="text-[10px] font-black tracking-widest text-[#D4A359] uppercase">
                        Informasi Museum
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Edukasi Budaya</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setActiveView('user-musewangi'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-bold leading-tight">Koleksi Sejarah</span>
                          <span className="text-[10px] text-slate-400 block leading-none mt-0.5">4.300+ Benda Kuno</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveModal('informasi'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-bold leading-tight">Jadwal & Tarif</span>
                          <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Mulai Rp 5.000 / Org</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveModal('kontak'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-bold leading-tight">Kontak & Lokasi</span>
                          <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Peta & WhatsApp</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </nav>
              </div>

              {/* Operational Hours & Footer inside drawer matching media_1791115428347.png */}
              <div className="pt-3 border-t border-white/10 space-y-2 relative z-10 shrink-0">
                {/* Jam Buka Loket Box */}
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5 text-[#F3E2C4]">
                      <Clock className="w-3 h-3 text-[#D4A359]" />
                      Jam Buka Loket
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/25">
                      ● Buka Hari Ini
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-300 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Senin – Jumat:</span>
                      <span className="font-semibold text-white">07:30 – 16:00 WIB</span>
                    </div>
                    <div className="flex justify-between text-amber-300/90 text-[10px]">
                      <span>Sabtu & Minggu:</span>
                      <span className="font-semibold text-amber-300">Tutup (Libur)</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-0.5 text-center">
                  <span className="text-[9.5px] font-semibold text-slate-400 block mb-1.5">
                    Sosial Media Resmi
                  </span>
                  <SocialMediaIconRow size="sm" />
                </div>

                <div className="text-[10px] text-slate-400 text-center font-medium">
                  Museum Blambangan Banyuwangi
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Hero Middle Content matching Figma Screen 1 */}
        <main className="relative z-10 px-5 pt-16 sm:pt-28 pb-6 flex flex-col items-start text-left flex-1 justify-center sm:justify-start">
          {/* Authentic Banyuwangi Batik Gajah Oling Accent on Mobile Hero (As per Figma media_1791077641373.png) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-44 h-64 opacity-30 pointer-events-none select-none">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-[0_2px_12px_rgba(212,163,89,0.3)]" />
          </div>

          {/* Slideshow Pill & Dot Indicators */}
          <div className="flex items-center gap-2 mb-3.5 relative z-10">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4A359]/30 text-[10.5px] text-[#E5BE7E] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
              <span className="font-medium">{heroSlides[activeSlide].caption}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-1.5 rounded-full border border-white/10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === i ? 'w-4.5 bg-[#D4A359]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Lihat Foto ${i + 1}`}
                  title={heroSlides[i].title}
                />
              ))}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-[25px] sm:text-[27px] font-bold text-white leading-[1.25] mb-2.5 tracking-tight drop-shadow-md relative z-10">
            Selamat Datang di<br />
            Museum Blambangan
          </h1>

          {/* Subtitle */}
          <p className="text-[12.5px] text-slate-200 leading-relaxed max-w-sm mb-6 drop-shadow-sm relative z-10">
            Jelajahi sejarah, budaya, dan warisan Banyuwangi dalam satu tempat.
          </p>

          {/* Golden Pill Button: Mulai Booking -> */}
          <button
            onClick={() => setActiveView('user-form')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A359] via-[#E5BE7E] to-[#D4A359] hover:from-[#C39247] hover:to-[#B68439] text-[#081827] font-black text-[13px] px-6 py-2.5 rounded-full shadow-lg border border-[#F5E2C2]/40 active:scale-95 transition-all cursor-pointer relative z-10"
          >
            <span>Mulai Booking</span>
            <span className="text-base leading-none">→</span>
          </button>

          {/* Note for Visitors Assisted by Counter Staff */}
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-300 max-w-[270px] sm:max-w-sm relative z-10">
            <span>💡</span>
            <span>Pengunjung yang kesulitan booking online dapat langsung membeli tiket di loket museum dibantu petugas.</span>
          </div>
        </main>

        {/* Bottom 3 Features Bar with Metallic Blue Finish */}
        <footer className="relative z-10 w-full bg-gradient-to-r from-[#061422] via-[#0E2640] to-[#061422] px-4 py-4 border-t border-[#2B5780]/40 overflow-hidden select-none">
          {/* Subtle Top Gold Highlight Line */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#DAB36E]/40 to-transparent" />

          {/* Authentic Banyuwangi Batik Gajah Oling Footer Watermark Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-between px-2">
            <img
              src="/assets/gajah-oling-footer-symmetric.png"
              alt="Batik Banyuwangi"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 text-center relative z-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center justify-center gap-1 px-1">
              <div className="w-6 h-6 flex items-center justify-center text-[#DAB36E]">
                <QrCode className="w-4.5 h-4.5 stroke-[1.9]" />
              </div>
              <span className="text-[11px] font-medium text-white/95 leading-tight">
                Mudah<br />& Cepat
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center justify-center gap-1 px-1">
              <div className="w-6 h-6 flex items-center justify-center text-[#DAB36E]">
                <ShieldCheck className="w-4.5 h-4.5 stroke-[1.9]" />
              </div>
              <span className="text-[11px] font-medium text-white/95 leading-tight">
                Aman<br />& Terpercaya
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center justify-center gap-1 px-1">
              <div className="w-6 h-6 flex items-center justify-center text-[#DAB36E]">
                <GraduationCap className="w-4.5 h-4.5 stroke-[1.9]" />
              </div>
              <span className="text-[11px] font-medium text-white/95 leading-tight">
                Wisata Edukasi<br />untuk Semua
              </span>
            </div>
          </div>
        </footer>

        {/* Interactive Feature Modals for Koleksi, Informasi, Kontak, and Profil */}
        <MuseumFeatureModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
        />
      </div>
    </div>
  );
};
