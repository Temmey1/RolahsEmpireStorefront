import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
          dark:    '#A07830',
          glow:    'rgba(201,168,76,0.18)',
        },
        dark: {
          bg:      '#090909',
          bg2:     '#111111',
          bg3:     '#1a1a1a',
          surface: '#141414',
          surface2:'#1e1e1e',
          text:    '#f0ede8',
          text2:   '#a09a90',
          text3:   '#5a5650',
          border:  'rgba(201,168,76,0.15)',
        },
        light: {
          bg:      '#fafaf8',
          bg2:     '#f4f0e8',
          bg3:     '#ede8dc',
          surface: '#ffffff',
          text:    '#1a1712',
          text2:   '#5a5040',
          text3:   '#8a7a60',
          border:  'rgba(160,120,48,0.2)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        bebas:   ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        marquee:  'marquee 28s linear infinite',
        'fade-up':'fadeUp 0.6s ease forwards',
        spin:     'spin 1s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      maxWidth: { '8xl': '1400px' },
    },
  },
  plugins: [],
};

export default config;
