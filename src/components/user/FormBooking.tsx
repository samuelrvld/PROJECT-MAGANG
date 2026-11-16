import React, { useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { CategoryType } from '../../types';
import { 
  ChevronLeft, 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Globe, 
  Calendar as CalendarIcon,
  Check, 
  Plus, 
  Minus, 
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { 
  isSessionTimePassed, 
  getSessionQuotaStats, 
  getTodayWIB,
  isWeekendClosed,
  getNextWeekdayDateStr,
  extractSessionId
} from '../../utils/sessionUtils';

/**
 * Validasi nomor telepon seluler Indonesia (10 - 13 digit).
 * Format yang diterima: 08..., +628..., 628...
 */
const isValidIndonesianPhone = (phone: string): boolean => {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-]/g, '');
  return /^(\+628|628|08)[1-9][0-9]{7,10}$/.test(clean);
};

export const FormBooking: React.FC = () => {
  const { setActiveView, formData, setFormData, bookings, sessionsConfig, ishomaConfig } = useBooking();

  // Multi-Category Counts & Validity
  const jmlDewasa = formData.jumlahDewasa !== undefined ? formData.jumlahDewasa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? 0 : (formData.jumlahOrang || 1));
  const jmlMahasiswa = formData.jumlahMahasiswa !== undefined ? formData.jumlahMahasiswa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? (formData.jumlahOrang || 1) : 0);
  const jmlManca = formData.jumlahMancanegara || 0;
  const totalPengunjung = jmlDewasa + jmlMahasiswa + jmlManca;
  const estimatedTotal = (jmlDewasa * 7500) + (jmlMahasiswa * 5000) + (jmlManca * 20000);

  // Individual Field Validity
  const isNamaValid = Boolean(formData.nama && formData.nama.trim().length >= 3);
  const isTeleponValid = isValidIndonesianPhone(formData.telepon);
  const isEmailValid = Boolean(formData.email && formData.email.includes('@') && formData.email.includes('.'));
  const isJumlahValid = totalPengunjung >= 1;
  const isDateClosedWeekend = isWeekendClosed(formData.tanggalKunjungan);
  const isTanggalValid = Boolean(formData.tanggalKunjungan) && !isDateClosedWeekend;
  const isSesiValid = Boolean(formData.sesi);

  // Core Steps Completion Check
  const allStepsDone = isNamaValid && isTeleponValid && isEmailValid && isJumlahValid && isTanggalValid && isSesiValid;

  // Dynamic Quick Dates: Generates upcoming open weekdays (Monday-Friday)
  const quickDates = useMemo(() => {
    const list: { label: string; date: string; dayName: string; dayDate: string; disabled: boolean }[] = [];
    const now = new Date();
    
    for (let i = 0; i < 8; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isWeekend = isWeekendClosed(dateStr);
      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
      const dayDate = `${d.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d)}`;
      
      let label = `${dayName}, ${dayDate}`;
      if (i === 0) label = `Hari Ini`;
      else if (i === 1) label = `Besok`;

      if (list.length < 4 && !isWeekend) {
        list.push({
          label,
          dayName,
          dayDate,
          date: dateStr,
          disabled: false,
        });
      }
    }
    return list;
  }, []);

  const updateCounts = (dewasa: number, mahasiswa: number, manca: number = 0) => {
    const d = Math.max(0, dewasa);
    const m = Math.max(0, mahasiswa);
    const w = Math.max(0, manca);
    const total = d + m + w;
    let kat: CategoryType = 'Umum';
    if (d > 0 && m > 0) kat = 'Campuran (Dewasa & Mahasiswa)';
    else if (w > 0) kat = 'Mancanegara';
    else if (m > 0) kat = 'Pelajar/Mahasiswa';
    else kat = 'Umum';

    const rincianParts: string[] = [];
    if (d > 0) rincianParts.push(`${d} Dewasa`);
    if (m > 0) rincianParts.push(`${m} Mahasiswa`);
    if (w > 0) rincianParts.push(`${w} Mancanegara`);

    setFormData(prev => ({
      ...prev,
      jumlahDewasa: d,
      jumlahMahasiswa: m,
      jumlahMancanegara: w,
      jumlahOrang: total,
      kategori: kat,
      rincianPengunjung: rincianParts.join(', ') || '1 Dewasa'
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPengunjung < 1) {
      alert('Mohon tentukan minimal 1 orang pengunjung (Dewasa atau Mahasiswa).');
      return;
    }
    if (!formData.tanggalKunjungan) {
      alert('Mohon tentukan Tanggal Kunjungan Anda.');
      return;
    }
    if (isDateClosedWeekend) {
      alert('Museum Blambangan tutup pada hari Sabtu dan Minggu (Libur Akhir Pekan). Silakan pilih hari Senin s.d. Jumat.');
      return;
    }
    if (!isSesiValid) {
      alert('Mohon pilih Sesi Kunjungan (Pagi, Siang, atau Sore).');
      return;
    }
    if (!isNamaValid) {
      alert('Mohon isi Nama Lengkap pemesan terlebih dahulu (minimal 3 huruf).');
      return;
    }
    if (!isTeleponValid) {
      alert('Mohon isi Nomor WhatsApp / HP yang valid (10–13 digit nomor Indonesia, contoh: 081234567890).');
      return;
    }
    if (!isEmailValid) {
      alert('Mohon isi alamat Email pemesan yang valid (contoh: nama@email.com).');
      return;
    }
    setActiveView('user-summary');
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
                onClick={() => setActiveView('user-landing')}
                className="p-1.5 -ml-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Kembali ke Beranda"
              >
                <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                  Pemesanan Tiket Museum
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#E5C287] font-medium leading-none mt-0.5">
                  Museum Blambangan Banyuwangi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
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
              {/* Step 1: Active Pill */}
              <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#D4A359]/15 text-white font-bold border border-[#D4A359]/60 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E5BE7E] to-[#D4A359] text-[#081827] text-[11px] flex items-center justify-center font-black shrink-0 shadow-xs">
                  1
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Jadwal & Tiket</span>
              </div>

              {/* Step 2: Inactive */}
              <div className="flex items-center gap-2 py-1.5 px-2 text-slate-300 font-medium opacity-85">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <span className="text-xs sm:text-sm text-slate-300 tracking-tight truncate">Data Pemesan</span>
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

        {/* ================= FORM BODY ================= */}
        <form onSubmit={handleNext} className="flex-1 flex flex-col justify-between overflow-hidden">
          <main className="flex-1 px-3 sm:px-5 py-4 overflow-y-auto space-y-3.5 text-left">
            
            {/* BAGIAN 1: TANGGAL KUNJUNGAN (DIPERTAHANKAN SESUAI PERMINTAAN USER) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <label className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#092C48]" />
                  <span>Tanggal Kunjungan</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Senin – Jumat (07:30 – 16:00 WIB)
                </span>
              </div>

              {/* Quick Date Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickDates.map((qd) => {
                  const isSelected = formData.tanggalKunjungan === qd.date;
                  return (
                    <button
                      key={qd.date}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tanggalKunjungan: qd.date,
                          sesi: '' // reset session on date change
                        }));
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#092C48] bg-[#092C48] text-white font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className={`block text-[10px] uppercase font-bold ${isSelected ? 'text-[#D4A359]' : 'text-slate-400'}`}>
                        {qd.dayName}
                      </span>
                      <span className="block text-xs sm:text-sm font-extrabold mt-0.5">
                        {qd.dayDate}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Native Date Picker */}
              <div className="pt-0.5">
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={getTodayWIB()}
                    value={formData.tanggalKunjungan}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        tanggalKunjungan: newDate,
                        sesi: ''
                      }));
                    }}
                    className={`w-full px-3.5 h-10 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all cursor-pointer ${
                      isDateClosedWeekend
                        ? 'border-amber-400 ring-2 ring-amber-300/30'
                        : 'border-slate-200 focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15'
                    }`}
                  />
                  {isTanggalValid && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>

                {/* Weekend Closed Alert */}
                {isDateClosedWeekend && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-amber-900 space-y-1.5 animate-in fade-in">
                    <div className="flex items-start gap-1.5 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Layanan Loket Museum Blambangan</strong>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Layanan loket beroperasi hari <strong>Senin s.d. Jumat pukul 07:30 – 16:00 WIB</strong> (Sabtu & Minggu Libur).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextWeekday = getNextWeekdayDateStr();
                        setFormData(prev => ({ ...prev, tanggalKunjungan: nextWeekday, sesi: '' }));
                      }}
                      className="px-2.5 py-1 bg-[#092C48] hover:bg-[#071f33] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Gunakan Hari Kerja Terdekat (Senin)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* BAGIAN 2: PILIH SESI KUNJUNGAN (MODEL NORMAL SEPERTI DI DASHBOARD & PORTAL) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#092C48]" />
                    <span>Pilih Sesi Kunjungan</span>
                    <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">
                    Pilih salah satu jadwal kunjungan museum di bawah ini
                  </p>
                </div>
                {ishomaConfig && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    ISHOMA: {ishomaConfig.label}
                  </span>
                )}
              </div>

              {/* Normal 3-Card Grid for Sessions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sessionsConfig.map((sesi) => {
                  const fullSesiString = `${sesi.label} (${sesi.time})`;
                  const currentSelectedId = extractSessionId(formData.sesi);
                  const isSelected = currentSelectedId === sesi.id;
                  const isPassed = isSessionTimePassed(sesi, formData.tanggalKunjungan);
                  const quotaStats = getSessionQuotaStats(sesi.id, formData.tanggalKunjungan, bookings);
                  const isQuotaFull = quotaStats.isFull;
                  const isNotEnough = totalPengunjung > quotaStats.remaining;
                  const isDisabled = isPassed || isQuotaFull || isNotEnough || isDateClosedWeekend;

                  return (
                    <button
                      key={sesi.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isDisabled) return;
                        const targetDate = formData.tanggalKunjungan || getNextWeekdayDateStr();
                        if (isSelected) {
                          setFormData(prev => ({ ...prev, sesi: '' }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            tanggalKunjungan: targetDate, 
                            sesi: fullSesiString 
                          }));
                        }
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center min-h-[110px] cursor-pointer relative ${
                        isDisabled
                          ? 'border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed opacity-75'
                          : isSelected
                          ? 'border-[#092C48] bg-[#092C48] text-white shadow-md ring-2 ring-[#092C48]/30 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#092C48] hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      <div className="w-full text-left">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {sesi.label}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-white/20 text-[#D4A359]' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {sesi.subLabel}
                          </span>
                        </div>
                        <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                          {sesi.time}
                        </div>
                      </div>

                      <div className="mt-2.5 w-full flex justify-center">
                        {isPassed ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            ✕ Lewat Jam
                          </span>
                        ) : isQuotaFull ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            ⛔ Penuh
                          </span>
                        ) : isNotEnough ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            ⚠️ Sisa {quotaStats.remaining}
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Terpilih</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Sisa {quotaStats.remaining} Kuota
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sesi Confirmation Bar */}
              {extractSessionId(formData.sesi) && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-950 font-medium truncate mr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="truncate">Sesi terpilih: <strong className="font-bold">{formData.sesi}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sesi: '' }))}
                    className="text-xs font-semibold text-slate-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Ganti Sesi
                  </button>
                </div>
              )}
            </div>

            {/* BAGIAN 3: KATEGORI & JUMLAH PENGUNJUNG (MULTI-ROLE: DEWASA + MAHASISWA SEKALIGUS) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#092C48]" />
                    <span>Kategori & Jumlah Tiket</span>
                    <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">
                    Bisa memilih Mahasiswa dan Dewasa sekaligus dalam satu pemesanan
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {/* 1. Dewasa / Umum */}
                <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  jmlDewasa > 0 
                    ? 'border-[#092C48] bg-[#F7F9FC] shadow-2xs ring-1 ring-[#092C48]/20' 
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#092C48] text-white flex items-center justify-center shrink-0 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Dewasa / Umum
                        </span>
                        <span className="text-[10px] font-extrabold text-[#092C48] bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          Rp 7.500
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-500 block truncate">
                        Masyarakat umum & wisatawan domestik dewasa
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa - 1, jmlMahasiswa, jmlManca)}
                      disabled={jmlDewasa <= 0}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed select-none active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {jmlDewasa}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa + 1, jmlMahasiswa, jmlManca)}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer select-none active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Pelajar / Mahasiswa */}
                <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  jmlMahasiswa > 0 
                    ? 'border-[#092C48] bg-[#F7F9FC] shadow-2xs ring-1 ring-[#092C48]/20' 
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Pelajar / Mahasiswa
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Rp 5.000
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-500 block truncate">
                        Pelajar SD–SMA & Mahasiswa ber-KTM aktif
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa, jmlMahasiswa - 1, jmlManca)}
                      disabled={jmlMahasiswa <= 0}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed select-none active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {jmlMahasiswa}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa, jmlMahasiswa + 1, jmlManca)}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer select-none active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Wisatawan Mancanegara */}
                <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  jmlManca > 0 
                    ? 'border-[#092C48] bg-[#F7F9FC] shadow-2xs ring-1 ring-[#092C48]/20' 
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Wisatawan Mancanegara
                        </span>
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          Rp 20.000
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-500 block truncate">
                        Foreign / International visitors
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa, jmlMahasiswa, jmlManca - 1)}
                      disabled={jmlManca <= 0}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed select-none active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {jmlManca}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCounts(jmlDewasa, jmlMahasiswa, jmlManca + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer select-none active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal Pengunjung */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-500">Total Pengunjung: </span>
                  <span className="font-extrabold text-[#092C48]">{totalPengunjung} Orang</span>
                  {totalPengunjung > 0 && (
                    <span className="block text-[10.5px] text-slate-500">
                      ({formData.rincianPengunjung})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Subtotal:</span>
                  <span className="text-sm font-extrabold text-[#092C48]">
                    Rp {estimatedTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* BAGIAN 4: DETAIL PEMESAN & KONTAK (DIPERTAHANKAN SESUAI PERMINTAAN USER) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#092C48] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#092C48]" />
                    <span>Detail Pemesan & Kontak</span>
                    <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">
                    E-tiket barcode resmi akan dikirimkan ke kontak di bawah ini
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Wajib Diisi
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* 1. Nama Lengkap */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Masukkan nama lengkap sesuai identitas"
                      className="w-full pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isNamaValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* 2. Nomor WhatsApp / HP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Pola nomor Indonesia (10–13 digit)
                    </span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isTeleponValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.telepon && !isTeleponValid && (
                    <p className="text-[10.5px] text-amber-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Nomor harus berformat Indonesia aktif (10–13 digit angka).</span>
                    </p>
                  )}
                </div>

                {/* 3. Alamat Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isEmailValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* 4. Kota Asal */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Kota / Kabupaten Asal
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                      Opsional
                    </span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      placeholder="Contoh: Banyuwangi / Surabaya / Denpasar"
                      className="w-full pl-9 pr-3 h-10 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Jaminan Layanan Resmi */}
            <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                Pemesanan resmi dikelola oleh <strong>Dinas Kebudayaan & Pariwisata Kabupaten Banyuwangi</strong>.
              </p>
            </div>
          </main>

          {/* ================= FIXED BOTTOM ACTION BAR ================= */}
          <footer className="bg-white border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg shrink-0 z-20">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Total Fare */}
              <div className="text-left min-w-0">
                <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                  Total Retribusi ({totalPengunjung} org):
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[#092C48] tracking-tight block leading-tight">
                  Rp {estimatedTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[9.5px] text-slate-400 block font-normal">
                  Bebas biaya admin
                </span>
              </div>

              {/* Right: Proceed Button with Museum Palette */}
              <button
                type="submit"
                disabled={!allStepsDone}
                className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl transition-all select-none shrink-0 cursor-pointer ${
                  allStepsDone
                    ? 'bg-[#092C48] hover:bg-[#071f33] text-white shadow-md active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
                }`}
              >
                <span>Lanjut ke Ringkasan</span>
                <ArrowRight className="w-4 h-4 text-[#D4A359]" />
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
