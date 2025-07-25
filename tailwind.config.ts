import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro-display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'system': ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Inter', 'sans-serif'],
        'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'sans': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-large': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-medium': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'headline-large': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        'headline-medium': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'title-large': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.005em' }],
        'body-large': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-medium': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label-large': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'label-medium': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        'apple-xs': '0.25rem',  /* 4px */
        'apple-sm': '0.5rem',   /* 8px */
        'apple-md': '1rem',     /* 16px */
        'apple-lg': '1.5rem',   /* 24px */
        'apple-xl': '2rem',     /* 32px */
        'apple-2xl': '3rem',    /* 48px */
        'apple-3xl': '4rem',    /* 64px */
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'apple-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'apple-lg': '0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'a24': '0 8px 32px hsla(22, 30%, 8%, 0.4)',
        'neon-glow': '0 0 24px hsla(40, 65%, 68%, 0.08)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'a24': 'cubic-bezier(0.32, 0.05, 0.35, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "apple-hover": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-1px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
