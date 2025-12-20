/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 rgba(11, 110, 79, 0.56)', rotate: '20deg' },
          '50%': { rotate: '-20deg' },
          '75%': { boxShadow: '0 0 0 10px rgba(11, 110, 79, 0.38)' },
          '100%': { boxShadow: '0 0 0 13px rgba(11, 110, 79, 0.19)', rotate: '0deg' },
        },
      },
    },
  },
  plugins: [],
}
