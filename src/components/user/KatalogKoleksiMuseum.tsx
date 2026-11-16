import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { KoleksiItem, KuratorialCategory } from '../../types';
import { 
  Landmark, 
  Search, 
  ArrowLeft, 
  QrCode, 
  Eye, 
  Calendar, 
  MapPin, 
  Layers, 
  X, 
  Volume2, 
  VolumeX, 
  Ticket, 
  Sparkles, 
  ShieldCheck, 
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

const CATEGORIES: { id: KuratorialCategory | 'Semua'; label: string }[] = [
  { id: 'Semua', label: 'Semua Koleksi' },
  { id: 'Arkeologi', label: 'Arkeologi' },
  { id: 'Etnografi', label: 'Etnografi' },
  { id: 'Filologi', label: 'Filologi' },
  { id: 'Keramologi', label: 'Keramologi' },
  { id: 'Numismatika & Heraldika', label: 'Numismatika' },
  { id: 'Seni Rupa & Kriya', label: 'Seni Rupa' },
  { id: 'Teknologi Tradisional', label: 'Teknologi Tradisional' },
];

export const KatalogKoleksiMuseum: React.FC = () => {
  const { koleksi, setActiveView } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState<KuratorialCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<KoleksiItem | null>(null);
  
  // Interactive QR Showcase Scanner Modal
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrInputCode, setQrInputCode] = useState('');
  const [qrScanError, setQrScanError] = useState<string | null>(null);

  // Audio guide simulator state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredItems = useMemo(() => {
    return koleksi.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.kategori === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q ||
        item.namaKoleksi.toLowerCase().includes(q) ||
        item.asal.toLowerCase().includes(q) ||
        item.tahunPembuatan.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.noRegistrasi.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [koleksi, selectedCategory, searchQuery]);

  const handleQrLookup = (code: string) => {
    const clean = code.trim().toLowerCase();
    const found = koleksi.find(k => 
      k.kodeUnik.toLowerCase() === clean || 
      k.noRegistrasi.toLowerCase() === clean ||
      k.id.toLowerCase() === clean
    );

    if (found) {
      setSelectedArtifact(found);
      setIsQrScannerOpen(false);
      setQrScanError(null);
      setQrInputCode('');
    } else {
      setQrScanError(`Kode "${code}" tidak ditemukan pada etalase museum.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-slate-900 flex flex-col font-sans selection:bg-[#081827] selection:text-white">
      {/* Top Visitor Navbar */}
      <header className="sticky top-0 z-40 bg-[#081827] text-white border-b border-[#142D45] shadow-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('user-landing')}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <MuseumLogo variant="white" className="h-10 sm:h-12 w-auto object-contain drop-shadow" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white">
                  Katalog Museum
                </span>
                <span className="text-[9px] font-semibold bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 px-2 py-0.2 rounded-full">
                  Galeri Digital
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Museum Blambangan Banyuwangi</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsQrScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4A359] text-xs font-bold border border-[#D4A359]/30 transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pindai QR Etalase</span>
            <span className="sm:hidden">Pindai QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('user-form')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4A359] hover:bg-[#c29247] text-[#081827] text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Pesan Tiket</span>
          </button>
        </div>
      </header>

      {/* Hero Curatorial Banner */}
      <section className="bg-gradient-to-b from-[#081827] to-[#122A42] text-white py-10 px-4 sm:px-8 border-b border-[#1A3A5B] relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D4A359] text-xs font-semibold backdrop-blur-sm">
            <Landmark className="w-3.5 h-3.5" />
            <span>Inventarisasi Cagar Budaya & Benda Bersejarah</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight max-w-3xl leading-tight">
            Menelusuri Kejayaan Blambangan Lewat Peninggalan Abadi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Jelajahi koleksi resmi Museum Blambangan yang telah terkurasi secara ilmiah menurut 8 disiplin kuratorial Permendikbud: dari arca kerajaan, keris pusaka, hingga naskah lontar kuno.
          </p>

          {/* Quick Search & Filter Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama benda cagar budaya, asal situs, atau era..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4A359]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#D4A359] hover:bg-[#c29247] text-[#081827] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Cek Plakat Showcase</span>
            </button>

            <a
              href="https://online.fliphtml5.com/Museum-Blambangan/Katalog-Koleksi-Museum-Blambangan-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4A359] border border-[#D4A359]/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Buka Flipbook E-Katalog Museum Blambangan Resmi 2026"
            >
              <span>Flipbook E-Katalog 2026</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-[60px] z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'Semua' 
              ? koleksi.length 
              : koleksi.filter(k => k.kategori === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#081827] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Collections Grid Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan <strong className="text-slate-800">{filteredItems.length}</strong> koleksi terpilih
            {selectedCategory !== 'Semua' && <span> dalam kategori <strong className="text-slate-800">{selectedCategory}</strong></span>}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArtifact(item)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-52 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.fotoUrl}
                    alt={item.namaKoleksi}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/koleksi/koleksi-stupika.png';
                    }}
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#081827]/80 text-[#D4A359] border border-[#D4A359]/30 backdrop-blur-sm">
                    {item.kategori}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                    {item.noRegistrasi}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-sans font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
                    {item.namaKoleksi}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.tahunPembuatan}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.asal}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed text-justify">
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#081827] font-bold bg-slate-50/50">
                <span className="flex items-center gap-1 text-[#D4A359] group-hover:translate-x-0.5 transition-transform">
                  <span>Pelajari Sejarah Benda</span>
                  <span>→</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.kodeUnik}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tidak ditemukan artefak yang cocok</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Silakan coba kata kunci lain atau pilih kategori "Semua Koleksi" untuk menjelajahi seluruh cagar budaya Museum Blambangan.
            </p>
          </div>
        )}
      </main>

      {/* MODAL: Detail Cerita Artefak untuk Pengunjung */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#081827] to-[#122A42] p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A359]">
                  {selectedArtifact.kategori} • Koleksi Museum Blambangan
                </span>
                <h2 className="text-xl font-sans font-bold mt-0.5">{selectedArtifact.namaKoleksi}</h2>
                <p className="text-xs text-slate-300 font-mono mt-0.5">Reg: {selectedArtifact.noRegistrasi}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedArtifact(null);
                  setIsPlayingAudio(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Photo Showcase */}
              <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[240px]">
                <img
                  src={selectedArtifact.fotoUrl}
                  alt={selectedArtifact.namaKoleksi}
                  className="max-h-56 max-w-full object-contain filter drop-shadow-2xl"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kondisi Fisik: <strong>{selectedArtifact.kondisi}</strong></span>
                </div>
              </div>

              {/* Audio Narration Simulator Bar */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-xl bg-[#081827] text-[#D4A359] flex items-center justify-center cursor-pointer hover:bg-[#122A42] transition-colors shadow-xs"
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">
                      {isPlayingAudio ? 'Memutar Narasi Audio Kuratorial...' : 'Dengarkan Narasi Audio Guide'}
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      {isPlayingAudio ? 'Menjelaskan asal-usul dan makna filosofis benda' : 'Fitur panduan suara untuk pengunjung museum'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {isPlayingAudio ? '01:24 / 02:45' : '02:45 Min'}
                </span>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Era / Periode</span>
                  <span className="font-bold text-slate-800">{selectedArtifact.tahunPembuatan}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Asal Temuan Situs</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedArtifact.asal}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Jenis Bahan / Benda</span>
                  <span className="font-bold text-slate-800">{selectedArtifact.jenisBenda}</span>
                </div>
              </div>

              {/* Full Historical Story */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-600" />
                  <span>Narasi Kuratorial & Makna Sejarah</span>
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-700 space-y-2 text-justify">
                  <p>{selectedArtifact.deskripsi}</p>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Ingin melihat koleksi ini secara langsung di etalase museum?
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtifact(null);
                    setIsPlayingAudio(false);
                    setActiveView('user-form');
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#081827] text-[#D4A359] text-xs font-black rounded-xl hover:bg-[#122A42] transition-colors cursor-pointer shadow-sm"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Pesan Tiket Kunjungan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pindai Plakat QR Etalase (Untuk Pengunjung di Lokasi Museum) */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#081827] text-[#D4A359] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pindai QR Plakat Etalase</h3>
                  <p className="text-[10px] text-slate-500">Scan plakat fisik di depan kaca etalase museum</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsQrScannerOpen(false);
                  setQrScanError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanner Viewport Simulation */}
            <div className="relative bg-slate-900 rounded-2xl h-44 overflow-hidden flex flex-col items-center justify-center text-white text-center p-4 border-2 border-dashed border-[#D4A359]/60">
              <div className="w-24 h-24 border-2 border-[#D4A359] rounded-xl flex items-center justify-center relative mb-2 animate-pulse">
                <QrCode className="w-12 h-12 text-[#D4A359]" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_red]"></div>
              </div>
              <span className="text-[11px] font-semibold text-slate-300">
                Arahkan kamera ke QR Code di plakat etalase
              </span>
            </div>

            {/* Fast Quick Select or Code Input */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Atau Masukkan Kode Unik / No Registrasi Koleksi:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: STUPIKA-01 atau 01.01.MB.2024"
                    value={qrInputCode}
                    onChange={(e) => {
                      setQrInputCode(e.target.value);
                      setQrScanError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleQrLookup(qrInputCode);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:border-[#081827]"
                  />
                  <button
                    type="button"
                    onClick={() => handleQrLookup(qrInputCode)}
                    className="px-4 py-2 bg-[#081827] text-white text-xs font-bold rounded-xl hover:bg-[#122A42] transition-colors cursor-pointer"
                  >
                    Buka
                  </button>
                </div>
              </div>

              {qrScanError && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
                  {qrScanError}
                </p>
              )}

              {/* Sample Quick Tap Plaquettes */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">
                  Contoh Plakat Koleksi Terpilih:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {koleksi.slice(0, 4).map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => handleQrLookup(k.kodeUnik)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#081827] hover:text-[#D4A359] text-[10px] font-mono font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      {k.namaKoleksi.split(' ')[0]} ({k.kodeUnik})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
