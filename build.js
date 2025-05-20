import * as sass from "sass-embedded";

const MINIFY = Boolean(process.env.MINIFY);

if (MINIFY) {
  const resultMinified = sass.compile("source/_root.scss", { style: "compressed" });
  process.stdout.write(`${resultMinified.css}\n`);
} else {
  const result = sass.compile("source/_root.scss", { style: "expanded" });
  process.stdout.write(`${result.css}\n`);
}
