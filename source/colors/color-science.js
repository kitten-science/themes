import { palette } from "./colors.js";

for (const [color, entries] of Object.entries(palette)) {
  const entryRoot = document.createElement("div");
  const entryColor = document.createElement("div");
  const entryInfo = document.createElement("div");

  entryRoot.classList.add("color");

  entryColor.classList.add("sample");
  entryColor.style.backgroundColor = `#${color}`;
  entryColor.textContent = `#${color}`;

  entryInfo.classList.add("info");
  for (const entry of entries) {
    const info = document.createElement("div");
    info.textContent = entry.usageNote.replace(/`([a-zA-Z0-9-]+)`/g, (match, css) => css);
    entryInfo.appendChild(info);

    const css = document.createElement("div");
    if (entry.cssNote) {
      const unwrappedCssNote = entry.cssNote
        .replace(/^\(/, "")
        .replace(/\)$/, "")
        .replace(/`([a-zA-Z0-9-]+)`/g, (match, css) => css);
      css.textContent = unwrappedCssNote;
    }
    entryInfo.appendChild(css);
  }

  entryRoot.appendChild(entryColor);
  entryRoot.appendChild(entryInfo);

  entryRoot.addEventListener("click", () => entryRoot.classList.toggle("hidden"));

  document.body.appendChild(entryRoot);
}
