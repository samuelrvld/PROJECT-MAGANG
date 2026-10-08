import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCache = () => {
    try {
      localStorage.removeItem('mb_bookings');
      localStorage.removeItem('mb_current_booking');
      localStorage.removeItem('mb_notifications');
      localStorage.removeItem('mb_activities');
    } catch (_) {}
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#061826] via-[#092C48] to-[#041422] flex items-center justify-center p-4 text-white font-sans">
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Terjadi Kendala Memuat Halaman
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Sistem mendeteksi penumpukan memori lokal atau kendala saat memuat data. Jangan khawatir, data pesanan Anda tetap aman di Cloud Supabase.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] text-amber-200/90 font-mono overflow-auto max-h-32">
                <span className="font-bold text-amber-400">Pesan Sistem: </span>
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-[#D4A359] hover:bg-[#C2934B] text-[#081827] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearCache}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Bersihkan Cache & Reset</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href="#/"
                onClick={() => { this.setState({ hasError: false }); window.location.hash = '#/'; window.location.reload(); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Beranda Utama</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
