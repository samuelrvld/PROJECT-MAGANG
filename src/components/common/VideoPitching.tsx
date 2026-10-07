import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  ChevronLeft, 
  Share2, 
  Sparkles, 
  Users, 
  Layers, 
  CheckCircle2, 
  FileVideo
} from 'lucide-react';
import { MuseumLogo } from './MuseumLogo';
import { GajahOlingMotif } from './GajahOlingMotif';

const CHAPTERS = [
  { time: 0, title: '01 • Pendahuluan & Proyek', desc: 'Pengenalan Sistem Informasi E-Ticketing Museum Blambangan' },
  { time: 5, title: '02 • Latar Belakang & Masalah', desc: 'Tantangan antrean fisik & risiko kebocoran retribusi manual' },
  { time: 11, title: '03 • Solusi: Ekosistem Digital', desc: 'Pemesanan 24/7, kuota sesi, QRIS resmi, & gate validator' },
  { time: 17, title: '04 • Pengalaman Wisatawan', desc: 'Pemesanan 3 langkah, tarif resmi, & E-Tiket PDF 300 DPI' },
  { time: 23, title: '05 • Gate Petugas & Scanner', desc: 'Kamera BarcodeDetector, audio beep indikator, & anti-duplikat' },
  { time: 29, title: '06 • Keuangan & PAD', desc: 'Laporan PAD transparan & rekapitulasi retribusi daerah' },
  { time: 35, title: '07 • Tim Mahasiswa TRPL', desc: 'Fitria Nur Aini, Syifa\'ul Qolbi, Ahmad Rofi Ridho, Samuel Christian H.' },
  { time: 42, title: '08 • Penutup & Implementasi', desc: 'Melestarikan sejarah dengan teknologi masa kini (Poliwangi 2026)' },
];

export const VideoPitching: React.FC = () => {
  const { setActiveView } = useBooking();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(47);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(CHAPTERS[0]);
  const [voiceoverActive, setVoiceoverActive] = useState(true);

  // Synchronize chapter and subtitles based on current time
  useEffect(() => {
    const active = [...CHAPTERS].reverse().find(c => currentTime >= c.time) || CHAPTERS[0];
    setCurrentChapter(active);
  }, [currentTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 47);
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#061524] text-white flex flex-col justify-between selection:bg-[#D4A359] selection:text-[#061524] relative overflow-hidden">
      
      {/* Background Batik Motif Accents */}
      <div className="absolute -top-12 -right-12 w-80 h-80 opacity-[0.05] pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
      </div>

      {/* ── TOPBAR ── */}
      <header className="px-4 sm:px-8 py-4 bg-[#092238]/90 backdrop-blur-md border-b border-[#1C3E60] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('user-web-portal')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Portal</span>
          </button>
          <div className="h-5 w-[1px] bg-white/20" />
          <MuseumLogo variant="white" className="h-7 w-auto" />
          <span className="hidden md:inline-block text-[11px] font-bold text-[#E5C287] bg-[#D4A359]/20 px-2.5 py-0.5 rounded-full border border-[#D4A359]/30">
            🎬 Video Pitching Proyek
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Download Button */}
          <a
            href="/assets/video_pitching_museum_blambangan.mp4"
            download="Video-Pitching-Museum-Blambangan-TRPL.mp4"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#D4A359] to-[#B38038] hover:from-[#E5C287] hover:to-[#D4A359] text-[#061524] font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Video (10.3 MB)</span>
          </a>
        </div>
      </header>

      {/* ── MAIN CONTENT: CINEMATIC VIDEO THEATER ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col justify-center space-y-4">
        
        {/* Title & Badge */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A359]/15 border border-[#D4A359]/30 text-[#E5C287] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
            <span>Presentasi Proyek Magang D4 TRPL Poliwangi</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Sistem Informasi E-Ticketing Museum Blambangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Video pitching resmi untuk pengujian magang, instansi Dinas Kebudayaan & Pariwisata Kab. Banyuwangi, serta publikasi pariwisata daerah.
          </p>
        </div>

        {/* Video Player Frame 16:9 */}
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-[#1C4268] shadow-2xl aspect-video group">
          <video
            ref={videoRef}
            src="/assets/video_pitching_museum_blambangan.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />

          {/* Big Play Button Overlay when Paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A359] to-[#996F2A] text-[#061524] flex items-center justify-center shadow-2xl shadow-[#D4A359]/40 hover:scale-110 active:scale-95 transition-transform">
                <Play className="w-10 h-10 ml-1.5 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* Bottom Custom Control Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-2 opacity-95 transition-opacity">
            {/* Timeline Scrubber */}
            <div className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden group/bar"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seekTo(pos * duration);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-[#D4A359] to-amber-300 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-lg hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => seekTo(0)}
                  className="p-2 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title="Ulangi dari Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="font-mono text-xs text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Active Chapter Label */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-bold text-[#E5C287]">
                <span>{currentChapter.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-2 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title="Layar Penuh"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CHAPTER SELECTOR & HIGHLIGHTS ── */}
        <div className="bg-[#092238] rounded-2xl p-4 border border-[#1C3E60] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E5C287]">
              <Layers className="w-4 h-4 text-[#D4A359]" />
              <span>Daftar Bab & Alur Pitching (Klik untuk Langsung Lompat)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Durasi: 47 Detik (8 Bab)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {CHAPTERS.map((ch, idx) => {
              const isCurrent = currentChapter.time === ch.time;
              return (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => seekTo(ch.time)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D4A359]/20 border-[#D4A359] text-white shadow-sm ring-1 ring-[#D4A359]'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isCurrent ? 'text-[#E5C287]' : 'text-slate-400'}>{formatTime(ch.time)}</span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#D4A359] animate-pulse" />}
                  </div>
                  <div className="font-extrabold text-xs mt-0.5 truncate">{ch.title.split('•')[1]?.trim() || ch.title}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{ch.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TEAM CREDIT CARD ── */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#081B2E] via-[#0E2C48] to-[#081B2E] border border-[#D4A359]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#D4A359]/20 border border-[#D4A359]/40 flex items-center justify-center text-[#D4A359] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Tim Mahasiswa Pengembang TRPL Poliwangi</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Fitria Nur Aini • Syifa'ul Qolbi • Ahmad Rofi Ridho • Samuel Christian H.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/assets/video_pitching_museum_blambangan.mp4"
              download="video_pitching_museum_blambangan.mp4"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileVideo className="w-4 h-4 text-[#D4A359]" />
              <span>Simpan MP4</span>
            </a>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="px-4 py-3 bg-[#04101A] border-t border-white/5 text-center text-[11px] text-slate-500">
        © 2026 Museum Blambangan Banyuwangi • Dinas Kebudayaan & Pariwisata Kab. Banyuwangi • Poliwangi
      </footer>
    </div>
  );
};
