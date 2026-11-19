export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#d9172d', dark: '#b80f23', 50: '#fff1f2' },
        nav: '#0b1220',
      },
      boxShadow: { card: '0 2px 12px rgba(15,23,42,.06)' },
    },
  },
  plugins: [],
};
