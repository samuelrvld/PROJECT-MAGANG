import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Users,
  Shield,
  KeyRound,
  ExternalLink,
  Check,
  Lock
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import type { AdminUser, AdminRole } from '../../types';
import { INITIAL_ADMINS } from '../../data/mockData';
import { PERMISSION_MATRIX, ROLE_CONFIGS } from '../../utils/rbac';

export const AdminManajemenPetugas: React.FC = () => {
  const { 
    admins, 
    addAdmin, 
    updateAdmin, 
    deleteAdmin, 
    toggleAdminStatus, 
    currentAdminUser,
    loginAdmin
  } = useBooking();

  const [activeTab, setActiveTab] = useState<'anggota' | 'matriks'>('anggota');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    prodi: 'D4 Teknologi Rekayasa Perangkat Lunak',
    username: '',
    email: '',
    pass: 'admin123',
    role: 'Verifikator' as AdminRole,
    status: 'Aktif' as 'Aktif' | 'Nonaktif'
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    setFormData({
      nama: '',
      nim: '',
      prodi: 'D4 Teknologi Rekayasa Perangkat Lunak',
      username: '',
      email: '',
      pass: 'admin123',
      role: 'Verifikator',
      status: 'Aktif'
    });
    setAdminModalOpen(true);
  };

  const openEditModal = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setFormData({
      nama: adm.nama,
      nim: adm.nim || adm.nip || '',
      prodi: adm.prodi || 'D4 Teknologi Rekayasa Perangkat Lunak',
      username: adm.username,
      email: adm.email,
      pass: adm.pass,
      role: adm.role,
      status: adm.status
    });
    setAdminModalOpen(true);
  };

  const handleToggleStatus = (adm: AdminUser) => {
    const nextStatus = adm.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    toggleAdminStatus(adm.id);
    showNotification('success', `Status ${adm.nama} berhasil diubah menjadi ${nextStatus}.`);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim() || !formData.email.trim() || !formData.username.trim()) {
      showNotification('error', 'Nama, Email, dan Username wajib diisi.');
      return;
    }

    if (editingAdmin) {
      updateAdmin(editingAdmin.id, {
        nama: formData.nama.trim(),
        nim: formData.nim.trim(),
        prodi: formData.prodi.trim(),
        nip: formData.nim.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        pass: formData.pass || editingAdmin.pass,
        role: formData.role,
        status: formData.status
      });
      showNotification('success', `Akun ${formData.nama} berhasil diperbarui.`);
    } else {
      const exists = admins.some(
        a => a.email.toLowerCase() === formData.email.trim().toLowerCase() ||
             a.username.toLowerCase() === formData.username.trim().toLowerCase()
      );
      if (exists) {
        showNotification('error', 'Email atau Username sudah digunakan.');
        return;
      }

      addAdmin({
        nama: formData.nama.trim(),
        nim: formData.nim.trim(),
        prodi: formData.prodi.trim(),
        nip: formData.nim.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        pass: formData.pass || 'admin123',
        role: formData.role,
        status: formData.status
      });
      showNotification('success', `Petugas baru ${formData.nama} berhasil didaftarkan.`);
    }

    setAdminModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const res = deleteAdmin(id);
    if (res.success) {
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setDeleteConfirmId(null);
  };

  const handleResetToGroup = () => {
    if (window.confirm('Reset data akun kembali ke susunan awal 4 anggota kelompok magang D4 TRPL?')) {
      localStorage.setItem('mb_admin_users', JSON.stringify(INITIAL_ADMINS));
      localStorage.setItem('mb_current_admin', JSON.stringify(INITIAL_ADMINS[0]));
      window.location.reload();
    }
  };

  const handleSwitchUser = (adm: AdminUser) => {
    loginAdmin(adm.email, adm.pass);
    showNotification('success', `Sesi aktif dialihkan ke: ${adm.nama} (${adm.role})`);
  };

  return (
    <AdminLayout
      title="Manajemen Petugas"
      subtitle="Pengaturan Akun Tim Magang D4 TRPL & Matriks Batas Hak Akses"
    >
      <div className="space-y-5 max-w-6xl mx-auto">

        {/* ── NOTIFIKASI FEEDBACK ── */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-rose-600 text-white border-rose-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-200" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white p-1">✕</button>
          </div>
        )}

        {/* ── TOP ACTION BAR: TABS & ACTION BUTTONS (SEDERHANA & BERSIH) ── */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Simple Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('anggota')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'anggota'
                  ? 'bg-white text-[#092C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Daftar Petugas ({admins.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matriks')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'matriks'
                  ? 'bg-white text-[#092C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Batas Hak Akses (RBAC)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleResetToGroup}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset ke susunan awal tim magang"
            >
              <RotateCcw className="w-3 h-3 text-[#D4A359]" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="px-3.5 py-2 bg-[#092C48] hover:bg-[#123A5E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Tambah Petugas</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: DAFTAR ANGGOTA TIM (TABEL SEDERHANA & BERSIH) ── */}
        {activeTab === 'anggota' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nama Petugas</th>
                    <th className="py-3 px-4">NIM / Akun</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Sesi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((adm) => {
                    const isCurrent = currentAdminUser?.id === adm.id || currentAdminUser?.email === adm.email;
                    const roleConfig = ROLE_CONFIGS[adm.role] || ROLE_CONFIGS['Verifikator'];

                    return (
                      <tr 
                        key={adm.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrent ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Nama & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#092C48] text-[#D4A359] font-black text-xs flex items-center justify-center shrink-0">
                              {adm.nama.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{adm.nama}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    Anda
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">{adm.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* NIM / Username */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {adm.nim || adm.nip || '3623583020--'}
                          </span>
                          <span className="text-[10.5px] text-slate-400 block mt-0.5">@{adm.username}</span>
                        </td>

                        {/* Peran / Role */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${roleConfig.badgeColor}`}>
                            {adm.role}
                          </span>
                        </td>

                        {/* Status Aktif */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(adm)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                              adm.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Klik untuk ubah status aktif/nonaktif"
                          >
                            ● {adm.status}
                          </button>
                        </td>

                        {/* Sesi Switcher */}
                        <td className="py-3.5 px-4 text-center">
                          {isCurrent ? (
                            <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                              Aktif Sekarang
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSwitchUser(adm)}
                              className="text-[10.5px] font-semibold text-[#092C48] hover:text-[#D4A359] hover:underline cursor-pointer"
                            >
                              Ganti ke Sesi Ini
                            </button>
                          )}
                        </td>

                        {/* Aksi Edit & Hapus */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(adm)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                              title="Edit Petugas"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {deleteConfirmId === adm.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(adm.id)}
                                  className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Ya
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(adm.id)}
                                disabled={adm.role === 'Superadmin' && admins.filter(a => a.role === 'Superadmin').length <= 1}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Hapus Petugas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50/70 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Program Studi D4 Teknologi Rekayasa Perangkat Lunak • Politeknik Negeri Banyuwangi</span>
              <span className="font-semibold text-slate-700">Total: 4 Petugas Terdaftar</span>
            </div>
          </div>
        )}

        {/* ── TAB 2: MATRIKS BATAS HAK AKSES PERAN (RBAC) ── */}
        {activeTab === 'matriks' && (
          <div className="space-y-4">
            {/* Penjelasan Singkat */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4A359]" />
                <span>Aturan Batas Hak Akses (Role-Based Access Control)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Setiap peran memiliki batasan hak akses yang tegas sesuai fungsi operasional masing-masing untuk menjaga integritas data dan keamanan sistem retribusi.
              </p>
            </div>

            {/* Tabel Matriks Hak Akses */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-600">
                      <th className="py-3 px-4 w-1/3">Modul / Fitur Sistem</th>
                      <th className="py-3 px-3 text-center">
                        <span className="block font-bold text-indigo-700">Superadmin</span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Fitria Ayu P.</span>
                      </th>
                      <th className="py-3 px-3 text-center">
                        <span className="block font-bold text-emerald-700">Verifikator</span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Syifa Kharisma</span>
                      </th>
                      <th className="py-3 px-3 text-center">
                        <span className="block font-bold text-sky-700">Petugas Loket</span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Rofi Nazar A.</span>
                      </th>
                      <th className="py-3 px-3 text-center">
                        <span className="block font-bold text-amber-700">Keuangan</span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Samuel Rivaldo</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PERMISSION_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block">{row.modul}</span>
                          <span className="text-[10.5px] text-slate-400 block">{row.deskripsi}</span>
                        </td>
                        
                        {/* Superadmin */}
                        <td className="py-3 px-3 text-center">
                          {row.superadmin ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> Diizinkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                              <Lock className="w-3 h-3" /> Dibatasi
                            </span>
                          )}
                        </td>

                        {/* Verifikator */}
                        <td className="py-3 px-3 text-center">
                          {row.verifikator ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> Diizinkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-50/60 px-2 py-0.5 rounded-md">
                              <Lock className="w-3 h-3" /> Dibatasi
                            </span>
                          )}
                        </td>

                        {/* Petugas Loket */}
                        <td className="py-3 px-3 text-center">
                          {row.petugasLoket ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> Diizinkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-50/60 px-2 py-0.5 rounded-md">
                              <Lock className="w-3 h-3" /> Dibatasi
                            </span>
                          )}
                        </td>

                        {/* Keuangan */}
                        <td className="py-3 px-3 text-center">
                          {row.keuangan ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> Diizinkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-50/60 px-2 py-0.5 rounded-md">
                              <Lock className="w-3 h-3" /> Dibatasi
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL TAMBAH / EDIT SEDERHANA ── */}
        {adminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-[#092C48] text-white p-4 flex items-center justify-between">
                <span className="font-bold text-sm">
                  {editingAdmin ? 'Edit Data Petugas' : 'Tambah Petugas Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="text-slate-300 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAdmin} className="p-4 sm:p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Fitria Ayu Pratiwi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#092C48]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIM Mahasiswa</label>
                    <input
                      type="text"
                      required
                      value={formData.nim}
                      onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                      placeholder="362358302016"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Peran (Role)</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none"
                    >
                      <option value="Superadmin">Superadmin</option>
                      <option value="Verifikator">Verifikator</option>
                      <option value="Petugas Loket">Petugas Loket</option>
                      <option value="Keuangan">Keuangan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="fitria_pratiwi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      value={formData.pass}
                      onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                      placeholder="Default: admin123"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@museumblambangan.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Keaktifan Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none"
                  >
                    <option value="Aktif">● Aktif (Dapat Login & Bertugas)</option>
                    <option value="Nonaktif">○ Nonaktif (Akses Ditangguhkan)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#092C48] text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
