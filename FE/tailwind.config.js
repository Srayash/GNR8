/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Bricolage: ["Bricolage Grotesque", "serif"],
      },
      colors: {
        'theme-black': '#111111',
        'theme-purple-primary': '#6200EE',
        'theme-purple-secondary': '#8133F1',
        'theme-gray-primary': '#1C1B1B',
        'theme-gray-secondary': '#797676',
      },
    },
  },
  plugins: [],
}