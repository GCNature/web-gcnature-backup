import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', '"Segoe UI"', 'Roboto', 'sans-serif'],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        mercy: {
          dark: "hsl(var(--mercy-dark))",
          navy: "hsl(var(--mercy-navy))",
          charcoal: "hsl(var(--mercy-charcoal))",
          orange: "hsl(var(--mercy-orange))",
          "orange-light": "hsl(var(--mercy-orange-light))",
          "orange-glow": "hsl(var(--mercy-orange-glow))",
          gray: "hsl(var(--mercy-gray))",
          light: "hsl(var(--mercy-light))",
          "warm-bg": "hsl(var(--mercy-warm-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--mercy-orange) / 0.3)" },
          "50%": { boxShadow: "0 0 25px hsl(var(--mercy-orange) / 0.6), 0 0 50px hsl(var(--mercy-orange) / 0.15)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "ripple": {
          "0%": { transform: "scale(1)", opacity: "0.4" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "slide-in-stagger": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "text-reveal": {
          "0%": { opacity: "0", transform: "translateY(100%)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "icon-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "kenburns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        "underline-expand": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-left": "fade-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-right": "fade-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-scale": "fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-down": "slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "kenburns": "kenburns 20s ease-in-out infinite",
        "text-reveal": "text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-stagger": "slide-in-stagger 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "progress-bar": "progress-bar linear forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
