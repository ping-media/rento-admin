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
        "autofill-bg": "#ffffff",
        "autofill-text": "#000000",
      },
    },
    variants: {
      extend: {
        backgroundColor: ["autofill"], // Enable background color for autofill
        textColor: ["autofill"], // Enable text color for autofill
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("autofill", "&:-webkit-autofill"); // Add autofill variant for webkit browsers
      addVariant("autofill-active", "&:-webkit-autofill:active"); // Optional active state
      addVariant("autofill-focus", "&:-webkit-autofill:focus"); // Optional focus state
    },
  ],
};
