/** @type {import('tailwindcss').Config} */
module.exports = {
  // tailwind preflight与antd primary样式冲突
  corePlugins: {
    preflight: false
  },
  content: [
    "./index.html",
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}