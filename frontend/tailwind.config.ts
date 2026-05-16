import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f4ead0",
          warm: "#efe2bb",
          cream: "#faf3dc",
          dark: "#e8dab5",
        },
        ink: {
          DEFAULT: "#1a1612",
          soft: "#3d342a",
          muted: "#6e6253",
        },
        roast: {
          yellow: "#ffd44d",
          gold: "#f0b929",
          orange: "#e85d3a",
          red: "#c83d2a",
        },
      },
      fontFamily: {
        display: ["Bowlby One SC", "Impact", "sans-serif"],
        heading: ["Archivo Black", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        type: ["Special Elite", "Courier New", "monospace"],
      },
      boxShadow: {
        "retro": "5px 5px 0 #1a1612",
        "retro-sm": "3px 3px 0 #1a1612",
        "retro-lg": "8px 8px 0 #1a1612",
        "retro-yellow": "5px 5px 0 #f0b929",
      },
      animation: {
        "wiggle": "wiggle 2.5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
