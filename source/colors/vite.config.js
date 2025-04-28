import { join } from "node:path";
import { cwd } from "node:process";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * @type {import("vite").UserConfig}
 */
export default {
  base: "https://kitten-science.github.io/themes/",
  build: {
    modulePreload: {
      polyfill: false,
    },
    outDir: join(cwd(), "_site"),
    rollupOptions: {
      input: {
        main: join(import.meta.dirname, "color-science.html"),
      },
    },
  },
  plugins: [createHtmlPlugin(), viteSingleFile()],
  root: import.meta.dirname,
};
