/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'saiyan': '#c5a355',
        'human': '#6a9fcf',
        'namekian': '#6aab75',
        'frieza-race': '#9b7bb6',
        'android': '#95a5a6',
        'majin': '#e58b8b',
        'jiren-race': '#c07065',
        'god': '#6a9fcf',
        'angel': '#b39bc8',
        'evil': '#c07065',
        'default-race': '#5f7385',
      }
    },
  },
  plugins: [],
};
