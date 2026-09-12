import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        bone: "#f4f1ea",
        glow: "#d4af37",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "20%": { transform: "translate(-4%,2%)" },
          "30%": { transform: "translate(2%,-4%)" },
          "40%": { transform: "translate(-2%,5%)" },
          "50%": { transform: "translate(-4%,2%)" },
          "60%": { transform: "translate(3%,0)" },
          "70%": { transform: "translate(0,3%)" },
          "80%": { transform: "translate(-3%,0)" },
          "90%": { transform: "translate(2%,2%)" },
        },
        pulseGlow: {
          "0%, 100%": { textShadow: "0 0 8px rgba(212,175,55,0.6), 0 0 20px rgba(212,175,55,0.3)" },
          "50%": { textShadow: "0 0 16px rgba(212,175,55,0.9), 0 0 32px rgba(212,175,55,0.5)" },
        },
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;