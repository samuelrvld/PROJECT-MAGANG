import React from 'react';

interface QRISLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const QRISLogo: React.FC<QRISLogoProps> = ({ className = 'h-5', style }) => {
  return (
    <img
      src="/assets/qris-logo.svg"
      alt="QRIS Logo"
      className={`block object-contain select-none shrink-0 ${className}`}
      style={{ maxHeight: '100%', maxWidth: '100%', ...style }}
    />
  );
};
