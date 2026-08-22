/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': 'var(--color-neon-green)',
        'neon-green-hover': 'var(--color-neon-green-hover)',
        'neon-purple': 'var(--color-neon-purple)',
        'neon-orange': 'var(--color-neon-orange)',
        'neon-yellow': 'var(--color-neon-yellow)',
        'neon-cyan': 'var(--color-neon-cyan)',
        'bento-bg': 'var(--color-bento-bg)',
        'bento-border': 'var(--color-bento-border)',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
