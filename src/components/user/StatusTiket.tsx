import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Check, 
  Clock, 
  ChevronLeft, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

export const StatusTiket: React.FC = () => {
  const { setActiveView, currentBooking, myBookings } = useBooking();
  const booking = currentBooking || myBookings[0] || null;

  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<{ type: 'info' | 'success' | 'warning'; text: string } | null>(null);

  const isVerified = booking ? (booking.status === 'Terverifikasi') : false;

  const handleCheckStatus = () => {
    if (!booking) {
      setActiveView('user-form');
      return;
    }

    setIsChecking(true);
    setCheckMessage(null);

    setTimeout(() => {
      setIsChecking(false);
      if (booking.status === 'Terverifikasi') {
        setCheckMessage({
          type: 'success',
          text: 'E-Tiket telah terverifikasi resmi oleh petugas loket! Klik tombol di bawah untuk melihat tiket Anda.'
        });
      } else if (booking.status === 'Ditolak') {
        setCheckMessage({
          type: 'warning',
          text: `Pembayaran ditolak: ${booking.alasanPenolakan || 'Bukti transfer tidak sesuai'}. Hubungi petugas loket.`
        });
      } else {
        setCheckMessage({
          type: 'info',
          text: 'Menunggu Verifikasi Loket. Petugas sedang memverifikasi bukti pembayaran dalam antrean sistem.'
        });
      }
      setTimeout(() => setCheckMessage(null), 5000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F7] sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4 font-sans text-slate-800">
      {/* Dashboard-Themed Container */}
      <div className="w-full max-w-full sm:max-w-2xl min-h-screen sm:min-h-[860px] bg-[#F8FAFC] flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-slate-300 overflow-hidden">
        
        {/* ================= HEADER: MUSEUM DASHBOARD NAVY PALETTE ================= */}
        <header className="bg-gradient-to-r from-[#081827] via-[#092C48] to-[#123E63] text-white px-4 py-3.5 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('user-web-portal')}
                className="p-1.5 -ml-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Kembali ke Portal"
              >
                <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                  Status E-Tiket Kunjungan
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#E5C287] font-medium leading-none mt-0.5">
                  Museum Blambangan Banyuwangi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isVerified 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[#D4A359]/20 text-[#F3E2C4] border border-[#D4A359]/40'
              }`}>
                {isVerified ? 'Terverifikasi' : 'Proses Verifikasi'}
              </span>
            </div>
          </div>
        </header>

        {/* ================= CONTENT MAIN ================= */}
        <main className="flex-1 px-3 sm:px-5 py-4 overflow-y-auto space-y-3.5 text-left">
          
          {/* STATUS HERO BANNER */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 text-center space-y-3">
            <div className="flex justify-center">
              {isVerified ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#092C48]/10 text-[#092C48] flex items-center justify-center shadow-xs">
                  <Clock className="w-7 h-7 text-[#D4A359]" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                {isVerified 
                  ? 'E-Tiket Kunjungan Siap Digunakan' 
                  : 'Bukti Pembayaran Sedang Diproses'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {isVerified
                  ? 'Pembayaran telah diverifikasi resmi oleh petugas loket. Tunjukkan QR code tiket saat tiba di museum.'
                  : 'Bukti transfer sedang diperiksa oleh petugas loket. Anda dapat memperbarui status secara berkala.'}
              </p>
            </div>

            {/* Kode Pemesanan Badge */}
            {booking && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[10.5px] uppercase font-bold text-slate-400">
                  Kode Pemesanan:
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#092C48]">
                  {booking.id}
                </span>
              </div>
            )}
          </div>

          {/* CHECK STATUS ACTION BANNER */}
          {checkMessage && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
              checkMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : checkMessage.type === 'warning'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkMessage.text}</span>
            </div>
          )}

          {/* DETAIL KUNJUNGAN RESMI */}
          {booking && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="bg-[#092C48] text-white px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  Detail Kunjungan Resmi
                </span>
                <span className="text-[10px] font-bold bg-[#D4A359]/25 text-[#F3E2C4] border border-[#D4A359]/40 px-2 py-0.5 rounded">
                  {booking.kategori}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 divide-y divide-slate-100 text-xs">
                <div className="pb-2.5 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Nama Pemesan</span>
                  <span className="font-bold text-slate-800">{booking.nama}</span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Tanggal Kunjungan</span>
                  <span className="font-bold text-slate-800">{booking.tanggalKunjungan}</span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Sesi Kunjungan</span>
                  <span className="font-extrabold text-[#092C48]">{booking.sesi}</span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Jumlah Pengunjung</span>
                  <span className="font-bold text-slate-800">
                    {booking.jumlahOrang} Orang {booking.rincianPengunjung ? `(${booking.rincianPengunjung})` : ''}
                  </span>
                </div>

                <div className="pt-2.5 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Total Pembayaran</span>
                  <span className="font-extrabold text-[#092C48] text-sm sm:text-base">
                    Rp {booking.totalPembayaran.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* OFFICIAL TIMELINE STEPS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-[#092C48] border-b border-slate-100 pb-2">
              Prosedur E-Tiket & Check-in
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Bukti Pembayaran Terunggah</span>
                  <span className="text-[10.5px] text-slate-500">Tersimpan dalam basis data resmi PAD Banyuwangi</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-[#092C48] flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Verifikasi Petugas Loket</span>
                  <span className="text-[10.5px] text-slate-500">Proses pencocokan mutasi kasda & struk pembayaran</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Pindai QR di Pintu Masuk</span>
                  <span className="text-[10.5px] text-slate-500">Scan QR barcode resmi saat tiba di Museum Blambangan</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ================= FIXED BOTTOM ACTION BAR ================= */}
        <footer className="bg-white border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg shrink-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#D4A359] ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Memeriksa...' : 'Cek Status'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isVerified) {
                  setActiveView('user-ticket');
                } else {
                  setActiveView('user-web-portal');
                }
              }}
              className="inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{isVerified ? 'Lihat E-Tiket' : 'Kembali ke Portal'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4A359]" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
