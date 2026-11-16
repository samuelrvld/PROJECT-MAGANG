import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Home, 
  Calendar, 
  Ticket, 
  User, 
  Search, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Users, 
  ShieldCheck, 
  Zap, 
  Download, 
  GraduationCap, 
  Globe, 
  PhoneCall, 
  Info, 
  Landmark, 
  Smartphone, 
  Monitor,
  ChevronRight,
  MapPin,
  Coins,
  Menu,
  X,
  Trash2,
  Compass,
  Copy,
  ExternalLink,
  Play,
  QrCode,
  Lock,
  Sparkles
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { ModernTicketPass } from '../common/ModernTicketPass';
import { MuseumFeatureModals, type MuseumModalType } from '../common/MuseumFeatureModals';
import { 
  SocialMediaIconRow, 
  InstagramIcon, 
  FacebookIcon, 
  YouTubeIcon, 
  TikTokIcon, 
  WhatsAppIcon, 
  TwitterBirdIcon,
  TwitterIcon
} from '../common/SocialMediaLinks';
import type { CategoryType } from '../../types';

import { 
  SESSIONS_CONFIG, 
  isSessionTimePassed, 
  getSessionQuotaStats, 
  getTodayWIB, 
  isWeekendClosed 
} from '../../utils/sessionUtils';

const TYPEWRITER_PHRASES = [
  'Kabupaten Banyuwangi',
  'Pusat Sejarah & Kebudayaan Blambangan',
  'Wisata Edukasi Sejarah & Budaya',
  'Setiap Koleksi Punya Cerita'
];

export const UserWebPortal: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    bookings, 
    myBookings,
    addMyBookingId,
    removeMyBookingId,
    clearAllMyBookings,
    setSelectedBookingId, 
    selectedBookingId,
    formData,
    setFormData,
    userViewMode,
    setUserViewMode,
    sessionsConfig,
    ishomaConfig
  } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [activeModal, setActiveModal] = useState<MuseumModalType>(null);
  const [viewingTicketId, setViewingTicketId] = useState<string | null>(null);
  const [claimCodeInput, setClaimCodeInput] = useState('');
  const [claimFeedback, setClaimFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showScrollBookPill, setShowScrollBookPill] = useState(false);

  // Typewriter Animation State (Like museumnegeri.ntbprov.go.id)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<1 | 2>(1);

  // Auto-cycle video: Video 1 rotates after 12s, Video 2 (Lingga-Yoni) rotates after 5s
  useEffect(() => {
    const cycleTimer = setTimeout(() => {
      setSelectedVideo(prev => prev === 1 ? 2 : 1);
    }, selectedVideo === 1 ? 12000 : 5000);
    return () => clearTimeout(cycleTimer);
  }, [selectedVideo]);

  useEffect(() => {
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
        setPhraseIndex(prev => (prev + 1) % TYPEWRITER_PHRASES.length);
        timer = setTimeout(() => {}, 400);
      }
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, phraseIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBookPill(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText('Jl. Jenderal A. Yani No. 78, Taman Baru, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Today WIB
  const todayStr = getTodayWIB();
  const isWeekendToday = isWeekendClosed(todayStr);

  // Only current visitor's bookings (do NOT display other visitors' mock tickets)
  const targetBookings = myBookings;
  const filteredBookings = targetBookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.nama.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'verified') return matchesSearch && b.status === 'Terverifikasi';
    if (filterStatus === 'pending') return matchesSearch && b.status === 'Menunggu Verifikasi';
    return matchesSearch;
  });

  const selectedTicket = (viewingTicketId ? targetBookings.find(b => b.id === viewingTicketId) : null) || 
                         (selectedBookingId ? targetBookings.find(b => b.id === selectedBookingId) : null) || 
                         targetBookings[0] || 
                         null;

  const handleClaimTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = claimCodeInput.trim().toUpperCase();
    if (!query) return;

    const found = bookings.find(b => b.id.toUpperCase() === query || b.telepon === query);
    if (found) {
      addMyBookingId(found.id);
      setSelectedBookingId(found.id);
      setViewingTicketId(found.id);
      setClaimFeedback({
        type: 'success',
        text: `Tiket ${found.id} atas nama "${found.nama}" berhasil ditemukan dan ditambahkan ke daftar tiket Anda!`
      });
      setClaimCodeInput('');
    } else {
      setClaimFeedback({
        type: 'error',
        text: `Kode booking "${query}" tidak ditemukan. Pastikan format benar (contoh: MB-20250815-0012).`
      });
    }
  };

  // Official Category Pricing
  const categories: { type: CategoryType; label: string; price: number; icon: React.ReactNode; desc: string; badgeColor: string }[] = [
    {
      type: 'Pelajar/Mahasiswa',
      label: 'Pelajar / Mahasiswa (Individu)',
      price: 5000,
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      desc: 'Kunjungan mandiri (1–9 orang). Wajib menunjukkan Kartu Pelajar/Mahasiswa aktif di loket.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      type: 'Umum',
      label: 'Pengunjung Umum',
      price: 7500,
      icon: <User className="w-5 h-5 text-blue-600" />,
      desc: 'Wisatawan domestik, perseorangan, dan keluarga non-pelajar.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      type: 'Mancanegara',
      label: 'Wisatawan Mancanegara',
      price: 20000,
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      desc: 'International visitors / foreign tourists (all ages).',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      type: 'Pelajar Rombongan',
      label: 'Pelajar Rombongan (Studi Tour)',
      price: 5000,
      icon: <Users className="w-5 h-5 text-teal-600" />,
      desc: 'Khusus rombongan sekolah / kampus minimal 10 orang terdaftar dengan pendamping resmi.',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 selection:bg-[#0F292F] selection:text-white font-sans">
      {/* ================= STICKY TOP NAVBAR (Clean White Theme like Majestic Banyuwangi) ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-xs transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Left: Brand Logo (Enlarged Museum Blambangan Logo - High Precision) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setActiveView('user-landing'); setViewingTicketId(null); }}
                className="flex items-center gap-2.5 text-left cursor-pointer group py-1.5"
                title="Museum Blambangan Banyuwangi"
              >
                <MuseumLogo 
                  variant="dark" 
                  className="h-14 sm:h-16 lg:h-20 w-auto object-contain transition-transform group-hover:scale-[1.02] drop-shadow-xs" 
                />
              </button>
            </div>

            {/* Right: Clean Text Navigation Links - Refined & Aesthetic */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13.5px] font-semibold text-slate-600 font-sans tracking-normal">
              <button
                type="button"
                onClick={() => { setActiveView('user-landing'); setViewingTicketId(null); }}
                className={`transition-all duration-150 cursor-pointer py-1.5 relative ${
                  activeView === 'user-landing'
                    ? 'text-[#0B3B60] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4A359] after:rounded-full'
                    : 'hover:text-[#0B3B60]'
                }`}
              >
                Home
              </button>

              <a
                href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-150 cursor-pointer py-1.5 hover:text-[#0B3B60] flex items-center gap-1.5 font-bold text-slate-700"
                title="Katalog Koleksi Resmi Museum Blambangan"
              >
                <span>Katalog Museum</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4A359]" />
              </a>

              <button
                type="button"
                onClick={() => { setActiveView('user-web-portal'); setViewingTicketId(null); }}
                className={`relative transition-all duration-150 cursor-pointer py-1.5 flex items-center gap-1.5 ${
                  activeView === 'user-web-portal'
                    ? 'text-[#0B3B60] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4A359] after:rounded-full'
                    : 'hover:text-[#0B3B60]'
                }`}
              >
                <span>Tiket Saya</span>
                {myBookings.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A359] text-[#081827]">
                    {myBookings.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('informasi')}
                className="hover:text-[#0B3B60] transition-colors cursor-pointer py-1.5"
              >
                Jadwal & Tarif
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('kontak')}
                className="hover:text-[#0B3B60] transition-colors cursor-pointer py-1.5"
              >
                Kontak & Layanan
              </button>

              <button
                type="button"
                onClick={() => setActiveView('admin-login')}
                className="hover:text-[#0B3B60] font-bold transition-all cursor-pointer flex items-center gap-1.5 border-l border-slate-200 pl-5 py-1 text-slate-800"
                title="Portal Petugas & Admin"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Login Petugas</span>
              </button>
            </nav>

            {/* Mobile Actions: Profile & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveModal('profil')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Profil Pengunjung"
              >
                <User className="w-4 h-4 text-slate-700" />
              </button>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5 text-[#D4A359]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer (Clean White Theme) */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => { setActiveView('user-landing'); setViewingTicketId(null); setMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                  activeView === 'user-landing' ? 'bg-[#092C48]/8 text-[#092C48] font-extrabold' : 'hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-[#D4A359]" />
                <span>Home</span>
              </button>

              <a
                href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-[#D4A359]" />
                  <span className="font-bold">Katalog Museum</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => { setActiveView('user-web-portal'); setViewingTicketId(null); setMobileSidebarOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                  activeView === 'user-web-portal' ? 'bg-[#092C48]/8 text-[#092C48] font-extrabold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-[#D4A359]" />
                  <span>Tiket Saya</span>
                </div>
                {myBookings.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A359] text-[#081827]">
                    {myBookings.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveModal('informasi'); setMobileSidebarOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left transition-colors"
              >
                <Clock className="w-4 h-4 text-[#D4A359]" />
                <span>Jadwal & Tarif</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveModal('kontak'); setMobileSidebarOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#D4A359]" />
                <span>Layanan Lainnya</span>
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setActiveView('user-qris'); setMobileSidebarOpen(false); }}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-100 font-semibold cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Desain QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveView('admin-login'); setMobileSidebarOpen(false); }}
                className="text-[#092C48] hover:underline flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg font-bold cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Login Petugas</span>
              </button>
            </div>
          </div>
        )}
      </header>


      

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-white w-full print:m-0 print:p-0 print:min-h-0 print:overflow-visible">
        {/* Beranda Web (Full-width Wide Hero Video & Content) */}
        {activeView === 'user-landing' && (
          <div className="w-full animate-in fade-in duration-200">
            {/* Hero Banner with Full-width HD Video Background & Reference Typewriter Typography */}
            <div className="relative w-full bg-[#081827] text-white min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] xl:min-h-[880px] min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-end select-none overflow-hidden group">
              {/* Full HD Background Video - Edge to Edge with Smooth Dissolve */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Video 1: Exterior Architecture */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    selectedVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
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
                    selectedVideo === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <source src="/assets/museum-hero-video-2.mp4" type="video/mp4" />
                </video>

              {/* Crystal Clear HD Video Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061422] via-transparent via-35% to-black/25 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061422]/85 via-[#061422]/50 via-45% to-transparent pointer-events-none z-10" />
            </div>

            {/* Hero Content Container (Clean, Direct on HD Video) */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="max-w-3xl space-y-4 sm:space-y-5">
                {/* Header Titles */}
                <div className="space-y-1.5 sm:space-y-2">
                  {/* Line 1: SELAMAT DATANG DI */}
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#E5C287] block drop-shadow-md">
                    SELAMAT DATANG DI
                  </span>
                  {/* Line 2: MUSEUM BLAMBANGAN (Clean, Balanced, Single Line) */}
                  <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black uppercase text-white tracking-tight leading-tight drop-shadow-xl">
                    MUSEUM BLAMBANGAN
                  </h1>
                  {/* Line 3: Typing Animated Text + Cursor */}
                  <div className="font-sans text-lg sm:text-2xl md:text-3xl font-extrabold text-[#F3E2C4] drop-shadow-lg min-h-[36px] sm:min-h-[44px] flex items-center pt-0.5">
                    <span className="inline-flex items-center flex-wrap">
                      <span>{typewriterText}</span>
                      <span className="inline-block w-[3px] sm:w-[4px] h-[1em] bg-[#D4A359] ml-1.5 align-middle animate-pulse" />
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed font-normal drop-shadow-md">
                  <strong className="text-white font-semibold">Setiap koleksi punya cerita.</strong> Jelajahi kekayaan sejarah kerajaan Blambangan, artefak purbakala, etnografi suku Osing, dan mahakarya seni budaya Banyuwangi.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveView('user-form')}
                    className="px-6 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-[#D4A359] via-[#E5BE7E] to-[#D4A359] hover:from-[#C39247] hover:to-[#B68439] text-[#081827] font-black text-xs sm:text-sm rounded-xl shadow-xl border border-[#F5E2C2]/50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer hover:shadow-2xl"
                  >
                    <span>Mulai Booking Kunjungan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#0E2C4A]/85 hover:bg-[#143B60] text-[#E5C287] font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-[#D4A359]/30 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Landmark className="w-4 h-4 text-[#D4A359]" />
                    <span>Katalog Museum</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4A359]/80" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveView('user-web-portal')}
                    className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-[#D4A359]" />
                    <span>Cek Tiket Saya</span>
                  </button>
                </div>
              </div>
            </div>
            </div>

            {/* Landing Page Content Sections */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

              {/* 3 Core Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Mudah & Cepat</h2>
                    <p className="text-[11px] text-slate-500">Pemesanan online instan tanpa antri panjang.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Aman & Terpercaya</h2>
                    <p className="text-[11px] text-slate-500">Sistem pembayaran QRIS resmi & verifikasi digital.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Wisata Edukasi Lengkap</h2>
                    <p className="text-[11px] text-slate-500">Koleksi purbakala & warisan budaya terlengkap.</p>
                  </div>
                </div>
              </div>

              {/* Sesi Kunjungan & Jam Operasional */}
              {/* Jadwal Sesi Hari Ini (Traveloka / RedBus Style) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Pilihan Sesi & Jam Kunjungan Hari Ini
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Live Quota
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Museum Blambangan buka hari <strong>Senin – Jumat (07:30 – 16:00 WIB)</strong>. Istirahat ISHOMA: {ishomaConfig.label}. Sabtu & Minggu libur operasional.
                    </p>
                  </div>

                  {/* KAI Access Style Operational Announcement */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0E2B5C] text-white border border-[#1D4ED8]/40 shadow-xs shrink-0">
                    <Clock className="w-4 h-4 text-[#D4A359] shrink-0" />
                    <div className="text-left">
                      <span className="block text-xs font-bold leading-tight text-white">
                        Loket Aktif: 07:30 – 16:00 WIB (Senin – Jumat)
                      </span>
                      <span className="block text-[10px] text-blue-200 leading-tight mt-0.5 font-medium">
                        Buka Senin – Jumat • Sabtu & Minggu Libur
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sesi Cards in RedBus & Traveloka Seat-Slot Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessionsConfig.map((sesi) => {
                    const isPassed = isSessionTimePassed(sesi, todayStr);
                    const quotaStats = getSessionQuotaStats(sesi.id, todayStr, bookings);
                    const isFull = quotaStats.isFull;
                    const isUnavailable = isPassed || isFull;
                    const usedQuota = 100 - quotaStats.remaining;
                    const percentFilled = Math.min(100, Math.round((usedQuota / 100) * 100));

                    return (
                      <div
                        key={sesi.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3.5 flex flex-col justify-between ${
                          isUnavailable
                            ? 'border-slate-200 bg-slate-50/80 opacity-70 grayscale-[20%]'
                            : 'border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-[#D4A359] group'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Row: Session Tag & Price */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#081827]/5 text-[#081827] border border-slate-200">
                              {sesi.label} • {sesi.subLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              Mulai <strong className="text-emerald-700 font-black">Rp 5.000</strong>
                            </span>
                          </div>

                          {/* Middle: Departure Time */}
                          <div>
                            <div className="flex items-center gap-2 text-lg font-black text-slate-900">
                              <Clock className="w-4 h-4 text-[#D4A359]" />
                              <span>{sesi.time}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Durasi kunjungan 2,5 jam • Akses seluruh galeri
                            </span>
                          </div>

                          {/* Quota Progress Meter (RedBus Live Seat Indicator) */}
                          <div className="space-y-1.5 pt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px]">
                              {isWeekendToday ? (
                                <span className="font-bold text-amber-700">Libur Akhir Pekan</span>
                              ) : isPassed ? (
                                <span className="font-bold text-slate-500">✕ Jam Sesi Telah Lewat</span>
                              ) : isFull ? (
                                <span className="font-bold text-rose-700">⛔ Kuota Sesi Penuh</span>
                              ) : (
                                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Tersisa <strong>{quotaStats.remaining}</strong> kuota</span>
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-medium">{usedQuota}/100 terisi</span>
                            </div>

                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percentFilled > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percentFilled}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!isUnavailable) {
                              setFormData(prev => ({ 
                                ...prev, 
                                tanggalKunjungan: todayStr,
                                sesi: `${sesi.label} (${sesi.time})` 
                              }));
                            } else {
                              setFormData(prev => ({ 
                                ...prev, 
                                sesi: `${sesi.label} (${sesi.time})` 
                              }));
                            }
                            setActiveView('user-form');
                          }}
                          className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isUnavailable
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              : 'bg-[#081827] hover:bg-[#0d263e] text-[#D4A359] group-hover:text-white'
                          }`}
                        >
                          <span>{isUnavailable ? 'Pilih Jadwal Lain' : 'Pilih Sesi Ini'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tarif Masuk Resmi per Kategori */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Tarif Tiket Masuk Resmi per Kategori
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sesuai Peraturan Daerah Kabupaten Banyuwangi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((c) => (
                    <div
                      key={c.type}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                            {c.icon}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                            {c.type}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs text-slate-800">
                          {c.label}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {c.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400">Harga Tiket:</span>
                        <span className="text-base font-black text-[#0F343D]">
                          Rp {c.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Koleksi Peninggalan Sejarah & Budaya */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Koleksi Peninggalan Sejarah & Budaya
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Museum Blambangan mengelola ragam koleksi cagar budaya, artefak arkeologi, dan etnografi suku Osing Kabupaten Banyuwangi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('user-koleksi')}
                    className="text-xs font-bold text-[#092C48] hover:text-[#D4A359] transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <span>Lihat Seluruh Koleksi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Card 1: Candi Macan Putih */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src="/assets/slide-2-candi-macan-putih-hd.jpg"
                        alt="Candi Macan Putih"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#E5BE7E] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Era Kerajaan Blambangan
                        </span>
                        <h3 className="font-sans text-base font-bold mt-1 text-white">
                          Artefak Candi Macan Putih
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between text-xs text-slate-600">
                      <p className="text-[11.5px] leading-relaxed">
                        Peninggalan bata berelief, keramik kuno, dan artefak bersejarah dari ibukota Kerajaan Blambangan masa pemerintahan Prabu Tawangalun.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Arca Klasik Lingga-Yoni */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src="/assets/slide-4-lingga-yoni-hd.jpg"
                        alt="Arca Klasik Lingga-Yoni"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#E5BE7E] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Abad ke-14 Masehi
                        </span>
                        <h3 className="font-sans text-base font-bold mt-1 text-white">
                          Peninggalan Arca Lingga-Yoni
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between text-xs text-slate-600">
                      <p className="text-[11.5px] leading-relaxed">
                        Simbol kesuburan dan keharmonisan peradaban Hindu-Jawa kuno yang ditemukan di berbagai situs candi dan pemukiman klasik Banyuwangi.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Galeri Foto Tempo Doeloe & Etnografi Osing */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group sm:col-span-2 lg:col-span-1">
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src="/assets/slide-3-galeri-sejarah-hd.jpg"
                        alt="Galeri Foto Banyuwangi Tempo Doeloe"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#E5BE7E] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Dokumentasi Sejarah
                        </span>
                        <h3 className="font-sans text-base font-bold mt-1 text-white">
                          Banyuwangi Tempo Doeloe
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between text-xs text-slate-600">
                      <p className="text-[11.5px] leading-relaxed">
                        Arsip foto bersejarah stasiun kereta tua, pelabuhan Boom tempo dulu, tradisi ritual Seblang, hingga kesenian Gandrung Banyuwangi masa lampau.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= EYE-CATCHING CULTURAL SHOWPIECE BANNER ================= */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A359]/50 bg-gradient-to-br from-[#051525] via-[#0C2744] to-[#07192C] text-white p-8 sm:p-12 lg:p-14 text-center group">
                  {/* Ambient Golden Radial Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4A359]/15 blur-[120px] rounded-full pointer-events-none" />

                  {/* Symmetrical Batik Gajah Oling Heritage Watermark */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-between px-4 mix-blend-screen">
                    <img
                      src="/assets/gajah-oling-footer-symmetric.png"
                      alt="Batik Gajah Oling Banyuwangi"
                      className="w-full h-full object-cover filter brightness-125"
                    />
                  </div>

                  {/* Golden Border Accents */}
                  <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#E5BE7E] to-transparent" />
                  <div className="absolute bottom-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#E5BE7E]/60 to-transparent" />

                  <div className="relative z-10 max-w-3xl mx-auto space-y-5">
                    {/* Sparkling Cultural Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A359]/15 border border-[#D4A359]/40 text-[#E5BE7E] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#E5BE7E] animate-pulse" />
                      <span>Warisan Luhur Nusantara • Banyuwangi</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#E5BE7E] animate-pulse" />
                    </div>

                    {/* Big Eye-Catching Quote with Stylized Amber Highlight */}
                    <blockquote className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-white leading-tight tracking-tight drop-shadow-md">
                      <span className="text-[#E5BE7E] text-3xl sm:text-4xl md:text-5xl font-serif align-top mr-1">“</span>
                      <span>Setiap koleksi punya cerita. </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5DEB3] via-[#E5BE7E] to-[#F3B755] block sm:inline">
                        Temukan ceritamu di Museum Blambangan.
                      </span>
                      <span className="text-[#E5BE7E] text-3xl sm:text-4xl md:text-5xl font-serif align-top ml-1">”</span>
                    </blockquote>

                    {/* Subtitle / Explanatory Text */}
                    <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xs">
                      Menyimpan lebih dari 4.000 artefak arkeologi, prasasti kerajaan, naskah kuno, hingga kekayaan tradisi suku Osing yang siap memperkaya wawasan dan inspirasi Anda.
                    </p>

                    {/* Action Buttons */}
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setActiveView('user-form')}
                        className="px-7 py-3.5 bg-gradient-to-r from-[#D4A359] via-[#E5BE7E] to-[#D4A359] hover:from-[#C39247] hover:to-[#B68439] text-[#081827] font-black text-xs sm:text-sm rounded-xl shadow-xl border border-[#F5E2C2]/50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer hover:shadow-2xl"
                      >
                        <span>Rencanakan Kunjungan Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveView('user-koleksi')}
                        className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-[#F5DEB3] font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Landmark className="w-4 h-4 text-[#D4A359]" />
                        <span>Jelajahi Galeri Koleksi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= OTHER VIEWS (Tiket Saya / Detail Tiket) ================= */}
        {activeView !== 'user-landing' && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10 text-left print:p-0 print:m-0 print:max-w-none">
            {/* ================= CASE 2: TIKET SAYA WEB ================= */}
            {(activeView === 'user-web-portal' || viewingTicketId) && (
              <div className="space-y-6 animate-in fade-in duration-200">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 ${viewingTicketId ? 'print:hidden' : ''}`}>
                <div>
                  <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Tiket Saya
                  </h1>
                  <p className="text-xs text-slate-500">
                    Daftar reservasi dan e-tiket kunjungan Museum Blambangan Anda.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari kode atau nama..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-52 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#17293D]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('user-form')}
                    className="py-2 px-4 bg-[#17293D] hover:bg-[#0F292F] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>+ Booking Baru</span>
                  </button>
                </div>
              </div>

              {/* Security & Privacy Banner */}
              <div className={`p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-sky-50/70 border border-blue-200/80 flex items-start gap-3 text-slate-700 shadow-2xs ${viewingTicketId ? 'print:hidden' : ''}`}>
                <div className="p-1.5 rounded-xl bg-[#092C48] text-white shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4A359]" />
                </div>
                <div className="text-xs space-y-0.5 flex-1">
                  <div className="font-bold text-[#092C48] flex items-center justify-between">
                    <span>Privasi & Keamanan E-Tiket Anda Terisolasi</span>
                    {targetBookings.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Bersihkan semua riwayat tiket dari browser/perangkat ini? (Data di database museum tetap aman)')) {
                            clearAllMyBookings();
                          }
                        }}
                        className="text-[10px] text-slate-500 hover:text-red-600 font-semibold hover:underline cursor-pointer"
                      >
                        Bersihkan Riwayat Perangkat
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Tiket hanya tersimpan secara lokal dan privat pada perangkat ini. Pengunjung lain pada ponsel atau komputer berbeda tidak dapat melihat maupun mengakses e-tiket Anda.
                  </p>
                </div>
              </div>

              {/* If viewing specific ticket: show ModernTicketPass */}
              {viewingTicketId && selectedTicket ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between print:hidden">
                    <button
                      type="button"
                      onClick={() => setViewingTicketId(null)}
                      className="text-xs font-bold text-[#17293D] hover:underline flex items-center gap-1"
                    >
                      ← Kembali ke Daftar Tiket Saya
                    </button>
                  </div>
                  <ModernTicketPass
                    booking={selectedTicket}
                    onBack={() => setViewingTicketId(null)}
                    showActions={true}
                  />
                </div>
              ) : filteredBookings.length === 0 ? (
                /* Tampilan saat belum ada tiket */
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xs flex flex-col items-center text-center max-w-lg mx-auto my-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                    <Ticket className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800 mb-1">
                    Belum Ada Tiket Kunjungan Dipesan
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
                    Anda belum memiliki tiket aktif pada perangkat ini. Lakukan pemesanan tiket baru untuk mendapatkan e-tiket resmi Museum Blambangan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView('user-form')}
                    className="py-2.5 px-6 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 mb-6"
                  >
                    <span>Booking Kunjungan Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Quick ticket lookup/claim box */}
                  <div className="w-full pt-5 border-t border-slate-100 text-left">
                    <div className="text-[11px] font-bold text-slate-700 mb-1">
                      Sudah pernah reservasi atau punya kode booking?
                    </div>
                    <p className="text-[10.5px] text-slate-400 mb-2.5">
                      Masukkan Kode Booking (contoh: <span className="font-mono text-slate-600">MB-20250815-0012</span>) atau nomor WhatsApp Anda untuk menampilkan tiket di sini:
                    </p>
                    <form onSubmit={handleClaimTicket} className="flex gap-2">
                      <input
                        type="text"
                        value={claimCodeInput}
                        onChange={(e) => setClaimCodeInput(e.target.value)}
                        placeholder="Contoh: MB-20250815-0012"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:outline-none focus:border-[#17293D]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#092C48] hover:bg-[#071f33] text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Cari Tiket
                      </button>
                    </form>
                    {claimFeedback && (
                      <div className={`mt-2 p-2.5 rounded-lg text-[10.5px] ${
                        claimFeedback.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {claimFeedback.text}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Daftar tiket pengunjung */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#092C48] text-sm">
                            {b.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              b.status === 'Terverifikasi'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : b.status === 'Ditolak'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="font-bold text-slate-800 text-sm">
                          {b.nama}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Kategori & Jumlah</span>
                            <span>{b.kategori} • {b.jumlahOrang} Org</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Total Biaya</span>
                            <span className="font-bold text-[#092C48]">
                              Rp {b.totalPembayaran.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] text-slate-400 block">Jadwal & Sesi</span>
                            <span>{b.tanggalKunjungan} ({b.sesi})</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {b.metodePembayaran === 'tunai' ? '💵 Tunai di Loket' : '📱 QRIS Terverifikasi'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus tiket ${b.id} dari tampilan perangkat ini? (Data di museum tetap aman)`)) {
                                removeMyBookingId(b.id);
                              }
                            }}
                            title="Hapus dari riwayat perangkat ini"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBookingId(b.id);
                              if (b.status === 'Terverifikasi') {
                                setViewingTicketId(b.id);
                              } else {
                                setActiveView('user-status');
                              }
                            }}
                            className="px-4 py-2 bg-[#092C48] hover:bg-[#071f33] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{b.status === 'Terverifikasi' ? 'Buka E-Tiket' : 'Cek Status'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= CASE 3: TIKET DETAIL VIEW ================= */}
          {activeView === 'user-ticket' && (
            <div className="space-y-4 print:space-y-0 print:m-0 print:p-0">
              <div className="flex items-center justify-between print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveView('user-web-portal')}
                  className="text-xs font-bold text-[#17293D] hover:underline flex items-center gap-1 print:hidden cursor-pointer"
                >
                  ← Kembali ke Tiket Saya
                </button>
              </div>
              <ModernTicketPass
                booking={selectedTicket}
                onBack={() => setActiveView('user-web-portal')}
                showActions={true}
              />
            </div>
          )}
        </main>
      )}

        {/* ================= OFFICIAL FOOTER (Disbudpar Banyuwangi Style - Light & Authentic) ================= */}
        <footer className="mt-auto bg-[#F4F7FB] text-slate-800 border-t border-slate-200/90 pt-12 pb-8 px-4 sm:px-6 lg:px-12 font-sans select-none print:hidden relative overflow-hidden">
          {/* Subtle Decorative Background Curve */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-100/50 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            {/* Main Content Grid: Left Info & Right Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start text-left">
              {/* Left Column: Logos, Description, Follow Us & Contact Rows */}
              <div className="lg:col-span-7 space-y-6">
                {/* Brand Logos Row: Majestic Banyuwangi, Ijen Geopark & Disbudpar (Natural Brand Colors) */}
                <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                  <img
                    src="/assets/logo-majestic-banyuwangi.png"
                    alt="Majestic Banyuwangi"
                    className="h-10 sm:h-12 w-auto object-contain drop-shadow-2xs"
                  />
                  <img
                    src="/assets/logo-ijen-geopark.png"
                    alt="Ijen Geopark"
                    className="h-11 sm:h-13 w-auto object-contain drop-shadow-2xs"
                  />
                  <div className="border-l-2 border-slate-300 pl-4 py-0.5">
                    <div className="text-sm sm:text-base font-extrabold text-[#0B3B60] leading-tight">
                      Dinas Kebudayaan dan Pariwisata
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#B58130] uppercase mt-0.5">
                      Kabupaten Banyuwangi
                    </div>
                  </div>
                </div>

                {/* Description Paragraph (Official Reference Text Style) */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xl font-normal">
                  Museum Blambangan adalah sarana pelestarian sejarah, arkeologi, dan cagar budaya resmi Kabupaten Banyuwangi yang dikelola oleh Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi.
                </p>

                {/* FOLLOW US Row: Official Real Museum Social Media Icons (Vibrant Brand Colors) */}
                <div className="pt-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-500 uppercase mr-1">
                      FOLLOW US
                    </span>
                    <div className="flex items-center gap-2.5">
                      {/* Facebook */}
                      <a
                        href="https://www.facebook.com/museumblambangan"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook Museum Blambangan"
                        title="Facebook: Museum Blambangan (@museumblambangan)"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>

                      {/* Twitter / X */}
                      <a
                        href="https://twitter.com/bwi_tourism"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter Banyuwangi Tourism"
                        title="Twitter: @bwi_tourism"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <TwitterBirdIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/museumblambangan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram Museum Blambangan"
                        title="Instagram: @museumblambangan"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>

                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@museumblambangan"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube Museum Blambangan"
                        title="YouTube: Museum Blambangan Official"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <YouTubeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>

                      {/* TikTok */}
                      <a
                        href="https://www.tiktok.com/@museumblambangan"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok Museum Blambangan"
                        title="TikTok: @museumblambangan"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#010101] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer border border-black/10"
                      >
                        <TikTokIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>

                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/6285287258502"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp Layanan Museum Blambangan"
                        title="WhatsApp Layanan: +62 852-8725-8502"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs hover:scale-110 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Official Address Info Row */}
                <div className="space-y-3.5 pt-3 border-t border-slate-200/90">
                  {/* ALAMAT */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-[#0B3B60]">
                      <MapPin className="w-4 h-4 text-[#D4A359]" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Alamat
                      </div>
                      <div className="text-xs sm:text-[13px] text-slate-700 leading-snug">
                        Jl. Jenderal Ahmad Yani No.78, Taman Baru, Kec. Banyuwangi, Jawa Timur 68416
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Lokasi Kami (Google Map Card) & Jam Layanan */}
              <div className="lg:col-span-5 space-y-5">
                {/* Jam Operasional Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Jam Layanan Loket Museum
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Senin – Jumat: <strong className="text-emerald-700 font-semibold">07:30 – 16:00 WIB</strong> (Sabtu & Minggu Tutup)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 shrink-0 border border-emerald-200">
                    Buka Senin – Jumat
                  </span>
                </div>

                {/* Lokasi Kami Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
                      Lokasi Museum Blambangan
                    </h4>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="text-[11px] text-[#0B3B60] hover:text-[#D4A359] hover:underline flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                    >
                      {copiedAddress ? <span>✓ Alamat Tersalin</span> : <span>Salin Alamat</span>}
                    </button>
                  </div>

                  <div className="h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-sm group">
                    {/* Floating Maps Pill */}
                    <a
                      href="https://maps.google.com/?q=Museum+Blambangan+Banyuwangi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2.5 left-2.5 z-10 px-3 py-1 rounded-xl bg-white/95 hover:bg-white text-[#0B3B60] text-xs font-extrabold shadow-md flex items-center gap-1 transition-all cursor-pointer hover:scale-105 border border-slate-200/80"
                      title="Buka Peta di Google Maps"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-3 h-3 text-[#0B3B60]" />
                    </a>

                    <iframe
                      title="Lokasi Museum Blambangan di Google Maps"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.835497910901!2d114.3644146!3d-8.2192737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd15ab670868f03%3A0xc34b3e5f49e49c71!2sMuseum%20Blambangan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full filter saturate-[1.05]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Copyright & Subtle Portal Petugas Link */}
            <div className="pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left font-normal">
              <span>
                © {new Date().getFullYear()} Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi. Hak Cipta Dilindungi.
              </span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveView('admin-login')}
                  className="text-slate-500 hover:text-[#0B3B60] transition-colors text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  title="Portal Petugas Loket & Admin"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>Portal Petugas</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Feature Modals (Koleksi, Informasi, Kontak, Profil) */}
      <MuseumFeatureModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />

      {/* Mobile Floating Quick Booking Pill (Discreet, Elegant, Matches Theme) */}
      {showScrollBookPill && (
        <div className="fixed bottom-5 right-4 z-40 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-200 print:hidden">
          <button
            type="button"
            onClick={() => setActiveView('user-form')}
            className="flex items-center gap-2 bg-[#092C48] hover:bg-[#071F33] text-white px-4 py-2.5 rounded-full shadow-2xl border border-[#D4A359]/60 active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-[#D4A359]" />
            <span>Pesan Tiket</span>
            <span className="text-[#D4A359]">→</span>
          </button>
        </div>
      )}
    </div>
  );
};
