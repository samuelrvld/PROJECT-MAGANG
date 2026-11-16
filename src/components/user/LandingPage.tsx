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
  ChevronRight,
  ExternalLink,
  Compass
} from 'lucide-react';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { OmprokGandrung } from '../common/OmprokGandrung';
import { SiluetPenariGandrung } from '../common/SiluetPenariGandrung';
import { MuseumLogo } from '../common/MuseumLogo';
import { MuseumFeatureModals, type MuseumModalType } from '../common/MuseumFeatureModals';
import { SocialMediaIconRow } from '../common/SocialMediaLinks';

const TYPEWRITER_PHRASES = [
  'Kabupaten Banyuwangi',
  'Pusat Sejarah & Kebudayaan',
  'Wisata Edukasi Warisan Budaya',
  'Setiap Koleksi Punya Cerita'
];

export const LandingPage: React.FC = () => {
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
      position: 'object-[right_center]',
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
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const heroVideos = ['/assets/museum-hero-video-1.mp4', '/assets/museum-hero-video-2.mp4'];

  // Typewriter Animation State (Like museumnegeri.ntbprov.go.id)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex % TYPEWRITER_PHRASES.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typewriterText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setTypewriterText(currentPhrase.slice(0, typewriterText.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (typewriterText.length > 0) {
        timer = setTimeout(() => {
          setTypewriterText(currentPhrase.slice(0, typewriterText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        timer = setTimeout(() => {}, 400);
      }
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, phraseIndex]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-cycle video: Video 1 rotates after 12s, Video 2 (Lingga-Yoni) rotates after 5s
  React.useEffect(() => {
    const cycleTimer = setTimeout(() => {
      setActiveVideoIdx((prev) => (prev + 1) % heroVideos.length);
    }, activeVideoIdx === 0 ? 12000 : 5000);
    return () => clearTimeout(cycleTimer);
  }, [activeVideoIdx, heroVideos.length]);

  return (
    <div className="min-h-screen bg-[#081523] sm:bg-[#E8EDF5] flex justify-center items-start sm:py-6 sm:px-4">
      {/* 100% Edge-to-Edge on mobile, Centered Card on desktop */}
      <div className="w-full max-w-full sm:max-w-[420px] md:max-w-md min-h-screen sm:min-h-[880px] bg-gradient-to-b from-[#081827] via-[#102B48] to-[#081523] text-white flex flex-col justify-between relative overflow-hidden sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-[#224A72]/40 select-none">
        
        {/* Full HD Background Video with Smooth Dissolve */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Video 1: Exterior Architecture */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              activeVideoIdx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <source src="/assets/museum-hero-video-1.mp4" type="video/mp4" />
          </video>

          {/* Video 2: Lingga-Yoni Artifact Gallery */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              activeVideoIdx === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <source src="/assets/museum-hero-video-2.mp4" type="video/mp4" />
          </video>

          {/* Crystal Clear HD Video Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent via-35% to-[#081523]/95 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent via-45% to-transparent pointer-events-none z-10" />
        </div>

        {/* Top Header: Logo (left) + Hamburger Icon (right) */}
        <header className="w-full max-w-full relative z-20 px-4 sm:px-5 pt-4 sm:pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[calc(100%-54px)] overflow-hidden shrink-0">
            <MuseumLogo variant="white" className="h-10 sm:h-12 w-auto object-contain drop-shadow" />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#D4A359] transition-colors cursor-pointer rounded-xl bg-white/10 hover:bg-white/20 shrink-0"
            aria-label="Menu"
          >
            {mobileMenuOpen && !activeModal ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
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
                    <MuseumLogo variant="white" className="h-9 sm:h-10 w-auto object-contain drop-shadow" />
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

                    <a
                      href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-bold leading-tight flex items-center gap-1.5">
                            <span>Katalog Museum</span>
                            <span className="text-[9px] bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/30 px-1.5 py-0.2 rounded-full font-bold">Resmi</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-none mt-0.5">E-Katalog Koleksi Lengkap</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D4A359] transition-colors" />
                    </a>

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

              {/* Jam operasional & footer drawer */}
              <div className="pt-3 border-t border-white/10 space-y-2 relative z-10 shrink-0">
                {/* Jam Buka Loket Box */}
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5 text-[#F3E2C4]">
                      <Clock className="w-3 h-3 text-[#D4A359]" />
                      Jam Buka Loket
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                      Buka Senin – Jumat
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-300 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Senin – Jumat:</span>
                      <span className="font-semibold text-white">07:30 – 16:00 WIB</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[9.5px]">
                      <span>Sabtu & Minggu:</span>
                      <span className="font-medium text-amber-300">Tutup / Libur</span>
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

        {/* Bagian Hero Beranda (Clean, Modern, Direct on HD Video) */}
        <main className="relative z-10 px-4 sm:px-5 pt-12 sm:pt-20 pb-6 flex flex-col items-start text-left flex-1 justify-center sm:justify-start w-full">
          <div className="space-y-3.5 max-w-sm mb-4">
            {/* Main Title with Typewriter Effect (Matching Video Layout) */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E5C287] block drop-shadow-sm">
                SELAMAT DATANG DI
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight drop-shadow-md">
                MUSEUM BLAMBANGAN
              </h1>
              <div className="font-sans text-base sm:text-lg font-extrabold text-[#F3E2C4] drop-shadow-sm min-h-[30px] flex items-center">
                <span className="inline-flex items-center flex-wrap">
                  <span>{typewriterText}</span>
                  <span className="inline-block w-[2.5px] h-[1em] bg-[#D4A359] ml-1 align-middle animate-pulse" />
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-[12px] sm:text-xs text-slate-200 leading-relaxed drop-shadow-sm font-normal">
              <strong className="text-white font-semibold">“Setiap koleksi punya cerita.”</strong> Temukan ceritamu dan jelajahi ribuan peninggalan bersejarah peradaban Bumi Blambangan.
            </p>

            {/* Action Buttons: Mulai Booking & Katalog Museum */}
            <div className="flex flex-col gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A359] via-[#E5BE7E] to-[#D4A359] hover:from-[#C39247] hover:to-[#B68439] text-[#081827] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg border border-[#F5E2C2]/40 active:scale-95 transition-all cursor-pointer"
              >
                <span>Mulai Booking Kunjungan</span>
                <span className="text-base leading-none">→</span>
              </button>

              <a
                href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-[#F3E2C4] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur-sm active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <Landmark className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Katalog Museum</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4A359]/80" />
              </a>
            </div>
          </div>

          {/* Note for Visitors Assisted by Counter Staff */}
          <div className="px-1 flex items-center gap-1.5 text-[10px] text-slate-300 max-w-[270px] sm:max-w-sm relative z-10">
            <span>💡</span>
            <span>Pengunjung yang kesulitan booking online dapat langsung membeli tiket di loket museum dibantu petugas.</span>
          </div>
        </main>

        {/* Footer Features */}
        <footer className="relative z-10 w-full bg-gradient-to-r from-[#061422] via-[#0E2640] to-[#061422] px-4 py-4 border-t border-[#2B5780]/40 overflow-hidden select-none">
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#DAB36E]/40 to-transparent" />

          {/* Ornamen Motif Gajah Oling Footer */}
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
