import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        secondary: '#6b7280',
        'secondary-dark': '#4b5563',
      },
    },
  },
  plugins: [],
}

export default config