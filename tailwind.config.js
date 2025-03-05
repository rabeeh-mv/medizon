/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
    // flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'btnclr':'#0081A7',
        'btnclr1': '#00AFB9',

        
    },
    
    },
  },
  plugins: [
    // flowbite.plugin(),
  ],
}
