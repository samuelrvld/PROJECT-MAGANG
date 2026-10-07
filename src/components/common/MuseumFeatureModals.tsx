import React, { useState } from 'react';
import { 
  X, 
  Landmark, 
  Info, 
  PhoneCall, 
  User, 
  Clock, 
  MapPin, 
  Calendar, 
  Ticket, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Copy,
  Users,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { GajahOlingMotif } from './GajahOlingMotif';
import { SocialMediaIconRow } from './SocialMediaLinks';

export type MuseumModalType = 'koleksi' | 'informasi' | 'kontak' | 'profil' | null;

interface MuseumFeatureModalsProps {
  activeModal: MuseumModalType;
  onClose: () => void;
}

export const MuseumFeatureModals: React.FC<MuseumFeatureModalsProps> = ({
  activeModal,
  onClose,
}) => {
  const { 
    setActiveView, 
    currentBooking, 
    bookings, 
    myBookings,
    setSelectedBookingId,
    addMyBookingId,
    removeMyBookingId,
    clearAllMyBookings,
    sessionsConfig, 
    ishomaConfig 
  } = useBooking();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimInput, setClaimInput] = useState('');
  const [claimMsg, setClaimMsg] = useState<{ success: boolean; text: string } | null>(null);

  const displayBookings = myBookings.length > 0 
    ? myBookings 
    : (currentBooking ? [currentBooking] : []);
  const activeBooking = currentBooking || (displayBookings.length > 0 ? displayBookings[0] : null);

  if (!activeModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dark Navy Background */}
        <div className="bg-[#14293E] text-white px-5 py-4 flex items-center justify-between relative overflow-hidden shrink-0">
          {/* Subtle Gajah Oling Watermark */}
          <div className="absolute -right-4 -bottom-4 w-20 h-28 opacity-15 pointer-events-none select-none">
            <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
          </div>

          <div className="flex items-center gap-2.5 relative z-10">
            {activeModal === 'koleksi' && (
              <div className="w-8 h-8 rounded-lg bg-[#DAB36E]/20 text-[#DAB36E] flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
            )}
            {activeModal === 'informasi' && (
              <div className="w-8 h-8 rounded-lg bg-[#DAB36E]/20 text-[#DAB36E] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            )}
            {activeModal === 'kontak' && (
              <div className="w-8 h-8 rounded-lg bg-[#DAB36E]/20 text-[#DAB36E] flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
            )}
            {activeModal === 'profil' && (
              <div className="w-8 h-8 rounded-lg bg-[#DAB36E]/20 text-[#DAB36E] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold leading-tight">
                {activeModal === 'koleksi' && 'Koleksi Museum Blambangan'}
                {activeModal === 'informasi' && 'Informasi & Jadwal Kunjungan'}
                {activeModal === 'kontak' && 'Kontak & Lokasi Museum'}
                {activeModal === 'profil' && 'Profil Pengunjung'}
              </h3>
              <p className="text-[10px] text-slate-300">
                {activeModal === 'koleksi' && 'Warisan Sejarah & Budaya Banyuwangi'}
                {activeModal === 'informasi' && 'Jam Buka, Sesi, dan Tata Tertib'}
                {activeModal === 'kontak' && 'Layanan Pengunjung & Alamat'}
                {activeModal === 'profil' && 'Informasi Akun & Booking Anda'}
              </p>
            </div>
          </div>

          {/* Single, Distinct Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
            aria-label="Tutup"
            title="Tutup Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          
          {/* KOLEKSI MODAL */}
          {activeModal === 'koleksi' && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Museum Blambangan menyimpan lebih dari 4.300 benda cagar budaya peninggalan masa prasejarah, Hindu-Buddha Kerajaan Blambangan, hingga kolonial.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="font-bold text-[#14293E] text-[11px] block">
                    🏛️ Arca Siwa & Relik Kerajaan Blambangan
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Arca batu andesit peninggalan era Majapahit dan Kerajaan Blambangan abad ke-14 yang ditemukan di kawasan Banyuwangi Selatan.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                  <span className="font-bold text-[#14293E] text-[11px] block flex items-center justify-between">
                    <span>🎨 Batik Gajah Oling Asli</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#DAB36E]/20 text-[#966E2E] font-extrabold">Ikon Budaya</span>
                  </span>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Koleksi kain batik tulis tertua dengan motif Gajah Oling, simbol kekuatan dan keagungan spiritual masyarakat suku Osing Banyuwangi.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="font-bold text-[#14293E] text-[11px] block">
                    ⚔️ Senjata Pusaka & Tombak Era Menak Jinggo
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Keris luk Blambangan dan senjata tempur tradisional yang digunakan para prajurit Blambangan pada masa lampau.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="font-bold text-[#14293E] text-[11px] block">
                    🪙 Numismatika & Keramik Dinasti Ming
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Uang kepeng kuno, koin VOC, dan guci keramik Tiongkok bukti perdagangan maritim di pesisir Selat Bali.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  onClick={() => { onClose(); setActiveView('user-form'); }}
                  className="w-full py-2.5 px-4 bg-[#DAB36E] hover:bg-[#cba45e] text-[#14293E] font-bold text-xs rounded-xl shadow transition-transform active:scale-95 text-center cursor-pointer"
                >
                  Booking Kunjungan Sekarang →
                </button>
              </div>
            </div>
          )}

          {/* INFORMASI MODAL */}
          {activeModal === 'informasi' && (
            <div className="space-y-3.5">
              {/* Jam Buka Operasional Museum Resmi */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <span className="font-bold text-[#14293E] text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#DAB36E]" />
                  <span>Jam Operasional Resmi Museum</span>
                </span>
                <div className="text-[10px] space-y-1.5 text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Senin – Jumat:</span>
                    <span className="font-bold text-slate-900 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                      07:30 – 16:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Istirahat (ISHOMA):</span>
                    <span className="font-semibold text-slate-700">{ishomaConfig.label}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600 font-medium pt-1 border-t border-slate-200/70">
                    <span>Sabtu & Minggu:</span>
                    <span className="font-bold">Tutup (Libur Akhir Pekan)</span>
                  </div>
                </div>
              </div>

              {/* 3 Sesi Kunjungan Sesuai Jadwal Resmi */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#14293E] text-[11px] block">
                  Jadwal Sesi Kunjungan Harian:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  {sessionsConfig.map((s) => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-[#14293E] block">{s.id}</span>
                      <span className="text-slate-700 font-semibold text-[9px] block">
                        {String(s.startHour).padStart(2, '0')}:{String(s.startMinute).padStart(2, '0')} - {String(s.endHour).padStart(2, '0')}:{String(s.endMinute).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] text-emerald-600 font-medium">{s.subLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarif Tiket Resmi per Kategori */}
              <div className="p-3.5 rounded-2xl bg-[#FCF8EF] border border-[#F0E6D0] space-y-2">
                <span className="font-bold text-[#092C48] text-[11px] block">
                  Tarif Masuk Resmi per Kategori:
                </span>
                <div className="text-[10px] space-y-1 text-slate-700">
                  <div className="flex justify-between items-center pb-1 border-b border-amber-200/50">
                    <span>Pelajar / Mahasiswa:</span>
                    <span className="font-bold text-slate-900">Rp 5.000 / orang</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-amber-200/50">
                    <span>Pelajar Rombongan:</span>
                    <span className="font-bold text-slate-900">Rp 5.000 / orang</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-amber-200/50">
                    <span>Umum:</span>
                    <span className="font-bold text-slate-900">Rp 7.500 / orang</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wisatawan Mancanegara:</span>
                    <span className="font-bold text-slate-900">Rp 20.000 / orang</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { onClose(); setActiveView('user-form'); }}
                className="w-full py-2.5 px-4 bg-[#14293E] hover:bg-[#0c1a27] text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 text-center cursor-pointer"
              >
                Pilih Sesi & Booking Tiket →
              </button>
            </div>
          )}

          {/* KONTAK MODAL */}
          {activeModal === 'kontak' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-relaxed">
                    <span className="font-bold text-slate-900 block text-[11px]">Alamat Resmi:</span>
                    Jl. Jenderal Ahmad Yani No. 78, Taman Baru, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-[10px]">
                    <span className="font-bold text-slate-900 block text-[11px]">WhatsApp & Telepon:</span>
                    +62 852-8725-8502 / (0333) 421-555
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-[11px]">Sosial Media Resmi:</span>
                  <SocialMediaIconRow variant="light" size="md" className="justify-start gap-2 pt-0.5" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-1">
                <span className="font-bold text-emerald-950 text-[11px] block">
                  💡 Pelayanan Pembelian Langsung di Loket Museum
                </span>
                <p className="text-[10px] text-emerald-900 leading-relaxed">
                  Bagi pengunjung rombongan, lansia, atau yang mengalami kesulitan booking online, petugas loket tiket Museum Blambangan siap melayani langsung di tempat.
                </p>
              </div>

              <button
                type="button"
                onClick={() => { onClose(); setActiveView('user-form'); }}
                className="w-full py-2.5 px-4 bg-[#14293E] hover:bg-[#0c1a27] text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 text-center cursor-pointer"
              >
                Mulai Booking Kunjungan →
              </button>
            </div>
          )}

          {/* PROFIL MODAL - RICH & ENGAGING (LEBIH MENARIK) */}
          {activeModal === 'profil' && (
            <div className="space-y-4 text-left">
              {/* Visitor Persona Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1E32] to-[#122A42] text-white border border-[#23456C] relative overflow-hidden shadow-md">
                {/* Subtle Gajah Oling decorative accent */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-15 pointer-events-none">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4A359] to-[#F5E6CC] p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-[#0E2640] flex items-center justify-center text-[#D4A359] font-black text-sm">
                      {activeBooking?.nama
                        ? activeBooking.nama
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        : 'MB'}
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white text-xs sm:text-sm truncate block">
                        {activeBooking ? activeBooking.nama : 'Pengunjung Baru / Tamu Museum'}
                      </span>
                      <span className="text-[9px] font-bold text-[#E5C287] bg-[#D4A359]/20 px-2 py-0.5 rounded-full border border-[#D4A359]/35">
                        {activeBooking ? 'Sahabat Budaya' : 'Tamu Wisata'}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-300 truncate">
                      {activeBooking ? (activeBooking.email || 'Wisatawan Resmi Blambangan') : 'Belum ada e-tiket terdaftar di perangkat ini'}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-3 h-3 text-[#D4A359] shrink-0" />
                      <span className="truncate">{activeBooking ? (activeBooking.alamat || 'Kabupaten Banyuwangi, Jawa Timur') : 'Pusat Sejarah & Wisata Budaya Banyuwangi'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Visitor Stats Counter */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
                    <Ticket className="w-3 h-3 text-[#14293E]" />
                    <span>Total Tiket</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {displayBookings.length}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
                    <Users className="w-3 h-3 text-[#14293E]" />
                    <span>Rombongan</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {displayBookings.reduce((sum, b) => sum + (b.jumlahOrang || 1), 0)} Org
                  </span>
                </div>

                <div className={`p-2 rounded-xl border ${
                  activeBooking
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`flex items-center justify-center gap-1 text-[10px] font-semibold mb-0.5 ${
                    activeBooking ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    <ShieldCheck className={`w-3 h-3 ${activeBooking ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Status</span>
                  </div>
                  <span className={`text-[11px] font-bold truncate block ${
                    activeBooking ? 'text-emerald-800' : 'text-slate-600'
                  }`}>
                    {activeBooking?.status || 'Belum Ada Tiket'}
                  </span>
                </div>
              </div>

              {/* Section: Riwayat E-Tiket Saya */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#14293E]" />
                    <span>E-Tiket Tersimpan di Perangkat Ini</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {displayBookings.length} Tiket
                  </span>
                </div>

                {displayBookings.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                    {displayBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#14293E] text-xs font-mono">
                              {b.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(b.id);
                                setCopiedCode(b.id);
                                setTimeout(() => setCopiedCode(null), 2000);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                              title="Salin Kode Booking"
                            >
                              {copiedCode === b.id ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                              b.status === 'Terverifikasi'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 leading-tight">
                          <span className="font-semibold text-slate-800">{b.nama}</span> • {b.jumlahOrang} Orang ({b.kategori})
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{b.tanggalKunjungan}</span>
                          </span>
                          <span className="font-medium text-slate-700">{b.sesi}</span>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBookingId(b.id);
                              onClose();
                              setActiveView('user-ticket');
                            }}
                            className="flex-1 py-1.5 px-3 bg-[#14293E] hover:bg-[#0c1a27] text-white text-[11px] font-bold rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Buka E-Tiket & QR Code</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {myBookings.some((mb) => mb.id === b.id) && (
                            <button
                              type="button"
                              onClick={() => removeMyBookingId(b.id)}
                              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus dari perangkat ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                    <p className="text-xs text-slate-500">Belum ada tiket yang terhubung di gawai ini.</p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('user-form');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#14293E] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Booking Tiket Sekarang</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Klaim Tiket Lain (Form Ringkas) */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 block">
                  Punya Kode Booking Lain? Hubungkan ke Gawai Ini:
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="misal: MB-20261006-4837"
                    value={claimInput}
                    onChange={(e) => setClaimInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#14293E]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = claimInput.trim();
                      if (!clean) return;
                      const found = bookings.find((b) => b.id.toLowerCase() === clean.toLowerCase());
                      if (found) {
                        addMyBookingId(found.id);
                        setClaimMsg({ success: true, text: `Tiket ${found.id} berhasil dihubungkan!` });
                        setClaimInput('');
                      } else {
                        setClaimMsg({ success: false, text: 'Kode booking tidak ditemukan.' });
                      }
                      setTimeout(() => setClaimMsg(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-[#14293E] text-white text-xs font-semibold rounded-xl hover:bg-[#0c1a27] cursor-pointer"
                  >
                    Hubungkan
                  </button>
                </div>
                {claimMsg && (
                  <p
                    className={`text-[10px] font-medium pt-0.5 ${
                      claimMsg.success ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {claimMsg.text}
                  </p>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {myBookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Bersihkan riwayat semua tiket di perangkat ini?')) {
                        clearAllMyBookings();
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 text-[11px] font-medium cursor-pointer"
                  >
                    Reset Riwayat Gawai
                  </button>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('user-form');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Booking Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
