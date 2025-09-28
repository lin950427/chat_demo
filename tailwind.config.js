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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-to-bottom': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'loading-dots': 'loading-dots 0.8s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 0.3s ease-out',
      },
      colors: {
        border: "#CBB486",
        input: "#e5e7eb",
        ring: "#8B6D47",
        background: "#ffffff",
        foreground: "#0f172a",
        primary: {
          DEFAULT: "#8B6D47",
          foreground: "#ffffff",
          background: "#ebd8b0",
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
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top, 0px)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right, 0px)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left, 0px)',
        },
        '.py-safe': {
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 34px)',
        },
        '.px-safe': {
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    function({ addUtilities }) {
      // 隐藏滚动条但保持可滚动功能的工具类
      const scrollbarHideUtilities = {
        '.no-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(scrollbarHideUtilities);
    },
    function({ addUtilities }) {
      // Radix UI 动画数据属性支持
      const radixAnimations = {
        '[data-state="open"]': {
          '&.animate-in': {
            animation: 'fade-in 0.3s ease-out',
          },
          '&.slide-in-from-bottom': {
            animation: 'slide-in-from-bottom 0.3s ease-out',
          },
        },
        '[data-state="closed"]': {
          '&.animate-out': {
            animation: 'fade-out 0.3s ease-out',
          },
          '&.slide-out-to-bottom': {
            animation: 'slide-out-to-bottom 0.3s ease-out',
          },
        },
      };
      addUtilities(radixAnimations);
    },
  ],
}
