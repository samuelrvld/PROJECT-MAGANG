import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { 
  Calendar, 
  Download, 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Building2,
  PieChart,
  BarChart3,
  ChevronDown,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

type ReportTab = 'kunjungan' | 'transaksi' | 'ringkasan';

export const AdminLaporan: React.FC = () => {
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState<ReportTab>('kunjungan');
  const [dateRange, setDateRange] = useState('01/08/2025 - 31/08/2025');

  // Filters for Laporan Kunjungan
  const [filterKategoriKunjungan, setFilterKategoriKunjungan] = useState('Semua');
  const [filterSesiKunjungan, setFilterSesiKunjungan] = useState('Semua');
  const [filterCheckIn, setFilterCheckIn] = useState('Semua');
  const [searchKunjungan, setSearchKunjungan] = useState('');

  // Filters for Laporan Transaksi
  const [filterMetodeTransaksi, setFilterMetodeTransaksi] = useState('Semua');
  const [filterStatusTransaksi, setFilterStatusTransaksi] = useState('Semua');
  const [searchTransaksi, setSearchTransaksi] = useState('');

  // Calculations for Kunjungan
  const totalPengunjung = bookings.reduce((acc, b) => acc + (b.jumlahOrang || 1), 0);
  const totalRombongan = bookings.filter((b) => (b.jumlahOrang || 1) > 1).length;
  const sudahCheckInCount = bookings.filter((b) => b.checkInStatus === 'Sudah Masuk').reduce((acc, b) => acc + (b.jumlahOrang || 1), 0);
  const belumCheckInCount = totalPengunjung - sudahCheckInCount;

  // Category Breakdown
  const kategoriStats = {
    pelajar: bookings.filter((b) => b.kategori.toLowerCase().includes('pelajar') || b.kategori.toLowerCase().includes('mahasiswa')).reduce((acc, b) => acc + (b.jumlahOrang || 1), 0),
    umum: bookings.filter((b) => b.kategori.toLowerCase().includes('umum')).reduce((acc, b) => acc + (b.jumlahOrang || 1), 0),
    mancanegara: bookings.filter((b) => b.kategori.toLowerCase().includes('mancanegara') || b.kategori.toLowerCase().includes('luar negeri')).reduce((acc, b) => acc + (b.jumlahOrang || 1), 0),
  };

  // Calculations for Transaksi
  const bookingsVerified = bookings.filter((b) => b.status === 'Terverifikasi');
  const totalPendapatan = bookingsVerified.reduce((acc, b) => acc + (b.totalPembayaran || 0), 0);
  const totalTransaksiBerhasil = bookingsVerified.length;
  const totalTransaksiPending = bookings.filter((b) => b.status === 'Menunggu Verifikasi').length;
  const totalTransaksiDitolak = bookings.filter((b) => b.status === 'Ditolak').length;
  const averageOrderValue = totalTransaksiBerhasil > 0 ? Math.round(totalPendapatan / totalTransaksiBerhasil) : 0;

  // Payment Method Breakdown
  const metodeStats = {
    qris: bookingsVerified.filter((b) => (b.metodePembayaran || '').toUpperCase().includes('QRIS')).reduce((acc, b) => acc + (b.totalPembayaran || 0), 0),
    tunai: bookingsVerified.filter((b) => (b.metodePembayaran || '').toLowerCase().includes('tunai')).reduce((acc, b) => acc + (b.totalPembayaran || 0), 0),
    transfer: bookingsVerified.filter((b) => (b.metodePembayaran || '').toLowerCase().includes('transfer')).reduce((acc, b) => acc + (b.totalPembayaran || 0), 0),
  };

  // Filtered Kunjungan Data
  const filteredKunjungan = bookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(searchKunjungan.toLowerCase()) ||
                          b.nama.toLowerCase().includes(searchKunjungan.toLowerCase());
    if (!matchesSearch) return false;
    if (filterKategoriKunjungan !== 'Semua' && !(b.kategori || '').toLowerCase().includes(filterKategoriKunjungan.toLowerCase())) return false;
    if (filterSesiKunjungan !== 'Semua' && !(b.sesi || '').toLowerCase().includes(filterSesiKunjungan.toLowerCase())) return false;
    if (filterCheckIn === 'Sudah Masuk' && b.checkInStatus !== 'Sudah Masuk') return false;
    if (filterCheckIn === 'Belum Hadir' && b.checkInStatus === 'Sudah Masuk') return false;
    return true;
  });

  // Filtered Transaksi Data
  const filteredTransaksi = bookings.filter((b) => {
    const matchesSearch = (b.nomorTransaksi || b.id).toLowerCase().includes(searchTransaksi.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTransaksi.toLowerCase()) ||
                          b.nama.toLowerCase().includes(searchTransaksi.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMetodeTransaksi !== 'Semua' && !(b.metodePembayaran || '').toLowerCase().includes(filterMetodeTransaksi.toLowerCase())) return false;
    if (filterStatusTransaksi !== 'Semua' && b.status !== filterStatusTransaksi) return false;
    return true;
  });

  // Export Laporan Kunjungan CSV
  const handleExportKunjunganCSV = () => {
    const headers = ['No Booking', 'Nama Pengunjung', 'Kategori', 'Tanggal Kunjungan', 'Sesi', 'Jumlah Orang', 'Status Gate'];
    const rows = filteredKunjungan.map((b) => [
      b.id,
      `"${b.nama}"`,
      `"${b.kategori}"`,
      `"${b.tanggalKunjungan}"`,
      `"${b.sesi}"`,
      b.jumlahOrang,
      b.checkInStatus === 'Sudah Masuk' ? 'Sudah Masuk (Check-In)' : 'Belum Hadir'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan-Kunjungan-Museum-Blambangan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Laporan Transaksi CSV
  const handleExportTransaksiCSV = () => {
    const headers = ['No Transaksi', 'No Booking', 'Tanggal Pembayaran', 'Nama Pengunjung', 'Metode Pembayaran', 'Total Retribusi (Rp)', 'Status Pembayaran'];
    const rows = filteredTransaksi.map((b) => [
      b.nomorTransaksi || `TRX-${b.id}`,
      b.id,
      `"${b.tanggalPembayaran || b.tanggalKunjungan}"`,
      `"${b.nama}"`,
      `"${b.metodePembayaran || 'QRIS'}"`,
      b.totalPembayaran,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan-Transaksi-Keuangan-Museum-Blambangan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout 
      title="Laporan & Rekapitulasi" 
      subtitle="Analisis data kunjungan wisatawan dan rekapitulasi keuangan retribusi museum."
    >
      <div className="space-y-6">
        {/* Top Header: Tab Selector & Date Range Control */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs print:hidden">
          {/* Main Module Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('kunjungan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'kunjungan'
                  ? 'bg-[#081827] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4 text-[#D4A359]" />
              <span>Laporan Kunjungan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transaksi')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'transaksi'
                  ? 'bg-[#081827] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#D4A359]" />
              <span>Laporan Transaksi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ringkasan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'ringkasan'
                  ? 'bg-[#081827] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#D4A359]" />
              <span>Ringkasan Eksekutif</span>
            </button>
          </div>

          {/* Date Range & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#D4A359]" />
              <span className="text-slate-400">Periode:</span>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-slate-800 w-44 focus:outline-none"
              />
            </div>

            {activeTab === 'kunjungan' && (
              <button
                type="button"
                onClick={handleExportKunjunganCSV}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#081827] hover:bg-[#0E2C4A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Export CSV Kunjungan</span>
              </button>
            )}

            {activeTab === 'transaksi' && (
              <button
                type="button"
                onClick={handleExportTransaksiCSV}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#081827] hover:bg-[#0E2C4A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Export CSV Transaksi</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Cetak Halaman Laporan Ini"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* ================= OFFICIAL LETTERHEAD FOR PRINT ONLY ================= */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-3 text-center">
          <div className="flex items-center justify-between pb-2">
            <img src="/assets/museum-logo.svg" alt="Logo Museum" className="h-14 object-contain" />
            <div className="flex-1 text-center px-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">Pemerintah Kabupaten Banyuwangi</h2>
              <h1 className="text-sm font-black uppercase text-slate-900">Dinas Kebudayaan dan Pariwisata</h1>
              <h3 className="text-base font-black uppercase text-[#081827]">UPTD Museum Blambangan</h3>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Jl. Jenderal Ahmad Yani No. 78, Taman Baru, Kec. Banyuwangi, Jawa Timur 68416 • Telp: (0333) 421555
              </p>
            </div>
            <div className="w-14" />
          </div>
          <div className="w-full h-0.5 bg-slate-900 mt-1" />
          <div className="w-full h-[1px] bg-slate-400 mt-0.5" />
          <div className="pt-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 underline underline-offset-4">
              {activeTab === 'kunjungan' && 'Laporan Rekapitulasi Kunjungan Wisatawan'}
              {activeTab === 'transaksi' && 'Laporan Rekapitulasi Penerimaan Retribusi Daerah'}
              {activeTab === 'ringkasan' && 'Laporan Eksekutif Kunjungan & Retribusi Wisata'}
            </h4>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Periode Data: {dateRange} • Dicetak pada: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short' }).format(new Date())}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LAPORAN KUNJUNGAN                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'kunjungan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Summary Metric Cards for Visitations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Total Wisatawan</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {totalPengunjung} <span className="text-xs font-bold text-slate-400">Orang</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Semua reservasi terdata</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Sudah Masuk (Gate)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {sudahCheckInCount} <span className="text-xs font-bold text-slate-400">Orang</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  {totalPengunjung > 0 ? Math.round((sudahCheckInCount / totalPengunjung) * 100) : 0}% tingkat kehadiran loket
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Belum Hadir</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {belumCheckInCount} <span className="text-xs font-bold text-slate-400">Orang</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  Menunggu kedatangan di lokasi
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Reservasi Rombongan</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-700">
                  {totalRombongan} <span className="text-xs font-bold text-slate-400">Kelompok</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  Sekolah, kampus & instansi
                </div>
              </div>
            </div>

            {/* Visual Analytics Grid: Category Breakdown & Attendance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[#D4A359]" />
                    <span>Kategori Pengunjung</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Berdasarkan Tiket</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Pelajar & Mahasiswa</span>
                      <span className="text-[#081827]">{kategoriStats.pelajar} Orang ({totalPengunjung > 0 ? Math.round((kategoriStats.pelajar / totalPengunjung) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${totalPengunjung > 0 ? (kategoriStats.pelajar / totalPengunjung) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Pengunjung Umum</span>
                      <span className="text-[#081827]">{kategoriStats.umum} Orang ({totalPengunjung > 0 ? Math.round((kategoriStats.umum / totalPengunjung) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${totalPengunjung > 0 ? (kategoriStats.umum / totalPengunjung) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Wisatawan Mancanegara</span>
                      <span className="text-[#081827]">{kategoriStats.mancanegara} Orang ({totalPengunjung > 0 ? Math.round((kategoriStats.mancanegara / totalPengunjung) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all"
                        style={{ width: `${totalPengunjung > 0 ? (kategoriStats.mancanegara / totalPengunjung) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  Data otomatis diperbarui saat pengunjung melakukan reservasi tiket melalui portal resmi museum.
                </div>
              </div>

              {/* Attendance Chart Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#D4A359]" />
                    <span>Tren Kunjungan Wisatawan per Periode</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Statistik Mingguan</span>
                </div>

                <div className="w-full h-44 relative pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F0" />

                    <defs>
                      <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#081827" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#081827" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="20,110 90,75 170,90 250,35 330,60 410,25 480,45 480,140 20,140"
                      fill="url(#visGrad)"
                    />
                    <polyline
                      fill="none"
                      stroke="#081827"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="20,110 90,75 170,90 250,35 330,60 410,25 480,45"
                    />
                    {[
                      { x: 20, y: 110 },
                      { x: 90, y: 75 },
                      { x: 170, y: 90 },
                      { x: 250, y: 35 },
                      { x: 330, y: 60 },
                      { x: 410, y: 25 },
                      { x: 480, y: 45 },
                    ].map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#D4A359"
                        strokeWidth="2.5"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>Minggu 1</span>
                    <span>Minggu 2</span>
                    <span>Minggu 3</span>
                    <span>Minggu 4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Toolbar for Visitation Table */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800">
                    Daftar Rekapitulasi Data Kunjungan
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {filteredKunjungan.length} Data
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari kode booking / nama..."
                      value={searchKunjungan}
                      onChange={(e) => setSearchKunjungan(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 focus:outline-none focus:border-[#081827]"
                    />
                  </div>

                  {/* Filter Kategori */}
                  <select
                    value={filterKategoriKunjungan}
                    onChange={(e) => setFilterKategoriKunjungan(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Pelajar">Pelajar / Mahasiswa</option>
                    <option value="Umum">Umum</option>
                    <option value="Mancanegara">Mancanegara</option>
                  </select>

                  {/* Filter Sesi */}
                  <select
                    value={filterSesiKunjungan}
                    onChange={(e) => setFilterSesiKunjungan(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Semua">Semua Sesi</option>
                    <option value="Pagi">Sesi Pagi</option>
                    <option value="Siang">Sesi Siang</option>
                  </select>

                  {/* Filter Kehadiran */}
                  <select
                    value={filterCheckIn}
                    onChange={(e) => setFilterCheckIn(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Semua">Semua Kehadiran</option>
                    <option value="Sudah Masuk">Sudah Masuk (Check-In)</option>
                    <option value="Belum Hadir">Belum Hadir</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5">No. Booking</th>
                      <th className="py-3 px-3.5">Nama Wisatawan</th>
                      <th className="py-3 px-3.5">Kategori</th>
                      <th className="py-3 px-3.5">Tanggal</th>
                      <th className="py-3 px-3.5">Sesi Waktu</th>
                      <th className="py-3 px-3.5 text-center">Jumlah</th>
                      <th className="py-3 px-3.5">Status Gate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredKunjungan.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-[#081827]">
                          {b.id}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-slate-800">
                          {b.nama}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {b.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {b.tanggalKunjungan}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {b.sesi}
                        </td>
                        <td className="py-3 px-3.5 text-center font-bold text-slate-800">
                          {b.jumlahOrang} Orang
                        </td>
                        <td className="py-3 px-3.5">
                          {b.checkInStatus === 'Sudah Masuk' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Sudah Masuk</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Belum Hadir</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredKunjungan.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Tidak ada data kunjungan yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LAPORAN TRANSAKSI KEUANGAN                                        */}
        {/* ========================================================================= */}
        {activeTab === 'transaksi' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Financial Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Total Penerimaan Retribusi</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#081827]">
                  Rp {totalPendapatan.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Pendapatan terverifikasi sah</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Transaksi Berhasil</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-700">
                  {totalTransaksiBerhasil} <span className="text-xs font-bold text-slate-400">Trx</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  Status Terverifikasi / Lunas
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Menunggu Verifikasi</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {totalTransaksiPending} <span className="text-xs font-bold text-slate-400">Trx</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  Perlu validasi bukti bayar
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Rata-rata Nilai Trx (AOV)</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-700">
                  Rp {averageOrderValue.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-500 font-medium pt-1">
                  Rata-rata per tiket terverifikasi
                </div>
              </div>
            </div>

            {/* Financial Analytics: Payment Method Share & Cash Flow Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Methods Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D4A359]" />
                    <span>Kanal Pembayaran</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Rekapitulasi</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">QRIS Bank Jatim / ASPI</span>
                      <span className="text-[#081827]">Rp {metodeStats.qris.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${totalPendapatan > 0 ? (metodeStats.qris / totalPendapatan) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Tunai Loket (POS Walk-In)</span>
                      <span className="text-[#081827]">Rp {metodeStats.tunai.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${totalPendapatan > 0 ? (metodeStats.tunai / totalPendapatan) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Transfer Bank</span>
                      <span className="text-[#081827]">Rp {metodeStats.transfer.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${totalPendapatan > 0 ? (metodeStats.transfer / totalPendapatan) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Total Rekonsiliasi:</span>
                  <span className="text-emerald-700 font-black">
                    Rp {totalPendapatan.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Cash Flow Graph Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#D4A359]" />
                    <span>Tren Penerimaan Retribusi Harian (Arus Kas)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Real-Time Sync</span>
                </div>

                <div className="w-full h-44 relative pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeDasharray="3,3" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F0" />

                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="20,125 90,85 170,95 250,45 330,70 410,30 480,20 480,140 20,140"
                      fill="url(#revGrad)"
                    />
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="20,125 90,85 170,95 250,45 330,70 410,30 480,20"
                    />
                    {[
                      { x: 20, y: 125 },
                      { x: 90, y: 85 },
                      { x: 170, y: 95 },
                      { x: 250, y: 45 },
                      { x: 330, y: 70 },
                      { x: 410, y: 30 },
                      { x: 480, y: 20 },
                    ].map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>Minggu 1</span>
                    <span>Minggu 2</span>
                    <span>Minggu 3</span>
                    <span>Minggu 4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Toolbar for Financial Transaction Table */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800">
                    Daftar Mutasi Transaksi Retribusi
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {filteredTransaksi.length} Transaksi
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari transaksi / booking..."
                      value={searchTransaksi}
                      onChange={(e) => setSearchTransaksi(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 focus:outline-none focus:border-[#081827]"
                    />
                  </div>

                  {/* Filter Metode */}
                  <select
                    value={filterMetodeTransaksi}
                    onChange={(e) => setFilterMetodeTransaksi(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Semua">Semua Metode</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Tunai">Tunai (Loket)</option>
                    <option value="Transfer">Transfer Bank</option>
                  </select>

                  {/* Filter Status */}
                  <select
                    value={filterStatusTransaksi}
                    onChange={(e) => setFilterStatusTransaksi(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Terverifikasi">Terverifikasi (Lunas)</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5">No. Transaksi</th>
                      <th className="py-3 px-3.5">No. Booking</th>
                      <th className="py-3 px-3.5">Pembayar</th>
                      <th className="py-3 px-3.5">Kanal / Metode</th>
                      <th className="py-3 px-3.5">Tanggal Bayar</th>
                      <th className="py-3 px-3.5 text-right">Nominal Retribusi</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransaksi.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-slate-600">
                          {b.nomorTransaksi || `TRX-${b.id}`}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-[#081827]">
                          {b.id}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-slate-800">
                          {b.nama}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {b.metodePembayaran || 'QRIS'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {b.tanggalPembayaran || b.tanggalKunjungan}
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-[#081827]">
                          Rp {(b.totalPembayaran || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          {b.status === 'Terverifikasi' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Lunas</span>
                            </span>
                          ) : b.status === 'Ditolak' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span>Ditolak</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Menunggu</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredTransaksi.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Tidak ada data transaksi yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RINGKASAN EKSEKUTIF                                               */}
        {/* ========================================================================= */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-[#081827] via-[#0E2C4A] to-[#07192A] text-white p-6 sm:p-8 rounded-3xl border border-[#D4A359]/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A359]">
                  Laporan Resmi Pemerintah Kabupaten Banyuwangi
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  Rekapitulasi Kinerja Operasional & Retribusi Museum Blambangan
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Periode {dateRange} • Sistem e-Tiket Terpadu Dinas Kebudayaan dan Pariwisata
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold">Total Wisatawan</div>
                  <div className="text-2xl font-black text-white">{totalPengunjung} Org</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold">Total Penerimaan</div>
                  <div className="text-2xl font-black text-[#F3E2C4]">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold">Transaksi Berhasil</div>
                  <div className="text-2xl font-black text-emerald-400">{totalTransaksiBerhasil} Trx</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold">Check-In Gate</div>
                  <div className="text-2xl font-black text-white">{sudahCheckInCount} Org</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3 text-xs text-slate-600 leading-relaxed">
              <h3 className="font-bold text-sm text-slate-800">
                Catatan Evaluasi Operasional
              </h3>
              <p>
                1. Kanal pembayaran nontunai QRIS resmi mendominasi penerimaan retribusi dengan kontribusi sebesar <strong>{totalPendapatan > 0 ? Math.round((metodeStats.qris / totalPendapatan) * 100) : 0}%</strong> dari total pendapatan.
              </p>
              <p>
                2. Sesi kunjungan terpadat tercatat pada <strong>Sesi Pagi (08:00 - 11:30 WIB)</strong> dengan porsi kunjungan rombongan edukasi sekolah dan keluarga.
              </p>
              <p>
                3. Seluruh dokumen laporan ini dapat diunduh dalam format berkas spreadsheet (.csv) maupun dicetak secara resmi sebagai berkas pertanggungjawaban bendahara penerimaan.
              </p>
            </div>
          </div>
        )}

        {/* ================= OFFICIAL SIGNATURE BLOCK FOR PRINT ONLY ================= */}
        <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs text-slate-900">
          <div className="text-center space-y-16">
            <div>
              <p className="font-semibold text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala UPTD Museum Blambangan</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900">Drs. H. ACHMAD TAUFIQ, M.Si</p>
              <p className="text-[10px] text-slate-500">NIP. 19740512 199903 1 004</p>
            </div>
          </div>

          <div className="text-center space-y-16">
            <div>
              <p className="font-semibold text-slate-600">Banyuwangi, {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
              <p className="font-bold text-slate-900">Petugas Loket / Bendahara Penerimaan</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900">SITI NURHIDAYAH, S.E</p>
              <p className="text-[10px] text-slate-500">NIP. 19820815 200801 2 011</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
