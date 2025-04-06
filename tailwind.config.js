/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          focus: '#2563EB', // blue-600
        },
        secondary: {
          DEFAULT: '#8B5CF6', // violet-500
          focus: '#7C3AED', // violet-600
        },
        accent: {
          DEFAULT: '#F59E0B', // amber-500
          focus: '#D97706', // amber-600
        },
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    styled: true,
    base: true,
    utils: true,
    logs: false,
  },
} 