/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "sans-serif",
      ],
      mono: ["SF Mono", "Menlo", "Consolas", "monospace"],
    },
    extend: {
      colors: {
        page: "#f9fafb",
        teal: {
          550: "#0f9688",
        },
      },
      boxShadow: {
        low: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
        mid: "0 2px 6px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
      },
    },
  },
  plugins: [],
};
