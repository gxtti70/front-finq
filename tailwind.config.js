/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'finq-primary': '#4F46E5', // Azul índigo moderno
        'finq-bg': '#F8FAFC',      // Gris muy claro para el fondo
      }
    },
  },
  plugins: [],
}