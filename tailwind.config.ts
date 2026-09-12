import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        ink: "#f4f1ea",
        gold: "#d4af37",
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-jost)", "sans-serif"],
        editorial: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
