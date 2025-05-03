import { techs, upgrades } from "@kitten-science/game-data";
import { indent } from "@oliversalzburg/js-utils/data/string.js";
import { instance } from "@viz-js/viz";

const renderPrices = price => price.map(_ => `${_.name}: ${_.val}`).join("\\n");

const buffer = [];
let indentation = 0;

buffer.push("digraph kittens {");
++indentation;

buffer.push(`rankdir="LR";`);

for (const _ of Object.values(techs)) {
  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; shape="box"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}
for (const _ of Object.values(upgrades)) {
  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; shape="oval"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

for (const _ of [...Object.values(techs), ...Object.values(upgrades)]) {
  for (const k of [...(_.unlocks?.tech ?? []), ...(_.unlocks?.upgrades ?? [])]) {
    buffer.push(indent(`${_.name} -> ${k};`, indentation));
  }
}

buffer.push("}");
--indentation;

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement(buffer.join("\n")));
});
