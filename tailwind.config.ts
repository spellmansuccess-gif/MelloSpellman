import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        ivory: '#F5F0E6',
        gold: '#B8985A',
        'gold-soft': '#D4BC85',
        'gold-deep': '#8C6E3F',
        muted: 'rgba(245, 240, 230, 0.62)',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.32em',
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
