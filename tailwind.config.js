/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cash': ['CashSans', 'cash_sansregular', 'system-ui', 'sans-serif'], // Use unified CashSans first
        'cash-sans': ['CashSans', 'cash_sansregular', 'system-ui', 'sans-serif'],
        'cash-sans-medium': ['CashSans', 'cash_sansmedium', 'system-ui', 'sans-serif'],
        sans: ['CashSans', 'cash_sansregular', 'system-ui', 'sans-serif'], // Default to CashSans
      },
    },
  },
  plugins: [],
} 