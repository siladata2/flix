import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0C',
        'bg-raised': '#151416',
        'bg-card': '#1B1A1C',
        line: '#2A2926',
        ink: '#F3EFE7',
        'ink-dim': '#B8B2A6',
        'ink-faint': '#7A756B',
        brand: {
          DEFAULT: '#C1432B', // SilaFlix red accent
          dim: '#8f3120',
        },
        gold: '#E8A33D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
    },
  },
  plugins: [],
};
export default config;
