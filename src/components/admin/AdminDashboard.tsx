import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
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

  // 4 metrics calculated dynamically from real bookings
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Menunggu Verifikasi').length;
  const verifiedCount = bookings.filter((b) => b.status === 'Terverifikasi').length;
  const rejectedCount = bookings.filter((b) => b.status === 'Ditolak').length;

  // Recent 5 bookings
  const recentBookings = bookings.slice(0, 5);

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
        {/* Kartu Statistik Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Booking */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Booking</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1.5">
              {totalBookings}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Menunggu Verifikasi</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1.5">
              {pendingCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+5% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 3: Terverifikasi */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Terverifikasi</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1.5">
              {verifiedCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+15% dari bulan lalu</span>
            </div>
          </div>

          {/* Card 4: Ditolak */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Ditolak</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1.5">
              {rejectedCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2% dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Grafik Kunjungan dan Statistik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Kunjungan 7 Hari Terakhir (Line Chart) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-900">
                Kunjungan 7 Hari Terakhir
              </h2>
              <span className="text-xs text-slate-400">Rata-rata 25 kunjungan/hari</span>
            </div>

            {/* SVG Line Chart */}
            <div className="w-full h-48 relative">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                {/* Horizontal Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F0" />

                {/* Y-axis labels */}
                <text x="-15" y="24" fontSize="9" fill="#94A3B8">40</text>
                <text x="-15" y="64" fontSize="9" fill="#94A3B8">30</text>
                <text x="-15" y="104" fontSize="9" fill="#94A3B8">20</text>
                <text x="-15" y="144" fontSize="9" fill="#94A3B8">10</text>

                {/* Area Gradient Fill */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="20,130 95,95 170,110 245,75 320,85 395,50 470,30 470,140 20,140"
                  fill="url(#chartGrad)"
                />

                {/* Smooth Polyline */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,130 95,95 170,110 245,75 320,85 395,50 470,30"
                />

                {/* Data Points */}
                {[
                  { x: 20, y: 130, val: 12 },
                  { x: 95, y: 95, val: 21 },
                  { x: 170, y: 110, val: 18 },
                  { x: 245, y: 75, val: 26 },
                  { x: 320, y: 85, val: 24 },
                  { x: 395, y: 50, val: 32 },
                  { x: 470, y: 30, val: 38 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    className="hover:r-6 cursor-pointer transition-all"
                  />
                ))}
              </svg>

              {/* X-axis Days Labels */}
              <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span>6 Agu</span>
                <span>7 Agu</span>
                <span>8 Agu</span>
                <span>9 Agu</span>
                <span>10 Agu</span>
                <span>11 Agu</span>
                <span>12 Agu</span>
              </div>
            </div>
          </div>

          {/* Grafik Donat Kategori Pengunjung */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Kategori Pengunjung
            </h2>

            {/* Donut Chart Visual */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
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
                <span className="text-xs font-black text-slate-800">{categoryStats.total}</span>
                <span className="text-[9px] text-slate-400 font-medium">Orang</span>
              </div>
            </div>

            {/* Legend for 4 categories */}
            <div className="space-y-1.5 mt-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#092C48]" />
                  <span className="text-slate-600">Umum</span>
                </div>
                <span className="font-bold text-slate-800">{categoryStats.umum.pct}% ({categoryStats.umum.count})</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-600">Pelajar / Mhs</span>
                </div>
                <span className="font-bold text-slate-800">{categoryStats.pelajar.pct}% ({categoryStats.pelajar.count})</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4A359]" />
                  <span className="text-slate-600">Mancanegara</span>
                </div>
                <span className="font-bold text-slate-800">{categoryStats.manca.pct}% ({categoryStats.manca.count})</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-600">Rombongan</span>
                </div>
                <span className="font-bold text-slate-800">{categoryStats.rombongan.pct}% ({categoryStats.rombongan.count})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Booking Terbaru */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Booking Terbaru
            </h2>
            <button
              onClick={() => setActiveView('admin-orders')}
              className="text-xs font-semibold text-[#092C48] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">No.</th>
                  <th className="py-2.5 px-3">No. Booking</th>
                  <th className="py-2.5 px-3">Nama</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Sesi</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#092C48]">{b.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{b.nama}</td>
                    <td className="py-3 px-3 text-slate-600">{b.tanggalKunjungan}</td>
                    <td className="py-3 px-3 text-slate-600">{b.sesi ? b.sesi.split('(')[0].trim() : '-'}</td>
                    <td className="py-3 px-3 text-slate-600">{b.kategori}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          b.status === 'Terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.status === 'Ditolak'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {b.status === 'Menunggu Verifikasi' ? 'Menunggu' : b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setActiveView('admin-order-detail');
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#092C48] transition-colors"
                        title="Lihat Detail Pesanan"
                      >
                        <Eye className="w-4 h-4" />
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
