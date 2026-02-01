export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
        },
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#818cf8",
        },
        secondary: {
          DEFAULT: "#a855f7",
          foreground: "#c084fc",
        },
      },

      /* ---------------- ANIMATIONS ---------------- */
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "scale-in": "scaleIn 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      /* ---------------- UTILITIES ---------------- */
      boxShadow: {
        glow: "0 0 30px rgba(99,102,241,0.35)",
        "glow-lg": "0 0 60px rgba(168,85,247,0.45)",
      },

      backdropBlur: {
        xs: "2px",
      },

      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
