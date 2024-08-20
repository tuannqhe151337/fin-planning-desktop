import colors from "tailwindcss/colors";
import { createThemes } from "tw-colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "twinkle-effect": "twinkle 5s infinite ease-in-out",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-600px)",
            opacity: "0",
          },
        },
        fatter: {
          "0%, 100%": {
            transform: "scale(0.95  ) translateY(0)",
            opacity: 0.4,
          },
          "50%": { transform: "scale(1) translateY(10px)", opacity: 0.2 },
        },
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    // Don't know why but without it, the tooltip seems to work just fine
    // but with it the plugin tw-colors just broken
    createThemes({
      blue: {
        primary: colors.sky,
        secondary: colors.emerald,
      },
      "blue-flatten": {
        primary: colors.sky["500"],
        secondary: colors.emerald["500"],
      },
      emerald: {
        primary: colors.emerald,
        secondary: colors.sky,
      },
      "emerald-flatten": {
        primary: colors.emerald["500"],
        secondary: colors.sky["500"],
      },
      teal: {
        primary: colors.teal,
        secondary: colors.cyan,
      },
      "teal-flatten": {
        primary: colors.teal["500"],
        secondary: colors.cyan["500"],
      },
      cyan: {
        primary: colors.cyan,
        secondary: colors.teal,
      },
      "cyan-flatten": {
        primary: colors.cyan["500"],
        secondary: colors.teal["500"],
      },
      purple: {
        primary: colors.violet,
        secondary: colors.indigo,
      },
      "purple-flatten": {
        primary: colors.violet["500"],
        secondary: colors.indigo["500"],
      },
      orange: {
        primary: colors.orange,
        secondary: colors.lime,
      },
      "orange-flatten": {
        primary: colors.orange["500"],
        secondary: colors.lime["500"],
      },
      rose: {
        primary: colors.pink,
        secondary: colors.fuchsia,
      },
      "rose-flatten": {
        primary: colors.pink["400"],
        secondary: colors.fuchsia["400"],
      },
    }),
    require("tw-elements-react/dist/plugin.cjs"),
  ],
};
