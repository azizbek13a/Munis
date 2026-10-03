import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: {
          50: "#121214",
          100: "#18181b",
          200: "#27272a",
        },
        cinema: {
          cyan: "#22d3ee",
          cyanGlow: "rgba(34, 211, 238, 0.15)",
          gold: "#f59e0b",
          goldGlow: "rgba(245, 158, 11, 0.15)",
          rose: "#fb7185",
          roseGlow: "rgba(251, 113, 133, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-breathe": "glowBreathe 4s ease-in-out infinite",
        "shutter-flash": "shutterFlash 0.35s ease-out forwards",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.02)" },
        },
        glowBreathe: {
          "0%, 100%": { opacity: "0.4", filter: "blur(20px)" },
          "50%": { opacity: "0.8", filter: "blur(32px)" },
        },
        shutterFlash: {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.95" },
          "100%": { opacity: "0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
