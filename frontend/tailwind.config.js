import forms from '@tailwindcss/forms'

/**
 * Timeline design tokens.
 * `brand` is the single accent colour used across the site. Once the official
 * logo colours are confirmed, change the `brand` scale here and the whole site
 * follows.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        ink: {
          950: '#05080F',
          900: '#0A0F1C',
          800: '#10182B',
          700: '#18233A',
          600: '#24314D',
        },
        metal: {
          50: '#F6F7F9',
          100: '#ECEEF2',
          200: '#DADFE7',
          300: '#BCC3CF',
          400: '#8F99AA',
          500: '#6B7587',
          600: '#4F586A',
        },
        brand: {
          50: '#EEF3FF',
          100: '#DAE5FF',
          200: '#B8CCFF',
          300: '#8AAAFF',
          400: '#5A84FF',
          500: '#2F6BFF',
          600: '#1D55E0',
          700: '#1743B3',
          800: '#15398F',
          900: '#142F6F',
        },
        success: '#0E9F6E',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,15,28,.04), 0 4px 16px rgba(10,15,28,.05)',
        lift: '0 12px 32px -8px rgba(10,15,28,.18), 0 4px 12px rgba(10,15,28,.06)',
        glow: '0 0 0 1px rgba(47,107,255,.25), 0 10px 40px -10px rgba(47,107,255,.45)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [forms],
}
