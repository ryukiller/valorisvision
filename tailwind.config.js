/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // NEON//GRID palette
        void: "#05060c",
        panel: {
          DEFAULT: "#0a0e1a",
          hover: "#0e1424",
        },
        line: "#1c2540",
        neon: {
          cyan: "#00f0ff",
          magenta: "#ff2e88",
          acid: "#c8ff2e",
          amber: "#ffb84d",
          violet: "#8b5bff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
      },
      boxShadow: {
        "neon-cyan": "0 0 12px rgba(0, 240, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.12)",
        "neon-magenta": "0 0 12px rgba(255, 46, 136, 0.35), 0 0 40px rgba(255, 46, 136, 0.12)",
        "neon-acid": "0 0 12px rgba(200, 255, 46, 0.3), 0 0 40px rgba(200, 255, 46, 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.6" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.8" },
          "97%": { opacity: "1" },
        },
        "glitch-a": {
          "0%, 100%": { clipPath: "inset(0 0 92% 0)", transform: "translate(-2px, -1px)" },
          "20%": { clipPath: "inset(28% 0 55% 0)", transform: "translate(2px, 1px)" },
          "40%": { clipPath: "inset(60% 0 20% 0)", transform: "translate(-1px, 0)" },
          "60%": { clipPath: "inset(10% 0 78% 0)", transform: "translate(1px, 1px)" },
          "80%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(-2px, 1px)" },
        },
        "glitch-b": {
          "0%, 100%": { clipPath: "inset(78% 0 8% 0)", transform: "translate(2px, 1px)" },
          "20%": { clipPath: "inset(15% 0 65% 0)", transform: "translate(-2px, -1px)" },
          "40%": { clipPath: "inset(45% 0 35% 0)", transform: "translate(1px, 0)" },
          "60%": { clipPath: "inset(5% 0 85% 0)", transform: "translate(-1px, -1px)" },
          "80%": { clipPath: "inset(65% 0 15% 0)", transform: "translate(2px, 1px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
        flicker: "flicker 6s linear infinite",
        "glitch-a": "glitch-a 2.8s infinite steps(2, jump-none)",
        "glitch-b": "glitch-b 3.4s infinite steps(2, jump-none)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
