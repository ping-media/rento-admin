/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "lighter-gray": "#F5F7FB",
        "light-gray": "#FAFBFD",
        theme: "#e23844",
        "theme-dark": "#c32d3b",
        "theme-seconday-dark": "#8f1b28",
        "theme-black": "#1E201E",
        "theme-purple": "#7B96FF",
        "theme-purple-dark": "#0F0248",
        "theme-purple-light": "#58D3FF",
        "theme-cyan": "#00bfd9",
      },
    },
  },
  plugins: [],
};
