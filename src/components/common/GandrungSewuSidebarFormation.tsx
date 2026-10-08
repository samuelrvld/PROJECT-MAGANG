import React from 'react';

interface GandrungSewuSidebarFormationProps {
  className?: string;
  variant?: 'gold' | 'white';
}

/**
 * GandrungSewuSidebarFormation
 * Menampilkan formasi siluet ribuan penari Gandrung (Festival Gandrung Sewu Banyuwangi).
 * Didesain artistik, simetris, dan berlapis dengan nuansa emas Banyuwangi,
 * memberikan latar belakang budaya yang megah namun tetap tenang dan enak dipandang.
 */
export const GandrungSewuSidebarFormation: React.FC<GandrungSewuSidebarFormationProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#102C4A]/80 via-[#0C233C]/80 to-[#081827]/95 border border-[#D4A359]/25 p-2.5 shadow-lg select-none ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Golden Ambient Light */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#D4A359]/15 to-transparent pointer-events-none" />

      {/* Dancers Formation */}
      <div className="relative w-full h-24 flex items-end justify-center px-1">
        {/* Dancer 1 (Far Left) */}
        <div className="absolute left-1 bottom-0 w-12 h-18 opacity-50 transform -translate-x-0.5 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 2 (Mid Left) */}
        <div className="absolute left-6 bottom-0.5 w-16 h-22 opacity-75 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 3 (Center Lead) */}
        <div className="relative z-10 w-20 h-24 opacity-100 filter drop-shadow-[0_2px_12px_rgba(212,163,89,0.45)] -mb-0.5">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu Utama"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 4 (Mid Right) */}
        <div className="absolute right-6 bottom-0.5 w-16 h-22 opacity-75 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 5 (Far Right) */}
        <div className="absolute right-1 bottom-0 w-12 h-18 opacity-50 transform translate-x-0.5 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Cultural Label Header / Footer */}
      <div className="pt-2 border-t border-white/10 relative z-10 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold tracking-widest text-[#E5C287] uppercase">
          <span className="w-1 h-1 rounded-full bg-[#D4A359]" />
          <span>Pesona Gandrung Sewu</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A359]" />
        </div>
        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight font-medium">
          Warisan Seni & Budaya Khas Banyuwangi
        </p>
      </div>
    </div>
  );
};
