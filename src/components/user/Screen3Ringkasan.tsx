import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  ChevronLeft, 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

export const Screen3Ringkasan: React.FC = () => {
  const { setActiveView, formData } = useBooking();

  const getPricePerPerson = () => {
    switch (formData.kategori) {
      case 'Pelajar/Mahasiswa':
      case 'Pelajar Rombongan':
      case 'Pelajar':
        return 5000;
      case 'Umum':
        return 7500;
      case 'Mancanegara':
      case 'Luar Negeri':
        return 20000;
      default:
        return 7500;
    }
  };

  const pricePerPerson = getPricePerPerson();
  const total = pricePerPerson * formData.jumlahOrang;

  const formatFullDateIndo = (dateStr: string): string => {
    if (!dateStr) return '15 Agustus 2025';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts.map(Number);
        const dateObj = new Date(y, m - 1, d);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const dayName = days[dateObj.getDay()] || '';
        const monthName = months[m - 1] || '';
        return `${dayName ? `${dayName}, ` : ''}${d} ${monthName} ${y}`;
      }
    } catch (_) {}
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: 100% full width on mobile, centered card on desktop */}
      <div className="w-full max-w-full sm:max-w-[420px] md:max-w-xl min-h-screen sm:min-h-[800px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden">
        
        {/* Header matching Figma Screen 3: [<] [Logo] [2/5] */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 relative">
          <div className="flex items-center gap-1.5 z-10 w-24 justify-start">
            <button
              onClick={() => setActiveView('user-form')}
              className="p-1 -ml-1 text-slate-700 hover:text-black transition-colors cursor-pointer"
              title="Kembali ke formulir data"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Formulir Data
            </span>
          </div>

          {/* Perfectly Centered Logo */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <MuseumLogo variant="dark" className="h-7 sm:h-8 pointer-events-auto" />
          </div>

          <div className="flex items-center z-10 w-24 justify-end">
            <span className="text-[11px] font-bold text-[#092C48] bg-slate-100 px-2.5 py-0.5 rounded-full">
              Langkah 2/5
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-5 py-4 overflow-y-auto space-y-3.5 text-left">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF3E0] border border-[#D4A359]/30 text-[#8B6E32] text-[10px] font-bold mb-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                <span>The Sunrise of Java • Kab. Banyuwangi</span>
              </div>
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight">
                Ringkasan Pesanan
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Periksa kembali detail pesanan Anda sebelum melanjutkan ke pembayaran.
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 opacity-20 pointer-events-none select-none hidden sm:block">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Card 1: Detail Pengunjung matching Figma Screen 3 */}
          <div className="border border-slate-200/90 rounded-2xl bg-white shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-[#092C48]" />
                <span>Detail Pengunjung</span>
              </h2>
              <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Lengkap</span>
              </span>
            </div>

            <div className="p-3.5 divide-y divide-slate-100 text-xs">
              <div className="pb-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3 h-3 text-slate-400" />
                  Nama Pengunjung
                </span>
                <span className="font-bold text-slate-800 text-[11px]">{formData.nama || '-'}</span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3 h-3 text-slate-400" />
                  Jumlah Orang
                </span>
                <span className="font-semibold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                  {formData.jumlahOrang} orang
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Kontak WhatsApp
                </span>
                <span className="font-semibold text-slate-800 text-[11px] font-mono">{formData.telepon || '-'}</span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Email
                </span>
                <span className="font-semibold text-slate-800 text-[11px] font-mono">{formData.email || '-'}</span>
              </div>

              <div className="pt-2 flex justify-between items-start">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px] pt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Alamat
                </span>
                <span className="font-semibold text-slate-800 text-[11px] text-right max-w-[200px] leading-relaxed">
                  {formData.alamat || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Detail Kunjungan matching Figma Screen 3 */}
          <div className="border border-slate-200/90 rounded-2xl bg-white shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#092C48]" />
                <span>Detail Kunjungan</span>
              </h2>
              <span className="text-[9.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Museum Blambangan
              </span>
            </div>

            <div className="p-3.5 divide-y divide-slate-100 text-xs">
              <div className="pb-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Tag className="w-3 h-3 text-slate-400" />
                  Kategori
                </span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {formData.kategori} <span className="font-normal text-slate-500">(Rp {pricePerPerson.toLocaleString('id-ID')}/orang)</span>
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Tanggal
                </span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {formatFullDateIndo(formData.tanggalKunjungan)}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Sesi
                </span>
                <span className="font-bold text-[#092C48] text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                  {formData.sesi || 'Sesi belum dipilih'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Calculation Box matching Figma Screen 3 (#FCF8EF soft cream) */}
          <div className="bg-[#FCF8EF] border border-[#E9DFBE] rounded-2xl p-4 space-y-2 text-xs shadow-2xs">
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Harga per orang</span>
              <span className="font-semibold text-slate-800">Rp {pricePerPerson.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Jumlah orang</span>
              <span className="font-semibold text-slate-800">{formData.jumlahOrang} orang</span>
            </div>
            <div className="border-t border-[#E5DCC5] pt-2.5 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Total Pembayaran
                </span>
                <span className="text-[10px] text-slate-500">Termasuk akses seluruh pameran</span>
              </div>
              <span className="font-black text-[#092C48] text-base tracking-tight">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </main>

        {/* Footer Actions: [Kembali] [Lanjut Pembayaran] matching Figma Screen 3 */}
        <footer className="p-4 pb-6 sm:pb-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveView('user-form')}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors text-center cursor-pointer shadow-2xs active:scale-95"
          >
            Kembali
          </button>

          <button
            type="button"
            onClick={() => setActiveView('user-qris')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs shadow-md transition-all text-center cursor-pointer active:scale-95"
          >
            Lanjut Pembayaran
          </button>
        </footer>
      </div>
    </div>
  );
};
