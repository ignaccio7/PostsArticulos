/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif']
      },
      colors: {
        primary: '#303841',
        secondary: '#47555E',
        third: '#7AA5D2',
        text: '#EEEEEE',
        black: 'rgb(18 18 18)'
      }
    }
  },
  plugins: []
}
