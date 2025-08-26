/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#ff5a5f',
          600: '#ff3b43',
          700: '#e03137',
        },
      },
    },
  },
  plugins: [],
}