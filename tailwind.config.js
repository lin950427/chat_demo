/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'loading-dots': {
          '0%': { transform: 'translateY(0)', opacity: '0.2' },
          '50%': { transform: 'translateY(-2px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0)', opacity: '0.2' },
        },
      },
      animation: {
        'loading-dots': 'loading-dots 0.8s ease-in-out infinite',
      },
      colors: {
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#8B6D47",
        background: "#ffffff",
        foreground: "#0f172a",
        primary: {
          DEFAULT: "#8B6D47",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f4f2",
          foreground: "#5d4e37",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f5f4f2",
          foreground: "#8b7355",
        },
        accent: {
          DEFAULT: "#a67c52",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        // 添加图片中的暖棕色调
        'warm-brown': {
          25: '#fdfcfa',
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d0',
          300: '#ddc8b0',
          400: '#c4a17c',
          500: '#a67c52',
          600: '#8b6d47',
          700: '#72583a',
          800: '#5d4932',
          900: '#4a3a28',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
