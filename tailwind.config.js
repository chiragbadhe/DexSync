/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-custom": {
          100: "#1A1D1F",
          200: "#272B30",
          300: "#111315",
          400: "#17191B",
        },
        purple: {
          primary: "#6F3CE4",
          secondary: "#6F3CE4",
          light: "#6F3CE4",
        },
      },
      fontFamily: {
        "dm-mono": ["DM Mono", "monospace"],
        "general-sans": ["General Sans", "sans-serif"],
      },
      maxHeight: {
        480: "30rem",
      },
      backdropBlur: {
        32: "32px",
      },
      space: {
        20: "20px",
      },
      fontSize: {
        16: "16px",
      },
      fontSize: {
        "095": "0.6rem",
      },
    },
  },
  plugins: [],
};
