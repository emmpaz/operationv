/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: '#F3F3F3',
      }
    },
  },
  plugins: [require('@tailwindcss/typography'),
  require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#73A59B",
          "secondary": "#ABCEC5",
          "accent": "#81BBB1",
          "neutral": "#F6F8F8",
          "base-100": "#0B0F0E",
          "custom": "#F3F3F3"
        }
      },

    ]
  }
}

