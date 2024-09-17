/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // add your HTML files here
  theme: {
    extend: {},
    container: {
      padding: {
        md: "8rem"
      }
    },
  },
  plugins: [],
}

