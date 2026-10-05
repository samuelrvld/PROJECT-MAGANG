import React from 'react';

interface GajahOlingMotifProps {
  variant?: 'gold' | 'white' | 'navy';
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

export const GajahOlingMotif: React.FC<GajahOlingMotifProps> = ({
  variant = 'gold',
  className = '',
  style,
  opacity,
}) => {
  const imageSrc =
    variant === 'navy'
      ? '/assets/gajah-oling-navy.png'
      : variant === 'white'
      ? '/assets/gajah-oling-white.png'
      : '/assets/gajah-oling-gold.png';

  return (
    <img
      src={imageSrc}
      alt="Motif Gajah Oling Banyuwangi"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={{
        opacity: opacity !== undefined ? opacity : undefined,
        ...style,
      }}
    />
  );
};
