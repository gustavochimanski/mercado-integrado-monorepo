import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{ts,tsx}",
    "../../apps/**/*.{ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
