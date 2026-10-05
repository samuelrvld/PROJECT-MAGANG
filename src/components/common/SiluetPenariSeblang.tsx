import React from 'react';

interface SiluetPenariSeblangProps {
  className?: string;
  variant?: 'gold' | 'dark' | 'white';
  style?: React.CSSProperties;
  opacity?: number;
}

export const SiluetPenariSeblang: React.FC<SiluetPenariSeblangProps> = ({
  className = '',
  variant = 'gold',
  style,
  opacity,
}) => {
  const src =
    variant === 'dark'
      ? '/assets/penari-seblang.png'
      : variant === 'white'
      ? '/assets/penari-seblang-white.png'
      : '/assets/penari-seblang-gold.png';

  return (
    <img
      src={src}
      alt="Motif Penari Seblang Banyuwangi"
      className={`pointer-events-none select-none object-contain ${className}`}
      crossOrigin="anonymous"
      style={{
        opacity: opacity !== undefined ? opacity : undefined,
        ...style,
      }}
    />
  );
};
