import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import manifest from "./package.json" with { type: "json" };

const MINIFY = Boolean(process.env.MINIFY);

const filename = ["neon-theme", MINIFY ? ".min" : "", ".inject.js"].join("");

const PAYLOAD = JSON.stringify(
  readFileSync(MINIFY ? "./output/theme_neon.min.css" : "./output/theme_neon.css", "utf-8"),
);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "neon-theme",
    },
    minify: false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
    sourcemap: "hidden",
  },
  define: {
    PAYLOAD,
  },
});
