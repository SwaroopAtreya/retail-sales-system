/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Add this line just in case you have files outside src
    "./src/**/*.{js,ts,jsx,tsx,mdx}" 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}