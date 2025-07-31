export default {
  plugins: {
    'postcss-import': {
      // Ensure imports are processed before Tailwind
    },
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}