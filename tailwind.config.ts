import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(162 18% 84%)",
        input: "hsl(162 18% 84%)",
        ring: "hsl(194 54% 27%)",
        background: "hsl(44 39% 97%)",
        foreground: "hsl(196 30% 16%)",
        primary: {
          DEFAULT: "hsl(194 54% 27%)",
          foreground: "hsl(45 44% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(42 43% 89%)",
          foreground: "hsl(196 28% 20%)",
        },
        muted: {
          DEFAULT: "hsl(42 18% 93%)",
          foreground: "hsl(197 10% 40%)",
        },
        accent: {
          DEFAULT: "hsl(157 30% 78%)",
          foreground: "hsl(196 28% 18%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(196 28% 18%)",
        },
      },
      boxShadow: {
        soft: "0 22px 60px rgba(16, 43, 56, 0.08)",
        panel: "0 12px 32px rgba(18, 48, 63, 0.10)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(200, 174, 109, 0.18), transparent 34%), linear-gradient(180deg, rgba(241, 247, 247, 0.98), rgba(251, 248, 241, 1))",
      },
    },
  },
  plugins: [],
};

export default config;
