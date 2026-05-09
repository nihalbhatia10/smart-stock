/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        card: "rgba(255, 255, 255, 0.08)",
        accent: "#3B82F6",
        secondaryAccent: "#8B5CF6",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444"
      }
    },
  },
  plugins: [],
}
