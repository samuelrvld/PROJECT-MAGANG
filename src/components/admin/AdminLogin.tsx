import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { GajahOlingMotif } from '../common/GajahOlingMotif';

export const AdminLogin: React.FC = () => {
  const { setActiveView, loginAdmin, admins } = useBooking();
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
    <div className="min-h-screen bg-gradient-to-br from-[#061826] via-[#092C48] to-[#041422] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* ─── KAYA MOTIF BUDAYA BANYUWANGI (BACKGROUND WATERMARKS) ─── */}
      
      {/* Siluet Candi / Heritage Sisi Kiri */}
      <div className="absolute top-1/2 -left-16 -translate-y-1/2 w-80 h-96 opacity-15 pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Siluet Penari Gandrung Sisi Kanan */}
      <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-80 h-96 opacity-20 pointer-events-none select-none">
        <img
          src="/assets/penari-gandrung-gold.png"
          alt="Siluet Gandrung"
          className="w-full h-full object-contain filter drop-shadow-xl"
        />
      </div>

      {/* Ornamen Gajah Oling Sudut Kiri Bawah */}
      <div className="absolute -bottom-16 -left-16 w-80 h-96 opacity-25 pointer-events-none select-none">
        <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>

      {/* Cahaya Lembut Pusat Elegan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4A359]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── KARTU LOGIN UTAMA SESUAI MOCKUP ─── */}
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Tombol Kembali ke Pengunjung */}
        <div className="mb-3.5 flex items-center justify-between">
          <button
            onClick={() => setActiveView('user-landing')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#D4A359]" />
            <span>Kembali ke Laman Pengunjung</span>
          </button>
        </div>

        <div className="bg-[#FAF7F0] rounded-[32px] shadow-2xl border border-white/20 overflow-hidden text-slate-800 relative">
          
          {/* ─── HEADER DENGAN ARSITEKTUR GEDUNG & GELOMBANG EMAS ─── */}
          <div className="relative bg-[#071828] text-white pt-6 pb-9 px-6 overflow-hidden">
            
            {/* Foto Arsitektur Gedung Museum Blambangan di Sisi Kanan */}
            <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none select-none opacity-40 mix-blend-luminosity filter contrast-125 overflow-hidden">
              <img
                src="/assets/slide-1-gedung-museum-hd.jpg"
                alt="Gedung Museum Blambangan"
                className="w-full h-full object-cover object-[center_40%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071828] via-[#071828]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071828] via-transparent to-transparent" />
            </div>

            {/* Emblem dan Logo Museum Blambangan */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4A359] p-0.5 bg-[#081827] shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/assets/museum-blambangan-emblem.png"
                  alt="Emblem Museum Blambangan"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-left">
                <span className="font-serif text-sm sm:text-base font-bold tracking-wider text-white uppercase block leading-tight">
                  MUSEUM BLAMBANGAN
                </span>
                <span className="text-[10px] text-[#D4A359] font-semibold tracking-wide flex items-center gap-1 mt-0.5">
                  <span>✦</span>
                  <span>KAB. BANYUWANGI</span>
                </span>
              </div>
            </div>

            {/* Gelombang Kurva Pemisah dengan Garis Emas */}
            <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
              <svg
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
                className="w-full h-7 text-[#FAF7F0] fill-current"
              >
                <path d="M0,0 C150,45 350,15 500,45 L500,50 L0,50 Z" />
                <path d="M0,0 C150,45 350,15 500,45" fill="none" stroke="#D4A359" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* ─── FORM LOGIN BODY ─── */}
          <div className="p-6 sm:p-7 pt-4 space-y-4 relative bg-[#FAF7F0]">
            
            {/* Judul & Sub-judul */}
            <div className="text-center space-y-1">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1f33] tracking-normal leading-tight">
                Sistem Manajemen Museum
              </h1>
              <p className="text-[11.5px] text-slate-600 font-medium">
                Dinas Kebudayaan dan Pariwisata Kab. Banyuwangi
              </p>

              {/* Ornamen Budaya Keemasan di Tengah */}
              <div className="flex items-center justify-center gap-2 py-1.5 text-[#D4A359]">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A359]/70" />
                <span className="text-[11px] tracking-widest font-serif">⟡ ❖ ⟡</span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A359]/70" />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 relative z-10 text-left">
              {/* Field 1: Email / Username */}
              <div className="relative rounded-xl bg-[#F1ECE1] border border-[#E0D7C4] focus-within:border-[#0c233c] focus-within:bg-white transition-all shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan akun Anda"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-3.5 py-3 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
                />
              </div>

              {/* Field 2: Kata Sandi */}
              <div className="relative rounded-xl bg-[#F1ECE1] border border-[#E0D7C4] focus-within:border-[#0c233c] focus-within:bg-white transition-all shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
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

              {/* Remember Me & Help Link */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0c233c] accent-[#0c233c] focus:ring-[#0c233c] cursor-pointer"
                  />
                  <span className="text-[11.5px]">Ingat saya selama 30 hari</span>
                </label>

                <button
                  type="button"
                  onClick={() => setError('Bantuan: Gunakan akun staf magang terdaftar di bawah (password: admin123).')}
                  className="text-[#1E40AF] hover:underline text-[11px] font-semibold cursor-pointer"
                >
                  Bantuan & Panduan
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#0c233c] hover:bg-[#07192a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
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
                  </>
                )}
              </button>

              {/* Quick Select: Tim Magang D4 TRPL (Praktis untuk demo pengujian) */}
              <div className="pt-3 border-t border-[#E8DFC9] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Pilih Cepat Akun Staf Loket:</span>
                  <span className="text-[9.5px] text-[#D4A359] font-mono font-bold bg-[#092C48]/5 px-1.5 py-0.5 rounded">Poliwangi</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {(admins && admins.length > 0 ? admins.slice(0, 4) : [
                    { nama: 'Fitria Ayu P.', nim: '362358302016', role: 'Superadmin', pass: 'admin123' },
                    { nama: 'Syifa Kharisma N.', nim: '362358302019', role: 'Verifikator', pass: 'admin123' },
                    { nama: 'Rofi Nazar A.', nim: '362358302025', role: 'Petugas Loket', pass: 'admin123' },
                    { nama: 'Samuel Rivaldo S.', nim: '362358302156', role: 'Keuangan', pass: 'admin123' },
                  ]).map((m) => {
                    const identifier = m.nim || ('nip' in m ? m.nip : '') || ('username' in m ? m.username : '') || ('email' in m ? m.email : '');
                    const safeNama = m?.nama || 'Petugas';
                    const displayName = safeNama.length > 17
                      ? safeNama.split(' ').slice(0, 3).map((w, idx) => (idx === 2 && w ? w[0] + '.' : w)).join(' ')
                      : safeNama;
                    const isNonaktif = 'status' in m && m.status === 'Nonaktif';

                    return (
                      <button
                        key={m.nim || ('id' in m ? m.id : identifier)}
                        type="button"
                        onClick={() => {
                          setEmail(identifier);
                          setPassword(m.pass || 'admin123');
                          setError(null);
                        }}
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer group ${
                          isNonaktif 
                            ? 'border-slate-200 bg-slate-100/70 opacity-60 hover:opacity-100' 
                            : 'border-[#E0D7C4] bg-[#F4EFE6] hover:bg-[#D4A359]/15 hover:border-[#D4A359]/60'
                        }`}
                      >
                        <span className="block text-[11px] font-bold text-slate-800 group-hover:text-[#092C48] truncate">
                          {displayName}
                        </span>
                        <span className="block text-[9.5px] font-mono text-slate-500 group-hover:text-[#D4A359] truncate font-medium">
                          {identifier} • <span className={m.role === 'Superadmin' ? 'text-amber-700 font-bold' : ''}>{m.role}</span>
                          {isNonaktif ? ' (Nonaktif)' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Ornamen Gajah Oling Sudut Kiri Bawah Kartu */}
            <div className="absolute -bottom-4 -left-4 w-28 h-32 opacity-35 pointer-events-none select-none">
              <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>

            {/* Aksen Gelombang Emas di Bagian Dasar Kartu */}
            <div className="pt-2 text-center text-[10px] text-slate-500 font-medium relative z-10 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359]" />
              <span>UPTD Museum Blambangan Banyuwangi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
