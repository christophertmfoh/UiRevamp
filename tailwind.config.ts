import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'a24-serif': ['Playfair Display', 'Times New Roman', 'serif'],
        'a24-sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Times New Roman', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
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

      spacing: {
        'a24-xs': '0.5rem',   /* 8px - geometric minimal */
        'a24-sm': '0.75rem',  /* 12px - clean increment */
        'a24-md': '1.5rem',   /* 24px - strong hierarchy */
        'a24-lg': '2rem',     /* 32px - dramatic spacing */
        'a24-xl': '3rem',     /* 48px - monumental */
        'a24-2xl': '4rem',    /* 64px - cinematic */
        'a24-3xl': '6rem',    /* 96px - architectural */
      },
      boxShadow: {
        'a24-minimal': '0 1px 2px rgba(0, 0, 0, 0.8)',
        'a24-medium': '0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
        'a24-dramatic': '0 8px 32px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6)',
        'a24-cinematic': '0 16px 64px rgba(0, 0, 0, 0.9), 0 8px 16px rgba(0, 0, 0, 0.7)',
      },
      transitionTimingFunction: {
        'a24': 'ease-out',
        'a24-smooth': 'cubic-bezier(0.32, 0.05, 0.35, 1)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "a24-hover": "a24-hover 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
