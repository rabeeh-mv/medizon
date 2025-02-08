/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
    // flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // flowbite.plugin(),
  ],
}
