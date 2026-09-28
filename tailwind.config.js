/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        school: {
          primary: '#006185',
          primaryDark: '#004c6a',
          primaryLight: '#e1f3fa',
          primaryContainer: '#0b7ba7',
          onPrimaryContainer: '#f6faff',
          secondary: '#006b5f',
          secondaryDark: '#005047',
          secondaryLight: '#e0f7f4',
          secondaryContainer: '#76f4e0',
          tertiary: '#854d00',
          tertiaryDark: '#693c00',
          tertiaryLight: '#fff9f6',
          tertiaryContainer: '#ffdcbd',
          surface: '#f7f9ff',
          surfaceDim: '#c9dcf3',
          surfaceContainer: '#e3efff',
          surfaceContainerHigh: '#d9eaff',
          card: '#ffffff',
          textMain: '#091d2e',
          textMuted: '#3f484e',
          border: '#bfc8cf',
          borderLight: '#e2e8f0',
          error: '#ba1a1a',
          errorBg: '#ffdad6',
          success: '#006b5f',
          successBg: '#e0f7f4',
          afb1: '#10b981', // Emerald / Green for AFB I
          afb2: '#f59e0b', // Amber for AFB II
          afb3: '#ef4444', // Red / Rose for AFB III
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(0, 97, 133, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 25px -5px rgba(0, 97, 133, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
