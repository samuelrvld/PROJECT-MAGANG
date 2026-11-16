import React from 'react';

// Official Authentic Vectors & Icons for Indonesian Payment Apps

export const BcaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/bca.svg" alt="BCA" className={`object-contain ${className}`} />
);

export const MandiriLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/mandiri.svg" alt="Bank Mandiri" className={`object-contain ${className}`} />
);

export const BriLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/brimo.svg" alt="BRImo" className={`object-contain ${className}`} />
);

export const BniLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/bni.svg" alt="BNI" className={`object-contain ${className}`} />
);

export const BankJatimLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/bankjatim.svg" alt="Bank Jatim" className={`object-contain ${className}`} />
);

export const GopayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/gopay.svg" alt="GoPay" className={`object-contain ${className}`} />
);

export const OvoLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/ovo.svg" alt="OVO" className={`object-contain ${className}`} />
);

export const DanaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/dana.svg" alt="DANA" className={`object-contain ${className}`} />
);

export const ShopeePayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/shopee.svg" alt="ShopeePay" className={`object-contain ${className}`} />
);

export const LinkAjaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img src="/assets/payment-icons/linkaja.svg" alt="LinkAja" className={`object-contain ${className}`} />
);

export const QrisOfficialBadge: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <img src="/assets/qris-logo.svg" alt="QRIS" className={`object-contain ${className}`} />
);
