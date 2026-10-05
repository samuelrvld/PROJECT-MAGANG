import React from 'react';

// Brand SVGs
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.031 0C5.395 0 .017 5.378.017 12.014c0 2.12.553 4.188 1.604 6.01L0 24l6.168-1.618a11.96 11.96 0 0 0 5.863 1.526h.005c6.634 0 12.012-5.378 12.012-12.014 0-3.207-1.25-6.222-3.518-8.49A11.934 11.934 0 0 0 12.03 0zm0 22.014a9.97 9.97 0 0 1-5.088-1.39l-.365-.217-3.778.99.1-3.682-.238-.378a9.957 9.957 0 0 1-1.528-5.323c0-5.513 4.486-10 10-10 2.67 0 5.18 1.04 7.07 2.93a9.94 9.94 0 0 1 2.93 7.07c0 5.513-4.487 10-10 10zm5.48-7.48c-.3-.15-1.77-.874-2.04-.973-.27-.1-.47-.15-.67.15-.2.3-.77.973-.94 1.173-.17.2-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export interface SocialMediaItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  colorClass: string;
  iconBg: string;
  icon: React.ReactNode;
}

export const SOCIAL_MEDIA_LIST: SocialMediaItem[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@museumblambangan',
    url: 'https://instagram.com/museumblambangan',
    badge: 'Foto & Cerita',
    colorClass: 'text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10',
    iconBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white',
    icon: <InstagramIcon className="w-4 h-4" />
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Museum Blambangan Official',
    url: 'https://youtube.com/@museumblambangan',
    badge: 'Video Edukasi',
    colorClass: 'text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10',
    iconBg: 'bg-[#FF0000] text-white',
    icon: <YouTubeIcon className="w-4 h-4" />
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@museumblambangan',
    url: 'https://tiktok.com/@museumblambangan',
    badge: 'Konten Kreatif',
    colorClass: 'text-[#00F2FE] hover:border-[#00F2FE]/50 hover:bg-[#00F2FE]/10',
    iconBg: 'bg-black border border-white/20 text-white',
    icon: <TikTokIcon className="w-4 h-4" />
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Museum Blambangan',
    url: 'https://facebook.com/museumblambangan',
    badge: 'Komunitas',
    colorClass: 'text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
    iconBg: 'bg-[#1877F2] text-white',
    icon: <FacebookIcon className="w-4 h-4" />
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+62 852-8725-8502',
    url: 'https://wa.me/6285287258502',
    badge: 'Layanan Tiket',
    colorClass: 'text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10',
    iconBg: 'bg-[#25D366] text-white',
    icon: <WhatsAppIcon className="w-4 h-4" />
  },
  {
    id: 'disbudpar',
    name: 'Website Pemkab',
    handle: 'banyuwangikab.go.id',
    url: 'https://banyuwangikab.go.id',
    badge: 'Portal Resmi',
    colorClass: 'text-[#D4A359] hover:border-[#D4A359]/50 hover:bg-[#D4A359]/10',
    iconBg: 'bg-gradient-to-tr from-[#9B7126] to-[#D4A359] text-white',
    icon: <GlobeIcon className="w-4 h-4" />
  }
];

// Aesthetic Footer Grid Component
export const SocialMediaFooterGrid: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#D4A359] animate-pulse" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5E6CC]">
          Sosial Media Resmi
        </h4>
      </div>
      <p className="text-[11px] text-slate-300">
        Ikuti kanal resmi Museum Blambangan untuk info pameran, event, dan edukasi budaya:
      </p>

      {/* Grid Cards of Social Media Channels (Symmetrical 2x3 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {SOCIAL_MEDIA_LIST.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all duration-200 group cursor-pointer shadow-2xs ${item.colorClass}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${item.iconBg}`}>
                {item.icon}
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-white transition-colors block truncate">
                    {item.name}
                  </span>
                  <span className="text-[8.5px] font-semibold text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/10 shrink-0">
                    {item.badge}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate transition-colors">
                  {item.handle}
                </span>
              </div>
            </div>

            <span className="text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-xs font-bold shrink-0 ml-1">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

// Icon Row Component (clean, proportional, and perfectly centered with uniform containers)
export const SocialMediaIconRow: React.FC<{ 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-10 h-10 rounded-xl'
  }[size];

  const iconSizes = {
    sm: '[&_svg]:w-4 [&_svg]:h-4',
    md: '[&_svg]:w-4.5 [&_svg]:h-4.5',
    lg: '[&_svg]:w-5 [&_svg]:h-5'
  }[size];

  const themeClasses = variant === 'light'
    ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#081827] hover:bg-slate-200 hover:border-slate-300 shadow-2xs'
    : 'bg-white/[0.08] border border-white/15 text-slate-200 hover:text-[#D4A359] hover:bg-white/[0.18] hover:border-[#D4A359]/40 shadow-2xs';

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {SOCIAL_MEDIA_LIST.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${item.name}: ${item.handle}`}
          className={`${sizeClasses} ${iconSizes} shrink-0 flex items-center justify-center ${themeClasses} transition-all duration-200 cursor-pointer active:scale-95`}
          aria-label={item.name}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};
