import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Calendar,
  Plus,
  Banknote,
  Check,
  Trash2,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { AdminWalkInModal } from './AdminWalkInModal';

export const AdminPesananKunjungan: React.FC = () => {
  const { bookings, setActiveView, setSelectedBookingId, verifyBooking, deleteBooking } = useBooking();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // Advanced Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterMetode, setFilterMetode] = useState<string>('Semua');
  const [filterSesi, setFilterSesi] = useState<string>('Semua');
  const [filterTanggal, setFilterTanggal] = useState<string>('');

  // Active filter count
  const activeFilterCount = (filterKategori !== 'Semua' ? 1 : 0) +
    (filterMetode !== 'Semua' ? 1 : 0) +
    (filterSesi !== 'Semua' ? 1 : 0) +
    (filterTanggal !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setFilterKategori('Semua');
    setFilterMetode('Semua');
    setFilterSesi('Semua');
    setFilterTanggal('');
    setSearchQuery('');
  };

  // Tab counts
  const allCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Menunggu Verifikasi').length;
  const verifiedCount = bookings.filter((b) => b.status === 'Terverifikasi').length;
  const rejectedCount = bookings.filter((b) => b.status === 'Ditolak').length;

  // Filtered list with comprehensive conditions
  const filteredBookings = bookings.filter((b) => {
    // 1. Search Query
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.telepon && b.telepon.includes(searchQuery));
    if (!matchesSearch) return false;

    // 2. Tab Filter
    if (activeTab === 'pending' && b.status !== 'Menunggu Verifikasi') return false;
    if (activeTab === 'verified' && b.status !== 'Terverifikasi') return false;
    if (activeTab === 'rejected' && b.status !== 'Ditolak') return false;

    // 3. Kategori Filter
    if (filterKategori !== 'Semua' && b.kategori !== filterKategori) return false;

    // 4. Metode Pembayaran Filter
    if (filterMetode !== 'Semua') {
      const bMethod = (b.metodePembayaran || '').toLowerCase();
      const fMethod = filterMetode.toLowerCase();
      if (!bMethod.includes(fMethod)) return false;
    }

    // 5. Sesi Filter
    if (filterSesi !== 'Semua') {
      const bSesi = (b.sesi || '').toLowerCase();
      const fSesi = filterSesi.toLowerCase();
      if (!bSesi.includes(fSesi)) return false;
    }

    // 6. Tanggal Filter
    if (filterTanggal !== '') {
      const bDate = (b.tanggalKunjungan || '') + ' ' + (b.createdAt || '');
      if (!bDate.toLowerCase().includes(filterTanggal.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <AdminLayout 
      title="Pesanan Kunjungan" 
      subtitle="Kelola dan verifikasi semua pesanan tiket kunjungan museum."
    >
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-5">
        {/* Top Controls: Search, Interactive Filter Button, & Walk-In Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor booking, telepon..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto relative">
            {/* Interactive Filter Button with Active Indicator Badge */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isFilterOpen || activeFilterCount > 0
                  ? 'bg-[#092C48] text-white border-[#092C48] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D4A359] text-[#092C48] text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Pindai QR Scanner Button */}
            <button
              type="button"
              onClick={() => setActiveView('admin-scan')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-200" />
              <span>Pindai QR Tiket</span>
            </button>

            {/* Walk-in Button */}
            <button
              type="button"
              onClick={() => setWalkInModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#092C48] hover:bg-[#071F33] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Beli Tiket Langsung di Loket</span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Popover Panel */}
        {isFilterOpen && (
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 duration-150 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4A359]" />
                <span className="text-xs font-bold text-slate-800">Filter Data Pesanan</span>
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset Filter ({activeFilterCount})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Filter 1: Kategori */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kategori Pengunjung
                </label>
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Umum">Umum</option>
                  <option value="Pelajar">Pelajar</option>
                  <option value="Pelajar/Mahasiswa">Pelajar / Mahasiswa</option>
                  <option value="Mancanegara">Mancanegara</option>
                  <option value="Pelajar Rombongan">Pelajar Rombongan</option>
                </select>
              </div>

              {/* Filter 2: Metode Pembayaran */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={filterMetode}
                  onChange={(e) => setFilterMetode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20"
                >
                  <option value="Semua">Semua Metode</option>
                  <option value="QRIS">QRIS Online / Dinamis</option>
                  <option value="Tunai">Tunai Loket (Cash)</option>
                  <option value="Loket">Loket Pembayaran</option>
                </select>
              </div>

              {/* Filter 3: Sesi Kunjungan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Sesi Kunjungan
                </label>
                <select
                  value={filterSesi}
                  onChange={(e) => setFilterSesi(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20"
                >
                  <option value="Semua">Semua Sesi</option>
                  <option value="Sesi 1">Sesi I (Pagi)</option>
                  <option value="Sesi 2">Sesi II (Siang)</option>
                  <option value="Sesi 3">Sesi III (Sore)</option>
                  <option value="Sesi 4">Sesi IV</option>
                </select>
              </div>

              {/* Filter 4: Tanggal Kunjungan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Cari Tanggal / Bulan
                </label>
                <input
                  type="text"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  placeholder="Contoh: Agustus, 15, 2025..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                Ditemukan <strong className="text-slate-800">{filteredBookings.length}</strong> pesanan sesuai filter.
              </span>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-1.5 bg-[#092C48] text-white rounded-xl text-xs font-bold hover:bg-[#071F33] cursor-pointer"
              >
                Tutup Filter
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Chips / Pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500">Filter Aktif:</span>
            {filterKategori !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                Kategori: {filterKategori}
                <button
                  type="button"
                  onClick={() => setFilterKategori('Semua')}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            {filterMetode !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                Metode: {filterMetode}
                <button
                  type="button"
                  onClick={() => setFilterMetode('Semua')}
                  className="hover:text-emerald-900 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            {filterSesi !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                Sesi: {filterSesi}
                <button
                  type="button"
                  onClick={() => setFilterSesi('Semua')}
                  className="hover:text-amber-900 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            {filterTanggal !== '' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                Tanggal: {filterTanggal}
                <button
                  type="button"
                  onClick={() => setFilterTanggal('')}
                  className="hover:text-purple-900 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer ml-1"
            >
              Hapus Semua Filter
            </button>
          </div>
        )}

        {/* Tab Filter Status */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-[#092C48] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({allCount})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pending'
                ? 'bg-[#092C48] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Menunggu Verifikasi ({pendingCount})
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'verified'
                ? 'bg-[#092C48] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Terverifikasi ({verifiedCount})
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'rejected'
                ? 'bg-[#092C48] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ditolak ({rejectedCount})
          </button>
        </div>

        {/* Tabel Data Pesanan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No.</th>
                <th className="py-3 px-3">No. Booking</th>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Sesi</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Filter className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">Tidak Ada Pesanan yang Sesuai</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Tidak ditemukan pesanan dengan kriteria filter atau pencarian saat ini. Silakan atur ulang filter Anda.
                      </p>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="mt-2 px-4 py-2 bg-[#092C48] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#071F33] transition-all shadow-xs"
                      >
                        Reset Semua Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#092C48]">{b.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{b.nama}</td>
                  <td className="py-3 px-3 text-slate-600">{b.tanggalKunjungan}</td>
                  <td className="py-3 px-3 text-slate-600">{b.sesi ? b.sesi.split('(')[0].trim() : '-'}</td>
                  <td className="py-3 px-3 text-slate-600">{b.kategori}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    Rp{b.totalPembayaran.toLocaleString('id-ID')}
                  </td>
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
                    <div className="flex items-center justify-center gap-1.5">
                      {b.status === 'Menunggu Verifikasi' && (
                        <button
                          type="button"
                          onClick={() => verifyBooking(b.id)}
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                          title="Setujui Pembayaran (Verifikasi)"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setActiveView('admin-order-detail');
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-[#092C48] text-slate-600 hover:text-white border border-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                        title="Lihat Detail Pesanan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Tombol Hapus Pesanan */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(b)}
                        className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 hover:border-rose-200 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                        title="Hapus Data Pesanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Navigasi Halaman / Paginasi */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Menampilkan 1 - {filteredBookings.length} dari {allCount} pesanan
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                currentPage === 1 ? 'bg-[#092C48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                currentPage === 2 ? 'bg-[#092C48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                currentPage === 3 ? 'bg-[#092C48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              disabled={currentPage === 3}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Beli Tiket Langsung di Loket */}
      <AdminWalkInModal 
        isOpen={walkInModalOpen} 
        onClose={() => setWalkInModalOpen(false)} 
      />

      {/* Modal Konfirmasi Hapus Data Pesanan */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-100 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Hapus Data Pesanan?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data pesanan <strong className="text-slate-800 font-mono">{deleteTarget.id}</strong> atas nama <strong className="text-slate-800">{deleteTarget.nama}</strong> ({deleteTarget.jumlahOrang} Orang) akan dihapus secara permanen dari sistem.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-700 flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>Tindakan ini tidak dapat dibatalkan. Pastikan data memang perlu dihapus.</span>
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
