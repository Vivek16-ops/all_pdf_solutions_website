import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'loading-dot': {
          '0%': {
            opacity: '0.2',
            transform: 'scale(0.8)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.2)',
          },
          '100%': {
            opacity: '0.2',
            transform: 'scale(0.8)',
          },
        },
      },
      animation: {
        'loading-dot': 'loading-dot 1.2s ease-in-out infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
