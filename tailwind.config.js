/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // Matches App.tsx, index.tsx, etc. in the root
    "./components/**/*.{js,ts,jsx,tsx}", // Matches everything in components
    "./services/**/*.{js,ts,jsx,tsx}",   // Matches everything in services
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}