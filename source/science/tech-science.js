import {
  buildings,
  chronoforgeUpgrades,
  planets,
  programs,
  religionUpgrades,
  techs,
  transcendenceUpgrades,
  upgrades,
  voidspaceUpgrades,
  zigguratUpgrades,
} from "@kitten-science/game-data";
import { indent } from "@oliversalzburg/js-utils/data/string.js";
import { instance } from "@viz-js/viz";

const renderPrices = price => price.map(_ => `${_.name}: ${_.val}`).join("\\n");

// Metadata entries not in active use in game.
const OrphanedItems = ["unobtainiumAxe", "unobtainiumSaw"];
const buffer = [];
let indentation = 0;

buffer.push("digraph kittens {");
++indentation;

buffer.push(indent(`fontname="sans-serif";`, indentation));
buffer.push(indent(`pad="0.5";`, indentation));
buffer.push(indent(`rankdir="LR";`, indentation));

// Buildings
buffer.push(
  indent(
    `node [fillcolor="#f2d174"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(buildings)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  if (_.stages) {
    buffer.push(
      indent(
        `${_.name} [label="${_.stages[0].label}"; tooltip="ID: ${_.name}:0\\n${renderPrices(_.stages[0].prices)}";];`,
        indentation,
      ),
    );
    buffer.push(
      indent(
        `${_.name}1 [label="${_.stages[1].label}"; tooltip="ID: ${_.name}:1\\n${renderPrices(_.stages[1].prices)}";];`,
        indentation,
      ),
    );
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Void Space Upgrades
buffer.push(
  indent(
    `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(voidspaceUpgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Chronoforge Upgrades
buffer.push(
  indent(
    `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(chronoforgeUpgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Ziggurat Upgrades
buffer.push(
  indent(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(zigguratUpgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Transcendence Upgrades
buffer.push(
  indent(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(transcendenceUpgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Religion Upgrades
buffer.push(
  indent(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(religionUpgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Space Programs
buffer.push(
  indent(
    `node [fillcolor="#9ef0a5"; fontcolor="#000000"; fontname="sans-serif"; shape="box"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(programs)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="  ${_.label}  "; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Planets
for (const _ of Object.values(planets)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}"; fillcolor="#ffffff"; fontcolor="#000000"; fontname="sans-serif"; shape="circle"; style="filled";];`,
      indentation,
    ),
  );

  buffer.push(
    indent(
      `node [fillcolor="#9ef0a5"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
      indentation,
    ),
  );
  for (const k of _.buildings) {
    buffer.push(indent(`${k.name} [label="${k.label}"; tooltip="ID: ${k.name}";];`, indentation));
    buffer.push(indent(`${_.name} -> ${k.name};`, indentation));
  }
}

// Upgrades
buffer.push(
  indent(
    `node [fillcolor="#93ccc6"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(upgrades)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  buffer.push(
    indent(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

// Techs
buffer.push(
  indent(
    `node [fillcolor="#465666"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
    indentation,
  ),
);
for (const _ of Object.values(techs)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  // HACK: Add some spaces around the label to aid with padding/readability.
  buffer.push(
    indent(
      `${_.name} [label="   ${_.label}  "; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
      indentation,
    ),
  );
}

for (const _ of [
  ...Object.values(techs),
  ...Object.values(upgrades),
  ...Object.values(voidspaceUpgrades),
  ...Object.values(chronoforgeUpgrades),
  ...Object.values(religionUpgrades),
  ...Object.values(buildings),
  ...Object.values(programs),
  ...Object.values(planets),
  ...Object.values(zigguratUpgrades),
  ...Object.values(transcendenceUpgrades),
]) {
  for (const unlock of [
    ...(_.unlocks?.tech ?? []),
    ...(_.unlocks?.upgrades ?? []),
    ...(_.unlocks?.voidSpace ?? []),
    ...(_.unlocks?.chronoforge ?? []),
    ...(_.unlocks?.zigguratUpgrades ?? []),
    ...(_.unlocks?.transcendenceUpgrades ?? []),
    ...(_.unlocks?.planet ?? []),
    ...(_.unlocks?.spaceMission ?? []),
    ...(_.unlocks?.buildings ?? []),
  ]) {
    buffer.push(indent(`${_.name} -> ${unlock};`, indentation));
  }
  for (const unlock of [...(_.unlocks?.stages ?? [])]) {
    buffer.push(indent(`${_.name} -> ${unlock.bld}1;`, indentation));
  }
}

// Fill implicit unlocks.
buffer.push(indent("library -> calendar;", indentation));
buffer.push(indent("calendar -> temporalImpedance;", indentation));
buffer.push(indent("chronoforge -> blastFurnace;", indentation));
buffer.push(indent("chronoforge -> temporalBattery;", indentation));
buffer.push(indent("chronoforge -> temporalAccelerator;", indentation));
buffer.push(indent("workshop -> mineralHoes;", indentation));
buffer.push(indent("workshop -> ironHoes;", indentation));
buffer.push(indent("workshop -> mineralAxes;", indentation));
buffer.push(indent("workshop -> ironAxes;", indentation));
buffer.push(indent("workshop -> stoneBarns;", indentation));
buffer.push(indent("workshop -> reinforcedBarns;", indentation));
buffer.push(indent("cryochambers -> usedCryochambers;", indentation));
buffer.push(indent("unicornPasture -> unicornTomb;", indentation));
buffer.push(indent("ziggurat -> unicornTomb;", indentation));
buffer.push(indent("unicornPasture -> unicornGraveyard;", indentation));
buffer.push(indent("ziggurat -> unicornGraveyard;", indentation));
buffer.push(indent("temple -> solarchant;", indentation));
buffer.push(indent("temple -> blackPyramid;", indentation));
buffer.push(indent("temple -> marker;", indentation));
buffer.push(indent("transcendence -> blackObelisk;", indentation));
buffer.push(indent("dimensionalPhysics -> artificialGravity;", indentation));
buffer.push(indent("rocketry -> orbitalLaunch;", indentation));

let previous = undefined;
for (const _ of Object.values(transcendenceUpgrades).sort((a, b) => a.tier - b.tier)) {
  if (!previous) {
    previous = _;
    continue;
  }
  buffer.push(indent(`${previous.name} -> ${_.name};`, indentation));
  buffer.push(indent(`temple -> ${_.name} [style="invis";];`, indentation));
  previous = _;
}

previous = undefined;
for (const _ of Object.values(religionUpgrades).sort((a, b) => a.faith - b.faith)) {
  if (!previous) {
    previous = _;
    continue;
  }
  buffer.push(indent(`${previous.name} -> ${_.name};`, indentation));
  buffer.push(indent(`temple -> ${_.name} [style="invis";];`, indentation));
  previous = _;
}

buffer.push("}");
--indentation;

// In case you want to copy to another DOT renderer, like for PNG exporting.
console.log(buffer.join("\n"));

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement(buffer.join("\n")));
});
