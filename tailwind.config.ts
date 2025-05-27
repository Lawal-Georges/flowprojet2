import type { Config } from "tailwindcss";
import daisyui from 'daisyui';

interface ExtendedConfig {
  daisyui?: {
    themes: string[];
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
  };
}

const config: Config & ExtendedConfig = {
  content: [
  
    "./app/**/*.{js,ts,jsx,tsx,}",
    "./components/**/*.{js,ts,jsx,tsx,}",
    "./node_modules/react-quill-new/dist/*.js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    daisyui // Active DaisyUI
  ],
  daisyui: {
    themes: ["light", "dark", "cmyk"],
    base: true,         // Active les styles de base
    styled: true,       // Active les composants styled
    utils: true         // Active les utilitaires
  },
}

export default config;
