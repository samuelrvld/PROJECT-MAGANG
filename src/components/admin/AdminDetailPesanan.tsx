import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import confetti from 'canvas-confetti';
import { 
  ChevronRight, 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Check, 
  X, 
  AlertTriangle, 
  ExternalLink,
  Ticket,
  Maximize2,
  Trash2
} from 'lucide-react';

export const AdminDetailPesanan: React.FC = () => {
  const { 
    bookings, 
    selectedBookingId, 
    setActiveView, 
    verifyBooking, 
    rejectBooking,
    deleteBooking
  } = useBooking();

  const booking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  // Modals state
  const [modalVerifyOpen, setModalVerifyOpen] = useState(false);
  const [modalRejectOpen, setModalRejectOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Nominal pembayaran tidak sesuai dengan total booking.');

  const handleConfirmDelete = () => {
    deleteBooking(booking.id);
    setModalDeleteOpen(false);
    setActiveView('admin-orders');
  };

  const handleConfirmVerify = () => {
    verifyBooking(booking.id);
    setModalVerifyOpen(false);
    setModalSuccessOpen(true);
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleConfirmReject = () => {
    rejectBooking(booking.id, rejectReason);
    setModalRejectOpen(false);
  };

  if (!booking) {
    return (
      <AdminLayout 
        title="Detail Pesanan" 
        subtitle="Kelola dan verifikasi bukti pembayaran pengunjung."
      >
        <div className="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pesanan Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Data pesanan tidak tersedia atau telah dihapus.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('admin-orders')}
            className="px-4 py-2 bg-[#092C48] text-white text-xs font-bold rounded-xl hover:bg-[#071F33] transition-colors cursor-pointer"
          >
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Detail Pesanan" 
      subtitle="Kelola dan verifikasi bukti pembayaran pengunjung."
    >
      <div className="space-y-5">
        {/* Breadcrumb matching Figma Image 2 Screen 3 */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button 
            onClick={() => setActiveView('admin-orders')}
            className="hover:text-[#092C48] transition-colors"
          >
            Pesanan Kunjungan
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">Detail</span>
          <span className="text-slate-400">({booking.id})</span>
        </div>

        {/* 2-Column Grid matching Figma Image 2 Screen 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Data Pengunjung & Detail Kunjungan */}
          <div className="space-y-6">
            {/* Card 1: Data Pengunjung */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#092C48]" />
                Data Pengunjung
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nama Pengunjung
                  </span>
                  <span className="font-semibold text-slate-800">{booking.nama}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Jumlah Orang
                  </span>
                  <span className="font-semibold text-slate-800">{booking.jumlahOrang} orang</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Kontak WhatsApp
                  </span>
                  <span className="font-semibold text-slate-800">{booking.telepon}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email
                  </span>
                  <span className="font-semibold text-slate-800">{booking.email}</span>
                </div>

                <div className="flex justify-between items-start py-1">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Alamat
                  </span>
                  <span className="font-semibold text-slate-800 text-right max-w-xs">{booking.alamat}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Detail Kunjungan */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#092C48]" />
                Detail Kunjungan
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Tanggal Kunjungan
                  </span>
                  <span className="font-semibold text-slate-800">{booking.tanggalKunjungan}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Sesi
                  </span>
                  <span className="font-semibold text-slate-800">{booking.sesi}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Kategori
                  </span>
                  <span className="font-semibold text-slate-800">{booking.kategori}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Harga per Orang</span>
                  <span className="font-semibold text-slate-800">
                    Rp{booking.hargaPerOrang.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500">Jumlah Orang</span>
                  <span className="font-semibold text-slate-800">{booking.jumlahOrang}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 font-bold">Total Pembayaran</span>
                  <span className="font-extrabold text-[#092C48] text-base sm:text-lg">
                    Rp{booking.totalPembayaran.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bukti Pembayaran */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#092C48]" />
                Bukti Pembayaran
              </h2>

              {/* Receipt Preview Card */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={booking.buktiPembayaranUrl || '/assets/sample-receipt.jpg'}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/sample-receipt.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      bukti-transfer-qris.jpg
                    </div>
                    <div className="text-[10px] text-slate-400">
                      245 KB • Transaksi QRIS
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lihat Gambar</span>
                </button>
              </div>

              {/* Transaction Metadata */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Nomor Transaksi:</span>
                  <span className="font-semibold text-slate-800">{booking.nomorTransaksi}</span>
                </div>

                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="font-semibold text-slate-800">{booking.metodePembayaran}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tanggal Pembayaran:</span>
                  <span className="font-semibold text-slate-800">{booking.tanggalPembayaran}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span>Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      booking.status === 'Terverifikasi'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : booking.status === 'Ditolak'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Warning Notice Box */}
              <div className="bg-[#FEF3C7]/60 border border-[#F59E0B]/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#92400E]">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <p>
                  Mohon periksa kembali bukti pembayaran dan pastikan nominal sudah sesuai.
                </p>
              </div>

              {/* Verification & Reject Action Buttons matching Figma Image 2 Screen 3 */}
              <div className="space-y-2.5 pt-2">
                {booking.status === 'Terverifikasi' ? (
                  <button
                    onClick={() => setActiveView('admin-ticket-view')}
                    className="w-full py-3 bg-[#092C48] hover:bg-[#071F33] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-[#D4A359]" />
                    <span>Lihat & Cetak Tiket Kunjungan</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setModalVerifyOpen(true)}
                      className="w-full py-3 bg-[#092C48] hover:bg-[#071F33] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Verifikasi Pembayaran</span>
                    </button>

                    <button
                      onClick={() => setModalRejectOpen(true)}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Tolak Pembayaran</span>
                    </button>
                  </>
                )}

                {/* Tombol Hapus Pesanan */}
                <button
                  type="button"
                  onClick={() => setModalDeleteOpen(true)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hapus Data Pesanan Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Data Pesanan */}
      {modalDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-100 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Hapus Pesanan Ini?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data pesanan <strong className="text-slate-800 font-mono">{booking.id}</strong> atas nama <strong className="text-slate-800">{booking.nama}</strong> ({booking.jumlahOrang} Orang) akan dihapus secara permanen.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-700 flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>Tindakan ini tidak dapat dibatalkan dan tiket tidak akan berlaku lagi.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setModalDeleteOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Verifikasi Pembayaran? matching Figma Image 2 Screen 4 */}
      {modalVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-100">
            <button
              onClick={() => setModalVerifyOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Verifikasi Pembayaran?
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
              Apakah Anda yakin informasi booking dan bukti pembayaran sudah sesuai?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalVerifyOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVerify}
                className="py-2.5 px-4 rounded-xl bg-[#092C48] hover:bg-[#071F33] text-white text-xs font-bold shadow-md"
              >
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Tolak Pembayaran? matching Figma Image 2 Screen 5 */}
      {modalRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center border border-slate-100">
            <button
              onClick={() => setModalRejectOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tolak Pembayaran?
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
              Silakan berikan alasan penolakan agar pengunjung bisa mengupload bukti pembayaran.
            </p>

            <div className="text-left mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={200}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
              <div className="text-right text-[10px] text-slate-400 mt-1">
                {rejectReason.length}/200
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalRejectOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Pembayaran Berhasil Diverifikasi! matching Figma Image 2 Screen 6 */}
      {modalSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-in zoom-in-75">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              Pembayaran Berhasil Diverifikasi!
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Status pesanan telah berubah menjadi Terverifikasi. Tiket kunjungan sudah aktif dan siap digunakan.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setModalSuccessOpen(false);
                  setActiveView('admin-ticket-view');
                }}
                className="w-full py-3 bg-[#0F292F] hover:bg-[#18434D] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-[#E5A93C]" />
                <span>Lihat Tiket Kunjungan</span>
              </button>

              <button
                onClick={() => {
                  setModalSuccessOpen(false);
                  setActiveView('admin-orders');
                }}
                className="w-full py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Kembali ke Daftar Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for "Lihat Gambar" */}
      {lightboxOpen && (
        <div 
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-lg w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden p-4 shadow-2xl flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800">
                  Bukti Pembayaran ({booking.id})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="overflow-auto max-h-[72vh] flex items-center justify-center bg-slate-900/5 rounded-xl p-2 border border-slate-200">
              <img
                src={booking.buktiPembayaranUrl || '/assets/sample-receipt.jpg'}
                alt="Bukti Transfer Penuh"
                className="w-full h-auto max-h-[68vh] object-contain rounded-lg shadow-xs"
                onError={(e) => {
                  e.currentTarget.src = '/assets/sample-receipt.jpg';
                }}
              />
            </div>

            {/* Modal Footer Info */}
            <div className="pt-3 text-xs text-slate-500 flex items-center justify-between">
              <span>Nominal: <strong className="text-slate-800">Rp{booking.totalPembayaran.toLocaleString('id-ID')}</strong></span>
              <span>Metode: <strong className="text-slate-800">{booking.metodePembayaran || 'QRIS'}</strong></span>
              <a 
                href={booking.buktiPembayaranUrl || '/assets/sample-receipt.jpg'} 
                download={`bukti-transfer-${booking.id}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Unduh Berkas</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
