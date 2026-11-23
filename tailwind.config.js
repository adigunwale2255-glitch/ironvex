/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf0',
          100: '#fbf5dc',
          200: '#f5e7b2',
          300: '#ebd380',
          400: '#e0bb4f',
          500: '#d4af37', // Classic Rich Metallic Gold
          600: '#b8860b',
          700: '#91630c',
          800: '#754d11',
          900: '#613e13',
          glow: '#ffd700',
        },
        iron: {
          950: '#060709',
          900: '#0c0e12',
          850: '#11141a',
          800: '#161a22',
          750: '#1d222d',
          700: '#252b39',
          600: '#384154',
          500: '#525e77',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Orbitron', 'Cinzel', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'gold-pulse': 'goldPulse 2.5s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
