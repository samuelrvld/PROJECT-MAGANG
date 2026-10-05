import React from 'react';

interface MuseumLogoProps {
  variant?: 'white' | 'dark';
  className?: string;
  alt?: string;
}

export const MuseumLogo: React.FC<MuseumLogoProps> = ({
  variant = 'white',
  className = 'h-9',
  alt = 'Museum Blambangan',
}) => {
  const logoSrc = variant === 'white' 
    ? '/assets/logo-museum-blambangan-white.png' 
    : '/assets/logo-museum-blambangan-resmi.png';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`w-auto object-contain select-none shrink-0 inline-block ${className}`}
      crossOrigin="anonymous"
    />
  );
};
