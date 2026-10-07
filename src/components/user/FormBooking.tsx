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
  Lock,
  Sparkles
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { 
  isSessionTimePassed, 
  getSessionQuotaStats, 
  getTodayWIB,
  isWeekendClosed,
  getNextWeekdayDateStr,
  extractSessionId
} from '../../utils/sessionUtils';

export const FormBooking: React.FC = () => {
  const { setActiveView, formData, setFormData, bookings, sessionsConfig, ishomaConfig } = useBooking();

  const categories: { type: CategoryType; label: string; price: string; icon: React.ReactNode }[] = [
    {
      type: 'Pelajar/Mahasiswa',
      label: 'Pelajar / Mahasiswa',
      price: 'Rp 5.000 / orang',
      icon: <GraduationCap className="w-4 h-4 text-slate-700" />
    },
    {
      type: 'Umum',
      label: 'Umum',
      price: 'Rp 7.500 / orang',
      icon: <User className="w-4 h-4 text-slate-700" />
    },
    {
      type: 'Mancanegara',
      label: 'Mancanegara',
      price: 'Rp 20.000 / orang',
      icon: <Globe className="w-4 h-4 text-slate-700" />
    },
    {
      type: 'Pelajar Rombongan',
      label: 'Pelajar Rombongan',
      price: 'Rp 5.000 / orang',
      icon: <Users className="w-4 h-4 text-slate-700" />
    },
  ];

  // Individual Step Validity (Checking if field has valid data)
  const isStep1Valid = Boolean(formData.nama && formData.nama.trim().length >= 3);
  const isStep2Valid = Number(formData.jumlahOrang) >= 1;
  const isStep3Valid = Boolean(formData.telepon && formData.telepon.trim().length >= 8);
  const isStep4Valid = Boolean(formData.email && formData.email.includes('@') && formData.email.includes('.'));
  const isStep5Valid = Boolean(formData.alamat && formData.alamat.trim().length >= 3);
  const isStep6Valid = Boolean(formData.kategori);
  const isDateClosedWeekend = isWeekendClosed(formData.tanggalKunjungan);
  const isStep7Valid = Boolean(formData.tanggalKunjungan) && !isDateClosedWeekend;
  const isStep8Valid = Boolean(formData.sesi);

  // A step is considered "Done" if it's currently valid
  const isStep1Done = isStep1Valid;
  const isStep2Done = isStep2Valid;
  const isStep3Done = isStep3Valid;
  const isStep4Done = isStep4Valid;
  const isStep5Done = isStep5Valid;
  const isStep6Done = isStep6Valid;
  const isStep7Done = isStep7Valid;
  const isStep8Done = isStep8Valid;

  // Dynamic Quick Dates: Generates upcoming open weekdays (Monday-Friday)
  const quickDates = useMemo(() => {
    const list: { label: string; date: string; disabled: boolean; badge?: string }[] = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isWeekend = isWeekendClosed(dateStr);
      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
      const dayDate = d.getDate();
      const monthName = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d);
      
      let label = `${dayName}, ${dayDate} ${monthName}`;
      if (i === 0) label = `Hari Ini (${dayName})`;
      else if (i === 1) label = `Besok (${dayName})`;

      if (list.length < 3 && !isWeekend) {
        list.push({
          label,
          date: dateStr,
          disabled: false,
          badge: 'Buka'
        });
      }
    }
    return list;
  }, []);

  // ALL fields are freely accessible without rigid locks
  const isStep1Unlocked = true;
  const isStep2Unlocked = true;
  const isStep3Unlocked = true;
  const isStep4Unlocked = true;
  const isStep5Unlocked = true;
  const isStep6Unlocked = true;
  const isStep7Unlocked = true;
  const isStep8Unlocked = true;

  const allStepsDone = isStep1Done && isStep2Done && isStep3Done && isStep4Done && isStep5Done && isStep6Done && isStep7Done && isStep8Done;

  const completedCount = [
    isStep1Done,
    isStep2Done,
    isStep3Done,
    isStep4Done,
    isStep5Done,
    isStep6Done,
    isStep7Done,
    isStep8Done,
  ].filter(Boolean).length;

  const getCategoryPrice = (kategori: string) => {
    switch (kategori) {
      case 'Pelajar/Mahasiswa': return 5000;
      case 'Umum': return 7500;
      case 'Mancanegara': return 20000;
      case 'Pelajar Rombongan': return 5000;
      default: return 7500;
    }
  };

  const estimatedTotal = (formData.jumlahOrang || 1) * getCategoryPrice(formData.kategori || 'Umum');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Done) {
      alert('Langkah 1: Mohon isi Nama Pengunjung terlebih dahulu (minimal 3 huruf).');
      return;
    }
    if (!isStep2Done) {
      alert('Langkah 2: Mohon tentukan Jumlah Pengunjung minimal 1 orang.');
      return;
    }
    if (!isStep3Done) {
      alert('Langkah 3: Mohon isi Nomor WhatsApp pengunjung yang valid (minimal 8 digit).');
      return;
    }
    if (!isStep4Done) {
      alert('Langkah 4: Mohon isi alamat Email pengunjung yang valid (contoh: nama@email.com).');
      return;
    }
    if (!isStep5Done) {
      alert('Langkah 5: Mohon isi Alamat lengkap pengunjung.');
      return;
    }
    if (!isStep6Done) {
      alert('Langkah 6: Mohon pilih Kategori Kunjungan (Pelajar, Umum, Mancanegara, dll).');
      return;
    }
    if (!formData.tanggalKunjungan) {
      alert('Langkah 7: Mohon tentukan Tanggal Kunjungan Anda.');
      return;
    }
    if (isDateClosedWeekend) {
      alert('Museum Blambangan tutup pada hari Sabtu dan Minggu (Libur Akhir Pekan). Mohon pilih hari Senin s.d. Jumat.');
      return;
    }
    if (!isStep8Done) {
      alert('Langkah 8: Mohon pilih Sesi Kunjungan (Pagi, Siang, atau Sore).');
      return;
    }
    setActiveView('user-summary');
  };

  // Helper for consistent card styling across all steps
  const getCardClasses = (_stepNumber: number, isDone: boolean, _isUnlocked: boolean) => {
    if (isDone) {
      return 'bg-white border border-emerald-300/80 shadow-2xs ring-1 ring-emerald-500/10';
    }
    return 'bg-white border border-slate-200/90 hover:border-slate-300';
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: Compact & 100% full width on mobile, spacious card on desktop */}
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl min-h-screen sm:min-h-[820px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden">
        
        {/* Header Formulir (Langkah 1/5) */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 relative shrink-0">
          <div className="flex items-center gap-1.5 z-10 w-24 justify-start">
            <button
              onClick={() => setActiveView('user-landing')}
              className="p-1 -ml-1 text-slate-700 hover:text-black transition-colors cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Beranda
            </span>
          </div>

          {/* Perfectly Centered Logo */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <MuseumLogo variant="dark" className="h-7 sm:h-8 pointer-events-auto" />
          </div>

          <div className="flex items-center z-10 w-24 justify-end">
            <span className="text-xs font-bold text-[#092C48] bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
              Langkah 1/5
            </span>
          </div>
        </header>

        {/* Unified Form Container wrapping Scrollable Body and Docked Bottom Action Bar */}
        <form onSubmit={handleNext} className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable Form Body */}
          <main className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto space-y-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF3E0] border border-[#D4A359]/30 text-[#8B6E32] text-[10px] font-bold mb-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                  <span>The Sunrise of Java • Kab. Banyuwangi</span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Data Pengunjung
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Lengkapi 8 data pemesanan berikut untuk reservasi e-tiket resmi Museum Blambangan.
                </p>
              </div>
              <div className="w-10 h-10 shrink-0 opacity-20 pointer-events-none select-none hidden sm:block">
                <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Completion Tracker Banner */}
            <div className="bg-[#FAF7EE] border border-[#E9DFBE] rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#092C48]">
                  <span className="w-6 h-6 rounded-full bg-[#092C48] text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                    {completedCount}
                  </span>
                  <span className="text-xs sm:text-sm font-bold">Langkah {completedCount} dari 8 Terisi</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-[#E9DFBE]">
                  {Math.round((completedCount / 8) * 100)}%
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full bg-[#E5DCC5] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#16A34A] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(completedCount / 8) * 100}%` }}
                />
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5 leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Pengisian fleksibel. Anda dapat langsung memilih tanggal kunjungan & sesi terlebih dahulu sesuai rencana Anda.</span>
              </div>
            </div>

            {/* FORM FIELDS (STEPS 1 TO 8) */}
            <div className="space-y-3.5">
              
              {/* 1. Nama Pengunjung */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(1, isStep1Done, isStep1Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep1Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep1Done ? '✓' : '1'}
                    </span>
                    <span>Nama Pengunjung</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep1Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Min. 3 huruf
                    </span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap pemesan"
                    className="w-full pl-10 pr-3.5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                  />
                </div>
              </div>

              {/* 2. Jumlah Orang - Input Manual & Cepat */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(2, isStep2Done, isStep2Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep2Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep2Done ? '✓' : '2'}
                    </span>
                    <span>Jumlah Orang</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {formData.jumlahOrang >= 10 ? (
                    <span className="text-xs font-bold text-[#092C48] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#092C48]" />
                      <span>Rombongan ({formData.jumlahOrang} Orang)</span>
                    </span>
                  ) : isStep2Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Min. 1 orang
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Input manual jumlah pengunjung */}
                  <div className="relative flex-1">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      min={1}
                      max={500}
                      disabled={!isStep2Unlocked}
                      required
                      value={formData.jumlahOrang === 0 ? '' : formData.jumlahOrang}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                        setFormData({ 
                          ...formData, 
                          jumlahOrang: isNaN(val) ? 1 : Math.max(0, val) 
                        });
                      }}
                      onBlur={() => {
                        if (!formData.jumlahOrang || formData.jumlahOrang < 1) {
                          setFormData({ ...formData, jumlahOrang: 1 });
                        }
                      }}
                      placeholder="Contoh: 2, 15, 30..."
                      className="w-full pl-10 pr-14 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                      Orang
                    </span>
                  </div>

                  {/* Tombol tambah / kurang jumlah */}
                  <div className="h-11 flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      disabled={!isStep2Unlocked}
                      onClick={() => setFormData({
                        ...formData,
                        jumlahOrang: Math.max(1, (formData.jumlahOrang || 1) - 1)
                      })}
                      className="w-9 h-full flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Kurangi 1 orang"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <div className="w-[1px] h-5 bg-slate-200" />
                    <button
                      type="button"
                      disabled={!isStep2Unlocked}
                      onClick={() => setFormData({
                        ...formData,
                        jumlahOrang: (formData.jumlahOrang || 0) + 1
                      })}
                      className="w-9 h-full flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Tambah 1 orang"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
                  <span className="text-xs text-slate-400 font-medium shrink-0">Pilihan cepat:</span>
                  {[1, 2, 5, 10, 15, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={!isStep2Unlocked}
                      onClick={() => setFormData({ ...formData, jumlahOrang: num })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all select-none min-w-[34px] text-center ${
                        !isStep2Unlocked
                          ? 'opacity-40 cursor-not-allowed border-slate-200 bg-white text-slate-400'
                          : formData.jumlahOrang === num
                          ? 'bg-[#092C48] text-white border-[#092C48] shadow-2xs cursor-pointer'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Kontak Pengunjung (WhatsApp) */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(3, isStep3Done, isStep3Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep3Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep3Done ? '✓' : '3'}
                    </span>
                    <span>Kontak WhatsApp</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep3Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Min. 8 digit
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="Contoh: 0812xxxxxxxx"
                    className="w-full pl-10 pr-3.5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                  />
                </div>
              </div>

              {/* 4. Kontak Pengunjung (Email) */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(4, isStep4Done, isStep4Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep4Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep4Done ? '✓' : '4'}
                    </span>
                    <span>Kontak Email</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep4Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      nama@email.com
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-3.5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                  />
                </div>
              </div>

              {/* 5. Alamat */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(5, isStep5Done, isStep5Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep5Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep5Done ? '✓' : '5'}
                    </span>
                    <span>Alamat Lengkap</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep5Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Min. 3 huruf
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Masukkan alamat asal / domisili"
                    className="w-full pl-10 pr-3.5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                  />
                </div>
              </div>

              {/* 6. Kategori Kunjungan */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(6, isStep6Done, isStep6Unlocked)}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep6Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep6Done ? '✓' : '6'}
                    </span>
                    <span>Kategori Kunjungan</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep6Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Terpilih: {formData.kategori}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Pilih 1 kategori
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = formData.kategori === cat.type;
                    return (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => {
                          if (cat.type === 'Pelajar Rombongan' && (!formData.jumlahOrang || formData.jumlahOrang < 10)) {
                            setFormData({ ...formData, kategori: cat.type, jumlahOrang: 15 });
                          } else {
                            setFormData({ ...formData, kategori: cat.type });
                          }
                        }}
                        className={`rounded-2xl p-3 border text-center transition-all flex flex-col items-center justify-center gap-1 relative cursor-pointer ${
                          isSelected
                            ? 'border-[#092C48] bg-[#FAF7EE] ring-2 ring-[#092C48]/10 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Check badge at top right of selected card */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#092C48] text-white flex items-center justify-center shadow-2xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                          {cat.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                          {cat.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#092C48]">
                          {cat.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Tanggal Kunjungan */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(7, isStep7Done, isStep7Unlocked)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep7Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep7Done ? '✓' : '7'}
                    </span>
                    <span>Tanggal Kunjungan</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isStep7Done ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Terpilih: {formData.tanggalKunjungan}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Pilih tanggal
                    </span>
                  )}
                </div>

                {/* Quick Date Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-0.5">Pilihan Cepat:</span>
                  {quickDates.map((qd) => (
                    <button
                      key={qd.date}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tanggalKunjungan: qd.date,
                          sesi: '' // Reset session when date changes
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        formData.tanggalKunjungan === qd.date
                          ? 'bg-[#092C48] text-white border-[#092C48] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {qd.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                        sesi: '' // Reset session when date changes
                      }));
                    }}
                    className="w-full pl-10 pr-9 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 disabled:bg-slate-50 disabled:cursor-not-allowed cursor-pointer"
                  />
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {isDateClosedWeekend && (
                  <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed animate-in fade-in">
                    <span className="text-amber-600 font-bold shrink-0 text-base">⚠️</span>
                    <div>
                      <strong className="font-bold">Museum Blambangan Tutup pada Hari Sabtu & Minggu (Libur Akhir Pekan).</strong>
                      <p className="mt-1 text-slate-600 text-xs">
                        Jam operasional resmi: <strong>Senin – Jumat pukul 07:30 – 16:00 WIB</strong> (Istirahat {ishomaConfig?.label || '12:30 – 13:30 WIB'}). Silakan pilih tanggal pada hari kerja (Senin s.d. Jumat).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Pilih Sesi Kunjungan */}
              <div className={`p-3.5 rounded-2xl transition-all ${getCardClasses(8, isStep8Done, isStep8Unlocked)}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStep8Done ? 'bg-emerald-600 text-white' : 'bg-[#092C48] text-white'
                    }`}>
                      {isStep8Done ? '✓' : '8'}
                    </span>
                    <span>Pilih Sesi Kunjungan</span>
                    <span className="text-rose-500">*</span>
                  </label>

                  {isStep8Done && extractSessionId(formData.sesi) ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        ✓ Terpilih: {extractSessionId(formData.sesi)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, sesi: '' }));
                        }}
                        className="text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 px-2 py-0.5 rounded-md border border-rose-200 transition-all cursor-pointer flex items-center gap-0.5 shadow-2xs active:scale-95"
                        title="Batalkan pilihan sesi ini"
                      >
                        ✕ Batal
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                      Pilih 1 sesi
                    </span>
                  )}
                </div>

                {/* Tampilan Sesi Menyamping (3 Kolom Horizontal) */}
                <div className="grid grid-cols-3 gap-2">
                  {sessionsConfig.map((sesi) => {
                    const fullSesiString = `${sesi.label} (${sesi.time})`;
                    const currentSelectedId = extractSessionId(formData.sesi);
                    const isSelected = currentSelectedId === sesi.id;
                    const isPassed = isSessionTimePassed(sesi, formData.tanggalKunjungan);
                    const quotaStats = getSessionQuotaStats(sesi.id, formData.tanggalKunjungan, bookings);
                    const isQuotaFull = quotaStats.isFull;
                    const isNotEnough = formData.jumlahOrang > quotaStats.remaining;
                    const isDisabled = isPassed || isQuotaFull || isNotEnough;

                    return (
                      <button
                        key={sesi.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={(e) => {
                          e.stopPropagation();
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
                        className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center relative min-h-[105px] ${
                          isDisabled
                            ? 'border-slate-200 bg-slate-100/90 text-slate-400 cursor-not-allowed opacity-75'
                            : isSelected
                            ? 'border-[#092C48] bg-[#092C48] text-white font-bold shadow-md cursor-pointer ring-2 ring-[#092C48]/35'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#092C48] hover:bg-slate-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        {/* Tombol Cepat Batalkan di Pojok Kartu Terpilih */}
                        {isSelected && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, sesi: '' }));
                            }}
                            role="button"
                            tabIndex={0}
                            className="absolute -top-2 -right-1 bg-rose-600 hover:bg-rose-700 active:scale-90 text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 shadow-md flex items-center gap-0.5 cursor-pointer z-10 transition-transform"
                            title="Klik untuk membatalkan sesi ini"
                          >
                            ✕ Batal
                          </div>
                        )}

                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {sesi.label}
                            </span>
                            <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {sesi.subLabel}
                            </span>
                          </div>
                          <div className={`text-xs sm:text-sm mt-1 text-left leading-tight truncate font-semibold ${isSelected ? 'text-slate-100' : 'text-slate-700'}`}>
                            {sesi.time.replace(' WIB', '')}
                          </div>
                        </div>

                        <div className="mt-2.5 w-full flex justify-center">
                          {isPassed ? (
                            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                              ✕ Lewat Jam
                            </span>
                          ) : isQuotaFull ? (
                            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              ⛔ Penuh
                            </span>
                          ) : isNotEnough ? (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              ⚠️ Sisa {quotaStats.remaining}
                            </span>
                          ) : isSelected ? (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-white/25 text-white border-white/40 flex items-center gap-1">
                              ✓ Terpilih
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                              ✓ Sisa {quotaStats.remaining}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bar Konfirmasi Sesi Terpilih & Tombol Batal Cepat */}
                {extractSessionId(formData.sesi) && (
                  <div className="mt-3 p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-950 font-medium truncate mr-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="truncate">Sesi terpilih: <strong className="font-bold">{formData.sesi}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, sesi: '' }));
                      }}
                      className="text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 bg-white border border-rose-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 active:scale-95 shadow-2xs"
                      title="Batalkan pilihan sesi"
                    >
                      ✕ Batalkan Sesi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Navigasi dan tombol konfirmasi bawah */}
          <footer className="bg-white border-t border-slate-200/90 px-4 sm:px-6 py-3.5 pb-6 sm:pb-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0 z-20">
            <div className="flex items-center justify-between gap-3">
              
              {/* Left Info: Step Progress / Total Price */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs shadow-2xs transition-colors ${
                  allStepsDone 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#092C48] text-white'
                }`}>
                  {allStepsDone ? <Check className="w-4 h-4 stroke-[3]" /> : `${completedCount}/8`}
                </div>

                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {allStepsDone ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <span>✓</span> Data Lengkap (8/8)
                      </span>
                    ) : (
                      <span>Langkah {completedCount} dari 8 Selesai</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {formData.kategori ? (
                      <span>
                        Total: <strong className="text-[#092C48] font-black text-xs sm:text-sm">Rp {estimatedTotal.toLocaleString('id-ID')}</strong> ({formData.jumlahOrang} org)
                      </span>
                    ) : (
                      <span>Lengkapi data untuk lanjut</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Button: Lanjut ke Ringkasan */}
              <button
                type="submit"
                disabled={!allStepsDone}
                className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
                  allStepsDone
                    ? 'bg-[#092C48] hover:bg-[#071f33] text-white shadow-lg shadow-[#092C48]/25 active:scale-95 group'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-90'
                }`}
              >
                <span>Lanjut ke Ringkasan</span>
                <span className={`text-base font-bold transition-transform ${
                  allStepsDone ? 'text-[#DAB36E] group-hover:translate-x-1' : 'text-slate-400'
                }`}>
                  →
                </span>
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
