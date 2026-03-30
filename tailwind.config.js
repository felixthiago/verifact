/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.tsx",
    "./src/**/*.{tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'systemui' ]
      },
      colors: {
        success: "#0ce45b",
        danger: "#ea0808",
        secureLink: "#adfa1d",
        unsafeLink: "#450109"
      },
      animation: {
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
      keyframes: {
        "shimmer-slide": {
          "to": {
            "transform": "translateX(100%)",
          },
        },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
}

