import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { MuseumLogo } from '../common/MuseumLogo';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

export const AdminLogin: React.FC = () => {
  const { setActiveView, loginAdmin } = useBooking();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Mohon masukkan Email/NIP dan Kata Sandi terdaftar Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Akses ditolak. Email/NIP atau kata sandi tidak cocok dengan data administrator terdaftar.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061826] via-[#092C48] to-[#041422] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* ─── KAYA MOTIF GAJAH OLING BANYUWANGI (BACKGROUND ORNAMENTS) ─── */}
      
      {/* Sudut Kiri Atas */}
      <div className="absolute -top-12 -left-12 w-72 h-80 opacity-20 pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Sudut Kanan Atas */}
      <div className="absolute -top-12 -right-12 w-72 h-80 opacity-20 pointer-events-none select-none scale-x-[-1]">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Sisi Kiri Tengah */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-64 h-72 opacity-10 pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
      </div>

      {/* Sisi Kanan Tengah */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-72 opacity-10 pointer-events-none select-none scale-x-[-1]">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
      </div>

      {/* Sudut Kiri Bawah */}
      <div className="absolute -bottom-16 -left-16 w-80 h-96 opacity-20 pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Sudut Kanan Bawah */}
      <div className="absolute -bottom-16 -right-16 w-80 h-96 opacity-20 pointer-events-none select-none scale-x-[-1]">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Cahaya Lembut Pusat Elegan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4A359]/8 rounded-full blur-3xl pointer-events-none" />

      {/* ─── KARTU LOGIN UTAMA ─── */}
      <div className="w-full max-w-[430px] relative z-10">
        
        {/* Tombol Kembali ke Pengunjung (Tanpa Portal Aman) */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setActiveView('user-landing')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#D4A359]" />
            <span>Kembali ke Laman Pengunjung</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden text-slate-800">
          
          {/* Card Header dengan Aksen Gajah Oling Mewah */}
          <div className="bg-[#092C48] text-white p-6 pb-7 text-center relative overflow-hidden border-b-2 border-[#D4A359]/30">
            {/* Watermark Gajah Oling Sisi Kanan Header */}
            <div className="absolute -top-4 -right-4 w-32 h-40 opacity-25 pointer-events-none select-none scale-x-[-1]">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>

            {/* Watermark Gajah Oling Sisi Kiri Header */}
            <div className="absolute -top-4 -left-4 w-32 h-40 opacity-25 pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 mb-3 shadow-inner">
                <MuseumLogo variant="white" className="h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A359]/20 text-[#D4A359] text-[10.5px] font-extrabold uppercase tracking-wider mb-2 border border-[#D4A359]/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Portal Khusus Administrator</span>
              </div>

              <h1 className="text-xl font-black text-white tracking-tight">
                Sistem Manajemen Museum
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-[290px] font-medium">
                Dinas Kebudayaan & Pariwisata Kab. Banyuwangi
              </p>
            </div>
          </div>

          {/* Form Login Body */}
          <div className="p-6 sm:p-7 space-y-4 relative">
            
            {/* Watermark Gajah Oling Lembut di Form Body */}
            <div className="absolute right-2 bottom-4 w-28 h-36 opacity-5 pointer-events-none select-none">
              <GajahOlingMotif variant="navy" className="w-full h-full object-contain" />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              {/* Field 1: Email / NIM / Username */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Email, NIM atau Username</span>
                  <span className="text-[10px] text-slate-400 font-normal">Wajib diisi</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: 362358302016 atau fitria_pratiwi"
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#092C48] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Kata Sandi */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Kata Sandi Petugas</span>
                  <span className="text-[10px] text-slate-400 font-normal">Default: admin123</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#092C48] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#092C48] focus:ring-[#092C48] border-slate-300 accent-[#092C48]"
                  />
                  <span className="font-semibold text-slate-700">Ingat sesi masuk</span>
                </label>
                <span className="text-[11px] text-slate-400 hover:text-slate-600">
                  Akses Terdaftar Resmi
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#092C48] hover:bg-[#071F33] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Petugas...</span>
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Panel Admin</span>
                    <ArrowRight className="w-4 h-4 text-[#D4A359]" />
                  </>
                )}
              </button>

              {/* Quick Select: Tim Magang D4 TRPL */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Pilih Cepat Akun Tim Magang TRPL:</span>
                  <span className="text-[9.5px] text-[#D4A359] font-mono font-bold bg-[#092C48]/5 px-1.5 py-0.5 rounded">Poliwangi</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { nama: 'Fitria Ayu P.', nim: '362358302016', role: 'Superadmin' },
                    { nama: 'Syifa Kharisma N.', nim: '362358302019', role: 'Verifikator' },
                    { nama: 'Rofi Nazar A.', nim: '362358302025', role: 'Loket' },
                    { nama: 'Samuel Rivaldo S.', nim: '362358302156', role: 'Keuangan' },
                  ].map((m) => (
                    <button
                      key={m.nim}
                      type="button"
                      onClick={() => {
                        setEmail(m.nim);
                        setPassword('admin123');
                        setError(null);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#D4A359]/10 hover:border-[#D4A359]/50 text-left transition-all cursor-pointer group"
                    >
                      <span className="block text-[11px] font-bold text-slate-800 group-hover:text-[#092C48] truncate">
                        {m.nama}
                      </span>
                      <span className="block text-[9.5px] font-mono text-slate-400 group-hover:text-[#D4A359] truncate">
                        {m.nim} • {m.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Footer of Card with Gajah Oling Accent */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-[10.5px] text-slate-600 flex items-center justify-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#092C48]" />
            <span className="font-semibold">Museum Blambangan Banyuwangi • Disbudpar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
