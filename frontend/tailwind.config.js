/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#fc8019',
          600: '#ed6b00',
          700: '#c85a00',
        },
      },
    },
  },
  plugins: [],
}