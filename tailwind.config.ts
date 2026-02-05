import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        jasper: {
          cream: '#FAEE8D',
          'cream-light': '#FDF8D4',
          coral: '#FF5C35',
          'coral-dark': '#E5472A',
          navy: '#1A1A38',
          'navy-light': '#2D2D4A',
          gray: '#6B6B7B',
          'gray-light': '#9D9DAB',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'pulse-coral': 'pulse-coral 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'pulse-coral': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 92, 53, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 92, 53, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 92, 53, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
