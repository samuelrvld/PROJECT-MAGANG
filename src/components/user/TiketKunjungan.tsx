import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { ChevronLeft, Ticket } from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { ModernTicketPass } from '../common/ModernTicketPass';

export const TiketKunjungan: React.FC = () => {
  const { setActiveView, currentBooking, myBookings, selectedBookingId } = useBooking();
  const booking = 
    (selectedBookingId ? myBookings.find(b => b.id === selectedBookingId) : null) || 
    currentBooking || 
    myBookings[0] || 
    null;

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-8 sm:px-4 print:p-0 print:m-0 print:min-h-0 print:bg-white">
      {/* Container adapts smoothly for both mobile screens (100% full width) and desktop */}
      <div className="w-full max-w-full sm:max-w-xl bg-white sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden flex flex-col justify-between min-h-screen sm:min-h-[820px] print:shadow-none print:border-none print:min-h-0 print:rounded-none print:w-full">
        {/* Header: [<] [Logo] [Terverifikasi] */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30 relative print:hidden">
          <div className="flex items-center gap-1.5 z-10 w-24 justify-start">
            <button
              onClick={() => setActiveView('user-status')}
              className="p-1 -ml-1 text-slate-700 hover:text-black transition-colors cursor-pointer"
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Perfectly Centered Logo */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <MuseumLogo variant="dark" className="h-7 sm:h-8 pointer-events-auto" />
          </div>

          <div className="flex items-center z-10 w-24 justify-end">
            <span className="bg-[#081827] text-[#D4A359] border border-[#D4A359]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              Terverifikasi
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 print:p-0 print:m-0 print:space-y-0">
          <div className="flex items-center justify-between px-1 print:hidden">
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                E-Tiket Kunjungan Resmi
              </h1>
              <p className="text-xs text-slate-500">
                Tunjukkan tiket ini kepada petugas loket saat berkunjung.
              </p>
            </div>
            <button
              onClick={() => setActiveView('user-web-portal')}
              className="text-xs text-[#081827] font-bold hover:text-[#D4A359] transition-colors"
            >
              Lihat Tiket Saya →
            </button>
          </div>

          {booking ? (
            <ModernTicketPass
              booking={booking}
              onBack={() => setActiveView('user-web-portal')}
              showActions={true}
            />
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Belum Ada Tiket Kunjungan Aktif
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Anda belum memiliki tiket kunjungan di perangkat ini. Silakan lakukan reservasi kunjungan terlebih dahulu.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  onClick={() => setActiveView('user-form')}
                  className="px-4 py-2.5 bg-[#092C48] hover:bg-[#071f33] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  + Pesan Tiket Baru
                </button>
                <button
                  onClick={() => setActiveView('user-web-portal')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Ke Portal Tiket Saya
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
