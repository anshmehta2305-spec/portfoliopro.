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
        navy: {
          DEFAULT: "#0B1F3A",
          dark: "#071526",
          light: "#142F55",
          deep: "#050E1A",
        },
        brand: {
          blue: "#1D5FB5",
          "blue-hover": "#154A91",
          teal: "#00BDD0",
          "teal-dark": "#009AA8",
          cyan: "#049FE2",
        },
        gold: {
          DEFAULT: "#B08D57",
          light: "#C5A46D",
          dark: "#8C6E3D",
          pale: "#F3EBDD",
        },
        ivory: {
          DEFAULT: "#FAF7F0",
          dark: "#F0EAE0",
          subtle: "#F5F1E8",
        },
        charcoal: {
          DEFAULT: "#222222",
          muted: "#555555",
          soft: "#777777",
        },
        rule: {
          DEFAULT: "#D9D4C7",
          subtle: "#EAE5D9",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: ["'Source Sans 3'", "'Source Sans Pro'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
      },
      boxShadow: {
        classic: "0 2px 8px rgba(11, 31, 58, 0.06)",
        "classic-lg": "0 6px 20px rgba(11, 31, 58, 0.08)",
        card: "0 1px 3px rgba(11, 31, 58, 0.04), 0 4px 12px rgba(11, 31, 58, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;

