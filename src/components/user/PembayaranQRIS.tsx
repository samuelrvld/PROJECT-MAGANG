import React, { useState, useRef, useEffect } from 'react';
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
  ShieldCheck,
  Clock,
  QrCode,
  AlertTriangle
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
  { name: 'Bank Jatim', badge: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'BCA', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: "Mandiri", badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'BRImo', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'BNI', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'GoPay', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'OVO', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'DANA', badge: 'bg-blue-50 text-sky-700 border-sky-200' },
  { name: 'ShopeePay', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export const PembayaranQRIS: React.FC = () => {
  const { setActiveView, formData, createBooking } = useBooking();
  const [activeTab, setActiveTab] = useState<'qris' | 'bank'>('qris');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isQrDownloaded, setIsQrDownloaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 15-Minute Payment Window Countdown Timer
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const rawUrl = uploadEvent.target?.result as string;
        if (!rawUrl) return;

        const img = new Image();
        img.onload = () => {
          const MAX_SIZE = 900;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > MAX_SIZE) {
              h = Math.round((h * MAX_SIZE) / w);
              w = MAX_SIZE;
            }
          } else {
            if (h > MAX_SIZE) {
              h = Math.round((h * MAX_SIZE) / h);
              w = MAX_SIZE;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);
            setUploadedReceipt(compressed);
            const approxKb = Math.round((compressed.length * 3) / 4 / 1024);
            setFileSize(`${approxKb} KB (Dioptimasi)`);
          } else {
            setUploadedReceipt(rawUrl);
          }
        };
        img.onerror = () => setUploadedReceipt(rawUrl);
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedReceipt(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const handleDownloadQR = () => {
    const success = downloadOfficialQRISImage({
      nama: formData.nama,
      jumlahOrang: formData.jumlahOrang,
      kategori: formData.kategori,
      tanggal: formData.tanggalKunjungan,
      sesi: formData.sesi,
      total,
      canvasSourceId: 'qris-canvas-source'
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
      {/* Responsive Frame */}
      <div className="w-full max-w-full sm:max-w-[430px] md:max-w-xl min-h-screen sm:min-h-[820px] bg-white text-slate-800 flex flex-col justify-between sm:rounded-[36px] sm:shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 relative">
          <div className="flex items-center gap-1.5 z-10 w-24 justify-start">
            <button
              onClick={() => setActiveView('user-summary')}
              className="p-1 -ml-1 text-slate-700 hover:text-black cursor-pointer"
              title="Kembali ke Ringkasan"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Ringkasan
            </span>
          </div>

          {/* Centered Logo */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <MuseumLogo variant="dark" className="h-7 sm:h-8 pointer-events-auto" />
          </div>

          <div className="flex items-center z-10 w-24 justify-end">
            <span className="text-[11px] font-bold text-[#092C48] bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Pembayaran
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-4 sm:px-5 py-4 overflow-y-auto space-y-3.5 text-left">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 leading-tight">
                Pembayaran Resmi E-Tiket
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih metode pembayaran resmi Museum Blambangan di bawah ini.
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 opacity-20 pointer-events-none select-none hidden sm:block">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Payment Session Countdown Timer Banner */}
          <div className="bg-gradient-to-r from-[#0E2C4A] to-[#081827] text-white p-3 rounded-2xl border border-[#234F7A]/60 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${timeLeft < 180 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-white/10 text-[#D4A359]'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10.5px] text-slate-300 block leading-tight font-medium">Batas Waktu Pembayaran</span>
                <span className="text-xs text-slate-100 font-semibold">
                  {timeLeft > 0 ? 'Selesaikan sebelum kuota sesi dilepas' : 'Waktu pembayaran telah berakhir'}
                </span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-mono text-sm font-black border tracking-wider ${
              timeLeft < 180 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                : 'bg-white/10 text-[#E5BE7E] border-white/20'
            }`}>
              {formatCountdown(timeLeft)}
            </div>
          </div>

          {/* Tab Switcher: QRIS vs Transfer Bank */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/90 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('qris')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'qris'
                  ? 'bg-[#092C48] text-white shadow-sm ring-1 ring-[#092C48]/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>QRIS Resmi (Scan)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'bank'
                  ? 'bg-[#092C48] text-white shadow-sm ring-1 ring-[#092C48]/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>Transfer Bank Jatim</span>
            </button>
          </div>

          {/* ================= TAB 1: OFFICIAL QRIS STANDAR ASPI / BI ================= */}
          {activeTab === 'qris' && (
            <div className="w-full max-w-[350px] sm:max-w-[370px] mx-auto bg-white rounded-3xl border border-slate-300/80 shadow-md overflow-hidden relative text-center animate-in fade-in duration-200">
              {/* Red Header Banner */}
              <div className="bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#BE123C] text-white px-4 py-2.5 flex items-center justify-center gap-2.5 shadow-xs">
                <div className="bg-white px-2 py-0.5 rounded shadow-xs flex items-center justify-center shrink-0 h-6">
                  <QRISLogo className="h-4.5 w-auto" />
                </div>
                <span className="text-[11px] font-black tracking-wider uppercase text-white drop-shadow-xs">
                  QRIS Nasional
                </span>
              </div>

              {/* Merchant Identity */}
              <div className="px-4 pt-3 pb-2 text-center border-b border-slate-100">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm font-black text-[#081827] tracking-wider uppercase">
                    MUSEUM BLAMBANGAN
                  </span>
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold" title="Merchant Resmi Bank Jatim">
                    ✓
                  </span>
                </div>
                <div className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                  UPTD Museum Blambangan • Disbudpar Banyuwangi
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">NMID: {OFFICIAL_BANK_DATA.nmid}</span>
                  <span>•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">Terminal: {OFFICIAL_BANK_DATA.terminal}</span>
                </div>
              </div>

              {/* QR Code Canvas Frame */}
              <div className="p-4 bg-gradient-to-b from-slate-50/60 to-white flex flex-col items-center">
                <div 
                  onClick={() => setIsQrZoomOpen(true)}
                  className="relative p-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-md group cursor-pointer overflow-hidden transition-all hover:border-[#DC2626] hover:shadow-lg max-w-full"
                  title="Klik untuk memperbesar QR Code"
                >
                  <QRCodeCanvas
                    id="qris-display-canvas"
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

                  <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 items-center justify-center rounded-xl transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">
                    <ZoomIn className="w-4 h-4 text-[#DAB36E]" />
                    <span>Klik untuk Perbesar</span>
                  </div>
                </div>

                {/* Total Nominal Badge with Quick Copy */}
                <div className="w-full mt-3 p-2.5 rounded-2xl bg-[#FAF7EE] border border-[#E8DBB8] flex items-center justify-between text-left shadow-2xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Nominal Pas Pembayaran:</span>
                    <span className="text-base font-black text-[#081827] tracking-tight">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyNominal}
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

                {/* Hidden High-Res Canvas Source */}
                <div className="hidden">
                  <QRCodeCanvas
                    id="qris-canvas-source"
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

              {/* Legible Payment Application Badges */}
              <div className="bg-slate-50 px-3.5 py-3 border-t border-slate-200/80 text-center space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                  DAPAT DIBAYAR MENGGUNAKAN SEMUA APLIKASI
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {PAYMENT_CHANNELS.map((ch) => (
                    <span
                      key={ch.name}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ch.badge}`}
                    >
                      {ch.name}
                    </span>
                  ))}
                </div>
                <div className="text-[9px] text-slate-400">
                  Terstandarisasi Bank Indonesia & ASPI
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TRANSFER BANK JATIM RESMI ================= */}
          {activeTab === 'bank' && (
            <div className="border border-[#D4A359]/40 rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F6F2EB] shadow-xs max-w-[350px] sm:max-w-[370px] mx-auto text-left space-y-3.5 animate-in fade-in duration-200">
              {/* Header Bank Card */}
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#D4A359]/20 text-[#8E631F] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Rekening Resmi Bank Jatim
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-none mt-0.5">
                      PT Bank Pembangunan Daerah Jatim (Kode: 114)
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] font-extrabold text-[#8E631F] bg-[#D4A359]/15 border border-[#D4A359]/30 px-2 py-0.5 rounded-full">
                  Kas Pemkab
                </span>
              </div>

              {/* Nomor Rekening Row with Salin Button */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Nomor Rekening
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRekening}
                    className={`text-[10.5px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
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
                <div className="font-mono text-lg font-black text-slate-900 tracking-wider">
                  {OFFICIAL_BANK_DATA.noRekening}
                </div>
              </div>

              {/* Atas Nama Rekening Row */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-0.5 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Atas Nama Rekening
                </span>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {OFFICIAL_BANK_DATA.namaRekening}
                </div>
              </div>

              {/* Nominal Row with Salin Nominal Button */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Nominal Transfer Pas
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNominal}
                    className={`text-[10.5px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
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
                <div className="text-lg font-black text-[#092C48]">
                  Rp {total.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Security Guarantee Note */}
              <div className="flex items-start gap-1.5 text-[10.5px] text-slate-600 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Rekening resmi kas daerah Pendapatan Asli Daerah (PAD) Disbudpar Kab. Banyuwangi.
                </span>
              </div>
            </div>
          )}

          {/* Instruksi Pengunggahan Bukti */}
          <div className="bg-[#FCF8EF] border border-[#F5EEDB] rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 max-w-[350px] sm:max-w-[370px] mx-auto">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Setelah pembayaran selesai, simpan struk/tangkapan layar Anda lalu tekan tombol <strong>"Saya Sudah Membayar"</strong> di bawah untuk mengunggah bukti bayar.
            </p>
          </div>
        </main>

        {/* Footer Tombol Konfirmasi Pembayaran */}
        <footer className="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full py-3 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Saya Sudah Membayar</span>
          </button>
        </footer>

        {/* ================= MODAL UPLOAD BUKTI PEMBAYARAN (Darkened Backdrop with Blur) ================= */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 shadow-2xl relative border border-slate-100 text-center animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
              
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup modal upload"
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
                    Unggah foto atau screenshot struk transfer QRIS / Bank Jatim untuk verifikasi loket.
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
                  accept="image/jpeg,image/png,image/webp,application/pdf"
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
                          Format: JPG, PNG, WEBP (Maks. 5MB)
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
                        Pilih File dari Galeri / Kamera
                      </button>
                    </div>

                    {/* DEV ONLY TESTING OPTION (Strictly hidden in live production builds) */}
                    {import.meta.env.DEV && (
                      <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 flex items-center justify-between text-left">
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>[Mode Dev Only] Uji coba cepat</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleUseDemoReceipt}
                          className="text-[10.5px] font-bold text-[#092C48] hover:underline bg-white px-2 py-1 rounded-lg border border-amber-300 shadow-2xs cursor-pointer"
                        >
                          Isi Struk Demo
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* KONDISI 2: Sudah Ada Bukti Diunggah */
                  <div className="space-y-3 text-left animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Pratinjau Bukti Pembayaran</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ File Terpilih
                      </span>
                    </div>

                    {/* Preview Box */}
                    <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900/5 flex items-center justify-center p-2 group shadow-inner">
                      <img
                        src={uploadedReceipt}
                        alt="Preview Bukti Pembayaran"
                        className="max-h-56 w-full object-contain rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/sample-receipt.jpg';
                        }}
                      />
                      
                      {/* Zoom Overlay */}
                      <button
                        type="button"
                        onClick={() => setIsZoomOpen(true)}
                        aria-label="Perbesar pratinjau bukti bayar"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer backdrop-blur-[1px]"
                      >
                        <ZoomIn className="w-5 h-5 text-[#DAB36E]" />
                        <span>Klik untuk Perbesar Gambar</span>
                      </button>
                    </div>

                    {/* Action Buttons with Clear Labels & Aria-Labels */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="overflow-hidden pr-2 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate" title={fileName}>
                          {fileName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {fileSize}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsZoomOpen(true)}
                          aria-label="Perbesar pratinjau bukti pembayaran"
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#092C48] hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                          <span>Perbesar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          aria-label="Ganti foto bukti pembayaran"
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#092C48] hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                          <span>Ganti</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearReceipt}
                          aria-label="Hapus foto bukti pembayaran"
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Buttons inside Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={!uploadedReceipt}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    uploadedReceipt 
                      ? 'bg-[#092C48] hover:bg-[#071f33] text-white shadow-md active:scale-95 cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Kirimkan Bukti</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= LIGHTBOX ZOOM MODAL (Tampilan Penuh Bukti) ================= */}
        {isZoomOpen && uploadedReceipt && (
          <div 
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          >
            <div className="relative max-w-2xl max-h-[85vh] w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                aria-label="Tutup perbesaran gambar"
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

        {/* ================= LIGHTBOX ZOOM MODAL QRIS RESMI ================= */}
        {isQrZoomOpen && (
          <div 
            onClick={() => setIsQrZoomOpen(false)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div 
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsQrZoomOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup perbesaran QR"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <QRISLogo className="h-6 w-auto" />
                <span className="text-xs font-black text-rose-600 tracking-wider">QRIS RESMI</span>
              </div>

              <div className="text-xs font-bold text-slate-800">
                MUSEUM BLAMBANGAN BANYUWANGI
              </div>

              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl inline-block shadow-inner">
                <QRCodeCanvas
                  value={OFFICIAL_QRIS_PAYLOAD}
                  size={260}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg"
                  imageSettings={{
                    src: '/assets/museum-blambangan-emblem.png',
                    height: 42,
                    width: 42,
                    excavate: true,
                  }}
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[11px]">Total Tagihan:</span>
                <span className="font-extrabold text-[#092C48] text-base">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="w-full py-2.5 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#DAB36E]" />
                <span>Unduh Gambar QR ke HP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
