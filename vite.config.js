import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Serving from a sub-path (e.g. a GitHub Pages project site)?
  // set base: "/<repo-name>/" and change /media + /David_… paths in
  // src/data/apps.js and src/App.jsx to be relative.
  base: "/portfolio/",
});
