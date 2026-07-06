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
        // Deep crimson brand (from the Luxe logo)
        luxe: {
          50: "#fbf1f2",
          100: "#f6dfe1",
          200: "#eec0c4",
          300: "#e1979d",
          400: "#d06d76",
          500: "#bd4a55",
          600: "#a5313d",
          700: "#8b2530", // primary
          800: "#701e28",
          900: "#5c1a23",
          950: "#340b10",
        },
        gold: {
          light: "#e4cd97",
          DEFAULT: "#c4a24e",
          dark: "#a5822f",
        },
        cream: {
          DEFAULT: "#faf4ec",
          soft: "#f4ebdf",
          deep: "#ece0cf",
        },
        ink: {
          DEFAULT: "#2a1f1f",
          soft: "#4a3b3b",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 50px -20px rgba(92, 26, 35, 0.35)",
        soft: "0 12px 40px -12px rgba(42, 31, 31, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
