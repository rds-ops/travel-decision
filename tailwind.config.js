/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        accent: "#0ea5e9"
      }
    }
  },
  plugins: []
};
