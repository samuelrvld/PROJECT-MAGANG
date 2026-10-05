import React from 'react';

interface OmprokGandrungProps {
  className?: string;
  variant?: 'gold' | 'metallic-blue' | 'silver';
  style?: React.CSSProperties;
  opacity?: number;
}

export const OmprokGandrung: React.FC<OmprokGandrungProps> = ({
  className = '',
  variant = 'gold',
  style,
  opacity,
}) => {
  const primaryColor =
    variant === 'metallic-blue'
      ? '#4A90E2'
      : variant === 'silver'
      ? '#E2E8F0'
      : '#D4A359'; // Heritage Gold

  const secondaryColor =
    variant === 'metallic-blue'
      ? '#2A6496'
      : variant === 'silver'
      ? '#94A3B8'
      : '#F3E2C4'; // Pale Gold Highlight

  const accentColor =
    variant === 'metallic-blue'
      ? '#173E65'
      : variant === 'silver'
      ? '#64748B'
      : '#9E7030'; // Dark Gold Shadow

  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{
        opacity: opacity !== undefined ? opacity : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`omprok-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <linearGradient id={`sheen-${variant}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Top Ornament: Garuda Mungkur Crest */}
      <path
        d="M100 8 C92 20 86 32 94 42 C98 47 102 47 106 42 C114 32 108 20 100 8 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1.2"
      />
      <circle cx="100" cy="22" r="3" fill={secondaryColor} />

      {/* Flanking Crest Feathers (Kupingan Omprok) */}
      <path
        d="M84 26 C68 22 55 35 62 50 C68 45 76 42 86 44 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1"
      />
      <path
        d="M116 26 C132 22 145 35 138 50 C132 45 124 42 114 44 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1"
      />

      {/* Upper Crown Wings (Sayap Mahkota Bertingkat) */}
      <path
        d="M52 46 C34 44 24 64 36 82 C46 76 56 72 68 74 C58 62 54 52 52 46 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1.2"
      />
      <path
        d="M148 46 C166 44 176 64 164 82 C154 76 144 72 132 74 C142 62 146 52 148 46 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1.2"
      />

      {/* Main Tier Arch Body (Tatah Emas Mahkota Utama) */}
      <path
        d="M45 88 C45 52 155 52 155 88 C140 84 122 82 100 82 C78 82 60 84 45 88 Z"
        fill={`url(#sheen-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1.5"
      />

      {/* Center Jewel Flower (Kembang Kanthil Tengah) */}
      <circle cx="100" cy="65" r="7" fill={secondaryColor} stroke={accentColor} strokeWidth="1" />
      <circle cx="100" cy="65" r="3" fill="#D9534F" />

      {/* Side Jewel Flowers */}
      <circle cx="78" cy="68" r="4.5" fill={secondaryColor} stroke={accentColor} strokeWidth="0.8" />
      <circle cx="122" cy="68" r="4.5" fill={secondaryColor} stroke={accentColor} strokeWidth="0.8" />
      <circle cx="62" cy="74" r="3.5" fill={secondaryColor} stroke={accentColor} strokeWidth="0.8" />
      <circle cx="138" cy="74" r="3.5" fill={secondaryColor} stroke={accentColor} strokeWidth="0.8" />

      {/* Intricate Filigree Leaf Arches */}
      <path
        d="M65 80 Q100 58 135 80"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeDasharray="2 2"
        fill="none"
      />

      {/* Pilis Forehead Band (Dahi Bertatahkan Permata Emas) */}
      <path
        d="M38 96 C62 90 138 90 162 96 C164 104 158 108 152 107 C125 102 75 102 48 107 C42 108 36 104 38 96 Z"
        fill={`url(#omprok-grad-${variant})`}
        stroke={secondaryColor}
        strokeWidth="1.5"
      />

      {/* Pilis Inset Beads (Deretan Manik-Manik Dahi) */}
      {[48, 60, 72, 84, 96, 104, 116, 128, 140, 152].map((x, i) => (
        <circle key={i} cx={x} cy={99} r="1.8" fill={secondaryColor} />
      ))}

      {/* Dangling Ronce Melati (Untaian Bunga Melati di Sisi Kiri & Kanan) */}
      {/* Kiri */}
      <path
        d="M40 104 Q34 122 36 142"
        stroke={secondaryColor}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="39" cy="112" r="2.2" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="36" cy="122" r="2.4" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="35" cy="132" r="2.6" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="36" cy="144" r="3" fill="#D9534F" stroke={secondaryColor} strokeWidth="0.8" />

      {/* Kanan */}
      <path
        d="M160 104 Q166 122 164 142"
        stroke={secondaryColor}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="161" cy="112" r="2.2" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="164" cy="122" r="2.4" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="165" cy="132" r="2.6" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="0.6" />
      <circle cx="164" cy="144" r="3" fill="#D9534F" stroke={secondaryColor} strokeWidth="0.8" />
    </svg>
  );
};
