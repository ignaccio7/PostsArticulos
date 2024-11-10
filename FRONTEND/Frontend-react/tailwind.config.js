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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        third: 'var(--color-third)',
        text: 'var(--color-text)',
        black: 'var(--color-black)',
        gray: 'var(--color-gray)'
      },
      fontSize: {
        step0: 'var(--step-0)',
        step1: 'var(--step-1)',
        step2: 'var(--step-2)',
        step3: 'var(--step-3)',
        step4: 'var(--step-4)',
        step5: 'var(--step-5)'
      }
    }
  },
  plugins: []
}
