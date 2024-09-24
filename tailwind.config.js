/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'webinar': "url('/src/assets/webinar.png')",
      },
      maxWidth: {
        container: "1250px"
      }
    },
    colors: {
      primary: "#48293F",
      secondary: "#E8543E",
      white: "#fff",
      black: "#000",
      lightgray: "#EFEFEF",
      gray: "#919191",
      transparent: "transparent"
    }
  },
  plugins: [],
}

