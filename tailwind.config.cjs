/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require("daisyui")
  ],
  daisyui: {
    themes: [
      'dark',
      'light',
      'night'
    ],
    logs: false
  },
  darkMode: ['class', '[data-theme="night"]'],
}
