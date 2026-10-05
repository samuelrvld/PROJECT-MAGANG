// Helper to download composite official QRIS image with high quality
export interface QRISDownloadData {
  nama: string;
  jumlahOrang: number;
  kategori: string;
  tanggal: string;
  sesi: string;
  total: number;
  canvasSourceId?: string;
}

export const downloadOfficialQRISImage = (data: QRISDownloadData): boolean => {
  try {
    const {
      nama,
      jumlahOrang,
      kategori,
      tanggal,
      sesi,
      total,
      canvasSourceId = 'official-qris-canvas-source'
    } = data;

    const sourceCanvas = document.getElementById(canvasSourceId) as HTMLCanvasElement | null;
    if (!sourceCanvas) {
      console.warn('Source QR Canvas not found for element ID:', canvasSourceId);
      return false;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 790;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 1. Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 790);

    // 2. Header Navy Card
    ctx.fillStyle = '#092C48';
    ctx.fillRect(0, 0, 600, 92);

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MUSEUM BLAMBANGAN', 300, 42);
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#DAB36E';
    ctx.fillText('PEMBAYARAN RESMI QRIS • DINAS KEBUDAYAAN BANYUWANGI', 300, 68);

    // 3. QRIS Header Label
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 30px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QRIS', 300, 136);
    ctx.fillStyle = '#64748B';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('NMID: ID2024326864723 • Terminal: A01 • Bank Jatim', 300, 156);

    // 4. Draw QR Code Frame & Image
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(144, 176, 312, 312);
    ctx.drawImage(sourceCanvas, 150, 182, 300, 300);

    // 5. Total Pembayaran Box (Cream #FCF8EF)
    ctx.fillStyle = '#FCF8EF';
    ctx.fillRect(40, 508, 520, 96);
    ctx.strokeStyle = '#E9DFBE';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 508, 520, 96);

    ctx.fillStyle = '#64748B';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TOTAL PEMBAYARAN', 300, 536);

    ctx.fillStyle = '#092C48';
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Rp ${total.toLocaleString('id-ID')}`, 300, 578);

    // 6. Detail Ringkasan Pesanan & Rekening Bank Jatim
    ctx.fillStyle = '#334155';
    ctx.font = '12.5px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';

    const safeNama = nama ? nama.trim() : 'Pengunjung';
    const safeKategori = kategori ? kategori.trim() : 'Umum';
    const safeTanggal = tanggal ? tanggal.trim() : 'Tanggal Kunjungan';
    const safeSesi = sesi ? sesi.trim() : 'Sesi Kunjungan';

    ctx.fillText(`Pemesan   : ${safeNama} (${jumlahOrang} orang)`, 55, 632);
    ctx.fillText(`Kategori   : ${safeKategori}`, 55, 654);
    ctx.fillText(`Jadwal     : ${safeTanggal} • ${safeSesi}`, 55, 676);
    ctx.fillText(`Rekening  : Bank Jatim 0021005380 a.n DISBUDPAR KAB BANYUWANGI`, 55, 698);

    // Separator line
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(55, 706);
    ctx.lineTo(545, 706);
    ctx.stroke();

    // 7. Footer Instructions
    ctx.fillStyle = '#64748B';
    ctx.font = '11.5px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Simpan ke Galeri & bayar via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay', 300, 734);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10.5px system-ui, -apple-system, sans-serif';
    ctx.fillText('Unggah bukti pembayaran setelah transfer untuk menerbitkan E-Tiket resmi.', 300, 755);

    // 8. Trigger File Download (Support Web Share for iPhone Photos / Galeri & fallback anchor)
    const safeFileName = `QRIS-Museum-Blambangan-${safeNama.replace(/[^a-zA-Z0-9]/g, '_')}-Rp${total}.png`;
    const dataUrl = canvas.toDataURL('image/png');

    // If Web Share API with files is available (iPhone / iOS Safari / Android Chrome), open native Share Sheet for direct "Simpan Gambar"
    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const file = new File([blob], safeFileName, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'QRIS Pembayaran Museum Blambangan',
                text: `QRIS Pembayaran Museum Blambangan - Total Rp ${total.toLocaleString('id-ID')}`
              });
              return;
            }
          } catch (_) {
            // User cancelled share or failed, proceed to anchor download below
          }
        }
        // Fallback standard anchor click
        const downloadAnchor = document.createElement('a');
        downloadAnchor.download = safeFileName;
        downloadAnchor.href = dataUrl;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
      }, 'image/png');
      return true;
    }

    // Standard Desktop / non-share fallback
    const downloadAnchor = document.createElement('a');
    downloadAnchor.download = safeFileName;
    downloadAnchor.href = dataUrl;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    return true;
  } catch (err) {
    console.error('Failed to download QRIS image:', err);
    return false;
  }
};
