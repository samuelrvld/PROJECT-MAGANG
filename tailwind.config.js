/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          // Opsi 1: Royal Blambangan Heritage
          dark: '#092C48',       // Deep Navy Blambangan
          darker: '#061D30',     // Deepest Navy
          navy: '#0D3A5F',       // Primary Navy
          hover: '#0B3658',      // Navy Hover
          gold: '#D4A359',       // Gold Pusaka Heritage
          'gold-light': '#FDF8EE', // Soft Champagne Cream
          'gold-hover': '#C39247', // Deep Gold Hover
          bg: '#F8FAFC',         // Soft Cloud White
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#059669',     // Emerald Green (Lunas QRIS)
          'success-bg': '#ECFDF5',
          'success-text': '#065F46',
          warning: '#D97706',     // Amber (Perlu Verifikasi)
          'warning-bg': '#FFFBEB',
          'warning-text': '#92400E',
          danger: '#DC2626',      // Crimson Red (Belum Bayar)
          'danger-bg': '#FEF2F2',
          'danger-text': '#991B1B',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(9, 44, 72, 0.06), 0 2px 6px -1px rgba(9, 44, 72, 0.04)',
        'modal': '0 20px 25px -5px rgba(9, 44, 72, 0.2), 0 10px 10px -5px rgba(9, 44, 72, 0.1)',
        'ticket': '0 10px 30px -5px rgba(9, 44, 72, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
