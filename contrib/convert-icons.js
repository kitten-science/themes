#!/usr/bin/env node

import { library } from "./icons.js";

const encodeSVG = subject =>
  subject
    .replace(/"/g, `'`)
    .replace(/>\s{1,}</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);

let metaSCSS = "";
for (const [icon, metadata] of Object.entries(library)) {
  const descriptor = {
    filled: metadata.filled,
    id: library[icon].id,
    outline: metadata.outline,
    usages: library[icon].usages,
  };
  try {
    metaSCSS += `"${icon}": url("data:image/svg+xml,${encodeSVG(descriptor.outline)}"),\n`;
  } catch (error) {
    console.error(`Unable to process entry '${icon}'!`);
    console.debug(metadata);
    throw error;
  }
}
console.log(`$icons: (\n${metaSCSS});`);
