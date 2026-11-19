export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#ef4444', dark: '#dc2626', 50: '#fef2f2' },
        nav: '#0b1220',
      },
      boxShadow: { card: '0 2px 14px rgba(15,23,42,.04)' },
    },
  },
  plugins: [],
};
