import React from 'react';

interface SiluetPenariGandrungProps {
  className?: string;
  variant?: 'gold' | 'metallic-blue' | 'white';
  style?: React.CSSProperties;
  opacity?: number;
}

export const SiluetPenariGandrung: React.FC<SiluetPenariGandrungProps> = ({
  className = '',
  variant = 'gold',
  style,
  opacity,
}) => {
  const strokeColor =
    variant === 'metallic-blue'
      ? '#4A90E2'
      : variant === 'white'
      ? '#F8FAFC'
      : '#D4A359'; // Heritage Gold

  const glowColor =
    variant === 'metallic-blue'
      ? '#2A6496'
      : variant === 'white'
      ? '#CBD5E1'
      : '#F3E2C4';

  return (
    <svg
      viewBox="0 0 240 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{
        opacity: opacity !== undefined ? opacity : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`gandrung-stroke-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.95" />
          <stop offset="50%" stopColor={strokeColor} stopOpacity="0.85" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id={`gandrung-fill-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
        </linearGradient>

        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g stroke={`url(#gandrung-stroke-${variant})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* ================= 1. OMPROK (MAHKOTA PENARI GANDRUNG) ================= */}
        {/* Garuda Mungkur Crest */}
        <path d="M128 28 C124 16 132 10 135 6 C138 12 142 20 134 28" fill={`url(#gandrung-fill-${variant})`} />
        {/* Crown Arch Tiers */}
        <path d="M118 36 C124 22 144 22 150 36 C154 44 148 48 142 46 C134 44 126 44 118 36 Z" fill={`url(#gandrung-fill-${variant})`} />
        {/* Crown Winglets (Sayap Omprok) */}
        <path d="M112 38 C102 34 100 44 106 50 C112 48 116 46 120 44" />
        <path d="M152 38 C162 34 164 44 158 50 C152 48 148 46 144 44" />
        {/* Forehead Pilis Band & Ronce Tassel */}
        <path d="M118 48 Q134 52 148 48" strokeWidth="2" />
        {/* Ronce Melati dangling near left cheek */}
        <path d="M112 50 Q106 65 108 78" strokeWidth="1.2" strokeDasharray="1 3" />
        <circle cx="108" cy="80" r="2" fill={strokeColor} />

        {/* ================= 2. HEAD & NECK PROFILE ================= */}
        {/* Graceful face profile tilted slightly right */}
        <path d="M136 49 C140 54 142 58 139 63 C137 66 133 68 131 71 C133 76 137 77 141 78" />
        {/* Sanggul (hair bun behind) */}
        <path d="M118 48 C110 52 108 62 114 68 C118 70 122 71 126 71" fill={`url(#gandrung-fill-${variant})`} />
        {/* Slender neck */}
        <path d="M125 71 C124 78 123 85 120 90" />
        <path d="M134 74 C135 80 136 86 138 90" />

        {/* ================= 3. RIGHT HAND: EXTENDING KIPAS GANDRUNG (Kipas Terbuka) ================= */}
        {/* Shoulder to elbow */}
        <path d="M138 90 C152 92 168 98 182 106" />
        {/* Forearm extending outward */}
        <path d="M182 106 C195 110 206 108 218 102" />
        {/* Wrist & delicate fingers gripping the fan */}
        <path d="M218 102 C222 100 226 103 224 107 C222 110 216 112 212 113" />

        {/* Traditional Gandrung Fan (Kipas Lipat Mekar Sempurna) */}
        <path
          d="M214 105 C208 80 236 60 250 82 C255 100 232 116 216 108 Z"
          fill={`url(#gandrung-fill-${variant})`}
          strokeWidth="1.5"
        />
        {/* Fan Ribs (Jari-jari Kipas) */}
        <path d="M214 105 L222 74" strokeWidth="1" opacity="0.7" />
        <path d="M214 105 L234 68" strokeWidth="1" opacity="0.7" />
        <path d="M214 105 L244 76" strokeWidth="1" opacity="0.7" />
        <path d="M214 105 L246 92" strokeWidth="1" opacity="0.7" />
        {/* Fan Tassel (Rumbai Kipas) */}
        <path d="M214 107 Q212 120 214 130" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="214" cy="132" r="1.5" fill={strokeColor} />

        {/* ================= 4. LEFT HAND: HOLDING FLOWING SAMPUR (Selendang) ================= */}
        {/* Left shoulder and elbow bent gracefully */}
        <path d="M120 90 C106 95 90 108 82 122" />
        {/* Forearm bent upward in classic Jejer stance */}
        <path d="M82 122 C78 132 80 144 88 150 C94 153 98 148 96 142" />
        {/* Hand touching the sampur */}
        <path d="M96 142 C97 138 94 135 90 136" />

        {/* ================= 5. TORSO, KEMBEN & ILER-ILER (Busana Gandrung) ================= */}
        {/* Iler-iler (ornamental breastplate neckline) */}
        <path d="M124 90 Q130 98 136 90" strokeWidth="1.8" />
        <path d="M121 95 Q130 106 137 95" strokeWidth="1.2" />
        {/* Slender Waist (Kemben Beludru Emas) */}
        <path d="M120 98 C118 114 116 130 114 146" />
        <path d="M136 98 C138 114 140 130 138 146" />
        {/* Pending Emas (Gold Waist Belt) */}
        <path d="M112 146 C124 144 138 144 146 146 C144 152 136 154 114 154 Z" fill={`url(#gandrung-fill-${variant})`} strokeWidth="1.8" />
        <circle cx="128" cy="149" r="2.5" fill={strokeColor} />

        {/* ================= 6. FLOWING SAMPUR (SELENDANG MELAYANG ANGGUN) ================= */}
        {/* Upper swirling loop */}
        <path
          d="M88 148 C68 152 46 166 40 186 C32 210 50 234 68 242 C84 248 102 238 98 218 C94 198 76 188 64 196"
          strokeWidth="1.5"
          fill={`url(#gandrung-fill-${variant})`}
        />
        {/* Cascading tail of sampur sweeping down */}
        <path
          d="M68 242 C74 270 60 300 48 328 C42 342 36 350 28 356"
          strokeWidth="1.8"
        />
        <path
          d="M74 245 C80 274 72 308 62 338 C56 348 48 354 38 358"
          strokeWidth="1.2"
          opacity="0.7"
        />

        {/* ================= 7. LOWER JARIK & DANCE POSTURE ================= */}
        {/* Jarik Batik Banyuwangi Silhouette */}
        <path
          d="M114 154 C110 180 108 214 110 250 C112 284 118 318 124 354"
          strokeWidth="1.6"
        />
        <path
          d="M142 154 C148 182 154 216 156 252 C158 286 154 320 148 354"
          strokeWidth="1.6"
        />
        {/* Jarik Bottom Hem Wave */}
        <path d="M124 354 Q136 350 148 354" strokeWidth="1.8" />
        {/* Front Drapery Pleats (Wiron Batik) */}
        <path d="M128 156 L128 352" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
        <path d="M134 160 L136 348" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

        {/* Bare Feet in Classic Stance (Jangkah Tari) */}
        <path d="M124 354 C120 358 116 359 112 358" strokeWidth="1.4" />
        <path d="M146 354 C150 358 154 359 158 358" strokeWidth="1.4" />
      </g>
    </svg>
  );
};
