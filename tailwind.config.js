/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B1020',
          card: '#12182B',
          hover: '#1A223B',
        },
        brand: {
          primary: '#7C5CFF',
          accent: '#00D4FF',
        },
        text: {
          main: '#F5F7FF',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(124, 92, 255, 0.4)',
        'glow-accent': '0 0 20px rgba(0, 212, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
