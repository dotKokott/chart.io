import { defineConfig } from "vite";

// If your repo name changes, update the base path accordingly.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/chart.io/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        eval: "eval.html",
        png: "png/index.html",
      },
    },
  },
}); 