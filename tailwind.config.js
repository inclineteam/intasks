/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...require("tailwindcss/defaultTheme").fontFamily.sans],
      },
    },
  },
  plugins: [],
};
