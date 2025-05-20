import { readFileSync } from "node:fs";
import cleanup from "rollup-plugin-cleanup";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const MINIFY = Boolean(process.env.MINIFY);
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["neon-theme", `-${versionString}`, MINIFY ? ".min" : "", ".user.js"].join("");

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
    minify: MINIFY ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        entryFileNames: filename,
        extend: true,
        format: "umd",
      },
      plugins: [cleanup({ comments: "none", extensions: ["js", "ts"] })],
    },
    sourcemap: "hidden",
  },
  define: {
    PAYLOAD,
  },
  plugins: [
    cssInjectedByJsPlugin({ styleId: "neon-theme", topExecutionPriority: false }),
    {
      ...metablock({
        override: {
          author: manifest.author,
          description: manifest.description,
          homepageURL: manifest.homepage,
          supportURL: manifest.bugs.url,
          version: versionString,
        },
      }),
      enforce: "post",
    },
  ],
});
