/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html'
  ],
  // CRITICAL: Safelist all theme-related selectors to prevent purging
  safelist: [
    // Core theme attribute selectors
    '[data-theme="light"]',
    '[data-theme="dark"]',
    // Classic theme attribute selectors
    '[data-theme="arctic-focus"]',
    '[data-theme="golden-hour"]',
    '[data-theme="midnight-ink"]',
    '[data-theme="forest-manuscript"]',
    '[data-theme="starlit-prose"]',
    '[data-theme="coffee-house"]',
    // Modern theme attribute selectors
    '[data-theme="sunset-coral"]',
    '[data-theme="lavender-dusk"]',
    '[data-theme="arctic-aurora"]',
    '[data-theme="desert-mirage"]',
    '[data-theme="cherry-lacquer"]',
    '[data-theme="volcanic-ash"]',
    // Fantasy theme attribute selectors
    '[data-theme="moonlit-garden"]',
    '[data-theme="dragons-hoard"]',
    // Specialty theme attribute selectors
    '[data-theme="halloween"]',
    '[data-theme="cyberpunk"]',
    '[data-theme="true-black-white"]',
    // Gradient classes used in footer
    'gradient-primary',
    'gradient-primary-br',
    'gradient-primary-text',
    // Any dynamic classes
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|accent|muted|destructive|card|popover)(-foreground)?$/,
      variants: ['hover', 'focus', 'active', 'group-hover'],
    },
  ],
  prefix: "",
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
        // FableCraft brand colors
        fable: {
          orange: "#ed7326",
          "orange-dark": "#d4641f",
          "orange-light": "#f5a662",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Playfair Display", "ui-serif", "Georgia"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
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
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}