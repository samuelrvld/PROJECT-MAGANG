import React, { useState, useRef, useEffect, useMemo } from 'react';
import jsQR from 'jsqr';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import type { Booking } from '../../types';
import { 
  Search, 
  Check, 
  Camera,
  UserCheck, 
  Plus,
  ShieldX,
  Eye,
  X,
  Smartphone,
  Image as ImageIcon,
  QrCode,
  AlertTriangle
} from 'lucide-react';
import { AdminWalkInModal } from './AdminWalkInModal';

export const AdminScanValidasi: React.FC = () => {
  const { 
    bookings, 
    checkInBooking,
    undoCheckIn,
    verifyBooking,
    setSelectedBookingId,
    setActiveView
  } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'checkedIn'>('pending');
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [proofModal, setProofModal] = useState<Booking | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ───── KALKULASI DAFTAR TAMU ─────
  // Tamu yang BELUM datang (belum check-in) — dibagi 2: sudah bayar & belum bayar
  const sudahBayarBelumHadir = useMemo(() =>
    bookings.filter(b => b.status === 'Terverifikasi' && b.checkInStatus !== 'Sudah Masuk'),
    [bookings]
  );
  const belumBayar = useMemo(() =>
    bookings.filter(b => b.status === 'Menunggu Verifikasi' && b.checkInStatus !== 'Sudah Masuk'),
    [bookings]
  );
  const sudahMasuk = useMemo(() =>
    bookings.filter(b => b.checkInStatus === 'Sudah Masuk'),
    [bookings]
  );

  // Gabung untuk tab "Belum Hadir" — sudah bayar dulu, belum bayar di bawah
  const allPending = useMemo(() => [...sudahBayarBelumHadir, ...belumBayar], [sudahBayarBelumHadir, belumBayar]);

  const displayedGuests = useMemo(() => {
    const list = activeTab === 'pending' ? allPending : sudahMasuk;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(b =>
      b.nama.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.telepon.includes(q)
    );
  }, [activeTab, allPending, sudahMasuk, searchQuery]);

  // ───── SUARA ─────
  const playChime = (ok: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = ok ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(ok ? 587.33 : 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  };

  // ───── FUNGSI UTAMA: TAMU SUDAH DATANG (hanya boleh untuk Terverifikasi) ─────
  const handleTamuDatang = (b: Booking) => {
    if (b.status !== 'Terverifikasi') return; // Extra guard
    playChime(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100]);
    checkInBooking(b.id);
    setSuccessMessage(`✅ ${b.nama} (${b.jumlahOrang} Orang) berhasil dicatat hadir. Silakan masuk!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // ───── KONFIRMASI QRIS SUDAH MASUK (hanya admin keuangan, redirect ke detail) ─────
  const handleLihatBuktiQRIS = (b: Booking) => {
    setSelectedBookingId(b.id);
    setProofModal(b);
  };

  const handleKonfirmasiDariProofModal = (b: Booking) => {
    verifyBooking(b.id);
    setProofModal(null);
    playChime(true);
    setSuccessMessage(`✅ Pembayaran QRIS ${b.nama} dikonfirmasi. Tamu dapat diizinkan masuk.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // ───── BATALKAN KEHADIRAN jika salah klik ─────
  const handleBatalHadir = (bookingId: string, nama: string) => {
    undoCheckIn(bookingId);
    setSuccessMessage(`Status kedatangan ${nama} telah dibatalkan.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ───── QR SCAN via Kamera (opsional) ─────
  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (cameraModalOpen) {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
          .then(s => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            interval = setInterval(() => {
              if (videoRef.current && videoRef.current.readyState >= 2 && ctx) {
                const v = videoRef.current;
                canvas.width = v.videoWidth || 640;
                canvas.height = v.videoHeight || 480;
                ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
                try {
                  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const code = jsQR(imgData.data, imgData.width, imgData.height);
                  if (code?.data) {
                    const found = bookings.find(b =>
                      b.id.toLowerCase() === code.data.trim().toLowerCase() ||
                      code.data.toLowerCase().includes(b.id.toLowerCase())
                    );
                    if (found) {
                      if (found.status === 'Terverifikasi') {
                        handleTamuDatang(found);
                        setCameraModalOpen(false);
                      } else {
                        playChime(false);
                        alert(`⛔ ${found.nama} — Pembayaran QRIS belum dikonfirmasi. Tamu tidak dapat masuk.`);
                      }
                    } else {
                      playChime(false);
                      alert('Tiket QR tidak ditemukan di sistem.');
                    }
                  }
                } catch (_) {}
              }
            }, 300);
          })
          .catch(() => {
            alert('Kamera tidak dapat dibuka. Gunakan pencarian nama tamu.');
            setCameraModalOpen(false);
          });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraModalOpen]);

  const handlePhotoScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const code = jsQR(ctx.getImageData(0, 0, img.width, img.height).data, img.width, img.height);
        if (code?.data) {
          const found = bookings.find(b =>
            b.id.toLowerCase() === code.data.trim().toLowerCase() ||
            code.data.toLowerCase().includes(b.id.toLowerCase())
          );
          if (found) {
            if (found.status === 'Terverifikasi') {
              handleTamuDatang(found);
              setCameraModalOpen(false);
            } else {
              playChime(false);
              alert(`⛔ ${found.nama} — Pembayaran QRIS belum dikonfirmasi. Tamu tidak dapat masuk.`);
            }
          } else {
            alert('Tiket tidak ditemukan.');
          }
        } else {
          alert('QR Code tidak terbaca dari foto.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ───── RENDER ─────
  return (
    <AdminLayout
      title="Validasi & Pindai QR Tiket"
      subtitle="Pindai QR Code tiket pengunjung, verifikasi kehadiran, dan check-in gate museum."
    >
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Pesan Sukses / Info Mengambang */}
        {successMessage && (
          <div className="p-4 bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-white/80 hover:text-white p-1">✕</button>
          </div>
        )}

        {/* ── BANNER PERINGATAN SISTEM QRIS-ONLY ── */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl">
          <QrCode className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-amber-900 text-sm">Museum Blambangan: Pembayaran QRIS Resmi</p>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              Uang masuk langsung ke rekening pemerintah. Tamu yang <strong>belum bayar QRIS</strong> (ditandai ⛔ Merah) <strong>tidak boleh diizinkan masuk</strong> meski meminta-minta. Minta tamu scan QR di layar loket & konfirmasi ke admin keuangan.
            </p>
          </div>
        </div>

        {/* ── BAR ATAS ── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWalkInModalOpen(true)}
            className="flex-1 py-3 px-4 bg-[#092C48] hover:bg-[#071f33] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4A359]" />
            <span>Beli Tiket Langsung di Loket</span>
          </button>

          <button
            type="button"
            onClick={() => setCameraModalOpen(true)}
            className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            title="Scan QR tiket di HP pengunjung"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>

        {/* ── KOLOM PENCARIAN ── */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Cari nama tamu... (contoh: Samuel)"
            className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-slate-200 focus:border-[#092C48] rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none shadow-xs transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
              ✕
            </button>
          )}
        </div>

        {/* ── 2 TAB ── */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pending' ? 'bg-white text-[#092C48] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⏳ Belum Hadir</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'pending' ? 'bg-[#092C48] text-white' : 'bg-slate-300 text-slate-700'}`}>
              {allPending.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checkedIn')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'checkedIn' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✅ Sudah Masuk</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'checkedIn' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
              {sudahMasuk.length}
            </span>
          </button>
        </div>

        {/* ── DAFTAR KARTU TAMU ── */}
        <div className="space-y-3">
          {displayedGuests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">
                {searchQuery
                  ? `Tidak ada nama "${searchQuery}" di daftar ini.`
                  : activeTab === 'pending'
                  ? 'Semua tamu reservasi sudah hadir dan masuk ke museum.'
                  : 'Belum ada tamu yang masuk hari ini.'}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-[#092C48] underline mt-1">
                  Tampilkan semua nama
                </button>
              )}
            </div>
          ) : (
            displayedGuests.map((b) => {
              const isPaid = b.status === 'Terverifikasi';
              const isInside = b.checkInStatus === 'Sudah Masuk';

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl p-4 sm:p-5 border-2 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isInside
                      ? 'bg-emerald-50 border-emerald-200'
                      : isPaid
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  {/* ── Info Tamu ── */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900 text-base leading-tight">{b.nama}</h3>
                      <span className="bg-blue-50 text-[#092C48] border border-blue-200 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                        {b.jumlahOrang} Orang
                      </span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {b.kategori}
                      </span>

                      {/* BADGE STATUS BAYAR — sangat mencolok */}
                      {isInside ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Sudah di Dalam
                        </span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> ✓ QRIS Lunas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-700 bg-red-100 border border-red-400 px-2.5 py-0.5 rounded-full animate-pulse">
                          <ShieldX className="w-3.5 h-3.5" /> ⛔ BELUM BAYAR
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{b.sesi}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{b.id}</span>
                      {b.telepon && b.telepon !== '-' && (
                        <>
                          <span>•</span>
                          <span>📱 {b.telepon}</span>
                        </>
                      )}
                    </div>

                    {/* Pesan khusus untuk yang belum bayar */}
                    {!isPaid && !isInside && (
                      <p className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 mt-1">
                        ⚠️ Tamu ini belum melakukan pembayaran QRIS. Minta tamu scan QRIS loket, lalu klik "Lihat & Konfirmasi Bukti QRIS" di bawah.
                      </p>
                    )}
                  </div>

                  {/* ── Tombol Aksi ── */}
                  <div className="shrink-0">
                    {isInside ? (
                      /* Sudah Masuk: tampilkan status + tombol batal kecil */
                      <button
                        type="button"
                        onClick={() => handleBatalHadir(b.id, b.nama)}
                        className="text-xs font-bold text-slate-400 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Batalkan status jika salah pencet"
                      >
                        Batal
                      </button>
                    ) : isPaid ? (
                      /* Sudah Bayar, Belum Hadir → TOMBOL HIJAU BESAR */
                      <button
                        type="button"
                        onClick={() => handleTamuDatang(b)}
                        className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>TAMU SUDAH DATANG</span>
                      </button>
                    ) : (
                      /* Belum Bayar → TOMBOL LIHAT BUKTI QRIS */
                      <button
                        type="button"
                        onClick={() => handleLihatBuktiQRIS(b)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        title="Lihat bukti pembayaran QRIS yang dikirim tamu"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Lihat & Konfirmasi Bukti QRIS</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── MODAL KONFIRMASI BUKTI QRIS (Anti-Kecolongan) ─── */}
      {proofModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setProofModal(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-amber-500 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Verifikasi Bukti QRIS</h3>
                <p className="text-xs text-amber-100 mt-0.5">Cocokkan nama & nominal di struk dengan pesanan</p>
              </div>
              <button onClick={() => setProofModal(null)} className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Pesanan */}
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Nama Tamu:</span>
                  <span className="font-extrabold text-slate-900">{proofModal.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Jumlah Orang:</span>
                  <span className="font-extrabold text-slate-900">{proofModal.jumlahOrang} Orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Kategori:</span>
                  <span className="font-bold text-slate-800">{proofModal.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Sesi Kunjungan:</span>
                  <span className="font-bold text-slate-800">{proofModal.sesi}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                  <span className="text-slate-500 font-bold">Total Harus Bayar:</span>
                  <span className="font-extrabold text-[#092C48] text-base">Rp{proofModal.totalPembayaran.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Bukti QRIS */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-700">Bukti QRIS yang dikirim tamu:</p>
                <div className="rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center min-h-[180px]">
                  {proofModal.buktiPembayaranUrl ? (
                    <img
                      src={proofModal.buktiPembayaranUrl}
                      alt="Bukti QRIS"
                      className="w-full object-contain max-h-64"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/sample-receipt.jpg';
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 space-y-2 text-slate-400">
                      <QrCode className="w-10 h-10 mx-auto" />
                      <p className="text-xs font-medium">Tidak ada foto bukti QRIS yang diunggah tamu.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Peringatan */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-amber-800">
                  Pastikan nominal di struk QRIS <strong>sesuai dengan total</strong> di atas sebelum mengkonfirmasi. Jangan konfirmasi jika nominal tidak sesuai atau foto tidak jelas.
                </p>
              </div>

              {/* 2 Tombol Aksi */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setProofModal(null)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  ✗ Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleKonfirmasiDariProofModal(proofModal)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer"
                >
                  ✓ Konfirmasi Lunas & Izinkan Masuk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL WALK-IN QRIS ─── */}
      <AdminWalkInModal
        isOpen={walkInModalOpen}
        onClose={() => setWalkInModalOpen(false)}
      />

      {/* ─── MODAL SCAN QR KAMERA ─── */}
      {cameraModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setCameraModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Scan QR Tiket Tamu</h3>
              <button type="button" onClick={() => setCameraModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square border-2 border-emerald-500 shadow-inner">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-white/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => cameraInputRef.current?.click()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <Smartphone className="w-4 h-4 text-[#092C48]" /><span>Foto HP</span>
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <ImageIcon className="w-4 h-4 text-emerald-600" /><span>Galeri</span>
              </button>
            </div>

            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoScan} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoScan} />

            <button type="button" onClick={() => setCameraModalOpen(false)}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
              Tutup & Gunakan Cari Nama Saja
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
