import React, { useState, useRef, useEffect, useMemo } from 'react';
import jsQR from 'jsqr';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  Search, 
  Camera, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Compass, 
  MapPin, 
  Tag, 
  Calendar, 
  X, 
  Maximize2, 
  Headphones, 
  Languages, 
  Ticket, 
  QrCode, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import type { MusewangiArtifact, MusewangiCategory } from '../../types';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

const CATEGORIES: ('Semua' | MusewangiCategory)[] = [
  'Semua',
  'Arkeologi',
  'Etnografi',
  'Historika',
  'Filologi',
  'Numismatika',
];

export const UserMusewangiDashboard: React.FC = () => {
  const { artifacts, setActiveView } = useBooking();

  const [displayMode, setDisplayMode] = useState<'live-app' | 'catalog'>('live-app');
  const musewangiUrl = 'http://127.0.0.1:8000';

  const [selectedCategory, setSelectedCategory] = useState<'Semua' | MusewangiCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArtifact, setActiveArtifact] = useState<MusewangiArtifact | null>(null);
  const [activeLang, setActiveLang] = useState<'id' | 'en' | 'osing'>('id');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  // Audio Guide Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered artifacts
  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(art => {
      const matchCat = selectedCategory === 'Semua' || art.kategori === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        art.nama.toLowerCase().includes(q) ||
        art.era.toLowerCase().includes(q) ||
        art.kategori.toLowerCase().includes(q) ||
        art.lokasiPameran.toLowerCase().includes(q) ||
        art.noRegistrasi.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [artifacts, selectedCategory, searchQuery]);

  // Audio notification chime
  const playSoundEffect = (success: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = success ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(success ? 659.25 : 220, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  };

  // Stop any active speech synthesis
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Play narration audio for current artifact & language
  const startSpeech = () => {
    if (!activeArtifact || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    let textToSpeak = '';
    let langCode = 'id-ID';

    if (activeLang === 'id') {
      textToSpeak = `${activeArtifact.nama}. Zaman ${activeArtifact.era}. ${activeArtifact.deskripsiId}`;
      langCode = 'id-ID';
    } else if (activeLang === 'en') {
      textToSpeak = `${activeArtifact.nama}. Period: ${activeArtifact.era}. ${activeArtifact.deskripsiEn}`;
      langCode = 'en-US';
    } else {
      // Osing
      textToSpeak = `${activeArtifact.nama}. Jaman ${activeArtifact.era}. ${activeArtifact.deskripsiOsing}`;
      langCode = 'id-ID';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.lang = langCode;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (activeLang === 'en') {
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      } else {
        const idVoice = voices.find(v => v.lang.startsWith('id'));
        if (idVoice) utterance.voice = idVoice;
      }
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when modal closes or active artifact changes
  useEffect(() => {
    stopSpeech();
  }, [activeArtifact, activeLang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle opening an artifact from QR or card click
  const handleOpenArtifact = (artifact: MusewangiArtifact, autoPlayAudio: boolean = false) => {
    setActiveArtifact(artifact);
    setActiveLang('id');
    setIsScannerOpen(false);
    if (autoPlayAudio) {
      setTimeout(() => {
        // Will be triggered by user gesture or next render
      }, 300);
    }
  };

  // Handle scanned QR payload
  const handleProcessQrCode = (code: string) => {
    const raw = code.trim();
    const cleanId = raw.replace(/^MUSEWANGI:/i, '').trim();

    const found = artifacts.find(a => 
      a.id.toLowerCase() === cleanId.toLowerCase() ||
      a.qrPayload.toLowerCase() === raw.toLowerCase() ||
      raw.toLowerCase().includes(a.id.toLowerCase())
    );

    if (found) {
      playSoundEffect(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 50, 80]);
      setScanFeedback(`Artefak ditemukan: ${found.nama}`);
      setTimeout(() => {
        setScanFeedback(null);
        handleOpenArtifact(found);
      }, 700);
    } else {
      playSoundEffect(false);
      setScanFeedback('Kode QR tidak cocok dengan koleksi Musewangi.');
      setTimeout(() => setScanFeedback(null), 2500);
    }
  };

  // Webcam scanning loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isScannerOpen) {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
          .then(s => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            interval = setInterval(() => {
              if (videoRef.current && videoRef.current.readyState >= 2 && ctx) {
                const v = videoRef.current;
                canvas.width = v.videoWidth || 640;
                canvas.height = v.videoHeight || 480;
                ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
                try {
                  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const qr = jsQR(imgData.data, imgData.width, imgData.height);
                  if (qr?.data) {
                    handleProcessQrCode(qr.data);
                  }
                } catch (_) {}
              }
            }, 300);
          })
          .catch(() => {
            // Camera permission denied or not available; fallback to manual input
          });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isScannerOpen, artifacts]);

  // Photo file QR scanning
  const handlePhotoScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const code = jsQR(ctx.getImageData(0, 0, img.width, img.height).data, img.width, img.height);
        if (code?.data) {
          handleProcessQrCode(code.data);
        } else {
          playSoundEffect(false);
          setScanFeedback('Foto tidak memuat kode QR yang valid.');
          setTimeout(() => setScanFeedback(null), 2500);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (displayMode === 'live-app') {
    return (
      <div className="min-h-screen bg-[#F8F5ED] flex flex-col font-sans selection:bg-[#C9981C] selection:text-white">
        {/* ── LIVE APP TOPBAR (Direct Bridge to E-Ticketing) ── */}
        <header className="sticky top-0 z-50 bg-[#092C48] text-white border-b border-white/10 shadow-md">
          <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
            
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveView('user-web-portal')}
                className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                title="Kembali ke Portal E-Ticketing"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4A359]" />
                <span className="hidden sm:inline">Kembali ke E-Ticketing</span>
                <span className="sm:hidden">Kembali</span>
              </button>

              <div className="h-5 w-px bg-white/15 hidden xs:block" />

              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="leading-tight">
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    MUSEWANGI Live
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono hidden md:inline">
                    {musewangiUrl}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open(musewangiUrl, '_blank')}
                className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Buka Musewangi di Tab Baru"
              >
                <span className="hidden md:inline">Buka Tab Baru</span>
                <span>↗</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode('catalog')}
                className="py-1.5 px-3 rounded-xl bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 text-xs font-bold transition-all cursor-pointer"
                title="Lihat Mode Ringkasan Katalog & Audio Guide"
              >
                Mode Katalog
              </button>

              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="py-1.5 px-3.5 rounded-xl bg-[#D4A359] hover:bg-[#c49247] text-[#092C48] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pesan Tiket</span>
              </button>
            </div>
          </div>
        </header>

        {/* Iframe Halaman Musewangi */}
        <iframe
          src={musewangiUrl}
          className="w-full flex-1 border-0 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] bg-[#F8F5ED]"
          title="MUSEWANGI — Museum Blambangan Banyuwangi"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#D4A359] selection:text-white">
      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-30 bg-[#092C48] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Back button & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('user-web-portal')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer"
              title="Kembali ke Beranda Museum"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4A359]" />
              <span className="hidden sm:inline">Kembali ke Portal</span>
            </button>

            <div className="h-6 w-px bg-white/15 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A359] to-[#b3833b] flex items-center justify-center text-[#092C48] shadow-inner font-black text-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight leading-none text-white">
                    MUSEWANGI
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#D4A359]/20 text-[#D4A359] text-[9px] font-extrabold uppercase tracking-wider border border-[#D4A359]/30">
                    Smart Tour
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
                  Digital Heritage Guide Museum Blambangan
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDisplayMode('live-app')}
              className="py-2 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Kembali ke Live Musewangi di Port 8000"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="hidden xs:inline">Live Musewangi (8000)</span>
              <span className="xs:hidden">Live</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="py-2 px-3 sm:px-4 bg-[#D4A359] hover:bg-[#c49247] text-[#092C48] rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden xs:inline">Pindai QR Etalase</span>
              <span className="xs:hidden">Scan QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('user-form')}
              className="hidden md:flex py-2 px-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Tiket Kunjungan</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER SECTION ── */}
      <section className="relative bg-gradient-to-b from-[#092C48] via-[#0d3b61] to-[#124977] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Cultural Motif */}
        <div className="absolute right-0 top-0 w-80 h-80 opacity-10 pointer-events-none select-none">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-[#D4A359] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Digitalisasi Koleksi Cagar Budaya & Narasi Suara</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Jelajahi Sejarah Blambangan <br className="hidden sm:inline" />
            <span className="text-[#D4A359]">Dalam 3 Bahasa Interaktif</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Dengarkan narasi audio terverifikasi kurator dalam <strong>Bahasa Indonesia</strong>, <strong>English</strong>, atau <strong>Basa Osing</strong> asli. Cukup pindai stiker QR pada etalase museum atau telusuri koleksi di bawah ini.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama koleksi, era, atau ruang pameran..."
                className="w-full pl-11 pr-10 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-medium shadow-xl outline-none focus:ring-2 focus:ring-[#D4A359] transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-3 flex flex-wrap justify-center items-center gap-4 text-[11px] sm:text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              <span className="text-[#D4A359] font-bold">4.300+</span> Benda Cagar Budaya
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              <span className="text-[#D4A359] font-bold">3 Bahasa:</span> ID • EN • Osing
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              <Headphones className="w-3.5 h-3.5 text-[#D4A359]" /> Audio Guide Gratis
            </span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        
        {/* Category Filter Pills */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-md border border-slate-200/80 mb-8 overflow-x-auto scrollbar-none flex items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#092C48] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Artifacts Counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Koleksi Unggulan ({filteredArtifacts.length})
            </h3>
            <p className="text-xs text-slate-500">
              {selectedCategory === 'Semua' 
                ? 'Menampilkan seluruh artefak terkurasi' 
                : `Kategori ${selectedCategory}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#092C48] hover:text-[#D4A359] transition-colors"
          >
            <Camera className="w-4 h-4 text-[#D4A359]" />
            <span>Pindai QR Fisik</span>
          </button>
        </div>

        {/* Empty State */}
        {filteredArtifacts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#D4A359] mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Koleksi yang Cocok</h4>
            <p className="text-xs text-slate-500">
              Coba gunakan kata kunci pencarian yang lain atau pilih kategori yang berbeda.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="mt-2 py-2 px-4 rounded-xl bg-[#092C48] text-white text-xs font-bold hover:bg-[#0c395d]"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={art.gambarUrl}
                  alt={art.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to stylized placeholder
                    (e.target as HTMLImageElement).src = '/assets/slide-1-gedung-museum-hd.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#092C48]/85 backdrop-blur-xs text-[#D4A359] text-[10px] font-extrabold uppercase tracking-wider border border-[#D4A359]/30">
                    {art.kategori}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-medium">
                    {art.id}
                  </span>
                </div>

                {/* Bottom Room on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="flex items-center gap-1 text-slate-200 font-medium">
                    <MapPin className="w-3 h-3 text-[#D4A359]" />
                    <span className="truncate">{art.lokasiPameran}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-mono">
                    No. Reg: {art.noRegistrasi}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#092C48] transition-colors line-clamp-1">
                    {art.nama}
                  </h4>
                  <div className="text-[11px] text-[#b3833b] font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{art.era}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.deskripsiId}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenArtifact(art, true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#D4A359]" />
                    <span>Dengarkan Narasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenArtifact(art, false)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                    title="Buka Detail & QR Label"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── ARTIFACT DETAIL & AUDIO GUIDE MODAL ── */}
      {activeArtifact && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setActiveArtifact(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#092C48] text-white p-4 sm:p-5 flex items-start justify-between relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 w-44 h-44 opacity-15 pointer-events-none select-none">
                <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10 space-y-1 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#D4A359] text-[#092C48] text-[10px] font-black uppercase">
                    {activeArtifact.kategori}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono">
                    {activeArtifact.noRegistrasi}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black leading-tight text-white">
                  {activeArtifact.nama}
                </h3>
                <p className="text-xs text-[#D4A359] font-medium">
                  {activeArtifact.era}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveArtifact(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
              
              {/* Media Banner & Key Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                  <img
                    src={activeArtifact.gambarUrl}
                    alt={activeArtifact.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/slide-1-gedung-museum-hd.jpg';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md">
                    Dimensi: {activeArtifact.dimensi}
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Informasi Penempatan Museum
                    </span>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">Lokasi Pameran</span>
                        <span className="text-slate-600 text-xs">{activeArtifact.lokasiPameran}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">Masa / Periode Sejarah</span>
                        <span className="text-slate-600 text-xs">{activeArtifact.era}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Mini Code for Exhibition Showcase */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
                      <QRCodeSVG value={activeArtifact.qrPayload} size={50} />
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      <span className="font-bold text-slate-700 block">Kode QR Etalase:</span>
                      {activeArtifact.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── AUDIO GUIDE CONTROLLER ── */}
              <div className="bg-gradient-to-r from-[#092C48] to-[#124977] text-white p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlayingAudio ? 'bg-[#D4A359] text-[#092C48] animate-pulse' : 'bg-white/10 text-[#D4A359]'}`}>
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">
                        Panduan Suara (Audio Guide)
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {isPlayingAudio ? '🔊 Sedang memutar narasi suara...' : 'Klik putar untuk mendengarkan narasi artefak'}
                      </span>
                    </div>
                  </div>

                  {/* Speed toggle */}
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-[10px]">
                    <span className="text-slate-300">Kecepatan:</span>
                    <button
                      type="button"
                      onClick={() => setSpeechRate(prev => prev === 0.95 ? 0.8 : 0.95)}
                      className="font-bold text-[#D4A359] hover:underline cursor-pointer"
                    >
                      {speechRate === 0.95 ? 'Normal (1.0x)' : 'Santai (0.8x)'}
                    </button>
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {!isPlayingAudio ? (
                    <button
                      type="button"
                      onClick={startSpeech}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4A359] hover:bg-[#c49247] text-[#092C48] font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Putar Narasi Audio ({activeLang.toUpperCase()})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopSpeech}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Hentikan Suara</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── 3-LANGUAGE TAB SWITCHER ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-[#D4A359]" />
                    <span>Pilihan Bahasa Narasi:</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveLang('id')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                      activeLang === 'id'
                        ? 'bg-white text-[#092C48] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇮🇩 Indonesia
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                      activeLang === 'en'
                        ? 'bg-white text-[#092C48] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇬🇧 English
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLang('osing')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                      activeLang === 'osing'
                        ? 'bg-white text-[#092C48] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔴 Basa Osing
                  </button>
                </div>

                {/* Narrative Text Container */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 leading-relaxed text-slate-800 text-xs sm:text-sm">
                  {activeLang === 'id' && (
                    <p className="whitespace-pre-line">{activeArtifact.deskripsiId}</p>
                  )}
                  {activeLang === 'en' && (
                    <p className="whitespace-pre-line">{activeArtifact.deskripsiEn}</p>
                  )}
                  {activeLang === 'osing' && (
                    <p className="whitespace-pre-line">{activeArtifact.deskripsiOsing}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Museum Blambangan Banyuwangi • Musewangi Digital Guide
              </span>
              <button
                type="button"
                onClick={() => setActiveArtifact(null)}
                className="py-2.5 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all ml-auto cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QR CODE SCANNER MODAL ── */}
      {isScannerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsScannerOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#092C48] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#D4A359]" />
                <h3 className="font-bold text-sm">Pindai QR Code Etalase</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanner Body */}
            <div className="p-5 space-y-4 text-center">
              {/* Feedback toast */}
              {scanFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  scanFeedback.includes('ditemukan') 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {scanFeedback}
                </div>
              )}

              {/* Viewfinder Area */}
              <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-slate-800">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Corner reticle */}
                <div className="absolute inset-8 border-2 border-[#D4A359] rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
                  <div className="w-full h-0.5 bg-[#D4A359] shadow-lg animate-bounce" />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Arahkan kamera ke kode QR yang tertempel di akrilik etalase koleksi museum.
              </p>

              {/* Upload photo fallback */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoScan}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#092C48] hover:text-[#D4A359] font-bold underline cursor-pointer"
                >
                  Atau unggah foto barcode dari galeri
                </button>
              </div>

              {/* Quick simulation buttons for testing */}
              <div className="pt-3 border-t border-slate-100 text-left space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Simulasi Cepat (Klik Contoh QR):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {artifacts.slice(0, 4).map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleProcessQrCode(a.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 text-left truncate cursor-pointer"
                    >
                      ⚡ {a.nama}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
