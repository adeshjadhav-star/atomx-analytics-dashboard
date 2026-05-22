/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#FFF7ED',
          100: '#FED7AA',
          200: '#FDBA74',
          500: '#F26A21',
          600: '#E85C12',
        },
        surface: {
          bg:    '#F6F7FB',
          card:  '#FFFFFF',
          input: '#FFFFFF',
        },
        ink: {
          primary:   '#172033',
          secondary: '#6B7280',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 6px rgba(242,106,33,0.35)', opacity: '1' },
          '50%': { boxShadow: '0 0 20px rgba(242,106,33,0.65)', opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 5s ease infinite',
      },
    },
  },
  plugins: [],
}
