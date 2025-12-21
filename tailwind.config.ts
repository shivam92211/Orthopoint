import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9d4ee9",
          foreground: "#FFFFFF",
          light: "#b169ed",
          hover: "#8933e5",
        },
        secondary: {
          DEFAULT: "#8ce94e",
          foreground: "#111827",
          light: "#a0ed69",
        },
        accent: {
          DEFAULT: "#F8AD19",
          foreground: "#111827",
        },
        background: "#FFFFFF",
        foreground: "#111827",
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        border: "#E5E7EB",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
