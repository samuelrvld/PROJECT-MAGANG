import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Check, 
  Clock, 
  Info, 
  Ticket, 
  ChevronLeft,
  Hourglass,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

export const StatusTiket: React.FC = () => {
  const { setActiveView, currentBooking, myBookings, verifyBooking } = useBooking();
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
          text: 'Bukti pembayaran telah diverifikasi resmi oleh Petugas Loket! Silakan klik tombol hijau di bawah untuk melihat tiket kunjungan.'
        });
      } else if (booking.status === 'Ditolak') {
        setCheckMessage({
          type: 'warning',
          text: `Pembayaran ditolak: ${booking.alasanPenolakan || 'Bukti transfer tidak sesuai'}. Silakan hubungi petugas loket.`
        });
      } else {
        setCheckMessage({
          type: 'info',
          text: 'Status Terkini: Menunggu Verifikasi. Petugas loket sedang memeriksa bukti transfer Anda dalam antrean sistem.'
        });
      }
      setTimeout(() => setCheckMessage(null), 6000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#14293E] sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: 100% full width on mobile, centered card on desktop */}
      <div className="w-full max-w-full sm:max-w-[420px] md:max-w-xl min-h-screen sm:min-h-[820px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden relative">
        
        {/* Header Status Tiket */}
        <div className="bg-[#14293E] text-white pt-4 pb-6 px-4 flex flex-col items-center justify-center relative overflow-hidden border-b border-[#D4A359]/25 shadow-sm">
          {/* Ornamen Gajah Oling Kiri */}
          <div className="absolute -left-1 -top-1 w-20 sm:w-24 h-24 sm:h-28 opacity-30 pointer-events-none select-none">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.3)]" />
          </div>

          {/* Ornamen Gajah Oling Kanan */}
          <div className="absolute -right-1 -top-1 w-20 sm:w-24 h-24 sm:h-28 opacity-30 pointer-events-none select-none scale-x-[-1]">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.3)]" />
          </div>

          {/* Header Navigation Bar */}
          <div className="w-full flex items-center justify-between mb-3 relative z-10">
            <button
              type="button"
              onClick={() => setActiveView('user-success')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all shadow-xs backdrop-blur-xs"
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Perfectly Centered Logo */}
            <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
              <MuseumLogo variant="white" className="h-7 sm:h-8 pointer-events-auto filter drop-shadow-xs" />
            </div>

            <div className="w-8" />
          </div>

          {/* Premium Verification Status Graphic */}
          <div className="relative my-2 flex items-center justify-center z-10">
            {isVerified ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 p-1 flex items-center justify-center shadow-2xl animate-in zoom-in-90">
                  <div className="w-full h-full rounded-[22px] bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg border border-emerald-300/40">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 text-emerald-300 text-xs font-bold animate-pulse">✦</span>
              </div>
            ) : (
              <div className="relative group">
                {/* Glowing backdrop pulse */}
                <div className="absolute inset-0 rounded-3xl bg-[#DAB36E]/20 blur-xl -z-10 animate-pulse" />

                {/* Central Medallion */}
                <div className="w-19 h-19 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#1B3654] via-[#254A73] to-[#152E4A] p-1 shadow-2xl border border-[#DAB36E]/60 flex items-center justify-center relative">
                  <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-[#10273F] to-[#081726] flex items-center justify-center relative shadow-inner">
                    {/* Clock Icon with Smooth Pulse */}
                    <Clock className="w-8 h-8 sm:w-9 sm:h-9 text-[#DAB36E] stroke-[2.2] animate-pulse" />
                  </div>

                  {/* Corner Badge: Hourglass */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-[#0F292F] border-2 border-[#14293E] flex items-center justify-center shadow-md">
                    <Hourglass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0F292F] stroke-[2.5]" />
                  </div>
                </div>

                {/* Floating Gold Sparkle Accents */}
                <span className="absolute -top-1.5 -right-2 text-[#DAB36E] text-xs font-bold select-none">✦</span>
                <span className="absolute -bottom-1 -left-2 text-[#DAB36E] text-[10px] font-bold select-none">✦</span>
                <span className="absolute top-2 -left-2.5 text-[#DAB36E] text-[8px] font-bold select-none">✦</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= MAIN CONTENT BODY: RICH BANYUWANGI HERITAGE MOTIFS ================= */}
        <main className="flex-1 px-5 py-5 overflow-y-auto flex flex-col items-center text-center space-y-4 relative bg-gradient-to-b from-[#FCFBF8] via-[#FAF7F2] to-white">
          {/* Top-Left Corner Motif Ornament (Contained, Not Overlapping) */}
          <div className="absolute top-1 left-1 w-16 h-20 opacity-20 pointer-events-none select-none">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-2xs" />
          </div>

          {/* Top-Right Corner Motif Ornament (Contained, Mirrored) */}
          <div className="absolute top-1 right-1 w-16 h-20 opacity-20 pointer-events-none select-none scale-x-[-1]">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-2xs" />
          </div>

          {/* Subtle Silhouette Penari Gandrung Watermark (Mid-Right) */}
          <div className="absolute right-2 top-24 w-44 h-60 opacity-[0.08] pointer-events-none select-none">
            <img
              src="/assets/penari-gandrung-gold.png"
              alt="Siluet Gandrung"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Subtle Gajah Oling Watermark (Lower-Left) */}
          <div className="absolute -left-4 bottom-16 w-36 h-48 opacity-[0.07] pointer-events-none select-none">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
          </div>

          {/* Title Area with Golden Pill Badge */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FAF3E0] to-[#FDF8EC] border border-[#D4A359]/40 text-[#8B6E32] text-[10px] font-bold mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
              <span>The Sunrise of Java • Museum Blambangan</span>
              <span className="text-[#D4A359]">✦</span>
            </div>

            <h1 className="text-[18px] sm:text-xl font-extrabold text-slate-900 leading-tight">
              {isVerified
                ? 'Pembayaran Berhasil Diverifikasi!'
                : 'Bukti Pembayaran Sedang Diverifikasi'}
            </h1>

            <p className="text-[11.5px] text-slate-600 max-w-[300px] mx-auto mt-1 leading-relaxed">
              {isVerified
                ? 'Tiket kunjungan Anda telah aktif dan siap digunakan di loket masuk.'
                : 'Tim loket kami akan memverifikasi bukti pembayaran Anda dalam 1x24 jam. Setelah terverifikasi, Anda akan mendapatkan tiket kunjungan.'}
            </p>

            {/* Ornamental Symmetrical Motif Divider under Title */}
            <div className="flex items-center justify-center gap-2 py-1 my-1.5 w-full max-w-[260px]">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4A359]/50 to-[#D4A359]" />
              <img
                src="/assets/gajah-oling-footer-symmetric.png"
                alt="Ornamen Gajah Oling"
                className="h-3.5 object-contain opacity-85 filter drop-shadow-2xs"
              />
              <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#D4A359]/50 to-[#D4A359]" />
            </div>
          </div>

          {/* ================= 3-STEP TIMELINE CARD: WITH BATIK EMBELLISHMENT ================= */}
          <div className="w-full text-left space-y-4 p-4 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#FFFDF9] border border-[#E5D7B5] rounded-3xl relative z-10 shadow-xs overflow-hidden">
            {/* Corner Gajah Oling Watermark inside Card */}
            <div className="absolute -top-3 -right-3 w-16 h-20 opacity-20 pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-14 h-16 opacity-15 pointer-events-none select-none scale-x-[-1]">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>

            {/* Step 1 */}
            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Pembayaran berhasil
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Struk transfer QRIS / m-Banking tersimpan
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Bukti pembayaran terkirim
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Telah masuk ke sistem verifikasi loket
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 relative">
              {isVerified ? (
                <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Verifikasi admin loket</span>
                  {!isVerified && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
                      Dalam Proses
                    </span>
                  )}
                </div>
                <div className={`text-[10px] font-medium mt-0.5 ${isVerified ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {isVerified ? '✓ Terverifikasi resmi oleh petugas loket' : 'Petugas loket sedang memvalidasi struk transfer...'}
                </div>
              </div>
            </div>
          </div>

          {/* ================= CULTURAL PHILOSOPHY CARD: BATIK GAJAH OLING ================= */}
          <div className="w-full rounded-2xl bg-gradient-to-br from-[#0F2F50] via-[#153B61] to-[#0A223B] border border-[#D4A359]/40 p-3.5 text-left relative overflow-hidden shadow-xs z-10">
            {/* Ambient Radial Golden Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A359]/15 rounded-full blur-xl pointer-events-none" />

            {/* Watermark Motif inside card */}
            <div className="absolute -right-2 -bottom-2 w-20 h-24 opacity-25 pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#D4A359]/25 to-[#D4A359]/10 border border-[#D4A359]/50 flex items-center justify-center shrink-0 p-1.5 shadow-xs">
                <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
              </div>
              <div className="flex-1 pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#F5E6CC] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4A359]" />
                    <span>Motif Khas Gajah Oling</span>
                  </span>
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#D4A359] bg-[#D4A359]/20 px-1.5 py-0.5 rounded-full border border-[#D4A359]/30">
                    Banyuwangi
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-snug mt-0.5">
                  Bermakna luhur <strong className="text-white font-semibold">"Eling marang Gusti"</strong> — melambangkan ketenangan, ketelitian, dan integritas petugas dalam memverifikasi tiket Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Info Box with Blambangan Heritage Touch */}
          <div className="w-full bg-[#FAF8F3] border border-[#E8DFC8] rounded-2xl p-3 flex items-start gap-2.5 text-[10.5px] text-slate-700 text-left relative z-10 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-[#D4A359]/20 text-[#8E631F] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5" />
            </div>
            <p className="leading-relaxed">
              Setelah diverifikasi oleh petugas loket, e-tiket resmi ber-QR Code akan otomatis aktif dan dapat diunduh (PDF) atau ditunjukkan langsung dari HP saat tiba di Museum Blambangan.
            </p>
          </div>

          {/* Ornamental Symmetrical Motif Border above Footer */}
          <div className="w-full h-3 opacity-35 flex items-center justify-center overflow-hidden my-0.5 z-10 pointer-events-none">
            <img
              src="/assets/gajah-oling-footer-symmetric.png"
              alt="Motif Pemisah"
              className="h-full object-contain filter drop-shadow"
            />
          </div>
        </main>

        {/* ================= FOOTER ACTION ================= */}
        <footer className="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white">
          {checkMessage && (
            <div
              className={`mb-3 p-3 rounded-xl text-xs flex items-start gap-2 animate-in fade-in ${
                checkMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : checkMessage.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}
            >
              {checkMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{checkMessage.text}</span>
            </div>
          )}

          {isVerified ? (
            <button
              onClick={() => setActiveView('user-ticket')}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Lihat Tiket Kunjungan</span>
            </button>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="w-full py-3 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-75"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4A359] ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Memeriksa ke Loket...' : (booking ? 'Perbarui & Cek Status Tiket' : 'Pesan Tiket Sekarang')}</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Status otomatis disinkronkan saat Admin Loket menyetujui pembayaran
              </p>

              {/* Mode Uji Coba Cepat (Khusus Simulasi Saat Presentasi) */}
              {booking && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      verifyBooking(booking.id);
                      setCheckMessage({
                        type: 'success',
                        text: 'Simulasi Berhasil: Tiket disetujui petugas loket! Silakan lihat tiket kunjungan.'
                      });
                    }}
                    className="text-[9.5px] text-slate-400 hover:text-[#092C48] hover:underline transition-colors cursor-pointer"
                    title="Gunakan opsi ini saat presentasi jika ingin mendemokan langsung tanpa membuka tab admin"
                  >
                    [Simulasi Demo: Setujui via Petugas Loket]
                  </button>
                </div>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
