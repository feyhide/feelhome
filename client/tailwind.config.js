/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        main:['League Spartan','sans-sarif'],
        sub:['Montserrat','sans-sarif'],
        sub2:['Libre Baskerville','sans-sarif']
      },
      lineClamp: {
        2: '2',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}