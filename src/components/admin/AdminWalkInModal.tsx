import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { CategoryType, Booking } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  X, 
  User, 
  Users, 
  Tag, 
  Clock, 
  Phone, 
  Banknote, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Plus, 
  Minus,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';

interface AdminWalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminWalkInModal: React.FC<AdminWalkInModalProps> = ({ isOpen, onClose }) => {
  const { createWalkInBooking } = useBooking();

  // Form states
  const [nama, setNama] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState(1);
  const [kategori, setKategori] = useState<CategoryType>('Umum');
  const [sesi, setSesi] = useState('Sesi I (07:30 - 10:00 WIB)');
  const [telepon, setTelepon] = useState('');
  const [langsungCheckIn, setLangsungCheckIn] = useState(true);

  // Result state
  const [issuedBooking, setIssuedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const categories: { type: CategoryType; label: string; price: number }[] = [
    { type: 'Umum', label: 'Umum', price: 7500 },
    { type: 'Pelajar/Mahasiswa', label: 'Pelajar / Mhs', price: 5000 },
    { type: 'Mancanegara', label: 'Mancanegara', price: 20000 },
    { type: 'Pelajar Rombongan', label: 'Pelajar Rombongan', price: 5000 },
  ];

  const sessions = [
    'Sesi I (07:30 - 10:00 WIB)',
    'Sesi II (10:00 - 12:30 WIB)',
    'Sesi III (13:30 - 16:00 WIB)',
  ];

  const currentPrice = categories.find((c) => c.type === kategori)?.price || 7500;
  const totalBayar = currentPrice * jumlahOrang;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Mohon masukkan nama pengunjung / perwakilan.');
      return;
    }

    const booking = createWalkInBooking({
      nama: nama.trim(),
      jumlahOrang,
      kategori,
      sesi,
      metodePembayaran: 'QRIS Loket',
      telepon: telepon.trim() || undefined,
      langsungCheckIn,
    });

    setIssuedBooking(booking);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWA = () => {
    if (!issuedBooking || !telepon) return;
    const cleanPhone = telepon.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(
      `*TIKET RESMI MUSEUM BLAMBANGAN*\n\n` +
      `No. Booking: ${issuedBooking.id}\n` +
      `Nama: ${issuedBooking.nama}\n` +
      `Jumlah: ${issuedBooking.jumlahOrang} Orang\n` +
      `Kategori: ${issuedBooking.kategori}\n` +
      `Sesi: ${issuedBooking.sesi}\n` +
      `Total: Rp${issuedBooking.totalPembayaran.toLocaleString('id-ID')} (LUNAS)\n\n` +
      `Terima kasih telah berkunjung ke Museum Blambangan Banyuwangi!`
    );
    window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank');
  };

  const handleResetModal = () => {
    setNama('');
    setJumlahOrang(1);
    setKategori('Umum');
    setTelepon('');
    setIssuedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-2xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative border border-slate-200 overflow-hidden my-6 text-left animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#092C48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Banknote className="w-5 h-5 text-[#D4A359]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">
                {issuedBooking ? 'Karcis Loket Diterbitkan' : 'Loket Pembelian Tiket Langsung'}
              </h2>
              <p className="text-[11px] text-slate-300">
                {issuedBooking ? 'Tiket resmi telah lunas dan siap diberikan ke pengunjung' : 'Bantu pemesanan dan cetak karcis langsung di loket museum'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetModal}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {!issuedBooking ? (
            /* FORM INPUT BELI TIKET DI LOKET */
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Nama Pengunjung */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pengunjung / Perwakilan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Bpk. Haryanto / Rombongan SMP 1"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#092C48]/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Jumlah Pengunjung */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Jumlah Orang <span className="text-red-500">*</span>
                  </label>
                  {jumlahOrang >= 10 && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded-full">
                      Rombongan ({jumlahOrang} Orang)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      max={500}
                      required
                      value={jumlahOrang}
                      onChange={(e) => setJumlahOrang(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#092C48]/20 focus:bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      Orang
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setJumlahOrang(Math.max(1, jumlahOrang - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300" />
                    <button
                      type="button"
                      onClick={() => setJumlahOrang(jumlahOrang + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
                  <span className="text-[10px] text-slate-400 shrink-0">Preset:</span>
                  {[1, 2, 4, 5, 10, 15, 20, 30].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setJumlahOrang(n)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                        jumlahOrang === n
                          ? 'bg-[#092C48] text-white border-[#092C48]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategori Kunjungan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori Kunjungan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => setKategori(c.type)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        kategori === c.type
                          ? 'border-[#092C48] bg-slate-50 ring-2 ring-[#092C48]/10 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs text-slate-900">{c.label}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        Rp{c.price.toLocaleString('id-ID')} / org
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sesi & WhatsApp Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sesi Kunjungan
                  </label>
                  <select
                    value={sesi}
                    onChange={(e) => setSesi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    {sessions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp Pengunjung <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran: QRIS Only */}
              <div className="bg-[#FAF7EE] border border-[#E9DFBE] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5DCC5] pb-2">
                  <span className="text-xs font-bold text-slate-700">Total Tagihan Loket:</span>
                  <span className="text-lg font-black text-[#092C48]">
                    Rp{totalBayar.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* QRIS ONLY - Tidak ada cash */}
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <img
                    src="/assets/qris-museum-blambangan.jpg"
                    alt="QRIS Bank Jatim"
                    className="w-12 h-14 object-contain rounded-lg border border-emerald-300 bg-white p-0.5 shrink-0"
                  />
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-emerald-900">QRIS Resmi Bank Jatim (NMID: ID2024326864723)</p>
                    <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                      Rek. Bank Jatim: <strong className="font-mono">0021005380</strong> a.n. DISBUDPAR KAB BANYUWANGI. Uang langsung masuk ke kas resmi PAD Pemkab Banyuwangi.
                    </p>
                  </div>
                </div>

                {/* Checkbox Langsung Check-in */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={langsungCheckIn}
                    onChange={(e) => setLangsungCheckIn(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer accent-[#092C48]"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Pengunjung langsung masuk gerbang (Tandai Check-in sekarang)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#092C48] hover:bg-[#071F33] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Terbitkan Tiket & Simpan</span>
                </button>
              </div>
            </form>
          ) : (
            /* HASIL TIKET/KARCIS LOKET RESMI YANG DITERBITKAN */
            <div className="space-y-5 text-center">
              {/* Green Success Badge */}
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Tiket Berhasil Diterbitkan!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pembayaran loket lunas dan pengunjung telah tercatat resmi di sistem.
                </p>
              </div>

              {/* Struk / Karcis Loket Fisik Frame */}
              <div className="bg-[#FAF7EE] border-2 border-dashed border-[#D2C29D] rounded-2xl p-5 max-w-sm mx-auto text-left space-y-3 shadow-sm print:m-0 print:border-solid">
                <div className="flex items-center justify-between border-b border-dashed border-[#D2C29D] pb-3">
                  <MuseumLogo variant="dark" className="h-6" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    LOKET RESMI • LUNAS
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">No. Karcis:</span>
                  <span className="font-bold text-[#092C48] font-mono">{issuedBooking.id}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Pengunjung:</span>
                  <span className="font-bold text-slate-900">{issuedBooking.nama}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Jumlah:</span>
                  <span className="font-extrabold text-slate-900">{issuedBooking.jumlahOrang} Orang</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Kategori:</span>
                  <span className="font-semibold text-slate-900">{issuedBooking.kategori}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Sesi:</span>
                  <span className="font-semibold text-slate-900">{issuedBooking.sesi}</span>
                </div>

                {/* QR Code in Receipt */}
                <div className="flex flex-col items-center justify-center py-2 border-y border-dashed border-[#D2C29D]">
                  <QRCodeSVG 
                    value={`VERIFIED_LOKET:${issuedBooking.id}:${issuedBooking.nama}:${issuedBooking.totalPembayaran}`}
                    size={110}
                    level="M"
                  />
                  <span className="text-[9px] text-slate-400 font-mono mt-1">Scan Gerbang Masuk</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-800">Total Pembayaran:</span>
                  <span className="text-base font-black text-[#092C48]">
                    Rp{issuedBooking.totalPembayaran.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400 text-center pt-1">
                  Dicetak pada {issuedBooking.tanggalPembayaran} • Museum Blambangan
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Karcis Fisik (Print)</span>
                </button>

                {telepon && (
                  <button
                    type="button"
                    onClick={handleSendWA}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim ke WhatsApp</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Selesai / Layani Pengunjung Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
