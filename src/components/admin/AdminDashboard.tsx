import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { getVisitorWeeklyChartData, ChartDayPoint } from '../../utils/chartSyncUtils';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { bookings, setActiveView, setSelectedBookingId } = useBooking();
  const [hoveredPoint, setHoveredPoint] = React.useState<ChartDayPoint | null>(null);

  // 4 metrics calculated dynamically from real bookings
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Menunggu Verifikasi').length;
  const verifiedCount = bookings.filter((b) => b.status === 'Terverifikasi').length;
  const rejectedCount = bookings.filter((b) => b.status === 'Ditolak').length;

  // Recent 5 bookings
  const recentBookings = bookings.slice(0, 5);

  // Dynamic 7-day visitor chart data synchronized with bookings state
  const chartData = React.useMemo(() => {
    return getVisitorWeeklyChartData(bookings);
  }, [bookings]);

  // Dynamic Category Breakdown for Donut Chart
  const categoryStats = React.useMemo(() => {
    let pelajar = 0;
    let umum = 0;
    let manca = 0;
    let rombongan = 0;

    bookings.forEach((b) => {
      const cat = b.kategori;
      const count = b.jumlahOrang || 1;
      if (cat === 'Pelajar Rombongan') rombongan += count;
      else if (cat === 'Pelajar' || cat === 'Pelajar/Mahasiswa') pelajar += count;
      else if (cat === 'Mancanegara' || cat === 'Luar Negeri') manca += count;
      else umum += count;
    });

    const total = pelajar + umum + manca + rombongan || 1;
    const pUmum = Math.round((umum / total) * 100);
    const pPelajar = Math.round((pelajar / total) * 100);
    const pManca = Math.round((manca / total) * 100);
    const pRombongan = Math.max(0, 100 - (pUmum + pPelajar + pManca));

    const circ = 238.76;
    const dashUmum = (pUmum / 100) * circ;
    const dashPelajar = (pPelajar / 100) * circ;
    const dashManca = (pManca / 100) * circ;
    const dashRombongan = (pRombongan / 100) * circ;

    return {
      umum: { count: umum, pct: pUmum, dash: `${dashUmum} ${circ}`, offset: 0 },
      pelajar: { count: pelajar, pct: pPelajar, dash: `${dashPelajar} ${circ}`, offset: -dashUmum },
      manca: { count: manca, pct: pManca, dash: `${dashManca} ${circ}`, offset: -(dashUmum + dashPelajar) },
      rombongan: { count: rombongan, pct: pRombongan, dash: `${dashRombongan} ${circ}`, offset: -(dashUmum + dashPelajar + dashManca) },
      total
    };
  }, [bookings]);

  return (
    <AdminLayout 
      title="Dashboard Admin" 
      subtitle="Selamat datang di panel admin Museum Blambangan"
    >
      <div className="space-y-6">
        {/* 4 Kartu Ringkasan Metrik Utama */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* Card 1: Total Booking */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#092C48] to-[#1C4D78]" />
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Booking</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#092C48]/10 text-[#092C48] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {totalBookings.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+12% tren bulan ini</span>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all group relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Menunggu</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight mb-2">
              {pendingCount.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 w-fit px-2.5 py-0.5 rounded-full border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{pendingCount > 0 ? `${pendingCount} antrean tiket` : 'Semua terverifikasi'}</span>
            </div>
          </div>

          {/* Card 3: Terverifikasi */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Terverifikasi</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight mb-2">
              {verifiedCount.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tiket sah aktif</span>
            </div>
          </div>

          {/* Card 4: Ditolak */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all group relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Ditolak</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <XCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 tracking-tight mb-2">
              {rejectedCount.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 w-fit px-2.5 py-0.5 rounded-full border border-rose-200/60">
              <span>{rejectedCount > 0 ? `${rejectedCount} ditolak / batal` : 'Nihil penolakan'}</span>
            </div>
          </div>
        </div>

        {/* Grafik Kunjungan dan Statistik Kategori */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Chart 1: Kunjungan 7 Hari Terakhir (Line Chart) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Kunjungan 7 Hari Terakhir</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200/60">
                    Real-time
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rata-rata <strong className="text-slate-800">{chartData.averagePerDay}</strong> pengunjung/hari • Total periode: <strong className="text-slate-800">{chartData.totalPeriod}</strong> orang
                </p>
              </div>
              {hoveredPoint && (
                <div className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-xl font-medium shadow-md transition-all animate-in fade-in flex items-center gap-1.5">
                  <span>{hoveredPoint.label}:</span>
                  <strong className="text-emerald-400 font-bold">{hoveredPoint.val}</strong>
                  <span>Orang ({hoveredPoint.bookingsCount} booking)</span>
                </div>
              )}
            </div>

            {/* SVG Line Chart */}
            <div className="w-full h-56 sm:h-64 relative">
              <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Horizontal Gridlines */}
                <line x1="20" y1="25" x2="480" y2="25" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="20" y1="63" x2="480" y2="63" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="20" y1="101" x2="480" y2="101" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="#E2E8F0" />

                {/* Y-axis dynamic labels */}
                <text x="2" y="28" fontSize="9" fill="#94A3B8" fontWeight="600">{chartData.yTicks[0]}</text>
                <text x="2" y="66" fontSize="9" fill="#94A3B8" fontWeight="600">{chartData.yTicks[1]}</text>
                <text x="2" y="104" fontSize="9" fill="#94A3B8" fontWeight="600">{chartData.yTicks[2]}</text>
                <text x="2" y="143" fontSize="9" fill="#94A3B8" fontWeight="600">0</text>

                {/* Area Gradient Fill */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={chartData.polygonPoints}
                  fill="url(#chartGrad)"
                />

                {/* Smooth Polyline */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartData.polylinePoints}
                />

                {/* Data Points */}
                {chartData.points.map((pt, i) => (
                  <g key={i}>
                    {/* Hover target */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint?.fullDate === pt.fullDate ? '6.5' : '5'}
                      fill="#FFFFFF"
                      stroke="#10B981"
                      strokeWidth={hoveredPoint?.fullDate === pt.fullDate ? '4' : '3'}
                      className="cursor-pointer transition-all pointer-events-none drop-shadow-sm"
                    />
                  </g>
                ))}
              </svg>

              {/* X-axis Days Labels */}
              <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-3 px-2">
                {chartData.points.map((pt, i) => (
                  <span 
                    key={i} 
                    className={`transition-colors cursor-pointer py-0.5 px-1 rounded-md ${
                      hoveredPoint?.fullDate === pt.fullDate 
                        ? 'text-emerald-700 font-bold bg-emerald-50' 
                        : 'hover:text-slate-800'
                    }`}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 2: Donut Kategori Pengunjung */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                Kategori Pengunjung
              </h2>
              <p className="text-xs text-slate-500">Komposisi wisatawan berdasarkan tipe tiket</p>
            </div>

            {/* Donut Chart Visual */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segment 1: Umum (#092C48) */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="transparent"
                  stroke="#092C48"
                  strokeWidth="14"
                  strokeDasharray={categoryStats.umum.dash}
                  strokeDashoffset={categoryStats.umum.offset}
                />
                {/* Segment 2: Pelajar/Mhs (#10B981) */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="14"
                  strokeDasharray={categoryStats.pelajar.dash}
                  strokeDashoffset={categoryStats.pelajar.offset}
                />
                {/* Segment 3: Mancanegara (#D4A359) */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="transparent"
                  stroke="#D4A359"
                  strokeWidth="14"
                  strokeDasharray={categoryStats.manca.dash}
                  strokeDashoffset={categoryStats.manca.offset}
                />
                {/* Segment 4: Pelajar Rombongan (#3B82F6) */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="14"
                  strokeDasharray={categoryStats.rombongan.dash}
                  strokeDashoffset={categoryStats.rombongan.offset}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">{categoryStats.total}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Orang</span>
              </div>
            </div>

            {/* Legend for 4 categories */}
            <div className="space-y-2 mt-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#092C48] shrink-0" />
                  <span className="font-semibold text-slate-700">Umum</span>
                </div>
                <span className="font-bold text-slate-900">{categoryStats.umum.pct}% ({categoryStats.umum.count})</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                  <span className="font-semibold text-slate-700">Pelajar / Mhs</span>
                </div>
                <span className="font-bold text-slate-900">{categoryStats.pelajar.pct}% ({categoryStats.pelajar.count})</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4A359] shrink-0" />
                  <span className="font-semibold text-slate-700">Mancanegara</span>
                </div>
                <span className="font-bold text-slate-900">{categoryStats.manca.pct}% ({categoryStats.manca.count})</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
                  <span className="font-semibold text-slate-700">Rombongan</span>
                </div>
                <span className="font-bold text-slate-900">{categoryStats.rombongan.pct}% ({categoryStats.rombongan.count})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Booking Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Booking Terbaru
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">5 Transaksi pemesanan tiket terakhir yang masuk ke loket</p>
            </div>
            <button
              onClick={() => setActiveView('admin-orders')}
              className="text-xs font-bold text-[#092C48] hover:text-[#D4A359] hover:underline flex items-center gap-1 transition-colors w-fit"
            >
              <span>Lihat Semua Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Card List View for Phones */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div 
                key={b.id} 
                onClick={() => {
                  setSelectedBookingId(b.id);
                  setActiveView('admin-order-detail');
                }}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#092C48] bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">{b.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      b.status === 'Terverifikasi'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : b.status === 'Ditolak'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {b.status === 'Menunggu Verifikasi' ? 'Menunggu' : b.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{b.nama}</div>
                  <div className="text-[11px] text-slate-500">
                    {b.tanggalKunjungan} • {b.jumlahOrang} Orang ({b.kategori})
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-bold text-xs text-slate-900">
                    Rp{b.totalPembayaran.toLocaleString('id-ID')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">No.</th>
                  <th className="py-3 px-4">No. Booking</th>
                  <th className="py-3 px-4">Nama Pemesan</th>
                  <th className="py-3 px-4">Tanggal Kunjungan</th>
                  <th className="py-3 px-4">Sesi</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#092C48] bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        {b.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.nama}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{b.tanggalKunjungan}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{b.sesi ? b.sesi.split('(')[0].trim() : '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        {b.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          b.status === 'Terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : b.status === 'Ditolak'
                            ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                            : 'bg-amber-50 text-amber-700 border-amber-200/80'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          b.status === 'Terverifikasi'
                            ? 'bg-emerald-500'
                            : b.status === 'Ditolak'
                            ? 'bg-rose-500'
                            : 'bg-amber-500 animate-pulse'
                        }`} />
                        <span>{b.status === 'Menunggu Verifikasi' ? 'Menunggu' : b.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setActiveView('admin-order-detail');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#092C48] text-slate-700 hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        title="Lihat Detail Pesanan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
