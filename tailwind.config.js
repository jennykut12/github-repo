/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
    screens: {
      'sm': {'min': '150px', 'max': '450px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '451px', 'max': '676px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '777px', 'max': '1579px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }
    },
    colors: {
      transparent: 'transparent',
      black: '#ODODOD',
      white: '#D9D9D9',
      gray: {
        100: '#BE9E60',
        // ...
        200: '#F26716',
      },
      brown: '#26011C',
      // ...
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#ODODOD",
          secondary: "#BF9663",
          "background-color":"#D9D9D9",

        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#D9D9D9",
          secondary: "#BF9663",
          "background-color":"#ODODOD",

        },
      },
    ],
  },
}