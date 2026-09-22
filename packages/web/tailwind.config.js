/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        solana: {
          green: "#14F195",
          purple: "#9945FF"
        },
        meteora: {
          teal: "#00E5FF",
          dark: "#0F172A"
        }
      }
    },
  },
  plugins: [],
}
