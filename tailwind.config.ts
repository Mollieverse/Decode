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
        purple: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#8B5CF6",   // brand primary
          700: "#7C3AED",   // brand dark
          800: "#6d28d9",
          900: "#4c1d95",
        },
        teal: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          400: "#2dd4bf",
          500: "#14B8A6",   // brand accent
          600: "#0d9488",
        },
        ink:   "#1F2937",
        muted: "#6B7280",
        ghost: "#9CA3AF",
        bg:    "#FAF5FF",
        card:  "#FFFFFF",
        border: "#E5E7EB",
        "border-purple": "rgba(139,92,246,0.15)",
      },
      fontFamily: {
        sans:    ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Sora'", "'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.04em" }],
        xs:    ["12px", { lineHeight: "16px" }],
        sm:    ["13px", { lineHeight: "20px" }],
        base:  ["15px", { lineHeight: "24px" }],
        lg:    ["17px", { lineHeight: "26px" }],
        xl:    ["20px", { lineHeight: "28px", letterSpacing: "-0.02em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.025em" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.03em" }],
        "4xl": ["38px", { lineHeight: "44px", letterSpacing: "-0.04em" }],
        "5xl": ["48px", { lineHeight: "54px", letterSpacing: "-0.045em" }],
        "6xl": ["60px", { lineHeight: "66px", letterSpacing: "-0.05em" }],
      },
      borderRadius: {
        sm:   "8px",
        md:   "12px",
        lg:   "16px",
        xl:   "20px",
        "2xl":"24px",
        "3xl":"32px",
        "4xl":"40px",
        full: "9999px",
      },
      boxShadow: {
        card:   "0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(139,92,246,0.06)",
        "card-hover": "0 8px 32px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.12)",
        purple: "0 4px 24px rgba(139,92,246,0.35)",
        "purple-lg": "0 8px 40px rgba(139,92,246,0.4)",
        teal:   "0 4px 20px rgba(20,184,166,0.3)",
        glow:   "0 0 0 4px rgba(139,92,246,0.15)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        "gradient-brand-teal": "linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)",
        "gradient-hero": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%)",
        "gradient-card": "linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(20,184,166,0.04) 100%)",
        "gradient-purple-soft": "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      },
      animation: {
        "float":          "float 4s ease-in-out infinite",
        "float-slow":     "float 6s ease-in-out infinite",
        "pulse-soft":     "pulse-soft 2.5s ease-in-out infinite",
        "wave":           "wave 1.2s ease-in-out infinite",
        "spin-slow":      "spin 8s linear infinite",
        "fade-up":        "fade-up 0.4s ease forwards",
        "fade-in":        "fade-in 0.3s ease forwards",
        "slide-up":       "slide-up 0.5s cubic-bezier(0.32,0.72,0,1) forwards",
        "progress-fill":  "progress-fill 0.6s ease forwards",
        "shimmer":        "shimmer 1.8s linear infinite",
        "bounce-gentle":  "bounce-gentle 2s ease-in-out infinite",
        "rotate-hue":     "rotate-hue 6s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "1",   transform: "scale(1)" },
          "50%":     { opacity: "0.75",transform: "scale(1.04)" },
        },
        wave: {
          "0%,100%": { height: "6px"  },
          "50%":     { height: "28px" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to:   { width: "var(--progress-width)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "bounce-gentle": {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-5px)" },
        },
        "rotate-hue": {
          from: { filter: "hue-rotate(0deg)" },
          to:   { filter: "hue-rotate(360deg)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
