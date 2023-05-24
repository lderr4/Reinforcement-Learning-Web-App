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
            'r1-brown': '#6F5643',
            'r1-red': '#CC6B49',
            'r1-orange': '#D2A24C',
            'r1-white': '#ECE6C2',
            'r1-blue': '#73BDA8',
        },
    },
  },
  plugins: [],
}
