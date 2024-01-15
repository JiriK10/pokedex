import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#71c1a1",
          light: "#c6e6d9",
          dark: "#255542",
        },
      },
    },
  },
  plugins: [],
}
export default config
