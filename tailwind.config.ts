import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151C",
          soft: "#1A1E27",
          softer: "#232836",
          line: "#2C3140",
        },
        paper: "#FFFFFF",
        signal: {
          DEFAULT: "#FF5A36",
          dim: "#E64A28",
          soft: "#FFE4DA",
        },
        mist: {
          DEFAULT: "#8891A5",
          soft: "#5D6479",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        sheet: "28px",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        "scan-line": "scan-line 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
