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
      },
      colors:{
        //https://coolors.co/323232-393e46-29a19c-a3f7bf-f4faff
        dark:'#222831',
        gray:'#393e46',
        'blueish-green':'#29a19c',
        'light-green':'#4f8a8b',
        'alice-blue':'#F4FAFF',
      }
    },
  },
  plugins: [],
}

