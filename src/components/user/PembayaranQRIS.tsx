import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  ChevronLeft, 
  Check, 
  UploadCloud, 
  X, 
  Trash2, 
  ZoomIn, 
  Download, 
  Copy,
  Building2,
  ShieldCheck,
  Clock,
  QrCode,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { downloadOfficialQRISImage } from '../../utils/qrisDownloadUtils';
import {
  BcaLogo,
  MandiriLogo,
  BriLogo,
  BniLogo,
  BankJatimLogo,
  GopayLogo,
  OvoLogo,
  DanaLogo,
  ShopeePayLogo,
  LinkAjaLogo,
  QrisOfficialBadge
} from '../common/PaymentLogos';

const OFFICIAL_QRIS_PAYLOAD = '00020101021126710019ID.CO.BANKJATIM.WWW01189360011400001592930215ID20240015907050303URE51440014ID.CO.QRIS.WWW0215ID20243268647230303URE5204939953033605802ID5917MUSEUM BLAMBANGAN6010BANYUWANGI61056841462070703A0163047681';

const OFFICIAL_BANK_DATA = {
  bank: 'Bank Jatim',
  namaRekening: 'DISBUDPAR KAB BANYUWANGI',
  noRekening: '0021005380',
  nmid: 'ID2024326864723',
  terminal: 'A01'
};

const PAYMENT_CHANNELS = [
  'Bank Jatim', 'BCA Mobile', 'Livin by Mandiri', 'BRImo', 'BNI Mobile', 
  'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'
];

export const PembayaranQRIS: React.FC = () => {
  const { setActiveView, formData, createBooking } = useBooking();
  const [activeTab, setActiveTab] = useState<'qris' | 'bank'>('qris');
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [isQrDownloaded, setIsQrDownloaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 15-Minute Countdown Timer
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

  // Multi-Category Dynamic Total Calculation
  const jmlDewasa = formData.jumlahDewasa !== undefined ? formData.jumlahDewasa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? 0 : (formData.jumlahOrang || 1));
  const jmlMahasiswa = formData.jumlahMahasiswa !== undefined ? formData.jumlahMahasiswa : (formData.kategori === 'Pelajar/Mahasiswa' || formData.kategori === 'Pelajar' ? (formData.jumlahOrang || 1) : 0);
  const jmlManca = formData.jumlahMancanegara || 0;
  const totalPengunjung = Math.max(1, jmlDewasa + jmlMahasiswa + jmlManca);
  const total = (jmlDewasa * 7500) + (jmlMahasiswa * 5000) + (jmlManca * 20000);

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
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            setUploadedReceipt(compressed);
          } else {
            setUploadedReceipt(rawUrl);
          }
        };
        img.onerror = () => setUploadedReceipt(rawUrl);
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQR = () => {
    const success = downloadOfficialQRISImage({
      nama: formData.nama || 'Pengunjung Museum',
      jumlahOrang: totalPengunjung,
      kategori: formData.kategori || 'Umum',
      tanggal: formData.tanggalKunjungan || '15 Agustus 2025',
      sesi: formData.sesi || 'Sesi I (Pagi)',
      total: total,
      canvasSourceId: 'official-qris-canvas-source'
    });
    if (success) {
      setIsQrDownloaded(true);
      setTimeout(() => setIsQrDownloaded(false), 3000);
    }
  };

  const handleSubmitPayment = () => {
    if (!uploadedReceipt) {
      alert('Mohon unggah foto bukti transfer atau tangkapan layar pembayaran terlebih dahulu.');
      return;
    }
    createBooking(uploadedReceipt);
    setActiveView('user-success');
  };

  return (
    <div className="min-h-screen bg-[#F0F3F7] sm:bg-[#EEF2F1] flex justify-center items-start sm:py-6 sm:px-4 font-sans text-slate-800">
      {/* Dashboard-Themed Container */}
      <div className="w-full max-w-full sm:max-w-2xl min-h-screen sm:min-h-[860px] bg-[#F8FAFC] flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-slate-300 overflow-hidden">
        
        {/* ================= HEADER: MUSEUM DASHBOARD NAVY PALETTE ================= */}
        <header className="bg-gradient-to-r from-[#081827] via-[#092C48] to-[#123E63] text-white px-4 py-3.5 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('user-summary')}
                className="p-1.5 -ml-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Kembali ke Ringkasan"
              >
                <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                  Pilih Metode Pembayaran
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#E5C287] font-medium leading-none mt-0.5">
                  Museum Blambangan Banyuwangi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#D4A359]/20 text-[#F3E2C4] border border-[#D4A359]/40 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                Step 3 / 3
              </span>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#081827] border-2 border-[#D4A359] p-1 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src="/assets/museum-blambangan-emblem.png"
                  alt="Museum Blambangan"
                  className="w-full h-full object-contain rounded-full drop-shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* STEPPER BAR (Selaras & Serasi dengan Palette Emas & Navy Museum Blambangan) */}
          <div className="mt-3 pt-2.5 border-t border-white/15">
            <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-6 text-xs">
              {/* Step 1: Inactive / Completed */}
              <div className="flex items-center gap-2 py-1.5 px-2 text-slate-300 font-medium opacity-85">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <span className="text-xs sm:text-sm text-slate-300 tracking-tight truncate">Jadwal & Tiket</span>
              </div>

              {/* Step 2: Inactive / Completed */}
              <div className="flex items-center gap-2 py-1.5 px-2 text-slate-300 font-medium opacity-85">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <span className="text-xs sm:text-sm text-slate-300 tracking-tight truncate">Data Pemesan</span>
              </div>

              {/* Step 3: Active Pill */}
              <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#D4A359]/15 text-white font-bold border border-[#D4A359]/60 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E5BE7E] to-[#D4A359] text-[#081827] text-[11px] flex items-center justify-center font-black shrink-0 shadow-xs">
                  3
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Pembayaran</span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= CONTENT MAIN ================= */}
        <main className="flex-1 px-3 sm:px-5 py-4 overflow-y-auto space-y-3.5 text-left">
          
          {/* COUNTDOWN TIMER BANNER */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4A359]/20 text-[#092C48] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#D4A359]" />
              </div>
              <div>
                <span className="text-[10.5px] text-slate-400 block font-semibold leading-tight">
                  Batas Waktu Pembayaran:
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                  {timeLeft > 0 ? 'Selesaikan sebelum kuota dilepas' : 'Waktu pembayaran telah berakhir'}
                </span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-lg font-mono text-xs sm:text-sm font-extrabold tracking-wider ${
              timeLeft < 180 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-[#092C48]'
            }`}>
              {formatCountdown(timeLeft)}
            </div>
          </div>

          {/* TOTAL TAGIHAN CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Total Pembayaran E-Tiket:</span>
              <span className="font-semibold text-slate-700">{totalPengunjung} Pengunjung</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-base sm:text-2xl font-extrabold text-[#092C48] tracking-tight">
                Rp {total.toLocaleString('id-ID')}
              </div>
              <button
                type="button"
                onClick={handleCopyNominal}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3 text-[#D4A359]" />
                <span>{copiedNominal ? 'Tersalin!' : 'Salin Nominal'}</span>
              </button>
            </div>
          </div>

          {/* TAB SWITCHER: QRIS VS TRANSFER BANK */}
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('qris')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'qris'
                  ? 'bg-white text-[#092C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#D4A359]" />
              <span>QRIS Resmi (Scan)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'bank'
                  ? 'bg-white text-[#092C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Transfer Bank Jatim</span>
            </button>
          </div>

          {/* TAB 1: QRIS RESMI BANK INDONESIA */}
          {activeTab === 'qris' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 text-center space-y-3.5">
              <div className="border-b border-slate-100 pb-2.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    QRIS RESMI BANK INDONESIA & ASPI
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  NMID: {OFFICIAL_BANK_DATA.nmid} • Merchant: MUSEUM BLAMBANGAN
                </p>
              </div>

              {/* QR Code Canvas */}
              <div className="flex flex-col items-center justify-center py-1">
                <div 
                  onClick={() => setIsQrZoomOpen(true)}
                  className="p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-sm cursor-pointer hover:border-[#092C48] transition-all relative group"
                  title="Klik untuk memperbesar QR Code"
                >
                  <QRCodeCanvas
                    id="official-qris-canvas-source"
                    value={OFFICIAL_QRIS_PAYLOAD}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="absolute inset-0 bg-slate-900/10 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> Perbesar
                    </span>
                  </div>
                </div>

                <span className="text-[10.5px] text-slate-400 mt-2">
                  Buka aplikasi M-Banking atau E-Wallet lalu arahkan kamera scan
                </span>
              </div>

              {/* Action Buttons for QR */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="py-2 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#092C48]" />
                  <span>{isQrDownloaded ? '✓ Tersimpan' : 'Unduh QRIS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrZoomOpen(true)}
                  className="py-2 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#092C48]" />
                  <span>Perbesar QR</span>
                </button>
              </div>

              {/* Supported Payment Channels: Official Brand Icons Only */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Mendukung Seluruh Bank & Dompet Digital (QRIS):
                  </span>
                  <QrisOfficialBadge className="h-4 sm:h-4.5 w-auto" />
                </div>

                {/* Grid of Clean Official Brand Icons Only */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 items-center">
                  {/* BCA */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="BCA Mobile">
                    <BcaLogo className="max-h-full max-w-full" />
                  </div>

                  {/* Mandiri */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="Livin' by Mandiri">
                    <MandiriLogo className="max-h-full max-w-full" />
                  </div>

                  {/* BRImo */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="BRImo">
                    <BriLogo className="max-h-full max-w-full" />
                  </div>

                  {/* BNI */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="BNI Mobile">
                    <BniLogo className="max-h-full max-w-full" />
                  </div>

                  {/* Bank Jatim */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="Bank Jatim JConnect">
                    <BankJatimLogo className="max-h-full max-w-full" />
                  </div>

                  {/* GoPay */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="GoPay">
                    <GopayLogo className="max-h-full max-w-full" />
                  </div>

                  {/* OVO */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="OVO">
                    <OvoLogo className="max-h-full max-w-full" />
                  </div>

                  {/* DANA */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="DANA">
                    <DanaLogo className="max-h-full max-w-full" />
                  </div>

                  {/* ShopeePay */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="ShopeePay">
                    <ShopeePayLogo className="max-h-full max-w-full" />
                  </div>

                  {/* LinkAja */}
                  <div className="h-10 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-center p-2" title="LinkAja">
                    <LinkAjaLogo className="max-h-full max-w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSFER BANK KASDA */}
          {activeTab === 'bank' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Rekening Kas Daerah (Kasda) Pemkab Banyuwangi
                </h3>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Transfer tepat sesuai nominal retribusi ke rekening resmi berikut
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                      <BankJatimLogo className="w-full h-full" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Penerima</span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#092C48]">
                        Bank Jatim (Kode: 114)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Kasda Resmi
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Rekening</span>
                    <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900">
                      {OFFICIAL_BANK_DATA.noRekening}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRekening}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-[#D4A359]" />
                    <span>{copiedRekening ? 'Tersalin!' : 'Salin No. Rek'}</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Atas Nama</span>
                  <span className="text-xs font-bold text-slate-800">
                    {OFFICIAL_BANK_DATA.namaRekening}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD BUKTI PEMBAYARAN CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-[#092C48]" />
                  <span>Unggah Bukti Pembayaran</span>
                  <span className="text-rose-500">*</span>
                </h3>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Lampirkan tangkapan layar (screenshot) atau struk transfer Anda
                </p>
              </div>
              {uploadedReceipt && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Siap
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {!uploadedReceipt ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-300 hover:border-[#092C48] rounded-xl bg-slate-50/60 hover:bg-slate-100/50 text-center transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 text-[#092C48] flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">
                  Pilih Foto Bukti Transfer
                </span>
                <span className="text-[10.5px] text-slate-400 block mt-0.5">
                  Format JPG, PNG atau WebP (Maksimal 5MB)
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={uploadedReceipt}
                    alt="Bukti Transfer"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {fileName || 'bukti-transfer.jpg'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {fileSize || 'Ukuran terkompresi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedReceipt(null);
                      setFileName('');
                      setFileSize('');
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OFFICIAL ASSURANCE BADGE */}
          <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Verifikasi tiket dilakukan resmi oleh sistem Museum Blambangan. E-tiket barcode resmi langsung aktif setelah bukti diverifikasi.
            </p>
          </div>
        </main>

        {/* ================= FIXED BOTTOM ACTION BAR ================= */}
        <footer className="bg-white border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg shrink-0 z-20">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Total Price */}
            <div className="text-left min-w-0">
              <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                Total Tagihan:
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#092C48] tracking-tight block leading-tight">
                Rp {total.toLocaleString('id-ID')}
              </span>
              <span className="text-[9.5px] text-slate-400 block font-normal">
                Bebas biaya admin
              </span>
            </div>

            {/* Right: Primary Action Button with Museum Palette */}
            <button
              type="button"
              onClick={handleSubmitPayment}
              disabled={!uploadedReceipt}
              className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl transition-all select-none shrink-0 cursor-pointer ${
                uploadedReceipt
                  ? 'bg-[#092C48] hover:bg-[#071f33] text-white shadow-md active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
              }`}
            >
              <span>Saya Sudah Bayar</span>
              <ArrowRight className="w-4 h-4 text-[#D4A359]" />
            </button>
          </div>
        </footer>

        {/* QR CODE ZOOM MODAL */}
        {isQrZoomOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-center space-y-3 relative shadow-2xl animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => setIsQrZoomOpen(false)}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-sm font-extrabold text-[#092C48] pt-1">
                Scan QRIS Resmi Museum
              </h4>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-center">
                <QRCodeCanvas
                  value={OFFICIAL_QRIS_PAYLOAD}
                  size={260}
                  level="H"
                />
              </div>

              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-800 block">MUSEUM BLAMBANGAN</span>
                <span>Nominal: Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsQrZoomOpen(false)}
                className="w-full py-2 bg-[#092C48] hover:bg-[#071f33] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
