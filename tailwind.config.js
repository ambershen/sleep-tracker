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
          DEFAULT: '#B794F6', // Soft lilac for headers and navigation
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#B794F6',
          600: '#A78BFA',
          700: '#9F7AEA',
          800: '#805AD5',
          900: '#6B46C1',
        },
        accent: {
          DEFAULT: '#D8B4FE', // Light lavender accent
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#B794F6',
          600: '#A78BFA',
          700: '#9F7AEA',
          800: '#805AD5',
          900: '#6B46C1',
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
