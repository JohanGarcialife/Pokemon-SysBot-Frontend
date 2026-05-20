/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050b18',
        bg2: '#071225',
        nav: '#081326',
        panel: '#101a31',
        panel2: '#141f39',
        panel3: '#1a2744',
        card: '#121d34',
        ink: '#f8fbff',
        muted: '#9fb0ca',
        soft: '#c8d6ef',
        line: 'rgba(173,197,255,.18)',
        blue: '#3c78ff',
        blue2: '#38bdf8',
        yellow: '#ffd21f',
        green: '#30e57f',
        purple: '#8b5cf6',
        pink: '#ec4899',
        danger: '#ff5b6e',
      }
    },
  },
  plugins: [],
}
