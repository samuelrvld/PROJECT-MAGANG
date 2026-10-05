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
  Sparkles, 
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
  ExternalLink
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { SiluetPenariGandrung } from '../common/SiluetPenariGandrung';
import { GandrungSewuSidebarFormation } from '../common/GandrungSewuSidebarFormation';
import { ModernTicketPass } from '../common/ModernTicketPass';
import { MuseumFeatureModals, type MuseumModalType } from '../common/MuseumFeatureModals';
import { SocialMediaIconRow } from '../common/SocialMediaLinks';
import type { CategoryType } from '../../types';

import { 
  SESSIONS_CONFIG, 
  isSessionTimePassed, 
  getSessionQuotaStats, 
  getTodayWIB, 
  isWeekendClosed 
} from '../../utils/sessionUtils';

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
      label: 'Pelajar / Mahasiswa',
      price: 5000,
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      desc: 'Wajib menunjukkan Kartu Pelajar / Mahasiswa aktif saat masuk loket.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      type: 'Umum',
      label: 'Pengunjung Umum',
      price: 7500,
      icon: <User className="w-5 h-5 text-blue-600" />,
      desc: 'Wisatawan domestik, perorangan, dan keluarga.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      type: 'Mancanegara',
      label: 'Wisatawan Mancanegara',
      price: 20000,
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      desc: 'International visitors / foreign tourists.',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      type: 'Pelajar Rombongan',
      label: 'Pelajar Rombongan',
      price: 5000,
      icon: <Users className="w-5 h-5 text-teal-600" />,
      desc: 'Kunjungan studi tour sekolah / universitas (min. 10 orang).',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800 selection:bg-[#0F292F] selection:text-white">
      {/* ================= MOBILE COMPACT TOPBAR (Phones only) ================= */}
      <div className="md:hidden bg-[#0F2236] text-white px-4 py-3 border-b border-[#1B3654] sticky top-0 z-40 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <MuseumLogo variant="white" className="h-8" />
        </div>

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5 text-[#DAB36E]" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* ================= MOBILE SLIDE-IN SIDEBAR DRAWER (Phones only) ================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden print:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-in Drawer from Left */}
          <aside className="fixed top-0 bottom-0 left-0 w-[300px] max-w-[85vw] bg-gradient-to-b from-[#051829] via-[#092C48] to-[#04121F] text-white z-50 flex flex-col justify-between shadow-2xl p-5 border-r border-[#153E66] animate-in slide-in-from-left duration-250 relative overflow-hidden">
            {/* Top-Right Gajah Oling Motif */}
            <div className="absolute -top-4 -right-4 w-32 h-32 opacity-10 pointer-events-none select-none transform rotate-12">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
            </div>

            {/* Bottom-Right Gajah Oling Motif */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-[0.09] pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
            </div>

            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto">
              {/* Header inside drawer */}
              <div className="pb-3.5 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <MuseumLogo variant="white" className="h-8" />
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
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

              {/* Navigation Items */}
              <nav className="space-y-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setActiveView('user-landing'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                    activeView === 'user-landing'
                      ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    activeView === 'user-landing'
                      ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                      : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                  }`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Beranda</span>
                    <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Halaman Utama</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveView('user-form'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                    activeView === 'user-form' || activeView === 'user-summary' || activeView === 'user-qris'
                      ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    activeView === 'user-form' || activeView === 'user-summary' || activeView === 'user-qris'
                      ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                      : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Booking Tiket</span>
                    <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Pilih Jadwal & Sesi</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveView('user-web-portal'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                    activeView === 'user-web-portal' || activeView === 'user-ticket'
                      ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      activeView === 'user-web-portal' || activeView === 'user-ticket'
                        ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                        : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                    }`}>
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold leading-tight">Tiket Saya</span>
                      <span className="text-[10px] text-slate-400 block leading-none mt-0.5">E-Tiket & QR Code</span>
                    </div>
                  </div>
                  {targetBookings.length > 0 && (
                    <span className="bg-gradient-to-r from-[#D4A359] to-[#E5BE7E] text-[#051829] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                      {targetBookings.length}
                    </span>
                  )}
                </button>

                <div className="pt-2.5 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] font-extrabold tracking-widest text-[#D4A359] uppercase px-3 py-1">
                    Informasi Museum
                  </div>

                  <button
                    type="button"
                    onClick={() => { setActiveView('user-musewangi'); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white transition-colors">
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
                    onClick={() => { setActiveModal('informasi'); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white transition-colors">
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
                    onClick={() => { setActiveModal('kontak'); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white transition-colors">
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

            {/* Authentic Banyuwangi Gandrung Sewu Formation in Sidebar */}
            <div className="pt-2 px-1 relative z-10 shrink-0">
              <GandrungSewuSidebarFormation />
            </div>

            {/* Operational Hours & Footer inside drawer matching media_1791115428347.png */}
            <div className="pt-2 border-t border-white/10 space-y-2 relative z-10 shrink-0">
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

      {/* ================= LEFT SIDEBAR (Desktop Luxury Metallic Blue & Heritage Theme) ================= */}
      <aside className="hidden md:flex w-72 lg:w-80 h-screen fixed top-0 bottom-0 left-0 bg-gradient-to-b from-[#081827] via-[#102B48] to-[#061422] text-white flex-col justify-between shrink-0 p-3.5 lg:p-4 border-r border-[#1C4268]/60 shadow-2xl overflow-y-auto overflow-x-hidden z-40 select-none print:hidden">
        {/* Authentic Banyuwangi Batik Gajah Oling - Top-Right Crown Accent (Subtle & Elegant) */}
        <div className="absolute -top-6 -right-6 w-36 h-36 opacity-[0.09] pointer-events-none select-none transform rotate-12">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
        </div>

        {/* Authentic Banyuwangi Batik Gajah Oling - Bottom-Right Frame Accent (Safely behind footer area) */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.07] pointer-events-none select-none transform -rotate-12">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
        </div>

        <div className="space-y-3.5 relative z-10">
          {/* Logo Brand Card - Rich Ethnic Cultural Border */}
          <div className="pt-1 pb-3 border-b border-white/10 relative">
            <div className="flex items-center justify-between">
              <MuseumLogo variant="white" className="h-9 sm:h-10 w-auto" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#E3C693] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                <span>Kab. Banyuwangi</span>
              </div>
              <span className="text-[9px] font-bold text-[#4A90E2] bg-[#4A90E2]/15 px-2 py-0.5 rounded-full border border-[#4A90E2]/30 tracking-wider">
                DISBUDPAR
              </span>
            </div>
          </div>

          {/* Section: Menu Navigasi Utama */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5 py-1">
              <span className="text-[10px] font-black tracking-widest text-[#D4A359] uppercase">
                Menu Utama
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Layanan E-Tiket</span>
            </div>

            <nav className="space-y-1 text-xs">
              {/* Beranda */}
              <button
                type="button"
                onClick={() => { setActiveView('user-landing'); setViewingTicketId(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  activeView === 'user-landing'
                    ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    activeView === 'user-landing'
                      ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                      : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                  }`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Beranda</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Halaman Utama</span>
                  </div>
                </div>
                {activeView === 'user-landing' && <span className="text-[#D4A359] text-xs font-bold">◆</span>}
              </button>

              {/* Booking Tiket */}
              <button
                type="button"
                onClick={() => { setActiveView('user-form'); setViewingTicketId(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  activeView === 'user-form' || activeView === 'user-summary' || activeView === 'user-qris'
                    ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    activeView === 'user-form' || activeView === 'user-summary' || activeView === 'user-qris'
                      ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                      : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Booking Tiket</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Pilih Jadwal & Sesi</span>
                  </div>
                </div>
                {(activeView === 'user-form' || activeView === 'user-summary' || activeView === 'user-qris') && (
                  <span className="text-[#D4A359] text-xs font-bold">◆</span>
                )}
              </button>

              {/* Tiket Saya */}
              <button
                type="button"
                onClick={() => { setActiveView('user-web-portal'); setViewingTicketId(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  (activeView === 'user-web-portal' || activeView === 'user-ticket') && !activeModal
                    ? 'bg-gradient-to-r from-[#D4A359]/25 via-[#D4A359]/10 to-transparent text-[#F5E6CC] font-bold border-l-4 border-[#D4A359] shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    (activeView === 'user-web-portal' || activeView === 'user-ticket') && !activeModal
                      ? 'bg-gradient-to-br from-[#D4A359] to-[#B38038] text-[#051829] shadow-md shadow-[#D4A359]/25 font-bold'
                      : 'bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-white/15 group-hover:text-white'
                  }`}>
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Tiket Saya</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">E-Tiket & QR Code</span>
                  </div>
                </div>
                {targetBookings.length > 0 ? (
                  <span className="bg-gradient-to-r from-[#D4A359] to-[#E5BE7E] text-[#051829] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    {targetBookings.length}
                  </span>
                ) : (
                  (activeView === 'user-web-portal' || activeView === 'user-ticket') && !activeModal && (
                    <span className="text-[#D4A359] text-xs font-bold">◆</span>
                  )
                )}
              </button>
            </nav>
          </div>

          {/* Section: Informasi Museum */}
          <div className="space-y-1 pt-2.5 border-t border-white/10">
            <div className="flex items-center justify-between px-2.5 py-1">
              <span className="text-[10px] font-black tracking-widest text-[#D4A359] uppercase">
                Informasi Museum
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Edukasi Budaya</span>
            </div>

            <nav className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('user-musewangi')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white group-hover:border-[#D4A359]/30 flex items-center justify-center shrink-0 transition-all">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Koleksi Sejarah</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">4.300+ Benda Kuno</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('informasi')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white group-hover:border-[#D4A359]/30 flex items-center justify-center shrink-0 transition-all">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Jadwal & Tarif</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Mulai Rp 5.000 / Org</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('kontak')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 text-[#E5C287] group-hover:bg-[#D4A359]/20 group-hover:text-white group-hover:border-[#D4A359]/30 flex items-center justify-center shrink-0 transition-all">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold leading-tight">Kontak & Lokasi</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Peta & WhatsApp</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:text-[#D4A359] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </nav>
          </div>

          {/* Authentic Banyuwangi Gandrung Sewu Procession in Desktop Sidebar */}
          <div className="pt-2 px-1 relative z-10 shrink-0">
            <GandrungSewuSidebarFormation />
          </div>
        </div>

        {/* Bottom Section: Sleek Operational Hours & Login Petugas (Simple & Elegant) */}
        <div className="pt-2 border-t border-white/10 space-y-2 relative z-10 shrink-0">
          {/* Operational Hours Compact Card */}
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

          {/* Social Media Quick Links */}
          <div className="pt-1.5 pb-0.5 text-center">
            <span className="text-[9.5px] font-semibold text-slate-400 block mb-1.5">
              Sosial Media Resmi
            </span>
            <SocialMediaIconRow size="sm" />
          </div>

          <div className="text-[9.5px] text-slate-400 text-center font-medium pt-0.5">
            Museum Blambangan Banyuwangi
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="md:ml-72 lg:ml-80 flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-white w-full print:m-0 print:p-0 print:min-h-0 print:overflow-visible">
        {/* Top Header matching Figma Screen 10 (Desktop only to prevent duplicate header on mobile) */}
        <header className="hidden md:flex bg-white border-b border-slate-100 px-6 sm:px-8 py-3.5 items-center justify-between sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-3">
            <MuseumLogo variant="dark" className="h-8" />
            <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-200 pl-3">
              Portal Pengunjung Web
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Profil Button */}
            <button
              type="button"
              onClick={() => setActiveModal('profil')}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#17293D] transition-colors p-1.5 rounded-xl hover:bg-slate-50 border border-slate-200"
            >
              <span className="hidden md:inline">Profil Pengunjung</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto relative z-10 text-left print:p-0 print:m-0 print:max-w-none">
          {/* ================= CASE 1: BERANDA WEB ================= */}
          {activeView === 'user-landing' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Grand Panoramic Hero Banner with Metallic Blue & Gandrung Heritage */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#224A72]/40 bg-[#081827] text-white min-h-[340px] flex flex-col justify-end p-6 sm:p-10 select-none">
                {/* Background Rotating Slideshow: Displays all 4 authentic museum photos */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {heroSlides.map((slide, idx) => (
                    <img
                      key={slide.src}
                      src={slide.src}
                      alt={slide.title}
                      className={`absolute inset-0 w-full h-full object-cover ${slide.position || 'object-center'} transition-opacity duration-1000 ease-in-out ${
                        activeHeroSlide === idx ? 'opacity-100 animate-kenburns scale-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061422] via-[#061422]/40 via-35% to-transparent pointer-events-none" />
                </div>

                {/* Authentic Banyuwangi Cultural Accents: Subtle Gold Batik Gajah Oling */}
                <div className="hidden sm:block absolute right-0 top-0 w-48 h-48 opacity-15 pointer-events-none select-none z-10">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-3">
                  {/* Slideshow Pill & Indicators */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4A359]/30 text-[11px] text-[#E5BE7E] shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                      <span className="font-semibold">{heroSlides[activeHeroSlide].caption}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-1 rounded-full border border-white/10">
                      {heroSlides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveHeroSlide(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeHeroSlide === i ? 'w-5 bg-[#D4A359]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                          title={heroSlides[i].title}
                        />
                      ))}
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                    Selamat Datang di <br />
                    Museum Blambangan Banyuwangi
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                    Jelajahi kekayaan sejarah kerajaan Blambangan, peninggalan purbakala, etnografi suku Osing, dan mahakarya seni budaya Banyuwangi dalam satu tempat.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveView('user-form')}
                      className="px-6 py-3 bg-gradient-to-r from-[#D4A359] via-[#E5BE7E] to-[#D4A359] hover:from-[#C39247] hover:to-[#B68439] text-[#081827] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg border border-[#F5E2C2]/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Mulai Booking Kunjungan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveView('user-web-portal')}
                      className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 text-[#D4A359]" />
                      <span>Cek Tiket Saya</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Core Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Jadwal Sesi Kunjungan Hari Ini
                    </h2>
                    <p className="text-xs text-slate-500">
                      Senin – Jumat: 07:30 – 16:00 WIB (Sabtu & Minggu Tutup). Istirahat: {ishomaConfig.label}.
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    isWeekendToday 
                      ? 'text-amber-800 bg-amber-50 border-amber-200' 
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    {isWeekendToday ? '● Libur Akhir Pekan (Tutup)' : '● Buka 07:30 - 16:00 WIB'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessionsConfig.map((sesi) => {
                    const isPassed = isSessionTimePassed(sesi, todayStr);
                    const quotaStats = getSessionQuotaStats(sesi.id, todayStr, bookings);
                    const isFull = quotaStats.isFull;
                    const isUnavailable = isWeekendToday || isPassed || isFull;

                    return (
                      <div
                        key={sesi.id}
                        className={`p-5 rounded-2xl bg-white border transition-all space-y-2.5 flex flex-col justify-between ${
                          isUnavailable
                            ? 'border-slate-200/80 bg-slate-50/50'
                            : 'border-slate-200 shadow-2xs hover:border-[#17293D] hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#17293D] bg-slate-100 px-2.5 py-1 rounded-lg">
                              {sesi.label}
                            </span>
                            {isWeekendToday ? (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Tutup (Akhir Pekan)
                              </span>
                            ) : isPassed ? (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                ✕ Lewat Jam Hari Ini
                              </span>
                            ) : isFull ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                ⛔ Kuota Penuh (0/100)
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ✓ Sisa {quotaStats.remaining}/100 Kuota
                              </span>
                            )}
                          </div>
                          <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{sesi.time}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {sesi.subLabel} • Maksimal 100 pengunjung per sesi
                          </div>
                        </div>

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
                          className={`w-full mt-2 py-2 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            isUnavailable
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer'
                              : 'bg-slate-100 hover:bg-[#17293D] hover:text-white text-slate-800 shadow-2xs cursor-pointer'
                          }`}
                        >
                          <span>{isUnavailable ? 'Pilih untuk Hari Lain' : 'Pilih Sesi Ini'}</span>
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

              {/* Pesona Warisan Sejarah & Budaya Blambangan */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D4A359]">
                        Warisan Budaya Bumi Blambangan
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Jelajahi Peninggalan Bersejarah & Seni Khas Banyuwangi
                    </h2>
                    <p className="text-xs text-slate-500">
                      Museum Blambangan menyimpan lebih dari 4.300 koleksi cagar budaya, arkeologi, etnografi Osing, dan seni tradisi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('user-musewangi')}
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
                        <h3 className="text-sm font-black mt-1 text-white">
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
                        <h3 className="text-sm font-black mt-1 text-white">
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
                        <h3 className="text-sm font-black mt-1 text-white">
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

                {/* Cultural Quote Banner with Symmetrical Batik Gajah Oling */}
                <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#081827] via-[#0E2C4A] to-[#07192A] text-white border border-[#D4A359]/30 shadow-md text-center overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-between px-3">
                    <img
                      src="/assets/gajah-oling-footer-symmetric.png"
                      alt="Batik Gajah Oling"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="relative z-10 max-w-xl mx-auto space-y-2">
                    <p className="text-sm sm:text-base font-semibold italic text-[#F5DEB3]">
                      &ldquo;Jaga bersama warisan budaya, untuk masa depan yang lebih baik.&rdquo;
                    </p>
                    <div className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                      Pemerintah Kabupaten Banyuwangi • The Sunrise of Java
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= CASE 2: TIKET SAYA WEB (Figma Screen 10) ================= */}
          {(activeView === 'user-web-portal' || viewingTicketId) && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 ${viewingTicketId ? 'print:hidden' : ''}`}>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Tiket Saya
                  </h1>
                  <p className="text-xs text-slate-500">
                    Daftar reservasi dan e-tiket kunjungan Museum Blambangan Anda.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
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
                /* Ticket Empty State matching Figma Screen 10 */
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
                /* List of Tickets matching Figma Screen 10 */
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

        {/* ================= OFFICIAL FOOTER: CLEAN, BALANCED & ELEGANT (UI-PRO) ================= */}
        <footer className="mt-auto bg-[#071626] text-white border-t border-[#17304C] py-10 px-6 sm:px-10 lg:px-12 select-none font-sans antialiased relative overflow-hidden print:hidden">
          {/* Subtle Authentic Banyuwangi Batik Gajah Oling Top Frieze */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A359]/35 to-transparent pointer-events-none" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-80 h-7 opacity-20 pointer-events-none select-none">
            <img
              src="/assets/gajah-oling-footer-symmetric.png"
              alt="Batik Gajah Oling Frieze"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Content Grid: 4 Balanced Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-left">
              {/* Column 1: Museum Identity & Disbudpar (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-3.5">
                <MuseumLogo variant="white" className="h-9" />
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                  Pusat pelestarian sejarah, arkeologi, dan cagar budaya di Banyuwangi di bawah naungan Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi.
                </p>
                <div className="space-y-2 text-xs text-slate-400 pt-1 font-normal">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
                    <span>Jl. Jenderal A. Yani No. 78, Taman Baru, Banyuwangi, Jawa Timur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#D4A359] shrink-0" />
                    <span>Layanan Informasi: +62 852-8725-8502</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Layanan Pengunjung (lg:col-span-3) */}
              <div className="lg:col-span-3 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A359]">
                  Layanan Pengunjung
                </h4>
                <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300 font-medium">
                  <li>
                    <button
                      type="button"
                      onClick={() => { setActiveView('user-landing'); setViewingTicketId(null); }}
                      className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-[#D4A359] text-xs">›</span>
                      <span>Beranda Utama</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { setActiveView('user-form'); setViewingTicketId(null); }}
                      className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-[#D4A359] text-xs">›</span>
                      <span>Booking E-Tiket</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { setActiveView('user-web-portal'); setViewingTicketId(null); }}
                      className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-[#D4A359] text-xs">›</span>
                      <span>Tiket Saya & QR Code</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('informasi')}
                      className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-[#D4A359] text-xs">›</span>
                      <span>Jadwal Operasional & Tarif</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveView('user-musewangi')}
                      className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-[#D4A359] text-xs">›</span>
                      <span>Koleksi & Pameran Sejarah</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Jam Kunjungan & Loket (lg:col-span-2) */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A359]">
                  Jam Buka Loket
                </h4>
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-300">
                  <div>
                    <div className="font-semibold text-white">Senin – Jumat</div>
                    <div className="text-slate-400 text-xs">07:30 – 16:00 WIB</div>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-300/90">Sabtu & Minggu</div>
                    <div className="text-slate-400 text-xs">Tutup (Libur)</div>
                  </div>
                  <div className="pt-1 text-slate-400 text-xs leading-relaxed font-normal">
                    Tersedia loket pembelian langsung dan verifikasi tiket online.
                  </div>
                </div>
              </div>

              {/* Column 4: Media Sosial & Bantuan Pengunjung (lg:col-span-3) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A359]">
                    Kanal Sosial Media
                  </h4>
                  <p className="text-xs text-slate-300 font-normal">
                    Ikuti kanal resmi kami untuk informasi dan agenda budaya:
                  </p>
                  <SocialMediaIconRow size="md" className="justify-start gap-2 pt-1" />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveModal('kontak')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white text-xs sm:text-[13px] font-semibold transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-[#D4A359]" />
                      <span>Hubungi Layanan Pengunjung</span>
                    </span>
                    <span className="text-[#D4A359] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Google Maps Location Section */}
            <div className="pt-6 border-t border-white/10">
              <div className="bg-[#0B1E32] rounded-2xl border border-[#23456C] p-4 sm:p-6 shadow-xl relative overflow-hidden">
                {/* Subtle Gajah Oling decorative accent */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                  {/* Left Column: Info & Directions */}
                  <div className="lg:col-span-5 space-y-3.5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A359]/15 border border-[#D4A359]/30 text-[#D4A359] text-[11px] font-bold uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Peta & Petunjuk Arah</span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        Lokasi Museum Blambangan
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                        Kunjungi kami di pusat kota Banyuwangi, bersebelahan dengan Kantor Bupati dan Gesibu Blambangan.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                      <div className="flex items-start gap-2.5 text-xs text-slate-200">
                        <MapPin className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          Jl. Jenderal A. Yani No. 78, Taman Baru, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-400 pl-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Akses mudah via R2, R4, & Bus Pariwisata</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <a
                        href="https://maps.google.com/?q=Museum+Blambangan+Banyuwangi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A359] to-[#B88738] hover:from-[#E0B26D] hover:to-[#C69344] text-[#0A1E34] text-xs font-bold shadow-md shadow-[#D4A359]/20 transition-all cursor-pointer group"
                      >
                        <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        <span>Buka di Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        {copiedAddress ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Salin Alamat</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Google Maps Interactive Embed */}
                  <div className="lg:col-span-7 h-52 sm:h-56 w-full rounded-xl overflow-hidden border border-white/15 shadow-2xl relative bg-slate-900">
                    <iframe
                      title="Lokasi Museum Blambangan di Google Maps"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.835497910901!2d114.3644146!3d-8.2192737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd15ab670868f03%3A0xc34b3e5f49e49c71!2sMuseum%20Blambangan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full filter saturate-[1.1] contrast-[1.05]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Clean Copyright & Tagline */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 text-center sm:text-left font-normal">
              <span>
                © {new Date().getFullYear()} Museum Blambangan. Pengelolaan resmi Dinas Kebudayaan & Pariwisata Kab. Banyuwangi.
              </span>
              <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
                <span className="text-[#D4A359] font-medium">
                  Banyuwangi Rebound • The Sunrise of Java
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={() => setActiveView('admin-login')}
                  className="text-slate-500 hover:text-[#D4A359] transition-colors text-[11px] font-medium cursor-pointer flex items-center gap-1"
                  title="Masuk ke Portal Petugas Loket & Admin"
                >
                  <span>Portal Petugas</span>
                  <span className="text-[10px]">🔒</span>
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
