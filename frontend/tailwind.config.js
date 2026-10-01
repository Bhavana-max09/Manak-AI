/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manak: {
          navy: "#0a192f",
          dark: "#0f172a",
          blue: "#1e3a8a",
          primary: "#1d4ed8",
          accent: "#ea580c", // Indian Saffron Accent
          gold: "#d97706",
          slate: "#334155",
          light: "#f8fafc",
          card: "#ffffff"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'elevation': '0 10px 30px -5px rgba(30, 58, 138, 0.12)'
      }
    },
  },
  plugins: [],
}
