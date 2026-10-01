import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F6F3",
          dark: "#EFE9DF",
        },
        navy: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
        },
        gold: {
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
