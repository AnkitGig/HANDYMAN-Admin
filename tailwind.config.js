export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'] },
      // compact type scale (rem is based on 14px root, see styles/index.css)
      fontSize: {
        xs: ['0.8rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
      },
      colors: {
        brand: { DEFAULT: '#9c0409', dark: '#6d0207', 50: '#fdf1f1', 100: '#fadcdd', 200: '#f0b4b6', 300: '#e48a8d' },
        nav: '#4a0104',
      },
      boxShadow: {
        // `shadow-xs` / `backdrop-blur-xs` are Tailwind v4 only -> define for v3
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        // crimson -> deep maroon, same as the app's wallet card / buttons
        'brand-grad': 'linear-gradient(135deg, #c1060d 0%, #9c0409 45%, #5e0205 100%)',
        'splash-grad': 'linear-gradient(160deg, #b30a10 0%, #8a0308 50%, #3d0103 100%)',
      },
      keyframes: {
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: { pop: 'pop 150ms ease-out' },
    },
  },
  plugins: [],
};
