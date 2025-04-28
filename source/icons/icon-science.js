import { library } from "./icons.js";

const encodeSVG = subject =>
  subject
    .replace(/"/g, `'`)
    .replace(/>\s{1,}</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);

for (const [icon, metadata] of Object.entries(library)) {
  const entryRoot = document.createElement("div");
  const entryIcon = document.createElement("div");
  const entryInfo = document.createElement("div");

  entryRoot.classList.add("icon");

  entryIcon.classList.add("sample");
  entryIcon.style.color = "pink";
  entryIcon.style.backgroundImage = `url("data:image/svg+xml,${encodeSVG(metadata.outline)}")`;
  entryIcon.title = `${icon}`;

  entryInfo.classList.add("info");
  const id = document.createElement("div");
  id.textContent = icon;
  id.classList.add("theme-id");
  entryInfo.appendChild(id);

  const materialId = document.createElement("a");
  materialId.textContent = icon;
  materialId.classList.add("material-id");
  if (metadata.origin === "https://fonts.google.com/icons") {
    materialId.setAttribute(
      "href",
      `https://fonts.google.com/icons?selected=Material+Symbols+Outlined:${metadata.id}:FILL@0;wght@400;GRAD@0;opsz@48icon.size=48&icon.color=%23e3e3e3&icon.style=Outlined`,
    );
    materialId.setAttribute("target", "_blank");
  }
  entryInfo.appendChild(materialId);

  for (const entry of metadata.usages) {
    const usage = document.createElement("div");
    usage.textContent = entry;
    usage.classList.add("usage");
    entryInfo.appendChild(usage);
  }

  entryRoot.appendChild(entryIcon);
  entryRoot.appendChild(entryInfo);

  entryRoot.addEventListener("click", () => entryRoot.classList.toggle("marked"));

  document.body.appendChild(entryRoot);
}
