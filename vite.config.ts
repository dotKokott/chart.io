import { defineConfig } from "vite";

// If your repo name changes, update the base path accordingly.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/chart.io/" : "/",
}); 