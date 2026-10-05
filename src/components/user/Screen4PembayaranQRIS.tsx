import React, { useState, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  ChevronLeft, 
  Info, 
  Check, 
  UploadCloud, 
  X, 
  Trash2,
  ZoomIn, 
  RefreshCw, 
  FileCheck, 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  CheckCircle2,
  Copy,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { QRISLogo } from '../common/QRISLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';
import { downloadOfficialQRISImage } from '../../utils/qrisDownloadUtils';

const OFFICIAL_QRIS_PAYLOAD = '00020101021126710019ID.CO.BANKJATIM.WWW01189360011400001592930215ID20240015907050303URE51440014ID.CO.QRIS.WWW0215ID20243268647230303URE5204939953033605802ID5917MUSEUM BLAMBANGAN6010BANYUWANGI61056841462070703A0163047681';

const OFFICIAL_BANK_DATA = {
  bank: 'Bank Jatim',
  namaRekening: 'DISBUDPAR KAB BANYUWANGI',
  noRekening: '0021005380',
  nmid: 'ID2024326864723',
  terminal: 'A01'
};

const PAYMENT_CHANNELS = [
  {
    name: 'Bank Jatim',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#ED1C24" />
        <path d="M7 6h4v8c0 1.4-.9 2.5-2.2 2.5-.6 0-1.2-.2-1.6-.6L6 17.5c.8.6 1.8 1 2.8 1 2.8 0 4.7-1.9 4.7-4.5V6h3.5V4H7v2z" fill="#FFFFFF" />
        <circle cx="17" cy="11" r="2.2" fill="#FFD100" />
      </svg>
    ),
  },
  {
    name: 'BCA',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#005BAA" />
        <text x="12" y="15.5" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.3">BCA</text>
      </svg>
    ),
  },
  {
    name: "Livin' Mandiri",
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#003D79" />
        <path d="M5 14.5C7.5 9.5 10 9 12 13C14 17 16.5 16 19 11" stroke="#FFC000" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="17.5" cy="8" r="1.8" fill="#FFC000" />
      </svg>
    ),
  },
  {
    name: 'BRImo',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00529C" />
        <text x="10.5" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">BRI</text>
        <circle cx="18" cy="8" r="2" fill="#F37021" />
      </svg>
    ),
  },
  {
    name: 'BNI',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#005E6A" />
        <text x="12" y="15.5" textAnchor="middle" fill="#F15A24" fontSize="8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">46</text>
      </svg>
    ),
  },
  {
    name: 'GoPay',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00AED6" />
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'OVO',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#4C2A86" />
        <text x="12" y="15.5" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">ovo</text>
      </svg>
    ),
  },
  {
    name: 'DANA',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#118EEA" />
        <text x="12" y="15.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.2" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.3">DANA</text>
      </svg>
    ),
  },
  {
    name: 'ShopeePay',
    icon: (
      <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0 shadow-2xs" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#EE4D2D" />
        <path d="M10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7V8H10V7Z" stroke="#FFFFFF" strokeWidth="1.2" />
        <rect x="7" y="8" width="10" height="10" rx="1.5" fill="#FFFFFF" />
        <path d="M13 11C12.8 10.5 12.4 10.2 11.8 10.2C11.1 10.2 10.6 10.6 10.6 11.2C10.6 12.5 13.4 12 13.4 13.7C13.4 14.6 12.6 15.2 11.7 15.2C10.8 15.2 10.3 14.7 10.1 14.2L10.9 13.8C11 14.2 11.3 14.5 11.7 14.5C12.1 14.5 12.5 14.2 12.5 13.8C12.5 12.6 9.7 13.1 9.7 11.3C9.7 10.4 10.4 9.5 11.8 9.5C12.6 9.5 13.2 9.9 13.5 10.6L13 11Z" fill="#EE4D2D" />
      </svg>
    ),
  },
];

export const Screen4PembayaranQRIS: React.FC = () => {
  const { setActiveView, formData, createBooking } = useBooking();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPricePerPerson = () => {
    switch (formData.kategori) {
      case 'Pelajar/Mahasiswa':
      case 'Pelajar Rombongan':
      case 'Pelajar':
        return 5000;
      case 'Umum':
        return 7500;
      case 'Mancanegara':
      case 'Luar Negeri':
        return 20000;
      default:
        return 7500;
    }
  };

  const total = getPricePerPerson() * formData.jumlahOrang;

  const handleCopyRekening = () => {
    navigator.clipboard.writeText(OFFICIAL_BANK_DATA.noRekening);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(total.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setUploadedReceipt(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseDemoReceipt = () => {
    setUploadedReceipt('/assets/sample-receipt.jpg');
    setFileName('contoh-struk-qris-berhasil.jpg');
    setFileSize('245 KB');
  };

  const handleClearReceipt = () => {
    setUploadedReceipt(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const [isQrDownloaded, setIsQrDownloaded] = useState(false);

  const handleDownloadQR = () => {
    const success = downloadOfficialQRISImage({
      nama: formData.nama,
      jumlahOrang: formData.jumlahOrang,
      kategori: formData.kategori,
      tanggal: formData.tanggalKunjungan,
      sesi: formData.sesi,
      total,
      canvasSourceId: 'screen4-qris-canvas-source'
    });
    if (success) {
      setIsQrDownloaded(true);
      setTimeout(() => setIsQrDownloaded(false), 3500);
    }
  };

  const handleSubmitProof = () => {
    if (!uploadedReceipt) {
      alert('Mohon pilih atau unggah foto bukti transfer terlebih dahulu.');
      return;
    }
    createBooking(uploadedReceipt);
    setModalOpen(false);
    setActiveView('user-success');
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4">
      {/* Responsive Frame: 100% full width on mobile, centered card on desktop */}
      <div className="w-full max-w-full sm:max-w-[430px] md:max-w-xl min-h-screen sm:min-h-[820px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden relative">
        
        {/* Header: [<] [Logo] [3/5] */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 relative">
          <div className="flex items-center gap-1.5 z-10 w-24 justify-start">
            <button
              onClick={() => setActiveView('user-summary')}
              className="p-1 -ml-1 text-slate-700 hover:text-black cursor-pointer"
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Ringkasan
            </span>
          </div>

          {/* Perfectly Centered Logo */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <MuseumLogo variant="dark" className="h-7 sm:h-8 pointer-events-auto" />
          </div>

          <div className="flex items-center z-10 w-24 justify-end">
            <span className="text-[11px] font-bold text-[#092C48] bg-slate-100 px-2.5 py-0.5 rounded-full">
              Langkah 3/5
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-4 sm:px-5 py-4 overflow-y-auto space-y-4 text-left">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF3E0] border border-[#D4A359]/30 text-[#8B6E32] text-[10px] font-bold mb-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-pulse" />
                <span>The Sunrise of Java • Pemkab Banyuwangi</span>
              </div>
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight">
                Pembayaran Resmi E-Tiket
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pilih metode bayar via Scan QRIS Resmi atau Transfer Rekening Bank Jatim di bawah ini.
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 opacity-20 pointer-events-none select-none hidden sm:block">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* ================= CARD 1: OFFICIAL GOVERNMENT QRIS (STANDAR NASIONAL ASPI / BANK INDONESIA) ================= */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto bg-white rounded-3xl border border-slate-300/80 shadow-md overflow-hidden relative text-center">
            {/* Red Official QRIS Top Header Banner */}
            <div className="bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#BE123C] text-white px-4 py-2.5 flex items-center justify-center gap-2.5 shadow-xs overflow-hidden">
              <div className="bg-white px-2 py-0.5 rounded shadow-xs flex items-center justify-center shrink-0 h-6 overflow-hidden">
                <QRISLogo className="h-4.5 w-auto" />
              </div>
              <span className="text-[11px] font-black tracking-wider uppercase text-white drop-shadow-xs">
                QRIS Nasional
              </span>
            </div>

            {/* Merchant Identity Card */}
            <div className="px-4 pt-3.5 pb-2 text-center border-b border-slate-100">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-sm font-black text-[#081827] tracking-wider uppercase">
                  MUSEUM BLAMBANGAN
                </span>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs" title="Merchant Terverifikasi Bank Jatim">
                  ✓
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                UPTD Museum Blambangan • Disbudpar Kab. Banyuwangi
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">NMID: {OFFICIAL_BANK_DATA.nmid}</span>
                <span>•</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">Terminal: {OFFICIAL_BANK_DATA.terminal}</span>
              </div>
            </div>

            {/* Standee QR Code Frame */}
            <div className="p-4 bg-gradient-to-b from-slate-50/60 to-white flex flex-col items-center">
              <div 
                onClick={() => setIsQrZoomOpen(true)}
                className="relative p-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-md group cursor-pointer overflow-hidden transition-all hover:border-[#DC2626] hover:shadow-lg max-w-full"
                title="Klik untuk memperbesar QR Code"
              >
                <QRCodeCanvas
                  id="screen4-qris-display-canvas"
                  value={OFFICIAL_QRIS_PAYLOAD}
                  size={210}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg block mx-auto max-w-full h-auto"
                  imageSettings={{
                    src: '/assets/museum-blambangan-emblem.png',
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />

                {/* Only show hover overlay on desktop mouse pointers, NOT touchscreens! */}
                <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 items-center justify-center rounded-xl transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">
                  <ZoomIn className="w-4 h-4 text-[#DAB36E]" />
                  <span>Klik untuk Perbesar</span>
                </div>
              </div>

              {/* Total Nominal Badge with Quick Copy */}
              <div className="w-full mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#FAF6ED] via-[#FDFBF7] to-[#FAF6ED] border border-[#E8DBB8] flex items-center justify-between text-left shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Total Pembayaran Tiket:</span>
                  <span className="text-base font-black text-[#081827] tracking-tight">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(total.toString());
                    setCopiedNominal(true);
                    setTimeout(() => setCopiedNominal(false), 2000);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-[#FAF3E0] text-[#8B6E32] text-[10.5px] font-bold rounded-xl border border-[#D4A359]/40 transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                >
                  {copiedNominal ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#D4A359]" />
                      <span>Salin Rp</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hidden High-Res Canvas Source for Download with Official Decoded Payload */}
              <div className="hidden">
                <QRCodeCanvas
                  id="screen4-qris-canvas-source"
                  value={OFFICIAL_QRIS_PAYLOAD}
                  size={360}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Action Buttons for QRIS: Download & Zoom */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                    isQrDownloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#081827] hover:bg-[#0E2C4A] text-white'
                  }`}
                  title="Unduh QR Code resmi ke galeri HP"
                >
                  {isQrDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>✓ Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#D4A359]" />
                      <span>Unduh QR</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrZoomOpen(true)}
                  className="py-2 px-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Perbesar QR</span>
                </button>
              </div>
            </div>

            {/* Multi-Payment Logos Banner (National QRIS ASPI) */}
            <div className="bg-slate-50 px-3.5 py-2.5 border-t border-slate-200/80 text-center space-y-1.5">
              <div className="text-[9.5px] font-black uppercase tracking-widest text-slate-500">
                SATU QRIS UNTUK SEMUA APLIKASI
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-semibold text-slate-700">
                {PAYMENT_CHANNELS.map((channel) => (
                  <span
                    key={channel.name}
                    className="inline-flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    {channel.icon}
                    <span>{channel.name}</span>
                  </span>
                ))}
              </div>
              <div className="text-[8.5px] text-slate-400">
                Terdaftar dan diawasi oleh Bank Indonesia & ASPI
              </div>
            </div>
          </div>

          {/* ================= CARD 2: DATA TRANSFER BANK RESMI (BANK JATIM) ================= */}
          <div className="border border-[#D4A359]/40 rounded-2xl p-4 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F6F2EB] shadow-xs max-w-[340px] sm:max-w-[360px] mx-auto text-left space-y-3">
            {/* Header Bank Card */}
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D4A359]/20 text-[#8E631F] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Data Rekening Bank Jatim
                  </span>
                  <span className="text-[9.5px] text-slate-500 block leading-none">
                    PT Bank Pembangunan Daerah Jatim (Kode: 114)
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold text-[#8E631F] bg-[#D4A359]/15 border border-[#D4A359]/30 px-2 py-0.5 rounded-full">
                Pemkab
              </span>
            </div>

            {/* Nomor Rekening Row with Salin Button */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Nomor Rekening
                </span>
                <button
                  type="button"
                  onClick={handleCopyRekening}
                  className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    copiedRekening
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-[#092C48] hover:text-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {copiedRekening ? (
                    <>
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                {OFFICIAL_BANK_DATA.noRekening}
              </div>
            </div>

            {/* Atas Nama Rekening Row */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Atas Nama Rekening
              </span>
              <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                {OFFICIAL_BANK_DATA.namaRekening}
              </div>
            </div>

            {/* Nilai Yang Harus Ditransfer Row with Salin Nominal Button */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Nilai Yang Harus Ditransfer
                </span>
                <button
                  type="button"
                  onClick={handleCopyNominal}
                  className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    copiedNominal
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-[#092C48] hover:text-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {copiedNominal ? (
                    <>
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Nominal</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-base sm:text-lg font-black text-[#092C48]">
                Rp {total.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-start gap-1.5 text-[10px] text-slate-500 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Pembayaran masuk langsung ke rekening kas resmi PAD Pemkab Banyuwangi.
              </span>
            </div>
          </div>

          {/* Notice Box */}
          <div className="bg-[#FCF8EF] border border-[#F5EEDB] rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900 max-w-[340px] sm:max-w-[360px] mx-auto">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-tight">
              Setelah melakukan scan QRIS atau transfer Bank Jatim di atas, simpan struk transfer Anda lalu klik <strong>"Saya Sudah Membayar"</strong> untuk mengunggah bukti.
            </p>
          </div>
        </main>

        {/* Footer Action: Saya Sudah Membayar matching Figma Screen 4 */}
        <footer className="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full py-3 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Saya Sudah Membayar</span>
          </button>
        </footer>

        {/* ================= MODAL UPLOAD BUKTI PEMBAYARAN (Jelas, Bagus, Preview Jernih) ================= */}
        {modalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xs p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 shadow-2xl relative border border-slate-100 text-center animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
              
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                {/* Modal Title & Header */}
                <div className="space-y-1 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#092C48] to-[#1A466E] text-white flex items-center justify-center mx-auto shadow-md">
                    <UploadCloud className="w-6 h-6 text-[#DAB36E]" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 pt-1">
                    Upload Bukti Pembayaran
                  </h2>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-tight">
                    Unggah foto atau screenshot struk transfer QRIS Anda untuk validasi.
                  </p>

                  <div className="inline-flex flex-col items-center gap-0.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-700 font-semibold mt-1">
                    <div className="flex items-center gap-1.5">
                      <span>Total Tagihan:</span>
                      <span className="font-extrabold text-[#092C48]">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Bank Jatim <strong>0021005380</strong> a.n DISBUDPAR KAB BANYUWANGI
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* KONDISI 1: Belum Ada Bukti Diunggah */}
                {!uploadedReceipt ? (
                  <div className="space-y-3">
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center ${
                        isDragging 
                          ? 'border-[#092C48] bg-blue-50/60 scale-[1.01]' 
                          : 'border-slate-300 hover:border-[#092C48] bg-slate-50/70 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-[#092C48]">
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Klik untuk Memilih Foto Bukti
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          atau seret file gambar ke sini
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Format: JPG, PNG, WEBP, PDF (Maks. 5MB)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-1 px-4 py-2 bg-[#092C48] hover:bg-[#071f33] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Pilih File dari Perangkat
                      </button>
                    </div>

                    {/* Quick Demo Testing Option */}
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-left">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-[11px] text-amber-900 font-medium">
                          Ingin testing tanpa upload file manual?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleUseDemoReceipt}
                        className="text-[11px] font-bold text-[#092C48] hover:underline bg-white px-2 py-1 rounded-lg border border-amber-300 shadow-2xs shrink-0 cursor-pointer"
                      >
                        Gunakan Struk Demo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* KONDISI 2: Sudah Ada Bukti Diunggah (Preview Jelas & Besar) */
                  <div className="space-y-3 text-left animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        Preview Bukti Pembayaran
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ File Terpilih
                      </span>
                    </div>

                    {/* High-definition Image Preview Box */}
                    <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900/5 flex items-center justify-center p-2 group shadow-inner">
                      <img
                        src={uploadedReceipt}
                        alt="Preview Bukti Pembayaran"
                        className="max-h-56 w-full object-contain rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/sample-receipt.jpg';
                        }}
                      />
                      
                      {/* Zoom Overlay on hover */}
                      <button
                        type="button"
                        onClick={() => setIsZoomOpen(true)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer backdrop-blur-2xs"
                      >
                        <ZoomIn className="w-5 h-5 text-[#DAB36E]" />
                        <span>Klik untuk Perbesar Gambar</span>
                      </button>
                    </div>

                    {/* File Info Bar with Action Buttons */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <div className="text-xs font-semibold text-slate-800 truncate" title={fileName}>
                          {fileName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Ukuran: {fileSize} • Sesuai
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsZoomOpen(true)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#092C48] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Perbesar gambar"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#092C48] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Ganti foto bukti"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleClearReceipt}
                          className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus bukti"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons: [Batal] [Kirim Bukti Pembayaran] */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={!uploadedReceipt}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                    uploadedReceipt 
                      ? 'bg-[#092C48] hover:bg-[#071f33] text-white cursor-pointer active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Kirim Bukti</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= LIGHTBOX ZOOM MODAL (Tampilan Penuh Bukti) ================= */}
        {isZoomOpen && uploadedReceipt && (
          <div 
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          >
            <div className="relative max-w-2xl max-h-[85vh] w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <X className="w-5 h-5" />
                <span>Tutup</span>
              </button>
              <img
                src={uploadedReceipt}
                alt="Bukti Transfer Penuh"
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.currentTarget.src = '/assets/sample-receipt.jpg';
                }}
              />
              <div className="mt-3 text-xs text-slate-300 text-center font-mono">
                {fileName} • {fileSize}
              </div>
            </div>
          </div>
        )}

        {/* ================= LIGHTBOX ZOOM MODAL QRIS RESMI PEMERINTAH ================= */}
        {isQrZoomOpen && (
          <div 
            onClick={() => setIsQrZoomOpen(false)}
            className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div 
              className="relative max-w-xs sm:max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center space-y-3 animate-in zoom-in-95 duration-150 border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsQrZoomOpen(false)}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-6 flex items-center justify-center pt-1">
                <QRISLogo className="h-5" />
              </div>
              <div className="text-xs font-black text-slate-900 tracking-wide">
                MUSEUM BLAMBANGAN
              </div>
              <div className="text-[10.5px] font-mono text-slate-500">
                NMID: {OFFICIAL_BANK_DATA.nmid} • {OFFICIAL_BANK_DATA.terminal}
              </div>

              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner w-full flex items-center justify-center relative">
                <QRCodeCanvas
                  value={OFFICIAL_QRIS_PAYLOAD}
                  size={260}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg block mx-auto"
                />
                <div className="absolute inset-0 m-auto w-11 h-11 rounded-xl bg-white p-1 shadow-md border border-slate-200 flex items-center justify-center pointer-events-none">
                  <img
                    src="/assets/museum-blambangan-emblem.png"
                    alt="Emblem"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="w-full bg-[#FCF8EF] border border-[#E9DFBE] p-2.5 rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-600 text-[11px]">
                  <span>Total Tagihan:</span>
                  <span className="font-extrabold text-[#092C48] text-sm">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-[10.5px] pt-1 border-t border-[#E5DCC5]">
                  <span>Rekening PAD:</span>
                  <span className="font-bold text-slate-800">Bank Jatim 0021005380</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="w-full py-2.5 bg-[#092C48] hover:bg-[#071F33] text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-[#DAB36E]" />
                <span>Unduh Kode QR ke Galeri HP</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
