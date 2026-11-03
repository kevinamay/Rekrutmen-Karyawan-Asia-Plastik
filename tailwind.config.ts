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
        background: "var(--background)",
        foreground: "var(--foreground)",
        blush: {
          50: "#fff5f7",
          100: "#ffe6ed",
          200: "#ffd0dd",
          300: "#ffabc4",
          400: "#f7739e",
          500: "#e63573",
          600: "#c71b59",
          700: "#a31346",
          800: "#82133a",
          900: "#6d1434",
        },
        pastel: {
          blush: "#fff0f3",
          lavender: "#f4f1fd",
          sky: "#eff6ff",
          mint: "#ecfdf5",
          sand: "#fdf8f4",
          amber: "#fffbeb",
        },
        corporate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        scan: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        scan: "scan 2.5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      boxShadow: {
        subtle: "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.03)",
        card: "0 10px 25px -5px rgba(226, 53, 115, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        blush: "0 8px 20px -4px rgba(230, 53, 115, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
