/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00D4B4',
          hover: '#00b89e',
          light: 'rgba(0, 212, 180, 0.1)',
          glow: 'rgba(0, 212, 180, 0.25)',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#121212',
          border: 'rgba(255, 255, 255, 0.05)',
          muted: 'rgba(255, 255, 255, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
