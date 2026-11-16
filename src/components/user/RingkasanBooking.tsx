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
  Edit3, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  Globe 
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

export const RingkasanBooking: React.FC = () => {
  const { setActiveView, formData } = useBooking();

  const jmlDewasa = formData.jumlahDewasa !== undefined ? formData.jumlahDewasa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? 0 : (formData.jumlahOrang || 1));
  const jmlMahasiswa = formData.jumlahMahasiswa !== undefined ? formData.jumlahMahasiswa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? (formData.jumlahOrang || 1) : 0);
  const jmlManca = formData.jumlahMancanegara || 0;
  const totalPengunjung = Math.max(1, jmlDewasa + jmlMahasiswa + jmlManca);
  const total = (jmlDewasa * 7500) + (jmlMahasiswa * 5000) + (jmlManca * 20000);

  const formatFullDateIndo = (dateStr: string): string => {
    if (!dateStr) return '-';
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
    <div className="min-h-screen bg-[#F0F3F7] sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4 font-sans text-slate-800">
      {/* Dashboard-Themed Container */}
      <div className="w-full max-w-full sm:max-w-2xl min-h-screen sm:min-h-[860px] bg-[#F8FAFC] flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-slate-300 overflow-hidden">
        
        {/* ================= HEADER: MUSEUM DASHBOARD NAVY PALETTE ================= */}
        <header className="bg-gradient-to-r from-[#081827] via-[#092C48] to-[#123E63] text-white px-4 py-3.5 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="p-1.5 -ml-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Kembali ke Formulir"
              >
                <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                  Ringkasan Pemesanan
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#E5C287] font-medium leading-none mt-0.5">
                  Tinjau kembali data pesanan sebelum pembayaran
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#D4A359]/20 text-[#F3E2C4] border border-[#D4A359]/40 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                Step 2 / 3
              </span>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#081827] border-2 border-[#D4A359] p-1 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src="/assets/museum-blambangan-emblem.png"
                  alt="Museum Blambangan"
                  className="w-full h-full object-contain rounded-full drop-shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* STEPPER BAR (Selaras & Serasi dengan Palette Emas & Navy Museum Blambangan) */}
          <div className="mt-3 pt-2.5 border-t border-white/15">
            <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-6 text-xs">
              {/* Step 1: Completed / Back */}
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="flex items-center gap-2 py-1.5 px-2 text-slate-300 font-medium opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
                title="Kembali ke Jadwal & Tiket"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <span className="text-xs sm:text-sm text-slate-300 tracking-tight truncate">Jadwal & Tiket</span>
              </button>

              {/* Step 2: Active Pill */}
              <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#D4A359]/15 text-white font-bold border border-[#D4A359]/60 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E5BE7E] to-[#D4A359] text-[#081827] text-[11px] flex items-center justify-center font-black shrink-0 shadow-xs">
                  2
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Data Pemesan</span>
              </div>

              {/* Step 3: Inactive */}
              <div className="flex items-center gap-2 py-1.5 px-2 text-slate-300 font-medium opacity-85">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <span className="text-xs sm:text-sm text-slate-300 tracking-tight truncate">Pembayaran</span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= CONTENT MAIN ================= */}
        <main className="flex-1 px-3 sm:px-5 py-4 overflow-y-auto space-y-3.5 text-left">
          
          {/* TICKET ITINERARY SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-[#092C48] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 p-0.5 border border-white/20 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/museum-blambangan-emblem.png"
                    alt="Museum Emblem"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                  Museum Blambangan
                </span>
              </div>
              <span className="text-[10px] font-bold bg-[#D4A359]/25 text-[#F3E2C4] border border-[#D4A359]/40 px-2 py-0.5 rounded">
                Kunjungan Edukasi
              </span>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Tanggal Kunjungan
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {formatFullDateIndo(formData.tanggalKunjungan)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Sesi Kunjungan
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#092C48] mt-0.5 block">
                    {formData.sesi || 'Sesi belum dipilih'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-[#092C48] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    Lokasi: Galeri Pameran Sejarah & Cagar Budaya
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jl. Singodimedjo No. 55, Taman Baru, Kec. Banyuwangi, Jawa Timur
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL PEMESAN CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#092C48]" />
                <span>Data Pemesan E-Tiket</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="text-[11px] font-bold text-[#092C48] hover:text-[#071f33] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-[#D4A359]" />
                <span>Ubah</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Nama Pemesan:</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {formData.nama || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">No. WhatsApp / HP:</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm font-sans tracking-tight">
                  {formData.telepon || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Alamat Email:</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm font-sans tracking-tight">
                  {formData.email || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Kota / Asal:</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {formData.alamat || 'Banyuwangi'}
                </span>
              </div>
            </div>
          </div>

          {/* DETAIL PENGUNJUNG CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#092C48]" />
                <span>Daftar Pengunjung ({totalPengunjung} Orang)</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="text-[11px] font-bold text-[#092C48] hover:text-[#071f33] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-[#D4A359]" />
                <span>Ubah</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {jmlDewasa > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#092C48]" />
                    <div>
                      <span className="font-bold text-slate-800 block">Pengunjung Dewasa / Umum</span>
                      <span className="text-[10px] text-slate-500">Masyarakat Umum & Domestik</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">{jmlDewasa} Orang</span>
                    <span className="text-[10px] text-slate-500">@ Rp 7.500</span>
                  </div>
                </div>
              )}

              {jmlMahasiswa > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-800 block">Pelajar / Mahasiswa</span>
                      <span className="text-[10px] text-slate-500">KTM / Kartu Pelajar Aktif</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">{jmlMahasiswa} Orang</span>
                    <span className="text-[10px] text-slate-500">@ Rp 5.000</span>
                  </div>
                </div>
              )}

              {jmlManca > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-bold text-slate-800 block">Wisatawan Mancanegara</span>
                      <span className="text-[10px] text-slate-500">Foreign Visitors</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">{jmlManca} Orang</span>
                    <span className="text-[10px] text-slate-500">@ Rp 20.000</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ITEMISED FARE BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
            <h2 className="text-xs sm:text-sm font-bold text-[#092C48] border-b border-slate-100 pb-2">
              Rincian Biaya Tiket
            </h2>

            <div className="space-y-1.5 text-xs">
              {jmlDewasa > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Dewasa / Umum ({jmlDewasa} × Rp 7.500)</span>
                  <span className="font-semibold text-slate-800">
                    Rp {(jmlDewasa * 7500).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {jmlMahasiswa > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Pelajar / Mahasiswa ({jmlMahasiswa} × Rp 5.000)</span>
                  <span className="font-semibold text-slate-800">
                    Rp {(jmlMahasiswa * 5000).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {jmlManca > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Wisatawan Mancanegara ({jmlManca} × Rp 20.000)</span>
                  <span className="font-semibold text-slate-800">
                    Rp {(jmlManca * 20000).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                <span>Biaya Layanan & Administrasi</span>
                <span>Rp 0 (Bebas Biaya)</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-900">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold block">
                    Total Pembayaran
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Termasuk akses seluruh koleksi cagar budaya
                  </span>
                </div>
                <span className="text-base sm:text-xl font-extrabold text-[#092C48]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* OFFICIAL VISITING POLICY */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <AlertCircle className="w-3.5 h-3.5 text-[#092C48] shrink-0" />
              <span>Ketentuan & Kebijakan E-Tiket:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px] leading-relaxed">
              <li>Tiket berlaku khusus pada tanggal dan sesi yang tercantum di atas.</li>
              <li>Tunjukkan kode QR e-tiket kepada petugas loket untuk proses verifikasi check-in.</li>
              <li>Tiket resmi Dinas Kebudayaan & Pariwisata Kabupaten Banyuwangi.</li>
            </ul>
          </div>
        </main>

        {/* ================= FIXED BOTTOM ACTION BAR ================= */}
        <footer className="bg-white border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg shrink-0 z-20">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Total Price */}
            <div className="text-left min-w-0">
              <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                Total Tagihan:
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#092C48] tracking-tight block leading-tight">
                Rp {total.toLocaleString('id-ID')}
              </span>
              <span className="text-[9.5px] text-slate-400 block font-normal">
                {totalPengunjung} Pengunjung
              </span>
            </div>

            {/* Right: Proceed Button with Museum Palette */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('user-form')}
                className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={() => setActiveView('user-qris')}
                className="inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut Pembayaran</span>
                <ArrowRight className="w-4 h-4 text-[#D4A359]" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
