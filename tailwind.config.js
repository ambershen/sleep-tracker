/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50', // Deep blue for headers and navigation
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#2C3E50',
          900: '#1E293B',
        },
        accent: {
          DEFAULT: '#3498DB', // Soft blue for accents
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3498DB',
          600: '#2B77CB',
          700: '#2C5AA0',
          800: '#2A4365',
          900: '#1A365D',
        },
        background: {
          DEFAULT: '#ECF0F1', // Light gray for backgrounds
          card: '#FFFFFF', // White for content areas
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '16px',
        lg: '18px',
      },
    },
  },
  plugins: [],
};
