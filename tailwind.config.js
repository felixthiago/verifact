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
        status: {
          verified: "#34d399",
          false: "#f87171",
          partial: "#fbbf24",
          unknown: "#94a3b8"
        },
        success: "#0ce45b",
        danger: "#ea0808",
        secureLink: "#adfa1d",
        unsafeLink: "#450109"
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}

