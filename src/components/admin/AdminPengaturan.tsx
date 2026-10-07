import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  Building2, 
  CreditCard, 
  Clock, 
  Bell, 
  ChevronRight, 
  Save, 
  Check,
  Utensils,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const AdminPengaturan: React.FC = () => {
  const { 
    sessionsConfig, 
    ishomaConfig, 
    updateAllSessions, 
    updateIshoma, 
    resetSchedule
  } = useBooking();

  const [activeSection, setActiveSection] = useState<'info' | 'payment' | 'schedule' | 'notif'>('info');
  const [savedAlert, setSavedAlert] = useState(false);
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  // Editable settings
  const [museumName, setMuseumName] = useState('Museum Blambangan Banyuwangi');
  const [museumAddress, setMuseumAddress] = useState('Jl. Jenderal Ahmad Yani No. 78, Taman Baru, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416');
  const [priceUmum, setPriceUmum] = useState('7500');
  const [pricePelajar, setPricePelajar] = useState('5000');
  const [priceForeign, setPriceForeign] = useState('20000');
  const [pricePelajarRombongan, setPricePelajarRombongan] = useState('5000');

  // Schedule & ISHOMA editable state
  const [localSessions, setLocalSessions] = useState(sessionsConfig);
  const [localIshomaStart, setLocalIshomaStart] = useState(
    `${String(ishomaConfig.startHour).padStart(2, '0')}:${String(ishomaConfig.startMinute).padStart(2, '0')}`
  );
  const [localIshomaEnd, setLocalIshomaEnd] = useState(
    `${String(ishomaConfig.endHour).padStart(2, '0')}:${String(ishomaConfig.endMinute).padStart(2, '0')}`
  );

  useEffect(() => {
    setLocalSessions(sessionsConfig);
    setLocalIshomaStart(
      `${String(ishomaConfig.startHour).padStart(2, '0')}:${String(ishomaConfig.startMinute).padStart(2, '0')}`
    );
    setLocalIshomaEnd(
      `${String(ishomaConfig.endHour).padStart(2, '0')}:${String(ishomaConfig.endMinute).padStart(2, '0')}`
    );
  }, [sessionsConfig, ishomaConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const rawStart = localIshomaStart.split(':').map(Number);
    const rawEnd = localIshomaEnd.split(':').map(Number);

    const safeStartH = Number.isNaN(rawStart[0]) ? 12 : rawStart[0];
    const safeStartM = Number.isNaN(rawStart[1]) ? 0 : rawStart[1];
    const safeEndH = Number.isNaN(rawEnd[0]) ? 13 : rawEnd[0];
    const safeEndM = Number.isNaN(rawEnd[1]) ? 0 : rawEnd[1];

    const fmtStart = `${String(safeStartH).padStart(2, '0')}:${String(safeStartM).padStart(2, '0')}`;
    const fmtEnd = `${String(safeEndH).padStart(2, '0')}:${String(safeEndM).padStart(2, '0')}`;

    updateIshoma({
      startHour: safeStartH,
      startMinute: safeStartM,
      endHour: safeEndH,
      endMinute: safeEndM,
      label: `${fmtStart} – ${fmtEnd} WIB`,
      time: `${fmtStart} - ${fmtEnd}`
    });

    const sanitizedSessions = localSessions.map(s => {
      const sStart = `${String(s.startHour).padStart(2, '0')}:${String(s.startMinute).padStart(2, '0')}`;
      const sEnd = `${String(s.endHour).padStart(2, '0')}:${String(s.endMinute).padStart(2, '0')}`;
      return {
        ...s,
        time: `${sStart} - ${sEnd} WIB`
      };
    });

    updateAllSessions(sanitizedSessions);
    setScheduleSavedMsg(true);
    setTimeout(() => setScheduleSavedMsg(false), 3000);
  };

  const handleResetSchedule = () => {
    if (confirm('Kembalikan jadwal sesi dan waktu ISHOMA ke pengaturan standar (Senin-Jumat 07:30-16:00, ISHOMA 12:30-13:30)?')) {
      resetSchedule();
      setScheduleSavedMsg(true);
      setTimeout(() => setScheduleSavedMsg(false), 3000);
    }
  };

  const sections = [
    {
      id: 'info' as const,
      title: 'Informasi Museum',
      desc: 'Kelola data dan profil museum',
      icon: <Building2 className="w-5 h-5 text-[#0F292F]" />
    },
    {
      id: 'payment' as const,
      title: 'Metode Pembayaran',
      desc: 'Konfigurasi QRIS dan pembayaran',
      icon: <CreditCard className="w-5 h-5 text-[#0F292F]" />
    },
    {
      id: 'schedule' as const,
      title: 'Jadwal Kunjungan',
      desc: 'Atur sesi dan jam operasional',
      icon: <Clock className="w-5 h-5 text-[#0F292F]" />
    },
    {
      id: 'notif' as const,
      title: 'Notifikasi',
      desc: 'Pengaturan notifikasi sistem',
      icon: <Bell className="w-5 h-5 text-[#0F292F]" />
    },
  ];

  return (
    <AdminLayout 
      title="Pengaturan Sistem" 
      subtitle="Konfigurasi preferensi sistem, operasional, dan data museum."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Kolom Kiri: Menu Pengaturan */}
        <div className="md:col-span-5 space-y-3">
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                activeSection === sec.id
                  ? 'bg-white border-[#0F292F] ring-2 ring-[#0F292F]/10'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {sec.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {sec.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === sec.id ? 'text-[#0F292F] translate-x-1' : 'text-slate-300'}`} />
            </div>
          ))}
        </div>

        {/* Right Column: Setting Detail Editor */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          {savedAlert && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}

          {activeSection === 'info' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Informasi & Profil Museum
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Museum
                </label>
                <input
                  type="text"
                  value={museumName}
                  onChange={(e) => setMuseumName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={museumAddress}
                  onChange={(e) => setMuseumAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarif Pelajar / Mahasiswa (Rp)
                  </label>
                  <input
                    type="number"
                    value={pricePelajar}
                    onChange={(e) => setPricePelajar(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarif Pelajar Rombongan (Rp)
                  </label>
                  <input
                    type="number"
                    value={pricePelajarRombongan}
                    onChange={(e) => setPricePelajarRombongan(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarif Umum (Rp)
                  </label>
                  <input
                    type="number"
                    value={priceUmum}
                    onChange={(e) => setPriceUmum(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarif Mancanegara (Rp)
                  </label>
                  <input
                    type="number"
                    value={priceForeign}
                    onChange={(e) => setPriceForeign(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F292F] hover:bg-[#18434D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}

          {activeSection === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Metode Pembayaran QRIS
              </h3>
              <p className="text-xs text-slate-500">
                Konfigurasi barcode QRIS statis & dinamis untuk transaksi tiket online.
              </p>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Merchant:</span>
                  <span className="font-bold text-slate-800">MUSEUM BLAMBANGAN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NMID / Merchant ID:</span>
                  <span className="font-semibold text-slate-800">ID2024326864723 (Terminal A01)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Penampung Resmi:</span>
                  <span className="font-bold text-blue-800">Bank Jatim (PT BPD Jawa Timur)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Rekening PAD:</span>
                  <span className="font-mono font-bold text-slate-800">0021005380</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Atas Nama Rekening:</span>
                  <span className="font-bold text-slate-800">DISBUDPAR KAB BANYUWANGI</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Status Gateway:</span>
                  <span className="font-bold text-emerald-600">● Aktif Permanen / Siap Pakai</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'schedule' && (
            <form onSubmit={handleSaveSchedule} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Jadwal Sesi Kunjungan & Waktu ISHOMA
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuaikan jam sesi operasional, kuota per sesi, dan waktu istirahat (ISHOMA).
                  </p>
                </div>
                {scheduleSavedMsg && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Jadwal Berhasil Disimpan!
                  </span>
                )}
              </div>

              {/* CARD 1: Pengaturan Waktu ISHOMA (Istirahat Sholat Makan) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">Waktu ISHOMA (Istirahat)</span>
                      <span className="text-[11px] text-amber-800/80">Museum tutup sementara saat ISHOMA</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs font-mono">
                    {localIshomaStart} – {localIshomaEnd} WIB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Jam Mulai ISHOMA
                    </label>
                    <input
                      type="time"
                      value={localIshomaStart}
                      onChange={(e) => setLocalIshomaStart(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F292F]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Jam Selesai ISHOMA
                    </label>
                    <input
                      type="time"
                      value={localIshomaEnd}
                      onChange={(e) => setLocalIshomaEnd(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F292F]"
                    />
                  </div>
                </div>

                {/* Quick Presets for Ishoma */}
                <div className="pt-1">
                  <span className="text-[10px] text-amber-900/80 font-medium block mb-1">Pilihan Cepat Waktu ISHOMA:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '12:00 – 13:00 (1 Jam)', start: '12:00', end: '13:00' },
                      { label: '12:30 – 13:30 (Standar)', start: '12:30', end: '13:30' },
                      { label: '11:30 – 12:30', start: '11:30', end: '12:30' },
                      { label: '13:00 – 14:00', start: '13:00', end: '14:00' }
                    ].map(preset => {
                      const isActive = localIshomaStart === preset.start && localIshomaEnd === preset.end;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setLocalIshomaStart(preset.start);
                            setLocalIshomaEnd(preset.end);
                          }}
                          className={`text-[10.5px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-xs'
                              : 'bg-white hover:bg-amber-100/60 text-amber-950 border-amber-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: Pengaturan Sesi Kunjungan (Sesi I, Sesi II, Sesi III) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0F292F]" />
                    <span>Daftar Sesi Kunjungan Resmi</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Kuota standar: 100 orang/sesi</span>
                </div>

                <div className="space-y-3">
                  {localSessions.map((s, index) => {
                    const startStr = `${String(s.startHour).padStart(2, '0')}:${String(s.startMinute).padStart(2, '0')}`;
                    const endStr = `${String(s.endHour).padStart(2, '0')}:${String(s.endMinute).padStart(2, '0')}`;

                    return (
                      <div key={s.id} className="p-3.5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#092C48] bg-slate-100 px-2 py-0.5 rounded-lg">
                              {s.id}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {s.subLabel}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {s.time}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div>
                            <label className="text-[10.5px] text-slate-500 block mb-1">Jam Mulai</label>
                            <input
                              type="time"
                              value={startStr}
                              onChange={(e) => {
                                const [h, m] = e.target.value.split(':').map(Number);
                                setLocalSessions(prev => prev.map((item, idx) => {
                                  if (idx !== index) return item;
                                  const endFormatted = `${String(item.endHour).padStart(2, '0')}:${String(item.endMinute).padStart(2, '0')}`;
                                  return {
                                    ...item,
                                    startHour: h,
                                    startMinute: m,
                                    time: `${e.target.value} - ${endFormatted} WIB`
                                  };
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] text-slate-500 block mb-1">Jam Selesai</label>
                            <input
                              type="time"
                              value={endStr}
                              onChange={(e) => {
                                const [h, m] = e.target.value.split(':').map(Number);
                                setLocalSessions(prev => prev.map((item, idx) => {
                                  if (idx !== index) return item;
                                  const startFormatted = `${String(item.startHour).padStart(2, '0')}:${String(item.startMinute).padStart(2, '0')}`;
                                  return {
                                    ...item,
                                    endHour: h,
                                    endMinute: m,
                                    time: `${startFormatted} - ${e.target.value} WIB`
                                  };
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] text-slate-500 block mb-1">Maks. Kuota</label>
                            <input
                              type="number"
                              min="10"
                              max="500"
                              value={s.maxQuota}
                              onChange={(e) => {
                                const q = Number(e.target.value) || 100;
                                setLocalSessions(prev => prev.map((item, idx) => idx === index ? { ...item, maxQuota: q } : item));
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetSchedule}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F292F] hover:bg-[#18434D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Pengaturan Jadwal & ISHOMA</span>
                </button>
              </div>
            </form>
          )}

          {activeSection === 'notif' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Pengaturan Notifikasi Sistem
              </h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F292F]" />
                  <span>Notifikasi bukti pembayaran baru ke WhatsApp admin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F292F]" />
                  <span>Kirim email otomatis saat tiket terbit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#0F292F]" />
                  <span>Kirim email alasan penolakan jika bukti tidak sesuai</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
