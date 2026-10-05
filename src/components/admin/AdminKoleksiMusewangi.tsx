import React, { useState, useMemo, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Trash2, 
  Compass, 
  Eye, 
  X, 
  Check, 
  Layers, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Languages, 
  Headphones, 
  Tag, 
  AlertTriangle,
  CheckCircle2,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import type { MusewangiArtifact, MusewangiCategory } from '../../types';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { MuseumLogo } from '../common/MuseumLogo';

const CATEGORIES: MusewangiCategory[] = [
  'Arkeologi',
  'Etnografi',
  'Historika',
  'Filologi',
  'Numismatika',
];

export const AdminKoleksiMusewangi: React.FC = () => {
  const { artifacts, addArtifact, updateArtifact, deleteArtifact, resetArtifacts } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingArtifact, setEditingArtifact] = useState<MusewangiArtifact | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [printArtifact, setPrintArtifact] = useState<MusewangiArtifact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'koleksi-label' | 'live-musewangi'>('koleksi-label');

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    noRegistrasi: '',
    kategori: 'Arkeologi' as MusewangiCategory,
    era: '',
    lokasiPameran: '',
    dimensi: '',
    gambarUrl: '',
    deskripsiId: '',
    deskripsiEn: '',
    deskripsiOsing: '',
    audioNarrative: '',
  });

  // Filtered artifacts
  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(art => {
      const matchCat = selectedCategory === 'all' || art.kategori === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQ = !q ||
        art.nama.toLowerCase().includes(q) ||
        art.noRegistrasi.toLowerCase().includes(q) ||
        art.id.toLowerCase().includes(q) ||
        art.era.toLowerCase().includes(q) ||
        art.lokasiPameran.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [artifacts, selectedCategory, searchQuery]);

  // Open Form for Adding New
  const handleOpenAdd = () => {
    setEditingArtifact(null);
    setFormData({
      nama: '',
      noRegistrasi: `0${Math.floor(Math.random() * 9 + 1)}.0${Math.floor(Math.random() * 9 + 1)}.MB.${new Date().getFullYear()}`,
      kategori: 'Arkeologi',
      era: '',
      lokasiPameran: 'Ruang Pamer Utama (Etalase A-01)',
      dimensi: '',
      gambarUrl: '/assets/slide-2-candi-macan-putih-hd.jpg',
      deskripsiId: '',
      deskripsiEn: '',
      deskripsiOsing: '',
      audioNarrative: '',
    });
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (art: MusewangiArtifact) => {
    setEditingArtifact(art);
    setFormData({
      nama: art.nama,
      noRegistrasi: art.noRegistrasi,
      kategori: art.kategori,
      era: art.era,
      lokasiPameran: art.lokasiPameran,
      dimensi: art.dimensi,
      gambarUrl: art.gambarUrl,
      deskripsiId: art.deskripsiId,
      deskripsiEn: art.deskripsiEn,
      deskripsiOsing: art.deskripsiOsing,
      audioNarrative: art.audioNarrative || '',
    });
    setIsFormOpen(true);
  };

  // Submit Add / Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.deskripsiId.trim()) {
      alert('Mohon isi nama koleksi dan narasi Bahasa Indonesia minimal.');
      return;
    }

    if (editingArtifact) {
      updateArtifact(editingArtifact.id, {
        nama: formData.nama,
        noRegistrasi: formData.noRegistrasi,
        kategori: formData.kategori,
        era: formData.era,
        lokasiPameran: formData.lokasiPameran,
        dimensi: formData.dimensi,
        gambarUrl: formData.gambarUrl,
        deskripsiId: formData.deskripsiId,
        deskripsiEn: formData.deskripsiEn || formData.deskripsiId,
        deskripsiOsing: formData.deskripsiOsing || formData.deskripsiId,
        audioNarrative: formData.audioNarrative || formData.deskripsiId,
      });
      setFeedbackMsg(`Artefak "${formData.nama}" berhasil diperbarui.`);
    } else {
      const created = addArtifact({
        nama: formData.nama,
        noRegistrasi: formData.noRegistrasi,
        kategori: formData.kategori,
        era: formData.era,
        lokasiPameran: formData.lokasiPameran,
        dimensi: formData.dimensi,
        gambarUrl: formData.gambarUrl,
        deskripsiId: formData.deskripsiId,
        deskripsiEn: formData.deskripsiEn || formData.deskripsiId,
        deskripsiOsing: formData.deskripsiOsing || formData.deskripsiId,
        audioNarrative: formData.audioNarrative || formData.deskripsiId,
      });
      setFeedbackMsg(`Artefak "${created.nama}" berhasil ditambahkan ke Musewangi.`);
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    deleteArtifact(id);
    setDeleteConfirmId(null);
    setFeedbackMsg('Koleksi berhasil dihapus dari sistem.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Print Label Action
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <AdminLayout
      title="Koleksi Musewangi"
      subtitle="Digitalisasi Cagar Budaya, Kurasi Narasi 3 Bahasa & Cetak Label QR Akrilik Showcase"
    >
      <div className="space-y-6">
        
        {/* Floating feedback alert */}
        {feedbackMsg && (
          <div className="p-4 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{feedbackMsg}</span>
            </span>
            <button onClick={() => setFeedbackMsg(null)} className="text-white/80 hover:text-white p-1">✕</button>
          </div>
        )}

        {/* ── CONNECTION BAR TO LIVE MUSEWANGI (PORT 8000) ── */}
        <div className="bg-[#092C48] text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white">
                  Terintegrasi dengan Proyek Musewangi (Port 8000)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Manajemen kurasi cagar budaya dan pencetakan label QR akrilik etalase museum.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminTab(prev => prev === 'live-musewangi' ? 'koleksi-label' : 'live-musewangi')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'live-musewangi'
                  ? 'bg-[#D4A359] text-[#092C48]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {adminTab === 'live-musewangi' ? 'Kembali ke Panel Kurator & Label' : 'Buka Live Admin Musewangi'}
            </button>

            <button
              type="button"
              onClick={() => window.open('http://127.0.0.1:8000/admin/koleksi', '_blank')}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Buka Admin Musewangi di Tab Baru"
            >
              <span>Tab Baru</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {adminTab === 'live-musewangi' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[78vh]">
            <iframe
              src="http://127.0.0.1:8000/admin/koleksi"
              className="w-full h-full border-0 bg-[#F8F5ED]"
              title="Admin Musewangi Live"
            />
          </div>
        ) : (
          <>
        {/* ── METRIC SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#092C48]/10 text-[#092C48] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Terdata
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {artifacts.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                Artefak Terkurasi
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Pilihan Bahasa
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                3 Bahasa
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                ID • EN • Basa Osing
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Audio Guide
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                100% Aktif
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold block">
                Web Speech Engine
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Label Akrilik
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Siap Cetak
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                Format Standar Pameran
              </span>
            </div>
          </div>
        </div>

        {/* ── ACTION BAR: SEARCH & FILTERS ── */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3">
          
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artefak, no reg, era..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-[#092C48] rounded-xl text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-44 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="py-2.5 px-4 bg-[#092C48] hover:bg-[#071f33] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4A359]" />
              <span>Tambah Koleksi</span>
            </button>
          </div>
        </div>

        {/* ── ARTIFACTS TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Koleksi</th>
                  <th className="py-3 px-3">No. Registrasi & ID</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Era / Masa Sejarah</th>
                  <th className="py-3 px-3">Lokasi Etalase</th>
                  <th className="py-3 px-3 text-center">Narasi 3 Bahasa</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArtifacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      Tidak ada koleksi artefak yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredArtifacts.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.gambarUrl}
                            alt={art.nama}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/slide-1-gedung-museum-hd.jpg';
                            }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight text-xs sm:text-sm">
                              {art.nama}
                            </span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {art.dimensi}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* No Reg & ID */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="font-bold text-slate-800 block">{art.noRegistrasi}</span>
                        <span className="text-[10px] text-slate-400">{art.id}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {art.kategori}
                        </span>
                      </td>

                      {/* Era */}
                      <td className="py-3 px-3 text-[11px] text-slate-700 font-medium">
                        {art.era}
                      </td>

                      {/* Showcase room */}
                      <td className="py-3 px-3 text-[11px] text-slate-500">
                        {art.lokasiPameran}
                      </td>

                      {/* 3-Language Status */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-bold">
                          <span title="Bahasa Indonesia" className="text-emerald-700">ID ✓</span>
                          <span className="text-slate-300">•</span>
                          <span title="English" className={art.deskripsiEn ? 'text-emerald-700' : 'text-slate-400'}>EN ✓</span>
                          <span className="text-slate-300">•</span>
                          <span title="Basa Osing" className={art.deskripsiOsing ? 'text-emerald-700' : 'text-slate-400'}>OS ✓</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Acrylic QR Card */}
                          <button
                            type="button"
                            onClick={() => setPrintArtifact(art)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                            title="Cetak Label QR Akrilik Showcase"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(art)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Data & Narasi"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="Hapus Koleksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      </div>

      {/* ── MODAL: TAMBAH / EDIT ARTIFACT ── */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsFormOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#092C48] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {editingArtifact ? 'Edit Koleksi Cagar Budaya' : 'Tambah Koleksi Musewangi Baru'}
                </h3>
                <p className="text-[10px] text-slate-300">
                  Isi data kurasi resmi dan narasi 3 bahasa untuk panduan audio pengunjung.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitForm} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Nama Koleksi / Benda Budaya *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    placeholder="Contoh: Arca Siwa Mahaguru"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-[#092C48]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Nomor Registrasi Museum *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.noRegistrasi}
                    onChange={(e) => setFormData(prev => ({ ...prev, noRegistrasi: e.target.value }))}
                    placeholder="Contoh: 01.07.MB.1982"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-[#092C48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Kategori Koleksi
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value as MusewangiCategory }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Era / Masa Asal
                  </label>
                  <input
                    type="text"
                    value={formData.era}
                    onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                    placeholder="Contoh: Abad XIV (Majapahit)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Dimensi / Ukuran
                  </label>
                  <input
                    type="text"
                    value={formData.dimensi}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensi: e.target.value }))}
                    placeholder="Contoh: T: 54cm, L: 26cm"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Lokasi Penempatan Etalase
                  </label>
                  <input
                    type="text"
                    value={formData.lokasiPameran}
                    onChange={(e) => setFormData(prev => ({ ...prev, lokasiPameran: e.target.value }))}
                    placeholder="Contoh: Ruang Pamer Utama (Etalase A-03)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    URL Gambar / Foto Artefak
                  </label>
                  <input
                    type="text"
                    value={formData.gambarUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, gambarUrl: e.target.value }))}
                    placeholder="/assets/slide-2-candi-macan-putih-hd.jpg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              {/* 3-Language Narration Areas */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-[#D4A359]" />
                  <span>Narasi Kuratorial 3 Bahasa (Untuk Audio Guide & Teks)</span>
                </span>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>🇮🇩 Bahasa Indonesia (Wajib)</span>
                    <span className="text-slate-400 font-normal">Narasi pengantar pengunjung lokal</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.deskripsiId}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsiId: e.target.value }))}
                    placeholder="Tuliskan deskripsi lengkap artefak dalam Bahasa Indonesia..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#092C48]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>🇬🇧 English Translation</span>
                    <span className="text-slate-400 font-normal">Narasi untuk wisatawan mancanegara</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.deskripsiEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsiEn: e.target.value }))}
                    placeholder="Write English narrative description for international visitors..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#092C48]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>🔴 Basa Osing (Bahasa Daerah Banyuwangi)</span>
                    <span className="text-slate-400 font-normal">Pelestarian bahasa ibu Blambangan</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.deskripsiOsing}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsiOsing: e.target.value }))}
                    placeholder="Tulisaken katrangan sejarah nggunakaken Basa Osing..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-[#092C48]"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#D4A359]" />
                  <span>{editingArtifact ? 'Simpan Perubahan' : 'Terbitkan Koleksi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CETAK LABEL QR AKRILIK SHOWCASE (OFFICIAL TEMPLATE) ── */}
      {printArtifact && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setPrintArtifact(null)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Dialog */}
            <div className="bg-[#092C48] text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#D4A359]" />
                <div>
                  <h3 className="font-bold text-sm">Label Akrilik Showcase Museum</h3>
                  <span className="text-[10px] text-slate-300">Format Resmi Standar Etalase Museum Blambangan</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrintArtifact(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Acrylic Label Preview (Printable Area) */}
            <div className="p-6 overflow-y-auto flex flex-col items-center justify-center bg-slate-100/70">
              
              {/* THE OFFICIAL EXHIBITION ACRYLIC CARD */}
              <div 
                id="showcase-acrylic-label"
                className="w-full max-w-md bg-white rounded-2xl border-4 border-[#092C48] p-6 shadow-xl relative overflow-hidden text-center text-slate-900"
              >
                {/* Decorative corner motifs */}
                <div className="absolute top-2 left-2 w-10 h-10 opacity-20 pointer-events-none">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-2 right-2 w-10 h-10 opacity-20 pointer-events-none -scale-x-100">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                </div>

                {/* Museum Header */}
                <div className="border-b-2 border-slate-200 pb-3 mb-4 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <MuseumLogo variant="dark" className="h-7" />
                  </div>
                  <h4 className="text-xs font-black tracking-wider text-[#092C48] uppercase">
                    Museum Blambangan Banyuwangi
                  </h4>
                  <p className="text-[9px] text-slate-500 font-semibold tracking-wide uppercase">
                    Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi
                  </p>
                </div>

                {/* Artifact Info */}
                <div className="space-y-1.5 mb-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
                    {printArtifact.kategori}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {printArtifact.nama}
                  </h3>
                  <div className="text-[10px] text-slate-600 font-mono">
                    No. Reg: {printArtifact.noRegistrasi} • {printArtifact.id}
                  </div>
                  <div className="text-[10px] text-[#b3833b] font-bold">
                    Era: {printArtifact.era}
                  </div>
                </div>

                {/* High-Res QR Code */}
                <div className="inline-block p-3 bg-white border-2 border-slate-800 rounded-2xl shadow-sm mb-3">
                  <QRCodeSVG 
                    value={printArtifact.qrPayload}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* Instruction for Visitors */}
                <div className="bg-[#092C48] text-white p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D4A359]">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>MUSEWANGI SMART-TOUR</span>
                  </div>
                  <p className="text-[10px] text-slate-200 leading-tight">
                    Pindai kode QR dengan kamera HP Anda untuk mendengarkan narasi panduan suara dalam <strong>3 Bahasa: Indonesia • English • Basa Osing</strong>
                  </p>
                </div>

                {/* Placement footer */}
                <div className="mt-3 text-[9px] text-slate-400 font-medium">
                  {printArtifact.lokasiPameran}
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 print:hidden">
              <span className="text-[11px] text-slate-500">
                Ukuran cetak disarankan: Stiker Akrilik 10 × 15 cm
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintArtifact(null)}
                  className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="py-2 px-5 rounded-xl bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>Cetak Label Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: KONFIRMASI HAPUS ── */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Hapus Koleksi Musewangi?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Data artefak dan QR Code akan dihapus dari sistem. Pengunjung tidak akan dapat mendengarkan narasi ini lagi.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
