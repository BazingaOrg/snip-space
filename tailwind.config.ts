import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        aurora: "var(--gradient-aurora)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsla(var(--surface) / var(--surface-alpha))",
        subtle: "hsla(var(--subtle) / var(--subtle-alpha))",
        glass: "hsla(var(--glass) / var(--glass-alpha))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        "elevation-xs": "0 6px 16px hsla(var(--shadow-color) / 0.16)",
        "elevation-sm": "0 14px 32px hsla(var(--shadow-color) / 0.2)",
        "elevation-md": "0 26px 54px hsla(var(--shadow-color) / 0.26)",
        "inner-glow": "inset 0 1px 0 hsla(var(--highlight-color) / 0.85)",
      },
      dropShadow: {
        floating: "0 26px 58px hsla(var(--shadow-color) / 0.28)",
      },
      blur: {
        fog: "32px",
      },
      backdropBlur: {
        glass: "28px",
      },
      transitionTimingFunction: {
        mac: "cubic-bezier(0.24, 0.82, 0.38, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.992)" },
          "70%": { opacity: "0.9", transform: "translateY(2px) scale(0.998)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-12px) scale(0.992)" },
          "70%": { opacity: "0.9", transform: "translateY(-2px) scale(0.998)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dock-bounce": {
          "0%": { transform: "translateY(10px) scale(0.97)", opacity: "0" },
          "45%": { transform: "translateY(-1px) scale(1.01)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "view-enter": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.992)" },
          "65%": { opacity: "0.86", transform: "translateY(2px) scale(0.998)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.28s var(--ease-mac) both",
        "fade-down": "fade-down 0.28s var(--ease-mac) both",
        "dock-bounce": "dock-bounce 0.32s var(--ease-mac) both",
        "view-enter": "view-enter 0.3s var(--ease-mac) both",
        shake: "shake 0.4s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
