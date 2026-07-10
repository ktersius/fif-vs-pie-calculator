/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        investnow: '#2563eb',
        ibkr: '#16a34a',
      },
    },
  },
  plugins: [],
};
