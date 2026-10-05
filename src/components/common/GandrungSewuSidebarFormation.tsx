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
  variant = 'gold',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top subtle fade gradient to blend naturally into dark blue sidebar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#081827] via-[#081827]/40 to-transparent z-10 pointer-events-none" />

      {/* Gandrung Sewu Formation Container */}
      <div className="relative w-full h-36 flex items-end justify-center px-1">
        {/* Dancer 1 (Far Left - Outer Formation) */}
        <div className="absolute left-1 bottom-0 w-16 h-24 opacity-15 transform -translate-x-1 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 2 (Mid Left - Second Layer) */}
        <div className="absolute left-8 bottom-1 w-20 h-28 opacity-25 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 3 (Center Lead Dancer - Primadonna Gandrung) */}
        <div className="relative z-10 w-24 h-34 opacity-35 filter drop-shadow-[0_2px_12px_rgba(212,163,89,0.35)] -mb-1">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu Utama"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 4 (Mid Right - Second Layer) */}
        <div className="absolute right-8 bottom-1 w-20 h-28 opacity-25 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Dancer 5 (Far Right - Outer Formation) */}
        <div className="absolute right-1 bottom-0 w-16 h-24 opacity-15 transform translate-x-1 filter drop-shadow">
          <img
            src="/assets/penari-gandrung-gold.png"
            alt="Gandrung Sewu"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Golden Stage Base Line with Batik Gajah Oling Accent */}
      <div className="relative z-10 w-full flex flex-col items-center pt-0.5">
        <div className="w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4A359]/40 to-transparent" />
        <div className="flex items-center gap-1.5 pt-1 text-[9px] text-[#D4A359]/75 font-semibold tracking-widest uppercase">
          <span className="w-1 h-1 rounded-full bg-[#D4A359]/70" />
          <span>Pesona Gandrung Sewu</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A359]/70" />
        </div>
      </div>
    </div>
  );
};
