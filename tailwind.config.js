/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nacar: {
          porcelana: '#F6F3EE',
          arena: '#EAE5DC',
          tinta: '#1B1A18',
          pizarra: '#63625C',
          jade: '#2E6B60',
          'jade-hover': '#245449',
          'jade-claro': '#8FC4B7',
          'jade-suave': '#E6EFE9',
          oro: '#A38E63',
          'oro-suave': '#F4EFE6',
          petroleo: '#10201C',
        },
        stitch: {
          primary: '#1B1A18',
          'primary-container': '#10201C',
          secondary: '#2E6B60',
          'secondary-accent': '#8FC4B7',
          background: '#F6F3EE',
          surface: '#FFFFFF',
          'surface-low': '#FAF8F5',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        headline: ['"Epilogue"', 'sans-serif'],
        mono: ['"Geist"', 'monospace']
      },
      boxShadow: {
        'nacar-sm': '0 2px 10px rgba(27, 26, 24, 0.04)',
        'nacar': '0 12px 36px rgba(27, 26, 24, 0.07)',
        'nacar-lg': '0 24px 50px rgba(27, 26, 24, 0.12)',
        'nacar-jade': '0 12px 30px rgba(46, 107, 96, 0.25)',
      }
    },
  },
  plugins: [],
}
