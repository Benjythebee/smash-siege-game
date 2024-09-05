/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontSize:{
        xxxxs: '0.5rem', // 8px;
        xxxs: '0.625rem', // 10px
        'fixed-xxxs': '0.625rem', // 10px
        xxs: '0.75rem', // 12px
        'fixed-xxs': '0.75rem', // 12px
      }
    },
  },
  plugins: [],
}

