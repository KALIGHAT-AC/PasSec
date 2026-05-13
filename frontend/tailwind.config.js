/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          green:  "#00ffb4",
          blue:   "#0070ff",
          navy:   "#020617",
          panel:  "#0f172a",
          border: "#1e293b",
        },
      },
      fontFamily: {
        mono: ['"Courier New"', "Courier", "monospace"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-fast":  "spin 0.7s linear infinite",
        "fade-up":    "fadeUp 0.5s ease forwards",
        glow:         "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          from: { boxShadow: "0 0 5px #00ffb440, 0 0 10px #00ffb420" },
          to:   { boxShadow: "0 0 20px #00ffb480, 0 0 40px #00ffb440" },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
