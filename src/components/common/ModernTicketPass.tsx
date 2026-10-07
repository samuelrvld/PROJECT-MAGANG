import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Tag, 
  Coins, 
  ShieldCheck, 
  MapPin, 
  Info,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import type { Booking } from '../../types';
import { MuseumLogo } from './MuseumLogo';
import { GajahOlingMotif } from './GajahOlingMotif';

interface ModernTicketPassProps {
  booking: Booking;
  onBack?: () => void;
  showActions?: boolean;
}

export const ModernTicketPass: React.FC<ModernTicketPassProps> = ({
  booking,
  onBack,
  showActions = true,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const printDocRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy Booking ID to Clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download PDF (Clean A4 PDF Export with identical design, razor-sharp 300 DPI)
  const handleDownloadPDF = async () => {
    const targetElement = printDocRef.current || ticketRef.current;
    if (!targetElement) return;
    try {
      setDownloading(true);
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      const canvas = await html2canvas(targetElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('master-pdf-ticket');
          if (el) {
            el.style.position = 'static';
            el.style.left = '0';
            el.style.top = '0';
            el.style.margin = '0 auto';
          }
        }
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
      const marginX = 12; // 12mm side margin
      const printWidth = pageWidth - marginX * 2; // 186 mm
      let printHeight = (canvas.height * printWidth) / canvas.width;

      // Ensure ticket fits on a single A4 page with balanced margins without cutting off
      let finalWidth = printWidth;
      let finalHeight = printHeight;
      const maxHeight = pageHeight - 20; // 10mm top and bottom margin
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      const xPos = (pageWidth - finalWidth) / 2;
      const yPos = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight, undefined, 'FAST');
      pdf.save(`E-Tiket-Resmi-Museum-Blambangan-${booking.id}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback: trigger print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Download Image (PNG) with iPhone Photos & Web Share support
  const handleDownloadImage = async () => {
    const targetElement = printDocRef.current || ticketRef.current;
    if (!targetElement) return;
    try {
      setDownloadingImg(true);
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(targetElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('master-pdf-ticket');
          if (el) {
            el.style.position = 'static';
            el.style.left = '0';
            el.style.top = '0';
            el.style.margin = '0 auto';
          }
        }
      });
      const fileName = `E-Tiket-Museum-Blambangan-${booking.id}.png`;
      const dataUrl = canvas.toDataURL('image/png', 1.0);

      // Native Web Share API support for iPhone / Android direct save to Photos
      if (navigator.share && canvas.toBlob) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const file = new File([blob], fileName, { type: 'image/png' });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                  files: [file],
                  title: `E-Tiket Museum Blambangan - ${booking.id}`,
                  text: `E-Tiket Resmi Museum Blambangan atas nama ${booking.nama} (${booking.id})`
                });
                return;
              }
            } catch (_) {}
          }
          // Fallback standard link
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 'image/png');
        return;
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error saving image:', err);
    } finally {
      setDownloadingImg(false);
    }
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🏛️ *E-TIKET RESMI MUSEUM BLAMBANGAN*\n\n` +
      `No. Booking: *${booking.id}*\n` +
      `Nama Pemesan: *${booking.nama}*\n` +
      `Kategori: *${booking.kategori}*\n` +
      `Jumlah: *${booking.jumlahOrang} Orang*\n` +
      `Tanggal: *${booking.tanggalKunjungan}*\n` +
      `Sesi: *${booking.sesi}*\n` +
      `Total Pembayaran: *Rp ${booking.totalPembayaran.toLocaleString('id-ID')}*\n` +
      `Status: *LUNAS & TERVERIFIKASI*\n\n` +
      `Silakan tunjukkan QR Code pada tiket kepada petugas loket saat berkunjung. Terima kasih!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Dedicated Isolated Print Ticket Function: Prints ONLY the ticket in an isolated iframe with zero web chrome
  const handleDirectPrint = () => {
    try {
      const ticketElement = document.getElementById('visual-ticket');
      if (!ticketElement) {
        window.print();
        return;
      }

      // Create an invisible iframe specifically for printing
      const printIframe = document.createElement('iframe');
      printIframe.setAttribute('style', 'position:fixed;top:0;left:0;width:0;height:0;border:0;visibility:hidden;z-index:-9999;');
      document.body.appendChild(printIframe);

      const iframeDoc = printIframe.contentDocument || printIframe.contentWindow?.document;
      if (!iframeDoc) {
        window.print();
        return;
      }

      // Clone visual ticket element
      const clonedTicket = ticketElement.cloneNode(true) as HTMLElement;
      clonedTicket.style.maxWidth = '460px';
      clonedTicket.style.margin = '0 auto';
      clonedTicket.style.boxShadow = 'none';
      clonedTicket.style.border = '1.5px solid #081827';
      clonedTicket.style.borderRadius = '16px';
      clonedTicket.style.pageBreakInside = 'avoid';
      clonedTicket.style.breakInside = 'avoid';

      // Grab existing stylesheets from head
      let stylesHtml = '';
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
        stylesHtml += node.outerHTML;
      });

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="id">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>E-Tiket Resmi Museum Blambangan - ${booking.id}</title>
            ${stylesHtml}
            <style>
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              *, *::before, *::after {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                box-sizing: border-box !important;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #FFFFFF !important;
                color: #0F172A !important;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
              }
              .print-container {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 10px 0;
                width: 100%;
              }
              img, svg, canvas {
                image-rendering: -webkit-optimize-contrast !important;
                image-rendering: crisp-edges !important;
                max-width: 100% !important;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${clonedTicket.outerHTML}
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
        } catch (e) {
          console.error('Iframe print error, falling back to window.print():', e);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 1500);
        }
      }, 400);
    } catch (err) {
      console.error('Error during direct print:', err);
      window.print();
    }
  };

  // Category Color Badge
  const getCategoryBadgeClass = (category: string) => {
    if (category.toLowerCase().includes('pelajar rombongan')) {
      return 'bg-teal-50 text-teal-800 border-teal-200';
    }
    if (category.toLowerCase().includes('pelajar') || category.toLowerCase().includes('mahasiswa')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (category.toLowerCase().includes('mancanegara')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Visual Ticket Container (Capturable with html2canvas & Isolated for Print) */}
      <div
        ref={ticketRef}
        id="visual-ticket"
        className="w-full bg-white rounded-[28px] shadow-xl border border-slate-200/90 overflow-hidden relative text-slate-800 select-none printable-ticket print:shadow-none print:border print:border-slate-300 print:m-0"
      >
        {/* Header E-Tiket */}
        <div 
          className="relative bg-gradient-to-br from-[#081827] via-[#0E2C4A] to-[#07192A] text-white p-5 sm:p-6 overflow-hidden border-b-2 border-[#D4A359]/40"
          style={{ backgroundColor: '#081827', color: '#FFFFFF' }}
        >
          {/* Ornamen Siluet Penari Gandrung */}
          <div className="absolute -right-6 -top-4 w-52 h-56 sm:w-60 sm:h-64 opacity-35 pointer-events-none">
            <img
              src="/assets/penari-gandrung-gold.png"
              alt="Penari Gandrung"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.3)]"
              crossOrigin="anonymous"
            />
          </div>

          {/* Ornamen Siluet Penari Seblang */}
          <div className="absolute -left-3 -bottom-2 w-36 h-44 sm:w-40 sm:h-48 opacity-40 pointer-events-none scale-x-[-1]">
            <img
              src="/assets/penari-seblang-bold-gold.png"
              alt="Penari Seblang"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.35)]"
              crossOrigin="anonymous"
            />
          </div>

          {/* Top Bar: Regional Heritage Agency & Museum Crest */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/15">
            <div className="flex items-center gap-3">
              <MuseumLogo variant="white" className="h-7 sm:h-8" />
            </div>

            <div 
              className="flex items-center gap-1.5 bg-[#D4A359]/20 text-[#F5DEB3] border border-[#D4A359]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-xs"
              style={{ borderColor: 'rgba(212,163,89,0.5)', color: '#F5DEB3' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>E-TIKET RESMI</span>
            </div>
          </div>

          {/* Ticket Title & Booking Code */}
          <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A359] block mb-0.5">
                Karcis Masuk Wisata Budaya
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white" style={{ color: '#FFFFFF' }}>
                MUSEUM BLAMBANGAN
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Pemerintah Kabupaten Banyuwangi • Disbudpar
              </p>
            </div>

            {/* Prominent Booking Code Pill with Copy */}
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 flex items-center justify-between gap-2.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Kode Booking
                </span>
                <span className="text-sm sm:text-base font-extrabold tracking-widest text-[#D4A359] font-mono">
                  {booking.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer print:hidden"
                title="Salin Kode Booking"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= TICKET PERFORATION & NOTCHES ================= */}
        <div className="relative h-6 bg-white flex items-center justify-between overflow-hidden">
          {/* Left Semicircle Notch */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 shadow-inner" />
          
          {/* Dashed Perforation Line */}
          <div className="w-full border-b-2 border-dashed border-slate-300/80 mx-6" />

          {/* Right Semicircle Notch */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 shadow-inner" />
        </div>

        {/* ================= TICKET BODY ================= */}
        <div className="p-5 sm:p-6 pt-2 space-y-4 sm:space-y-4 bg-white relative">
          {/* QR Code Validation Showcase */}
          <div className="relative z-10 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="relative p-3.5 bg-white rounded-2xl border border-slate-200 shadow-md">
              {/* Gold Corner Accents */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#D4A359] rounded-tl-sm" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#D4A359] rounded-tr-sm" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#D4A359] rounded-bl-sm" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#D4A359] rounded-br-sm" />

              <QRCodeCanvas
                value={`VERIFIED_TICKET:${booking.id}:${booking.nama}:${booking.tanggalKunjungan}:${booking.sesi}`}
                size={160}
                level="Q"
                includeMargin={false}
              />
            </div>

            <div className="mt-3.5 text-center">
              <span className="text-[10.5px] font-extrabold text-[#081827] uppercase tracking-wider block">
                PINDAI DI PINTU MASUK / LOKET RESMI
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Tunjukkan QR Code ini kepada petugas gerbang untuk check-in kunjungan.
              </span>
            </div>

            {/* Barcode Garis Boarding Pass */}
            <div className="mt-3 pt-3 border-t border-slate-200 w-full flex flex-col items-center">
              <div className="flex items-center gap-[2px] h-6 px-4">
                {[4, 2, 6, 2, 1, 3, 5, 2, 4, 1, 3, 6, 2, 3, 1, 5, 2, 4, 3, 1, 6, 2, 4, 2, 5, 1, 3, 6, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-800 rounded-xs"
                    style={{
                      width: i % 3 === 0 ? '3px' : '1.5px',
                      height: `${12 + h * 1.8}px`
                    }}
                  />
                ))}
              </div>
              <span className="text-[9.5px] font-mono tracking-widest text-slate-500 mt-1 uppercase">
                * {booking.id} *
              </span>
            </div>
          </div>

          {/* Visitor Details Grid (Refined Symmetrical Layout & Clean Margins) */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 text-left">
            {/* 1. Nama Pemesan */}
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Nama Pengunjung</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm capitalize leading-snug break-words">
                {booking.nama || 'Pengunjung Museum'}
              </div>
            </div>

            {/* 2. Kategori Pengunjung */}
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Kategori Tiket</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(booking.kategori)}`}>
                  {booking.kategori}
                </span>
              </div>
            </div>

            {/* 3. Tanggal Kunjungan */}
            <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Tanggal</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-snug">
                {booking.tanggalKunjungan}
              </div>
            </div>

            {/* 4. Sesi Kunjungan */}
            <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Sesi Waktu</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-snug break-words">
                {booking.sesi}
              </div>
            </div>

            {/* 5. Jumlah Orang */}
            <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Jumlah Pengunjung</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-snug">
                {booking.jumlahOrang} Orang
              </div>
            </div>

            {/* 6. Pintu Masuk / Gate */}
            <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 min-h-[66px] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#0E2C4A]" />
                <span>Pintu Masuk</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-snug">
                Gate Utama Museum
              </div>
            </div>
          </div>

          {/* Payment & Invoice Status Summary */}
          <div className="relative z-10 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 border border-amber-200/90 shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Total Pembayaran (Lunas)</span>
              </span>
              <span className="text-lg sm:text-xl font-black text-[#081827] block mt-0.5">
                Rp {booking.totalPembayaran.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="bg-[#16A34A] text-white font-black text-[10.5px] px-3 py-1 rounded-full shadow-2xs tracking-wider">
                ✓ LUNAS & SAH
              </div>
              <span className="block text-[9.5px] font-semibold text-slate-500 mt-1">
                Terverifikasi QRIS Resmi
              </span>
            </div>
          </div>

          {/* Visitation Guidelines */}
          <div className="relative z-10 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 text-left text-[10px] text-slate-700 space-y-1">
            <div className="font-bold flex items-center gap-1 text-[#081827]">
              <Info className="w-3.5 h-3.5 text-[#0E2C4A]" />
              <span>Petunjuk Kunjungan Museum:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
              <li>Harap hadir di lokasi 10 menit sebelum jam sesi dimulai.</li>
              <li>Bagi kategori Pelajar/Mahasiswa harap membawa kartu identitas/kartu pelajar.</li>
              <li>Dilarang menyentuh benda bersejarah dan wajib menjaga kebersihan museum.</li>
            </ul>
          </div>
        </div>

        {/* Ticket Bottom Security Strip */}
        <div className="bg-slate-100 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-mono">
          <span>ORIGINAL DIGITAL PASS • PEMKAB BANYUWANGI</span>
          <span>GATE SCAN VERIFIED</span>
        </div>
      </div>

      {/* ================= TICKET ACTIONS TOOLBAR (Harmonious Button Hierarchy) ================= */}
      {showActions && (
        <div className="w-full mt-4 space-y-2.5 print:hidden">
          {/* Gate Scan Tip */}
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center gap-2 text-[10.5px] text-amber-900 shadow-2xs text-left">
            <span className="text-amber-600 font-bold shrink-0">💡 Tips:</span>
            <span>Tingkatkan kecerahan layar HP Anda agar QR Code mudah dipindai oleh scanner petugas loket.</span>
          </div>
          {/* Baris 1: Aksi Utama (Unduh / Simpan) - Seragam Metallic Blue & Gold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="py-2.5 px-3.5 bg-[#081827] hover:bg-[#0E2C4A] text-white font-bold text-xs rounded-xl border border-[#D4A359]/30 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4A359]" /> : <Download className="w-3.5 h-3.5 text-[#D4A359]" />}
              <span>Unduh PDF Resmi</span>
            </button>

            {/* Save Image (PNG) */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloadingImg}
              className="py-2.5 px-3.5 bg-[#081827] hover:bg-[#0E2C4A] text-white font-bold text-xs rounded-xl border border-[#D4A359]/30 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {downloadingImg ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4A359]" /> : <ImageIcon className="w-3.5 h-3.5 text-[#D4A359]" />}
              <span>Simpan Foto (Galeri HP)</span>
            </button>
          </div>

          {/* Baris 2: Aksi Pendukung (Kirim WA & Cetak) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Share to WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2 px-3.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kirim ke WhatsApp</span>
            </button>

            {/* Print Ticket (Isolated, pristine 1-page print) */}
            <button
              type="button"
              onClick={handleDirectPrint}
              className="py-2 px-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Tiket (Print)</span>
            </button>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-[#081827] transition-colors text-center cursor-pointer"
            >
              ← Kembali ke Daftar Tiket
            </button>
          )}
        </div>
      )}

      {/* ================= MASTER PRINT/PDF DOCUMENT (FIXED PROPORTION A4 TEMPLATE) ================= */}
      {/* Rendered off-screen with fixed 720px width so downloaded PDF & images are 100% crisp, centered, and never clipped */}
      <div
        ref={printDocRef}
        id="master-pdf-ticket"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '720px',
          backgroundColor: '#FFFFFF',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#0F172A',
          padding: '24px 28px',
          boxSizing: 'border-box',
          zIndex: -999,
          pointerEvents: 'none',
        }}
      >
        {/* Official Kop Surat Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '3px double #081827' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#081827', border: '2px solid #D4A359', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img
                src="/assets/museum-blambangan-emblem.png"
                alt="Emblem"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                crossOrigin="anonymous"
              />
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: '#64748B', textTransform: 'uppercase' }}>
                Pemerintah Kabupaten Banyuwangi
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase' }}>
                Dinas Kebudayaan dan Pariwisata
              </div>
              <div style={{ fontSize: '17px', fontWeight: '900', color: '#081827', letterSpacing: '0.04em' }}>
                UPTD MUSEUM BLAMBANGAN
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                Jl. Jenderal A. Yani No. 78, Taman Baru, Banyuwangi, Jawa Timur 68416 • Telp: +62 852-8725-8502
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            <MuseumLogo variant="dark" className="h-7 mb-1" />
            <div style={{ display: 'inline-block', backgroundColor: '#081827', color: '#F5DEB3', padding: '3px 10px', borderRadius: '20px', fontSize: '9.5px', fontWeight: '800', border: '1px solid #D4A359' }}>
              E-TIKET RESMI SAH
            </div>
            <div style={{ fontSize: '8.5px', color: '#64748B', marginTop: '2px', fontFamily: 'monospace' }}>
              TERVERIFIKASI SISTEM
            </div>
          </div>
        </div>

        {/* Header E-Tiket PDF */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', padding: '12px 18px', backgroundColor: '#081827', borderRadius: '12px', color: '#FFFFFF' }}>
          {/* Ornamen Gandrung PDF */}
          <div style={{ position: 'absolute', right: '-12px', top: '-12px', width: '130px', height: '130px', opacity: 0.3, pointerEvents: 'none' }}>
            <img
              src="/assets/penari-gandrung-gold.png"
              alt="Gandrung"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>
          {/* Ornamen Seblang PDF */}
          <div style={{ position: 'absolute', left: '-8px', bottom: '-8px', width: '95px', height: '115px', opacity: 0.38, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
            <img
              src="/assets/penari-seblang-bold-gold.png"
              alt="Seblang"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#D4A359', fontWeight: '700', letterSpacing: '0.08em' }}>
              Surat Karcis Masuk Wisata Budaya
            </div>
            <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '0.02em' }}>
              E-TIKET KUNJUNGAN MUSEUM BLAMBANGAN
            </div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '600' }}>
              Nomor Booking
            </div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#F3E2C4', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
              {booking.id}
            </div>
          </div>
        </div>

        {/* Main Ticket Pass Card: Split 2 Columns (Left: QR Code Gate Scan, Right: Visitor & Schedule Details) */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', marginTop: '14px', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '16px', backgroundColor: '#F8FAFC' }}>
          {/* Left Column: QR Code & Security Barcode */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ border: '2px solid #D4A359', padding: '8px', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
              <QRCodeCanvas
                value={`VERIFIED_TICKET:${booking.id}:${booking.nama}:${booking.tanggalKunjungan}:${booking.sesi}`}
                size={150}
                level="H"
                includeMargin={false}
              />
            </div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#081827', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PINDAI DI PINTU MASUK
            </div>
            <div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px', lineHeight: '1.2' }}>
              Tunjukkan QR Code ini kepada petugas gate loket museum
            </div>
            {/* 1D Barcode Strip */}
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #E2E8F0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '20px' }}>
                {[4, 2, 6, 2, 1, 3, 5, 2, 4, 1, 3, 6, 2, 3, 1, 5, 2, 4, 3, 1, 6, 2, 4, 2, 5, 1, 3, 6, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#1E293B',
                      width: i % 3 === 0 ? '3px' : '1.5px',
                      height: `${10 + h * 1.5}px`
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#64748B', marginTop: '2px', letterSpacing: '0.15em' }}>
                * {booking.id} *
              </span>
            </div>
          </div>

          {/* Right Column: Grid Details of Visitor & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left' }}>
              {/* Nama Pengunjung */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Nama Pengunjung
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px', textTransform: 'capitalize' }}>
                  {booking.nama || 'Pengunjung Museum'}
                </div>
              </div>

              {/* Kategori Tiket */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Kategori Wisatawan
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#081827', marginTop: '2px' }}>
                  {booking.kategori}
                </div>
              </div>

              {/* Tanggal Kunjungan */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Tanggal Kunjungan
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {booking.tanggalKunjungan}
                </div>
              </div>

              {/* Sesi Waktu */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Sesi Waktu
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {booking.sesi}
                </div>
              </div>

              {/* Jumlah Rombongan */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Jumlah Pengunjung
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {booking.jumlahOrang} Orang
                </div>
              </div>

              {/* Pintu Masuk / Gate */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  Pintu Masuk
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  Gate Utama Museum
                </div>
              </div>
            </div>

            {/* Payment Box Summary */}
            <div style={{ marginTop: '10px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748B', fontWeight: '700' }}>
                  Total Pembayaran Retribusi
                </div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#081827', marginTop: '1px' }}>
                  Rp {booking.totalPembayaran.toLocaleString('id-ID')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                  ✓ LUNAS & SAH
                </span>
                <div style={{ fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
                  {booking.metodePembayaran || 'QRIS Resmi Disbudpar'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules & Visitor Guidelines Box */}
        <div style={{ marginTop: '14px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '10px 14px', textAlign: 'left' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#081827', marginBottom: '4px', textTransform: 'uppercase' }}>
            Petunjuk dan Ketentuan Berkunjung:
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '9.5px', color: '#334155', lineHeight: '1.45' }}>
            <li>Harap hadir di lokasi loket museum sekurang-kurangnya 10 menit sebelum jam sesi dimulai.</li>
            <li>Tunjukkan dokumen digital atau cetak ini kepada petugas loket untuk proses validasi gate.</li>
            <li>Bagi pengunjung kategori Pelajar/Mahasiswa wajib dapat menunjukkan Kartu Pelajar aktif jika diminta.</li>
            <li>Dilarang menyentuh artefak koleksi, membawa makanan/minuman ke ruang pameran, serta wajib menjaga ketertiban.</li>
          </ul>
        </div>

        {/* Legal Footer & Verification Timestamp */}
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', color: '#64748B' }}>
          <div>
            Dokumen ini sah dan diterbitkan secara elektronik oleh Dinas Kebudayaan & Pariwisata Kab. Banyuwangi.
          </div>
          <div style={{ fontWeight: '600' }}>
            Banyuwangi Rebound • The Sunrise of Java
          </div>
        </div>
      </div>
    </div>
  );
};
