// tailwind.config.js  (with "type":"module")  OR  tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const Export = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/globals.css',
  ],
  theme: { extend: {} },
  plugins: [],
};
export default Export
