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
  AlertCircle
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

  const categories: { type: CategoryType; label: string; subLabel: string; price: string; icon: React.ReactNode }[] = [
    {
      type: 'Pelajar/Mahasiswa',
      label: 'Pelajar / Mahasiswa',
      subLabel: 'Individu (1–9 org)',
      price: 'Rp 5.000 / org',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />
    },
    {
      type: 'Umum',
      label: 'Pengunjung Umum',
      subLabel: 'Domestik & Keluarga',
      price: 'Rp 7.500 / org',
      icon: <User className="w-4 h-4 text-blue-600" />
    },
    {
      type: 'Mancanegara',
      label: 'Wisatawan Mancanegara',
      subLabel: 'Foreign Tourist',
      price: 'Rp 20.000 / org',
      icon: <Globe className="w-4 h-4 text-purple-600" />
    },
    {
      type: 'Pelajar Rombongan',
      label: 'Pelajar Rombongan',
      subLabel: 'Studi Tour (Min. 10)',
      price: 'Rp 5.000 / org',
      icon: <Users className="w-4 h-4 text-teal-600" />
    },
  ];

  // Individual Field Validity
  const isNamaValid = Boolean(formData.nama && formData.nama.trim().length >= 3);
  const isTeleponValid = isValidIndonesianPhone(formData.telepon);
  const isEmailValid = Boolean(formData.email && formData.email.includes('@') && formData.email.includes('.'));
  const isKategoriValid = Boolean(formData.kategori);
  const isJumlahValid = Number(formData.jumlahOrang) >= 1;
  const isDateClosedWeekend = isWeekendClosed(formData.tanggalKunjungan);
  const isTanggalValid = Boolean(formData.tanggalKunjungan) && !isDateClosedWeekend;
  const isSesiValid = Boolean(formData.sesi);

  // Grouped Progress Tracker (6 Core Fields)
  const coreFields = [
    isNamaValid,
    isTeleponValid,
    isEmailValid,
    isKategoriValid,
    isTanggalValid,
    isSesiValid,
  ];
  const completedFieldsCount = coreFields.filter(Boolean).length;
  const progressPercent = Math.round((completedFieldsCount / coreFields.length) * 100);
  const allStepsDone = completedFieldsCount === coreFields.length && isJumlahValid;

  // Dynamic Quick Dates: Generates upcoming open weekdays (Monday-Friday)
  const quickDates = useMemo(() => {
    const list: { label: string; date: string; disabled: boolean }[] = [];
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
        });
      }
    }
    return list;
  }, []);

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
    if (!isKategoriValid) {
      alert('Mohon pilih Kategori Kunjungan tiket Anda.');
      return;
    }
    if (!isJumlahValid) {
      alert('Mohon tentukan Jumlah Pengunjung minimal 1 orang.');
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
    setActiveView('user-summary');
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: Compact & 100% full width on mobile, spacious card on desktop */}
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl min-h-screen sm:min-h-[820px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden">
        
        {/* Header Formulir: Clean flow header without duplicate step numbers */}
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

          <div className="flex items-center z-10 w-28 justify-end">
            <span className="text-xs font-bold text-[#092C48] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Formulir Tiket
            </span>
          </div>
        </header>

        {/* Unified Form Body wrapping Scrollable Sections and Docked Footer */}
        <form onSubmit={handleNext} className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable Form Content */}
          <main className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto space-y-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  Pemesanan Tiket Museum
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Lengkapi data pemesan dan jadwal rencana kunjungan Anda di bawah ini.
                </p>
              </div>
            </div>

            {/* Indikator Kelengkapan Formulir */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#092C48]" />
                  <span>Kelengkapan Data Formulir</span>
                </span>
                <span className="font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 text-[11px]">
                  {progressPercent}% Terisi
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#092C48] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* ================= BAGIAN 1: DATA PEMESAN & KONTAK ================= */}
            <div className="border border-slate-200/90 rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-3.5">
              <div className="border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-extrabold text-[#092C48] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#092C48] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Data Pemesan & Kontak</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5 ml-8">
                  E-tiket resmi dan invoice akan dikirimkan ke WhatsApp & Email pemesan.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1.1 Nama Pengunjung */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Masukkan nama lengkap pemesan"
                      className="w-full pl-10 pr-9 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isNamaValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* 1.2 Nomor WhatsApp / HP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10.5px] text-slate-400">
                      Pola nomor Indonesia (10–13 digit)
                    </span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full pl-10 pr-9 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isTeleponValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.telepon && !isTeleponValid && (
                    <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Nomor harus diawali 08/628 dan terdiri dari 10–13 digit angka.</span>
                    </p>
                  )}
                </div>

                {/* 1.3 Alamat Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contoh: nama@email.com"
                      className="w-full pl-10 pr-9 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    {isEmailValid && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* 1.4 Kota / Kabupaten Asal (Opsional, menggantikan alamat panjang) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Kota / Kabupaten Asal
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                      Opsional
                    </span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      placeholder="Contoh: Banyuwangi / Surabaya / Denpasar"
                      className="w-full pl-10 pr-3.5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BAGIAN 2: RENCANA KUNJUNGAN & TIKET ================= */}
            <div className="border border-slate-200/90 rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-extrabold text-[#092C48] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#092C48] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>Rencana Kunjungan & Sesi</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5 ml-8">
                  Pilih kategori tiket, jumlah pengunjung, tanggal kedatangan, dan sesi kunjungan.
                </p>
              </div>

              {/* 2.1 Kategori Kunjungan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Kategori Tiket Pengunjung <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
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
                        className={`rounded-2xl p-3 border text-left transition-all relative cursor-pointer ${
                          isSelected
                            ? 'border-[#092C48] bg-[#F7F9FC] ring-2 ring-[#092C48]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#092C48] text-white flex items-center justify-center shadow-2xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center mb-1.5">
                          {cat.icon}
                        </div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {cat.label}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-none">
                          {cat.subLabel}
                        </div>
                        <div className="text-xs font-black text-[#092C48] mt-1.5">
                          {cat.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2.2 Jumlah Pengunjung */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Jumlah Pengunjung <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      min={1}
                      max={500}
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
                      placeholder="Contoh: 2, 10, 25..."
                      className="w-full pl-10 pr-14 h-11 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092C48] focus:ring-2 focus:ring-[#092C48]/15 transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                      Orang
                    </span>
                  </div>

                  {/* +/- buttons */}
                  <div className="h-11 flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        jumlahOrang: Math.max(1, (formData.jumlahOrang || 1) - 1)
                      })}
                      className="w-9 h-full flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer select-none active:scale-95"
                      title="Kurangi 1 orang"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <div className="w-[1px] h-5 bg-slate-200" />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        jumlahOrang: (formData.jumlahOrang || 0) + 1
                      })}
                      className="w-9 h-full flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer select-none active:scale-95"
                      title="Tambah 1 orang"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Quick preset chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">Cepat:</span>
                  {[1, 2, 5, 10, 15, 20, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, jumlahOrang: num })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        formData.jumlahOrang === num
                          ? 'bg-[#092C48] text-white border-[#092C48] shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2.3 Tanggal Kunjungan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Tanggal Kunjungan <span className="text-rose-500">*</span>
                </label>

                {/* Quick Date Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-0.5">Hari Kerja:</span>
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
                    className={`w-full px-3.5 h-11 bg-white border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 cursor-pointer transition-all ${
                      isDateClosedWeekend 
                        ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/15' 
                        : 'border-slate-200 focus:border-[#092C48] focus:ring-[#092C48]/15'
                    }`}
                  />
                  {isTanggalValid && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>

                {/* Weekend Closed Warning with Auto-Fix Helper */}
                {isDateClosedWeekend && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-left text-amber-900 animate-in fade-in">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-amber-600 font-bold shrink-0 text-base">⚠️</span>
                      <div>
                        <strong className="font-bold">Museum Blambangan Tutup pada Hari Sabtu & Minggu.</strong>
                        <p className="mt-0.5 text-slate-600 text-[11.5px] leading-relaxed">
                          Jam operasional loket resmi: <strong>Senin s.d. Jumat pukul 07:30 – 16:00 WIB</strong> (Istirahat {ishomaConfig?.label || '12:30 – 13:30 WIB'}).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextWeekday = getNextWeekdayDateStr();
                        setFormData(prev => ({ ...prev, tanggalKunjungan: nextWeekday, sesi: '' }));
                      }}
                      className="px-3 py-1.5 bg-[#092C48] hover:bg-[#071f33] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      Gunakan Hari Kerja Terdekat (Senin)
                    </button>
                  </div>
                )}
              </div>

              {/* 2.4 Sesi Kunjungan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Pilih Sesi Kunjungan <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {sessionsConfig.map((sesi) => {
                    const fullSesiString = `${sesi.label} (${sesi.time})`;
                    const currentSelectedId = extractSessionId(formData.sesi);
                    const isSelected = currentSelectedId === sesi.id;
                    const isPassed = isSessionTimePassed(sesi, formData.tanggalKunjungan);
                    const quotaStats = getSessionQuotaStats(sesi.id, formData.tanggalKunjungan, bookings);
                    const isQuotaFull = quotaStats.isFull;
                    const isNotEnough = formData.jumlahOrang > quotaStats.remaining;
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
                        className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center relative min-h-[105px] ${
                          isDisabled
                            ? 'border-slate-200 bg-slate-100/90 text-slate-400 cursor-not-allowed opacity-75'
                            : isSelected
                            ? 'border-[#092C48] bg-[#092C48] text-white font-bold shadow-md cursor-pointer ring-2 ring-[#092C48]/35'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#092C48] hover:bg-slate-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {sesi.label}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {sesi.subLabel}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 text-left leading-tight truncate font-semibold ${isSelected ? 'text-slate-100' : 'text-slate-700'}`}>
                            {sesi.time.replace(' WIB', '')}
                          </div>
                        </div>

                        <div className="mt-2 w-full flex justify-center">
                          {isPassed ? (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
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
                            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border bg-white/25 text-white border-white/40 flex items-center gap-1">
                              ✓ Terpilih
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                              ✓ Sisa {quotaStats.remaining}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sesi Confirmation Bar */}
                {extractSessionId(formData.sesi) && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-950 font-medium truncate mr-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      <span className="truncate">Sesi terpilih: <strong className="font-bold">{formData.sesi}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sesi: '' }))}
                      className="text-xs font-semibold text-slate-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Ganti Sesi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Docked Action Footer: Clean Total & Confirmation Button (No redundant step box) */}
          <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3.5 pb-6 sm:pb-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0 z-20">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Total Estimated Cost */}
              <div className="text-left min-w-0">
                <span className="text-[11px] text-slate-500 block leading-none">
                  Total Estimasi ({formData.jumlahOrang} orang):
                </span>
                <span className="text-base sm:text-lg font-black text-[#092C48] tracking-tight">
                  Rp {estimatedTotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Right: Proceed Button */}
              <button
                type="submit"
                disabled={!allStepsDone}
                className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all select-none shrink-0 ${
                  allStepsDone
                    ? 'bg-[#092C48] hover:bg-[#071f33] text-white shadow-lg shadow-[#092C48]/25 active:scale-95 cursor-pointer group'
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
