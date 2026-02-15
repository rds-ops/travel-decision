/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Reddit-inspired tokens
        ink: "#1a1a1b",
        accent: "#ff4500",        // Reddit orange
        "accent-blue": "#0079d3", // Reddit blue
        // Light mode surfaces
        "surface-light": "#dae0e6",
        "card-light": "#ffffff",
        "border-light": "#ccc",
        "hover-light": "#f6f7f8",
        "muted-light": "#7c7c7c",
        // Dark mode surfaces
        "surface-dark": "#030303",
        "card-dark": "#1a1a1b",
        "border-dark": "#343536",
        "hover-dark": "#272729",
        "muted-dark": "#818384",
      },
    },
  },
  plugins: [],
};
