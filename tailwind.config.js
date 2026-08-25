/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#FACC15", light: "#FEF9C3", accent: "#EAB308", dark: "#CA8A04" },
        background: "#FFFFFF",
        surface: "#F9FAFB",
        text: { DEFAULT: "#111827", muted: "#6B7280" },
        success: "#16A34A",
        danger: "#DC2626",
      },
      fontFamily: {
        // Lemon Milk Pro — un archivo por peso.
        sans: ["LemonMilkPro"], // Regular (por defecto)
        "lm-light": ["LemonMilkPro-Light"], // UltraLight
        "lm-medium": ["LemonMilkPro-Medium"],
        "lm-bold": ["LemonMilkPro-Bold"],
      },
    },
  },
  plugins: [],
}
