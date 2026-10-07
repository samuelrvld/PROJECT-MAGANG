import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  Building2, 
  CreditCard, 
  Clock, 
  Bell, 
  UserCog, 
  ChevronRight, 
  Save, 
  Check,
  Utensils,
  RotateCcw,
  CheckCircle2,
  UserPlus,
  Pencil,
  Trash2,
  Shield,
  Key,
  X,
  Search,
  Phone,
  Mail,
  UserCheck,
  UserX,
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import type { AdminUser, AdminRole } from '../../types';

export const AdminPengaturan: React.FC = () => {
  const { 
    sessionsConfig, 
    ishomaConfig, 
    updateAllSessions, 
    updateIshoma, 
    resetSchedule,
    admins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
    currentAdminUser
  } = useBooking();

  const [activeSection, setActiveSection] = useState<'info' | 'payment' | 'schedule' | 'notif' | 'admin'>('info');
  const [savedAlert, setSavedAlert] = useState(false);
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  // Admin Management State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState<'all' | AdminRole>('all');
  const [adminFeedback, setAdminFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    nama: '',
    username: '',
    email: '',
    pass: 'admin123',
    role: 'Verifikator' as AdminRole,
    nip: '',
    telepon: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif'
  });

  const openAddModal = () => {
    setEditingAdmin(null);
    setAdminForm({
      nama: '',
      username: '',
      email: '',
      pass: 'admin123',
      role: 'Verifikator',
      nip: '',
      telepon: '',
      status: 'Aktif'
    });
    setAdminModalOpen(true);
  };

  const openEditModal = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setAdminForm({
      nama: adm.nama,
      username: adm.username,
      email: adm.email,
      pass: adm.pass,
      role: adm.role,
      nip: adm.nip || '',
      telepon: adm.telepon || '',
      status: adm.status
    });
    setAdminModalOpen(true);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.nama.trim() || !adminForm.email.trim()) {
      setAdminFeedback({ type: 'error', message: 'Nama lengkap dan email resmi wajib diisi!' });
      return;
    }

    if (editingAdmin) {
      updateAdmin(editingAdmin.id, {
        nama: adminForm.nama.trim(),
        username: adminForm.username.trim() || adminForm.email.split('@')[0],
        email: adminForm.email.trim(),
        pass: adminForm.pass.trim() || editingAdmin.pass,
        role: adminForm.role,
        nip: adminForm.nip.trim() || undefined,
        telepon: adminForm.telepon.trim() || undefined,
        status: adminForm.status
      });
      setAdminFeedback({ type: 'success', message: `Data akun ${adminForm.nama} berhasil diperbarui!` });
    } else {
      addAdmin({
        nama: adminForm.nama.trim(),
        username: adminForm.username.trim() || adminForm.email.split('@')[0],
        email: adminForm.email.trim(),
        pass: adminForm.pass.trim() || 'admin123',
        role: adminForm.role,
        nip: adminForm.nip.trim() || undefined,
        telepon: adminForm.telepon.trim() || undefined,
        status: adminForm.status
      });
      setAdminFeedback({ type: 'success', message: `Akun admin baru ${adminForm.nama} berhasil ditambahkan!` });
    }

    setAdminModalOpen(false);
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleDeleteAdmin = (id: string) => {
    const res = deleteAdmin(id);
    if (res.success) {
      setAdminFeedback({ type: 'success', message: res.message });
      setDeleteConfirmId(null);
    } else {
      setAdminFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setAdminFeedback(null), 3500);
  };

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
    {
      id: 'admin' as const,
      title: 'Manajemen Admin',
      desc: 'Kelola akun admin',
      icon: <UserCog className="w-5 h-5 text-[#0F292F]" />
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

          {activeSection === 'admin' && (
            <div className="space-y-5">
              {/* Header with Title and Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-[#0F292F]" />
                    <span>Manajemen Pengguna & Akun Admin</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kelola hak akses petugas, tambah admin baru, ubah peran dan status akun.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F292F] hover:bg-[#18434D] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>Tambah Admin Baru</span>
                </button>
              </div>

              {/* Feedback Alert if any */}
              {adminFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
                    adminFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {adminFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium">{adminFeedback.message}</span>
                </div>
              )}

              {/* Summary Stats Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-[10px] text-slate-500 block">Total Petugas</span>
                  <span className="text-base font-bold text-slate-900">{admins.length}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-left">
                  <span className="text-[10px] text-indigo-700 block">Superadmin</span>
                  <span className="text-base font-bold text-indigo-900">
                    {admins.filter(a => a.role === 'Superadmin').length}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-left">
                  <span className="text-[10px] text-emerald-700 block">Verifikator & Loket</span>
                  <span className="text-base font-bold text-emerald-900">
                    {admins.filter(a => a.role === 'Verifikator' || a.role === 'Petugas Loket').length}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-left">
                  <span className="text-[10px] text-teal-700 block">Status Aktif</span>
                  <span className="text-base font-bold text-teal-900">
                    {admins.filter(a => a.status === 'Aktif').length}
                  </span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari admin (nama, username, email, NIP)..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20"
                  />
                  {adminSearch && (
                    <button
                      type="button"
                      onClick={() => setAdminSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={adminRoleFilter}
                  onChange={(e) => setAdminRoleFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                >
                  <option value="all">Semua Peran (Role)</option>
                  <option value="Superadmin">Superadmin</option>
                  <option value="Verifikator">Verifikator Loket</option>
                  <option value="Petugas Loket">Petugas Loket (POS)</option>
                  <option value="Keuangan">Bagian Keuangan</option>
                </select>
              </div>

              {/* List of Admins */}
              <div className="space-y-2.5">
                {admins
                  .filter((a) => {
                    const q = adminSearch.toLowerCase().trim();
                    const matchesQuery =
                      !q ||
                      a.nama.toLowerCase().includes(q) ||
                      a.email.toLowerCase().includes(q) ||
                      a.username.toLowerCase().includes(q) ||
                      (a.nip && a.nip.includes(q));
                    const matchesRole = adminRoleFilter === 'all' || a.role === adminRoleFilter;
                    return matchesQuery && matchesRole;
                  })
                  .map((adm) => {
                    const isCurrent = currentAdminUser?.id === adm.id;
                    const initials = adm.nama
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    const roleBadgeColor =
                      adm.role === 'Superadmin'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : adm.role === 'Verifikator'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : adm.role === 'Petugas Loket'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <div
                        key={adm.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          adm.status === 'Aktif'
                            ? 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                            : 'bg-slate-50/70 border-slate-200 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: Avatar & Info */}
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0F2D4A] border border-[#D4A359]/30 text-[#D4A359] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {initials}
                            </div>

                            <div className="space-y-0.5 text-left">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                                  {adm.nama}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                                    Anda
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                                  {adm.role}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 font-normal">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{adm.email}</span>
                                </span>
                                <span className="text-slate-300">•</span>
                                <span>@{adm.username}</span>
                                {adm.nip && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span>NIP: {adm.nip}</span>
                                  </>
                                )}
                                {adm.telepon && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      <span>{adm.telepon}</span>
                                    </span>
                                  </>
                                )}
                              </div>

                              {adm.terakhirLogin && (
                                <div className="text-[10px] text-slate-400 pt-0.5">
                                  Terakhir aktif: {adm.terakhirLogin}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Status Switch & Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {/* Toggle Status */}
                            <button
                              type="button"
                              onClick={() => toggleAdminStatus(adm.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                adm.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={`Klik untuk ubah ke ${adm.status === 'Aktif' ? 'Nonaktif' : 'Aktif'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                              <span>{adm.status}</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => openEditModal(adm)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Ubah Data Admin"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            {deleteConfirmId === adm.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                <span className="text-[10px] text-rose-700 font-bold px-1">Yakin?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdmin(adm.id)}
                                  className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                                >
                                  Ya
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-1.5 py-0.5 rounded text-slate-500 text-[10px] hover:bg-slate-200 cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(adm.id)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus Admin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Add / Edit Admin Modal */}
              {adminModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
                  onClick={() => setAdminModalOpen(false)}
                >
                  <div
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="bg-[#0F292F] text-white px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-[#D4A359]" />
                        <h4 className="text-sm font-bold">
                          {editingAdmin ? 'Ubah Data Akun Admin' : 'Tambah Akun Admin Baru'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdminModalOpen(false)}
                        className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={handleSaveAdmin} className="p-5 space-y-3.5 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nama Lengkap Petugas / Admin *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="misal: Budi Prasetyo, S.Sos"
                          value={adminForm.nama}
                          onChange={(e) => setAdminForm({ ...adminForm, nama: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Email Resmi Login *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="admin@museumblambangan.id"
                            value={adminForm.email}
                            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Username Login
                          </label>
                          <input
                            type="text"
                            placeholder="misal: budi_prasetyo"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Password Login {editingAdmin && '(Kosongkan jika tak diubah)'}
                          </label>
                          <input
                            type="text"
                            placeholder="Minimal 6 karakter"
                            value={adminForm.pass}
                            onChange={(e) => setAdminForm({ ...adminForm, pass: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Peran / Hak Akses (Role) *
                          </label>
                          <select
                            value={adminForm.role}
                            onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as AdminRole })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs font-semibold"
                          >
                            <option value="Superadmin">Superadmin (Akses Penuh)</option>
                            <option value="Verifikator">Verifikator Loket (Verifikasi Tiket)</option>
                            <option value="Petugas Loket">Petugas Loket (POS & Pintu Masuk)</option>
                            <option value="Keuangan">Bagian Keuangan (Laporan Retribusi)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            NIP Pegawai (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="19820412..."
                            value={adminForm.nip}
                            onChange={(e) => setAdminForm({ ...adminForm, nip: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            No. WhatsApp / Telepon
                          </label>
                          <input
                            type="text"
                            placeholder="081234567890"
                            value={adminForm.telepon}
                            onChange={(e) => setAdminForm({ ...adminForm, telepon: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F292F]/20 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Status Akun
                        </label>
                        <div className="flex items-center gap-4 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="adminStatus"
                              checked={adminForm.status === 'Aktif'}
                              onChange={() => setAdminForm({ ...adminForm, status: 'Aktif' })}
                              className="text-[#0F292F]"
                            />
                            <span className="text-emerald-700 font-bold">Aktif (Dapat Login)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="adminStatus"
                              checked={adminForm.status === 'Nonaktif'}
                              onChange={() => setAdminForm({ ...adminForm, status: 'Nonaktif' })}
                              className="text-[#0F292F]"
                            />
                            <span className="text-slate-500">Nonaktif (Diblokir Sementara)</span>
                          </label>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setAdminModalOpen(false)}
                          className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0F292F] hover:bg-[#18434D] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingAdmin ? 'Simpan Perubahan' : 'Tambah Admin'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
