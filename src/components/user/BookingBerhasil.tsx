import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Check, 
  Copy, 
  Home, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Tag, 
  Info,
  ArrowRight 
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

export const BookingBerhasil: React.FC = () => {
  const { setActiveView, currentBooking, myBookings } = useBooking();
  const [copied, setCopied] = useState(false);

  const booking = currentBooking || myBookings[0] || null;

  const handleCopy = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: 100% full width on mobile, centered card on desktop */}
      <div className="w-full max-w-full sm:max-w-[420px] md:max-w-xl min-h-screen sm:min-h-[800px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden relative">
        
        {/* Header: [Logo] */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-center sticky top-0 z-30">
          <MuseumLogo variant="dark" className="h-7 sm:h-8" />
        </header>

        {/* Konten Status Berhasil */}
        <main className="flex-1 px-5 py-5 overflow-y-auto flex flex-col items-center text-center space-y-3.5">
          {!booking ? (
            <div className="py-16 text-center space-y-3">
              <h2 className="text-base font-bold text-slate-800">Tidak Ada Pemesanan Aktif</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Silakan lakukan proses pemesanan tiket kunjungan terlebih dahulu.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="px-5 py-2.5 bg-[#092C48] text-white font-bold text-xs rounded-xl"
              >
                Pesan Tiket Sekarang
              </button>
            </div>
          ) : (
            <>
              {/* Green Checkmark Circle */}
              <div className="w-14 h-14 rounded-full bg-[#16A34A] text-white flex items-center justify-center mt-1 shadow-sm animate-in zoom-in-75">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF3E0] border border-[#D4A359]/30 text-[#8B6E32] text-[10px] font-bold mb-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                  <span>The Sunrise of Java • Museum Blambangan</span>
                </div>
                <h1 className="text-[18px] font-bold text-slate-900 leading-tight">
                  Booking Berhasil!
                </h1>
                <p className="text-[11px] text-slate-500 max-w-[260px] mx-auto mt-1 leading-relaxed">
                  Terima kasih telah melakukan pemesanan. Booking Anda sedang menunggu verifikasi admin.
                </p>
              </div>

              {/* Kotak Ringkasan Kode Booking */}
              <div className="w-full bg-[#FCF8EF] border border-[#F5EEDB] rounded-2xl p-4 text-left space-y-2.5 relative overflow-hidden">
                {/* Subtle Gajah Oling watermark */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 pointer-events-none select-none">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                </div>

                <div className="flex items-center justify-between border-b border-[#EFE5CE] pb-2 relative z-10">
              <div>
                <span className="text-[10px] text-slate-400 block font-normal">
                  Nomor Booking
                </span>
                <span className="font-bold text-[#092C48] text-sm tracking-wide">
                  {booking.id}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-colors"
                title="Salin nomor booking"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nama Pengunjung
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{booking.nama}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Jumlah Pengunjung
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{booking.jumlahOrang} orang</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal Kunjungan
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{booking.tanggalKunjungan}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Sesi Kunjungan
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{booking.sesi}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Total Pembayaran
                </span>
                <span className="font-bold text-[#092C48] text-[11px]">
                  Rp{booking.totalPembayaran.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-[#EFE5CE]">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Status Bukti Pembayaran
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF3C7] text-[#B45309]">
                  Menunggu Verifikasi
                </span>
              </div>
            </div>
          </div>

          {/* Stepper link to Screen 7 */}
          <button
            onClick={() => setActiveView('user-status')}
            className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5"
          >
            <span>Pantau Status Verifikasi</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          </>
          )}
        </main>

        {/* Tombol Kembali ke Beranda */}
        <footer className="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveView('user-landing')}
            className="w-full py-3 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
