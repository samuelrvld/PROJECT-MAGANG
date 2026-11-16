import React from 'react';

// ============================================================================
// Official HD Indonesian Payment Channel Logos (Bank Jatim, BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, Shopee, LinkAja)
// ============================================================================

export interface PaymentChannelItem {
  id: string;
  name: string;
  category: 'bank' | 'ewallet';
  iconSrc: string;
}

export const OFFICIAL_PAYMENT_LOGOS: PaymentChannelItem[] = [
  { id: 'bank-jatim', name: 'Bank Jatim', category: 'bank', iconSrc: '/assets/payment-logos/bankjatim.svg' },
  { id: 'bca', name: 'BCA', category: 'bank', iconSrc: '/assets/payment-logos/bca.svg' },
  { id: 'mandiri', name: 'Bank Mandiri', category: 'bank', iconSrc: '/assets/payment-logos/mandiri.svg' },
  { id: 'bri', name: 'Bank BRI', category: 'bank', iconSrc: '/assets/payment-logos/bri.svg' },
  { id: 'bni', name: 'BNI', category: 'bank', iconSrc: '/assets/payment-logos/bni.svg' },
  { id: 'gopay', name: 'GoPay', category: 'ewallet', iconSrc: '/assets/payment-logos/gopay.svg' },
  { id: 'ovo', name: 'OVO', category: 'ewallet', iconSrc: '/assets/payment-logos/ovo.svg' },
  { id: 'dana', name: 'DANA', category: 'ewallet', iconSrc: '/assets/payment-logos/dana.svg' },
  { id: 'shopee', name: 'ShopeePay', category: 'ewallet', iconSrc: '/assets/payment-logos/shopee.svg' },
  { id: 'linkaja', name: 'LinkAja', category: 'ewallet', iconSrc: '/assets/payment-logos/linkaja.svg' },
];

export const PaymentMethodBadgeGrid: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="space-y-1.5">
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="truncate">DAPAT DIBAYAR MENGGUNAKAN SEMUA M-BANKING & E-WALLET</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-0.5">
        {OFFICIAL_PAYMENT_LOGOS.map((item) => (
          <div
            key={item.id}
            className="h-7 sm:h-8 px-1.5 py-1 rounded-lg border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs hover:border-[#0c233c]/40 flex items-center justify-center transition-all group"
            title={`Mendukung Pembayaran Resmi via ${item.name}`}
          >
            <img
              src={item.iconSrc}
              alt={item.name}
              className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
