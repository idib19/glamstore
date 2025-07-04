/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#FF69B4',
        'light-pink': '#FFB6C1',
        'dark-pink': '#C71585',
        'soft-pink': '#FFE4E1',
        'rose-pink': '#FF1493',
        'pale-pink': '#FFF0F5',
      },
      fontFamily: {
        'elegant': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
} 