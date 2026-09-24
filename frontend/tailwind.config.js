/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        panel: '#1e1e1e',
        accent: '#f97316',
        alert: '#ef4444',
        online: '#22c55e',
      }
    },
  },
  plugins: [],
}
