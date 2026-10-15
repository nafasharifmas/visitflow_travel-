/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Border radius is 0 everywhere (design system rule).
    borderRadius: { none: '0', DEFAULT: '0', sm: '0', md: '0', lg: '0', xl: '0', '2xl': '0', full: '0' },
    extend: {
      colors: {
        ground: '#EFE9DD', ground2: '#E5DED0', ink: '#141C2B', ink2: '#4A5364', muted: '#767E8C', accent: '#2C4A8F',
      },
      borderColor: { DEFAULT: 'rgba(20,28,43,.16)', hair: 'rgba(20,28,43,.16)' },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
