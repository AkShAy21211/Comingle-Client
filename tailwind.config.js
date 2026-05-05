/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': "#004080",
        'custom-gold': "#FFD700",
        'custom-teal': '#007F86',
        'glass-white': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(15, 23, 42, 0.7)',
      },
      fontSize: {
        'extra-small': '5px'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon-blue': '0 0 15px rgba(0, 64, 128, 0.5)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right bottom, #f8fafc, #e2e8f0)',
        'dark-gradient': 'linear-gradient(to right bottom, #0f172a, #1e293b)',
      }
    },
  },
  plugins: [],
}

