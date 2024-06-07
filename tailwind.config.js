/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{

        'custom-blue':"#004080",
        'custom-gold':"#FFD700",
        'custom-teal':'#007F86'
      },
      fontSize:{
        'extra-small':'5px'
      }
    },
  },
  plugins: [],
}

