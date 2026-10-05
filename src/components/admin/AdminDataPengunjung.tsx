import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Users, 
  User, 
  GraduationCap, 
  Globe, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import type { CategoryType, BookingStatus } from '../../types';

// Helper to normalize any historical category names into the canonical 4 categories
export const normalizeCategory = (kategori: string): 'Pelajar/Mahasiswa' | 'Umum' | 'Mancanegara' | 'Pelajar Rombongan' => {
  if (kategori === 'Pelajar' || kategori === 'Pelajar/Mahasiswa') return 'Pelajar/Mahasiswa';
  if (kategori === 'Luar Negeri' || kategori === 'Mancanegara') return 'Mancanegara';
  if (kategori === 'Pelajar Rombongan') return 'Pelajar Rombongan';
  return 'Umum';
};

export const AdminDataPengunjung: React.FC = () => {
  const { bookings, setActiveView, setSelectedBookingId, deleteBooking } = useBooking();
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  
  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'name-asc' | 'qty-desc'>('latest');
  const [search, setSearch] = useState('');

  // Category counts and statistics
  const categoryStats = useMemo(() => {
    let pelajarCount = 0;
    let pelajarPeople = 0;

    let umumCount = 0;
    let umumPeople = 0;

    let mancaCount = 0;
    let mancaPeople = 0;

    let rombonganCount = 0;
    let rombonganPeople = 0;

    bookings.forEach((b) => {
      const cat = normalizeCategory(b.kategori);
      if (cat === 'Pelajar/Mahasiswa') {
        pelajarCount++;
        pelajarPeople += b.jumlahOrang || 1;
      } else if (cat === 'Umum') {
        umumCount++;
        umumPeople += b.jumlahOrang || 1;
      } else if (cat === 'Mancanegara') {
        mancaCount++;
        mancaPeople += b.jumlahOrang || 1;
      } else if (cat === 'Pelajar Rombongan') {
        rombonganCount++;
        rombonganPeople += b.jumlahOrang || 1;
      }
    });

    const totalPeople = pelajarPeople + umumPeople + mancaPeople + rombonganPeople;

    return {
      pelajar: { count: pelajarCount, people: pelajarPeople },
      umum: { count: umumCount, people: umumPeople },
      manca: { count: mancaCount, people: mancaPeople },
      rombongan: { count: rombonganCount, people: rombonganPeople },
      totalPeople,
      totalBookings: bookings.length
    };
  }, [bookings]);

  // Filtered & Sorted Visitors
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const cat = normalizeCategory(b.kategori);
        const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
        
        const q = search.toLowerCase();
        const matchesSearch = 
          b.nama.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.telepon.includes(q) ||
          b.alamat.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.nama.localeCompare(b.nama);
        }
        if (sortBy === 'qty-desc') {
          return (b.jumlahOrang || 1) - (a.jumlahOrang || 1);
        }
        // Default latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [bookings, selectedCategory, selectedStatus, search, sortBy]);

  // Category Configuration for Badges & Tabs
  const categoryConfigs: {
    id: string;
    label: string;
    shortLabel: string;
    price: string;
    count: number;
    people: number;
    icon: React.ReactNode;
    colorClasses: string;
    activeClasses: string;
  }[] = [
    {
      id: 'all',
      label: 'Semua Kategori',
      shortLabel: 'Semua',
      price: '',
      count: categoryStats.totalBookings,
      people: categoryStats.totalPeople,
      icon: <Users className="w-3.5 h-3.5" />,
      colorClasses: 'text-slate-700 bg-slate-100 border-slate-200',
      activeClasses: 'bg-[#092C48] text-white border-[#092C48]'
    },
    {
      id: 'Pelajar/Mahasiswa',
      label: 'Pelajar / Mahasiswa',
      shortLabel: 'Pelajar / Mhs',
      price: 'Rp 5.000',
      count: categoryStats.pelajar.count,
      people: categoryStats.pelajar.people,
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      colorClasses: 'text-blue-700 bg-blue-50 border-blue-200',
      activeClasses: 'bg-blue-700 text-white border-blue-700'
    },
    {
      id: 'Umum',
      label: 'Umum',
      shortLabel: 'Umum',
      price: 'Rp 7.500',
      count: categoryStats.umum.count,
      people: categoryStats.umum.people,
      icon: <User className="w-3.5 h-3.5" />,
      colorClasses: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      activeClasses: 'bg-emerald-700 text-white border-emerald-700'
    },
    {
      id: 'Mancanegara',
      label: 'Mancanegara',
      shortLabel: 'Mancanegara',
      price: 'Rp 20.000',
      count: categoryStats.manca.count,
      people: categoryStats.manca.people,
      icon: <Globe className="w-3.5 h-3.5" />,
      colorClasses: 'text-purple-700 bg-purple-50 border-purple-200',
      activeClasses: 'bg-purple-700 text-white border-purple-700'
    },
    {
      id: 'Pelajar Rombongan',
      label: 'Pelajar Rombongan',
      shortLabel: 'Rombongan',
      price: 'Rp 5.000',
      count: categoryStats.rombongan.count,
      people: categoryStats.rombongan.people,
      icon: <Users className="w-3.5 h-3.5" />,
      colorClasses: 'text-amber-800 bg-amber-50 border-amber-200',
      activeClasses: 'bg-amber-600 text-white border-amber-600'
    }
  ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('latest');
    setSearch('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || search !== '';

  return (
    <AdminLayout 
      title="Data & Kategori Pengunjung" 
      subtitle="Manajemen data buku tamu, pemilahan kategori tarif tiket, dan riwayat pengunjung."
    >
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* 4 Mini KPI Cards for Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Pelajar / Mahasiswa */}
          <div 
            onClick={() => setSelectedCategory(selectedCategory === 'Pelajar/Mahasiswa' ? 'all' : 'Pelajar/Mahasiswa')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              selectedCategory === 'Pelajar/Mahasiswa'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Pelajar / Mhs
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Rp 5.000
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">
                {categoryStats.pelajar.people} <span className="text-xs font-bold text-slate-400">Orang</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {categoryStats.pelajar.count} Pesanan
              </span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ 
                  width: `${categoryStats.totalPeople > 0 ? (categoryStats.pelajar.people / categoryStats.totalPeople) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          {/* Card 2: Umum */}
          <div 
            onClick={() => setSelectedCategory(selectedCategory === 'Umum' ? 'all' : 'Umum')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              selectedCategory === 'Umum'
                ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Umum
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Rp 7.500
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">
                {categoryStats.umum.people} <span className="text-xs font-bold text-slate-400">Orang</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {categoryStats.umum.count} Pesanan
              </span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ 
                  width: `${categoryStats.totalPeople > 0 ? (categoryStats.umum.people / categoryStats.totalPeople) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          {/* Card 3: Mancanegara */}
          <div 
            onClick={() => setSelectedCategory(selectedCategory === 'Mancanegara' ? 'all' : 'Mancanegara')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              selectedCategory === 'Mancanegara'
                ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-500/20'
                : 'bg-white border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-600" />
                Mancanegara
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Rp 20.000
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">
                {categoryStats.manca.people} <span className="text-xs font-bold text-slate-400">Orang</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {categoryStats.manca.count} Pesanan
              </span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all"
                style={{ 
                  width: `${categoryStats.totalPeople > 0 ? (categoryStats.manca.people / categoryStats.totalPeople) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          {/* Card 4: Pelajar Rombongan */}
          <div 
            onClick={() => setSelectedCategory(selectedCategory === 'Pelajar Rombongan' ? 'all' : 'Pelajar Rombongan')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              selectedCategory === 'Pelajar Rombongan'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                Rombongan
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Rp 5.000
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">
                {categoryStats.rombongan.people} <span className="text-xs font-bold text-slate-400">Orang</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {categoryStats.rombongan.count} Rombongan
              </span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ 
                  width: `${categoryStats.totalPeople > 0 ? (categoryStats.rombongan.people / categoryStats.totalPeople) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
          {/* Top Category Filter Tabs / Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#092C48]" />
                <span>Pilah Berdasarkan Kategori Pengunjung:</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Pemilahan</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryConfigs.map((cfg) => {
                const isActive = selectedCategory === cfg.id;
                return (
                  <button
                    key={cfg.id}
                    onClick={() => setSelectedCategory(cfg.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95 ${
                      isActive 
                        ? cfg.activeClasses 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {cfg.icon}
                    <span>{cfg.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      {cfg.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Status Filter, and Sorting Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, ID booking, email, nomor HP, alamat..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter by Status & Sort Options */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Status Select */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                <span className="text-slate-400 text-[11px]">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {/* Sort By Select */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-[11px]">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="latest">Terbaru</option>
                  <option value="name-asc">Nama (A-Z)</option>
                  <option value="qty-desc">Jumlah Orang Terbanyak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Counter Banner */}
          <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-600">
              Menampilkan <span className="font-bold text-slate-900">{filteredBookings.length}</span> pengunjung
              {selectedCategory !== 'all' && (
                <span> pada kategori <span className="font-bold text-[#092C48]">"{selectedCategory}"</span></span>
              )}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Total Tiket: {filteredBookings.reduce((sum, b) => sum + (b.jumlahOrang || 1), 0)} Orang
            </span>
          </div>

          {/* Visitors Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-3.5">No.</th>
                  <th className="py-3.5 px-3.5">Nama & ID Booking</th>
                  <th className="py-3.5 px-3.5">Kategori Pengunjung</th>
                  <th className="py-3.5 px-3.5 text-center">Jumlah Orang</th>
                  <th className="py-3.5 px-3.5">Kontak Pengunjung</th>
                  <th className="py-3.5 px-3.5">Jadwal Kunjungan</th>
                  <th className="py-3.5 px-3.5 text-center">Status</th>
                  <th className="py-3.5 px-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-600 text-xs">Tidak ada data pengunjung yang cocok</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        Coba sesuaikan kata kunci pencarian atau ubah filter kategori pengunjung.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#092C48] text-white rounded-lg text-xs font-semibold hover:bg-[#071F33] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Tampilkan Semua Pengunjung</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b, idx) => {
                    const canonicalCategory = normalizeCategory(b.kategori);

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* No */}
                        <td className="py-3 px-3.5 text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Nama & ID */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 group-hover:text-[#092C48] transition-colors">
                            {b.nama}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <span>{b.id}</span>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{b.alamat}</span>
                          </div>
                        </td>

                        {/* Kategori Badge */}
                        <td className="py-3 px-3.5">
                          {canonicalCategory === 'Pelajar/Mahasiswa' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <GraduationCap className="w-3 h-3 text-blue-600" />
                              <span>Pelajar / Mahasiswa</span>
                            </span>
                          )}

                          {canonicalCategory === 'Umum' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <User className="w-3 h-3 text-emerald-600" />
                              <span>Umum</span>
                            </span>
                          )}

                          {canonicalCategory === 'Mancanegara' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <Globe className="w-3 h-3 text-purple-600" />
                              <span>Mancanegara</span>
                            </span>
                          )}

                          {canonicalCategory === 'Pelajar Rombongan' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Users className="w-3 h-3 text-amber-600" />
                              <span>Pelajar Rombongan</span>
                            </span>
                          )}
                        </td>

                        {/* Jumlah Orang */}
                        <td className="py-3 px-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            b.jumlahOrang > 5 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            <Users className="w-3 h-3" />
                            <span>{b.jumlahOrang} Orang</span>
                          </span>
                        </td>

                        {/* Kontak */}
                        <td className="py-3 px-3.5 space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{b.telepon}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{b.email}</span>
                          </div>
                        </td>

                        {/* Jadwal */}
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-800 text-xs">
                            {b.tanggalKunjungan}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[120px]">{b.sesi}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3.5 text-center">
                          {b.status === 'Terverifikasi' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Terverifikasi</span>
                            </span>
                          )}
                          {b.status === 'Menunggu Verifikasi' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3" />
                              <span>Menunggu</span>
                            </span>
                          )}
                          {b.status === 'Ditolak' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3 h-3" />
                              <span>Ditolak</span>
                            </span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedBookingId(b.id);
                                setActiveView('admin-order-detail');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#092C48] hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                              title="Lihat Detail Pesanan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(b)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Data Pengunjung"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Data Pengunjung */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-100 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Hapus Data Pengunjung?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data booking <strong className="text-slate-800 font-mono">{deleteTarget.id}</strong> atas nama <strong className="text-slate-800">{deleteTarget.nama}</strong> ({deleteTarget.jumlahOrang} Orang) akan dihapus secara permanen.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-700 flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>Data yang dihapus tidak dapat dipulihkan kembali.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBooking(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminDataPengunjung;
