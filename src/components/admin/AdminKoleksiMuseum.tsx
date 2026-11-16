import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import type { KoleksiItem, KuratorialCategory } from '../../types';
import { 
  Landmark, 
  Search, 
  Plus, 
  Printer, 
  QrCode, 
  Eye, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  Download, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Check, 
  Info,
  ExternalLink
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

const CATEGORIES: { id: KuratorialCategory | 'Semua'; label: string; color: string }[] = [
  { id: 'Semua', label: 'Semua Kategori', color: 'bg-slate-100 text-slate-800' },
  { id: 'Arkeologi', label: 'Arkeologi', color: 'bg-amber-100 text-amber-800' },
  { id: 'Etnografi', label: 'Etnografi', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'Filologi', label: 'Filologi', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'Keramologi', label: 'Keramologi', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'Numismatika & Heraldika', label: 'Numismatika', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'Seni Rupa & Kriya', label: 'Seni Rupa & Kriya', color: 'bg-rose-100 text-rose-800' },
  { id: 'Teknologi Tradisional', label: 'Teknologi Tradisional', color: 'bg-orange-100 text-orange-800' },
  { id: 'Geologi', label: 'Geologi', color: 'bg-stone-100 text-stone-800' },
];

export const AdminKoleksiMuseum: React.FC = () => {
  const { koleksi, addKoleksi, deleteKoleksi } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState<KuratorialCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('Semua');

  // Modals state
  const [detailItem, setDetailItem] = useState<KoleksiItem | null>(null);
  const [printPlaqueItem, setPrintPlaqueItem] = useState<KoleksiItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form state
  const [formData, setFormData] = useState({
    namaKoleksi: '',
    noRegistrasi: '',
    noRegistrasiLama: '',
    kodeUnik: '',
    kategori: 'Arkeologi' as KuratorialCategory,
    jenisBenda: '',
    tahunPembuatan: '',
    asal: '',
    kondisi: 'Baik' as KoleksiItem['kondisi'],
    deskripsi: '',
    fotoUrl: '/assets/koleksi/koleksi-stupika.png',
  });

  // Filtered collections
  const filteredKoleksi = useMemo(() => {
    return koleksi.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.kategori === selectedCategory;
      const matchKondisi = filterKondisi === 'Semua' || item.kondisi === filterKondisi;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q ||
        item.namaKoleksi.toLowerCase().includes(q) ||
        item.noRegistrasi.toLowerCase().includes(q) ||
        item.asal.toLowerCase().includes(q) ||
        item.tahunPembuatan.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q);
      return matchCat && matchKondisi && matchQuery;
    });
  }, [koleksi, selectedCategory, filterKondisi, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaKoleksi || !formData.noRegistrasi) return;

    addKoleksi({
      ...formData,
      kodeUnik: formData.kodeUnik || `MB-${Date.now().toString().slice(-5)}`,
    });

    setIsAddModalOpen(false);
    setFormData({
      namaKoleksi: '',
      noRegistrasi: '',
      noRegistrasiLama: '',
      kodeUnik: '',
      kategori: 'Arkeologi',
      jenisBenda: '',
      tahunPembuatan: '',
      asal: '',
      kondisi: 'Baik',
      deskripsi: '',
      fotoUrl: '/assets/koleksi/koleksi-stupika.png',
    });
  };

  return (
    <AdminLayout 
      title="Koleksi & Kuratorial (Musewangi)" 
      subtitle="Integrasi Sistem Informasi Koleksi & Cagar Budaya Museum Blambangan."
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Total Koleksi Terdaftar</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{koleksi.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">10 Terkurasi Resmi</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Kategori Kuratorial</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">8</div>
            <span className="text-[11px] text-slate-500">Standar Permendikbud</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Status Display Galeri</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Terpajang di Showcase</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Plakat QR Etalase</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{koleksi.length}</div>
            <span className="text-[11px] text-indigo-600 font-semibold">Siap Cetak / Plaque</span>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari koleksi (nama, nomor reg, asal temuan, era sejarah)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#081827] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterKondisi}
                onChange={(e) => setFilterKondisi(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="Semua">Semua Kondisi</option>
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="Perlu Konservasi">Perlu Konservasi</option>
              </select>

              <a
                href="http://musewangi.rf.gd/login?i=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#D4A359] to-[#B38038] hover:from-[#C39247] hover:to-[#A3702B] text-[#081827] text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Buka Panel Admin Musewangi di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Admin Musewangi</span>
              </a>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#081827] hover:bg-[#0c2236] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-[#D4A359]" />
                <span>Tambah Koleksi</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredKoleksi.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                {/* Artifact Photo Container */}
                <div className="relative h-48 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden flex items-center justify-center p-3">
                  <img 
                    src={item.fotoUrl} 
                    alt={item.namaKoleksi}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/koleksi/koleksi-stupika.png';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#081827]/85 text-[#D4A359] border border-[#D4A359]/30 backdrop-blur-sm">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/85 text-white backdrop-blur-sm">
                      {item.kondisi}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                    {item.noRegistrasi}
                  </div>
                </div>

                {/* Artifact Info */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
                      {item.namaKoleksi}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.tahunPembuatan}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.asal}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setDetailItem(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Detail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintPlaqueItem(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#081827] text-[#D4A359] text-xs font-bold hover:bg-[#0c2236] transition-all cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Plakat QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus koleksi "${item.namaKoleksi}" dari katalog?`)) {
                      deleteKoleksi(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  title="Hapus Koleksi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredKoleksi.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">Tidak ada koleksi yang cocok</h4>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori kuratorial.</p>
          </div>
        )}
      </div>

      {/* MODAL 1: Detail Kuratorial Lengkap */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="relative bg-gradient-to-r from-[#081827] to-[#12283e] p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A359]">
                  Detail Kuratorial • Museum Blambangan
                </span>
                <h2 className="text-xl font-bold mt-1">{detailItem.namaKoleksi}</h2>
                <p className="text-xs text-slate-300 font-mono mt-0.5">Reg: {detailItem.noRegistrasi}</p>
              </div>
              <button 
                type="button"
                onClick={() => setDetailItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Photo & Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center min-h-[220px]">
                  <img 
                    src={detailItem.fotoUrl} 
                    alt={detailItem.namaKoleksi}
                    className="max-h-48 max-w-full object-contain filter drop-shadow-xl"
                  />
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-semibold">Kategori</span>
                    <span className="font-bold text-slate-900">{detailItem.kategori}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-semibold">Era / Periode</span>
                    <span className="font-bold text-slate-900">{detailItem.tahunPembuatan}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-semibold">Asal Temuan</span>
                    <span className="font-bold text-slate-900">{detailItem.asal}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-semibold">Jenis Benda</span>
                    <span className="font-bold text-slate-900">{detailItem.jenisBenda}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-semibold">Kondisi Cagar</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{detailItem.kondisi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Kode Unik Showcase</span>
                    <span className="font-mono font-bold text-slate-900">{detailItem.kodeUnik}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Narasi Sejarah & Nilai Penting</span>
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-700 space-y-2 text-justify">
                  <p>{detailItem.deskripsi}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  const item = detailItem;
                  setDetailItem(null);
                  setPrintPlaqueItem(item);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#081827] text-[#D4A359] text-xs font-bold rounded-xl hover:bg-[#0c2236] transition-all cursor-pointer shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Cetak Plakat QR Etalase</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Cetak Plakat QR Etalase Museum (Print-Ready) */}
      {printPlaqueItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#D4A359]" />
                <span className="text-xs font-bold">Preview Plakat Etalase Cagar Budaya (Standar Display)</span>
              </div>
              <button
                type="button"
                onClick={() => setPrintPlaqueItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Plaque Card */}
            <div className="p-8 bg-[#FAFAF8] text-slate-900 border-4 border-[#081827] m-4 rounded-2xl shadow-inner relative overflow-hidden" id="print-plaque-area">
              {/* Header Museum */}
              <div className="flex items-center justify-between border-b-2 border-[#081827] pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <MuseumLogo variant="dark" className="h-10" />
                  <div>
                    <h3 className="font-serif font-black text-xs uppercase tracking-widest text-[#081827]">
                      MUSEUM BLAMBANGAN
                    </h3>
                    <p className="text-[10px] text-slate-600">Dinas Kebudayaan dan Pariwisata Kab. Banyuwangi</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                    {printPlaqueItem.noRegistrasi}
                  </span>
                </div>
              </div>

              {/* Plaque Body */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#D4A359] uppercase tracking-wider">
                      {printPlaqueItem.kategori}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                      {printPlaqueItem.namaKoleksi}
                    </h2>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p><strong>Asal Temuan:</strong> {printPlaqueItem.asal}</p>
                    <p><strong>Era / Waktu:</strong> {printPlaqueItem.tahunPembuatan}</p>
                    <p><strong>Jenis Bahan:</strong> {printPlaqueItem.jenisBenda}</p>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-snug line-clamp-4 text-justify pt-1">
                    {printPlaqueItem.deskripsi}
                  </p>
                </div>

                {/* QR Code Plakat for Smart Visitors */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-300 shadow-xs text-center">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 mb-1.5">
                    {/* SVG Real QR Code Simulation */}
                    <svg viewBox="0 0 120 120" className="w-24 h-24">
                      {/* Quiet Zone */}
                      <rect width="120" height="120" fill="white" />
                      {/* Corner Position Markers */}
                      <rect x="10" y="10" width="30" height="30" fill="#081827" />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="#081827" />

                      <rect x="80" y="10" width="30" height="30" fill="#081827" />
                      <rect x="85" y="15" width="20" height="20" fill="white" />
                      <rect x="90" y="20" width="10" height="10" fill="#081827" />

                      <rect x="10" y="80" width="30" height="30" fill="#081827" />
                      <rect x="15" y="85" width="20" height="20" fill="white" />
                      <rect x="20" y="90" width="10" height="10" fill="#081827" />

                      {/* Random Data Pattern Matrix */}
                      <rect x="45" y="15" width="6" height="6" fill="#081827" />
                      <rect x="55" y="15" width="6" height="6" fill="#081827" />
                      <rect x="65" y="15" width="6" height="6" fill="#081827" />
                      <rect x="45" y="25" width="6" height="6" fill="#081827" />
                      <rect x="65" y="25" width="6" height="6" fill="#081827" />
                      <rect x="45" y="45" width="30" height="30" fill="#D4A359" opacity="0.3" rx="4" />
                      <rect x="52" y="52" width="16" height="16" fill="#081827" />
                      
                      <rect x="15" y="55" width="6" height="6" fill="#081827" />
                      <rect x="25" y="55" width="6" height="6" fill="#081827" />
                      <rect x="85" y="55" width="6" height="6" fill="#081827" />
                      <rect x="95" y="55" width="6" height="6" fill="#081827" />

                      <rect x="45" y="85" width="6" height="6" fill="#081827" />
                      <rect x="55" y="95" width="6" height="6" fill="#081827" />
                      <rect x="75" y="85" width="6" height="6" fill="#081827" />
                      <rect x="85" y="95" width="6" height="6" fill="#081827" />
                      <rect x="95" y="85" width="6" height="6" fill="#081827" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-800">
                    Pindai Cerita Audio
                  </span>
                  <span className="text-[7px] text-slate-500 font-mono">
                    ID: {printPlaqueItem.kodeUnik}
                  </span>
                </div>
              </div>

              {/* Plaque Footer */}
              <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-500">
                <span>Kuratorial Resmi Disbudpar Kab. Banyuwangi</span>
                <span className="font-mono">Standar Registrasi Nasional Cagar Budaya</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setPrintPlaqueItem(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 bg-[#081827] text-[#D4A359] hover:bg-[#0c2236] text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Plakat (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Tambah Koleksi Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 bg-[#081827] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Tambah Koleksi Baru (Musewangi)</h3>
                <p className="text-xs text-slate-300">Pencatatan inventaris cagar budaya ke sistem museum.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Koleksi / Benda *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arca Siwa Mahadewa"
                    value={formData.namaKoleksi}
                    onChange={(e) => setFormData({ ...formData, namaKoleksi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor Registrasi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 03.11.MB.2024"
                    value={formData.noRegistrasi}
                    onChange={(e) => setFormData({ ...formData, noRegistrasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Kuratorial</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KuratorialCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  >
                    {CATEGORIES.filter(c => c.id !== 'Semua').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kondisi Cagar</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as KoleksiItem['kondisi'] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  >
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Perlu Konservasi">Perlu Konservasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Asal Temuan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Situs Macanputih, Kabat"
                    value={formData.asal}
                    onChange={(e) => setFormData({ ...formData, asal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Era / Masa Sejarah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Abad XIV - XV Masehi"
                    value={formData.tahunPembuatan}
                    onChange={(e) => setFormData({ ...formData, tahunPembuatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi & Narasi Sejarah</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan fisik, nilai historis, serta fungsi budaya benda..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#081827]"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081827] text-[#D4A359] font-bold rounded-xl hover:bg-[#0c2236] transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Koleksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
