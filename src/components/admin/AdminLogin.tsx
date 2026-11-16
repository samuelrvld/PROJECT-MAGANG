import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { INITIAL_ADMINS } from '../../data/mockData';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { setActiveView, loginAdmin, admins } = useBooking();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const staffList = (admins && admins.length > 0) ? admins : INITIAL_ADMINS;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Mohon masukkan Email, NIM, atau Username dan Kata Sandi terdaftar Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Akses ditolak. Akun atau kata sandi tidak cocok dengan data administrator terdaftar.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071B2D] via-[#051422] to-[#020A12] flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none">
      
      {/* Subtle Architectural Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0E3559]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#D4A359]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── KARTU LOGIN UTAMA RESMI ─── */}
      <div className="w-full max-w-[440px] relative z-10 flex flex-col">
        
        {/* Tombol Kembali ke Pengunjung */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setActiveView('user-landing')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#D4A359]" />
            <span>Kembali ke Laman Pengunjung</span>
          </button>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            v2.4 TRPL Poliwangi
          </span>
        </div>

        <div className="bg-[#FAF8F5] rounded-[28px] sm:rounded-[32px] shadow-2xl border border-white/20 overflow-hidden text-slate-800 relative flex flex-col">
          
          {/* ─── HEADER BANNER RESMI (EMBLEM & IDENTITAS INSTITUSI) ─── */}
          <div className="relative w-full overflow-hidden select-none bg-gradient-to-br from-[#071828] via-[#0C243B] to-[#071828] p-6 text-white border-b-2 border-[#D4A359]/30">
            {/* Subtle Authentic Museum Building Facade Watermark */}
            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-20 pointer-events-none overflow-hidden">
              <img
                src="/assets/museum-real-blambangan.jpg"
                alt="Gedung Museum Blambangan"
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071828] via-[#071828]/60 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-2.5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D4A359]/25 to-transparent p-1 border border-[#D4A359]/40 flex items-center justify-center shadow-lg">
                <img
                  src="/assets/museum-blambangan-emblem.png"
                  alt="Emblem Resmi Museum Blambangan"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>

              <div>
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#D4A359] bg-[#D4A359]/10 border border-[#D4A359]/30 px-3 py-0.5 rounded-full mb-1">
                  PORTAL KHUSUS ADMINISTRATOR
                </span>
                <h1 className="font-serif font-black text-xl text-white tracking-wide">
                  Sistem Manajemen Museum
                </h1>
                <p className="text-[11px] text-slate-300 font-medium">
                  Dinas Kebudayaan dan Pariwisata Kab. Banyuwangi
                </p>
              </div>
            </div>
          </div>

          {/* ─── FORM LOGIN BODY ─── */}
          <div className="p-4 sm:p-5 pt-3.5 space-y-3 bg-[#FAF7F0]">
            
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 text-left">
              {/* Field 1: Email, NIP atau Username */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Email, NIP atau Username</span>
                  <button
                    type="button"
                    onClick={() => setError('Validasi: Gunakan Email, NIM, atau Username yang terdaftar di bawah.')}
                    className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Validasi?
                  </button>
                </div>
                <div className="relative rounded-xl bg-[#F4EFE6] border border-[#E0D7C4] focus-within:border-[#0c233c] focus-within:bg-white transition-all shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan akun Anda"
                    required
                    autoComplete="username"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 2: Kata Sandi Petugas */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Kata Sandi Petugas</span>
                  <button
                    type="button"
                    onClick={() => setError('Kata sandi default untuk akun tim pengujian magang adalah: admin123')}
                    className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative rounded-xl bg-[#F4EFE6] border border-[#E0D7C4] focus-within:border-[#0c233c] focus-within:bg-white transition-all shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    autoComplete="current-password"
                    className="w-full pl-9 pr-9 py-2.5 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    aria-label="Tampilkan atau sembunyikan kata sandi"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help Link */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#0c233c] accent-[#0c233c] focus:ring-[#0c233c] cursor-pointer"
                  />
                  <span className="text-[11px]">Ingat saya selama 30 hari</span>
                </label>

                <button
                  type="button"
                  onClick={() => setError('Bantuan: Klik salah satu kartu staf magang di bawah untuk login instan (password: admin123).')}
                  className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                >
                  Bantuan & Panduan
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#0c233c] hover:bg-[#07192a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer mt-1"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Petugas...</span>
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#D4A359]" />
                    <span>Masuk ke Panel Admin</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4A359]" />
                  </>
                )}
              </button>
            </form>

            {/* ─── PILIH CEPAT AKUN TIM MAGANG / PETUGAS (POLIWANGI D4 TRPL) ─── */}
            <div className="pt-2 border-t border-[#E8DFC9] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[11px]">Pilih Cepat Akun Tim Magang/TPR:</span>
                <span className="text-[9.5px] text-[#C88D2D] font-bold bg-[#FDF6E2] border border-[#EEDFB3] px-2 py-0.5 rounded-md">
                  Poliwangi D4 TRPL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {staffList.slice(0, 4).map((acc) => {
                  const isSelected = 
                    email.trim().toLowerCase() === (acc.nim || '').toLowerCase() || 
                    email.trim().toLowerCase() === (acc.username || '').toLowerCase() || 
                    email.trim().toLowerCase() === (acc.email || '').toLowerCase();

                  const roleBadgeClass = 
                    acc.role === 'Superadmin'
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : acc.role === 'Keuangan'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : acc.role === 'Verifikator'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200';

                  return (
                    <button
                      key={acc.id || acc.nim}
                      type="button"
                      onClick={() => {
                        setEmail(acc.nim || acc.username || acc.email || '');
                        setPassword(acc.pass || 'admin123');
                        setError(null);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer group shadow-2xs relative ${
                        isSelected 
                          ? 'border-[#0c233c] bg-white ring-2 ring-[#0c233c]/20' 
                          : 'border-[#E0D7C4] bg-[#F4EFE6] hover:bg-[#FAF3E2] hover:border-[#D4A359]'
                      }`}
                      title={`Login sebagai ${acc.nama} (${acc.role})`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="block text-[11px] font-bold text-slate-900 group-hover:text-[#0c233c] truncate">
                          {acc.nama}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="block text-[9.5px] font-mono text-slate-600 group-hover:text-[#D4A359] truncate font-medium">
                          NIM: {acc.nim}
                        </span>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded border ${roleBadgeClass} shrink-0`}>
                          {acc.role}
                        </span>
                      </div>
                      <span className="block text-[8.5px] text-slate-400 group-hover:text-slate-600 truncate mt-0.5">
                        @{acc.username}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tagline Footer Kartu */}
            <div className="pt-1 pb-1 text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <span>🏛️</span>
              <span>Museum Blambangan Banyuwangi • Poliwangi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};