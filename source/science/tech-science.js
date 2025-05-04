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

const render = _ => buffer.push(indent(_, indentation));
const renderImplied = (a, b) => render(`${a} -> ${b} [style="dotted";];`);
const renderAll = subject => {
  for (const _ of Object.values(subject)) {
    if (OrphanedItems.includes(_.name)) {
      continue;
    }

    render(
      `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices ?? [])}";];`,
    );
  }
};

render("digraph kittens {");
++indentation;

render(`fontname="sans-serif";`);
render(`pad="0.5";`);
render(`rankdir="LR";`);

// Buildings
render(
  `node [fillcolor="#f2d174"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
for (const _ of Object.values(buildings)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  if (_.stages) {
    render(
      `${_.name} [label="${_.stages[0].label}"; tooltip="ID: ${_.name}:0\\n${renderPrices(_.stages[0].prices)}";];`,
    );
    render(
      `${_.name}1 [label="${_.stages[1].label}"; tooltip="ID: ${_.name}:1\\n${renderPrices(_.stages[1].prices)}";];`,
    );
    continue;
  }

  render(`${_.name} [label="${_.label}"; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`);
}

// Void Space Upgrades
render(
  `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(voidspaceUpgrades);

// Chronoforge Upgrades
render(
  `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(chronoforgeUpgrades);

// Ziggurat Upgrades
render(
  `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(zigguratUpgrades);

// Transcendence Upgrades
render(
  `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(transcendenceUpgrades);

// Religion Upgrades
render(
  `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(religionUpgrades);

// Space Programs
render(
  `node [fillcolor="#9ef0a5"; fontcolor="#000000"; fontname="sans-serif"; shape="box"; style="filled";];`,
);
renderAll(programs);

// Upgrades
render(
  `node [fillcolor="#93ccc6"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(upgrades);

// Techs
render(
  `node [fillcolor="#465666"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
);
renderAll(techs);

// Planets
for (const _ of Object.values(planets)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  render(
    `${_.name} [label="${_.label}"; tooltip="ID: ${_.name}"; fillcolor="#ffffff"; fontcolor="#000000"; fontname="sans-serif"; shape="circle"; style="filled";];`,
  );

  buffer.push(
    indent(
      `node [fillcolor="#9ef0a5"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
      indentation,
    ),
  );
  for (const building of _.buildings) {
    render(
      `${building.name} [label="${building.label}"; tooltip="ID: ${building.name}\\n${renderPrices(building.prices)}";];`,
    );
    render(`${_.name} -> ${building.name};`);

    for (const tech of Array.isArray(building.requiredTech) ? building.requiredTech : []) {
      render(`${tech} -> ${building.name};`);
    }
  }
}

for (const _ of [
  ...Object.values(buildings),
  ...Object.values(chronoforgeUpgrades),
  ...Object.values(planets).flatMap(p => p.buildings),
  ...Object.values(programs),
  ...Object.values(religionUpgrades),
  ...Object.values(techs),
  ...Object.values(transcendenceUpgrades),
  ...Object.values(upgrades),
  ...Object.values(voidspaceUpgrades),
  ...Object.values(zigguratUpgrades),
]) {
  for (const unlock of [
    ...(_.unlocks?.buildings ?? []),
    ...(_.unlocks?.chronoforge ?? []),
    ...(_.unlocks?.planet ?? []),
    ...(_.unlocks?.spaceMission ?? []),
    ...(_.unlocks?.spaceBuilding ?? []),
    ...(_.unlocks?.tech ?? []),
    ...(_.unlocks?.transcendenceUpgrades ?? []),
    ...(_.unlocks?.upgrades ?? []),
    ...(_.unlocks?.voidSpace ?? []),
    ...(_.unlocks?.zigguratUpgrades ?? []),
  ]) {
    render(`${_.name} -> ${unlock};`);
  }
  for (const unlock of [...(_.unlocks?.stages ?? [])]) {
    render(`${_.name} -> ${unlock.bld}1;`);
  }
}

// Perks
render(
  `megalomenia [label="   Megalomenia   "; tooltip="ID: megalomenia"; fillcolor="#afffff"; fontcolor="#000000"; fontname="sans-serif"; shape="rect"; style="dashed";];`,
);
render("megalomenia -> marker;");
render("megalomenia -> blackPyramid;");
render(
  `anachronomancy [label="   Anachronomancy   "; tooltip="ID: anachronomancy"; fillcolor="#afffff"; fontcolor="#000000"; fontname="sans-serif"; shape="rect"; style="dashed";];`,
);
render("anachronomancy -> chronophysics;");

// Fill implicit unlocks.
render("library -> calendar;");
render("chronoforge -> blastFurnace;");
render("chronoforge -> temporalBattery;");
render("chronoforge -> temporalAccelerator;");
// Some stuff is pre-unlocked in workshop.
render("workshop -> mineralHoes;");
render("workshop -> ironHoes;");
render("workshop -> mineralAxes;");
render("workshop -> ironAxes;");
render("workshop -> stoneBarns;");
render("workshop -> reinforcedBarns;");
// Makes sense, right?
renderImplied("cryochambers", "usedCryochambers");
render("unicornPasture -> unicornTomb;");
// No sorrow, no pyramid.
renderImplied("unicornPasture", "blackPyramid");
// No unobtainium, no pyramid/marker.
renderImplied("moonOutpost", "blackPyramid");
renderImplied("moonOutpost", "marker");
// ?
render("dimensionalPhysics -> artificialGravity;");
// No rockets, no launch.
render("rocketry -> orbitalLaunch;");
// Need necrocorns, thus marker.
renderImplied("marker", "unicornGraveyard");
renderImplied("marker", "unicornNecropolis");
renderImplied("marker", "mausoleum");
// Needs void, thus Chronosphere.
renderImplied("chronosphere", "darkNova");
renderImplied("chronosphere", "mausoleum");
renderImplied("chronosphere", "holyGenocide");
// Theology chain.
render("theology -> solarchant;");
renderImplied("solarchant", "scholasticism");
renderImplied("scholasticism", "goldenSpire");
renderImplied("goldenSpire", "sunAltar");
renderImplied("sunAltar", "stainedGlass");
renderImplied("stainedGlass", "solarRevolution");
renderImplied("solarRevolution", "basilica");
renderImplied("basilica", "templars");
renderImplied("templars", "apocripha");
renderImplied("apocripha", "transcendence");
// No unobtainium, no crazy space stuff.
renderImplied("moonOutpost", "spaceElevator");
renderImplied("moonOutpost", "moonBase");
renderImplied("moonOutpost", "hydroponics");
// Probably need to register all upgrades...
renderImplied("spaceBeacon", "relicStation");
// No pyramid, no elders, no relics.
renderImplied("blackPyramid", "cryptotheology");
// No pyramid, no elders, no TCs.
renderImplied("blackPyramid", "temporalImpedance");

let previous = undefined;

renderImplied("transcendence", "blackObelisk");
for (const _ of Object.values(transcendenceUpgrades).sort((a, b) => a.tier - b.tier)) {
  if (previous) {
    renderImplied(previous.name, _.name);
  }
  previous = _;
}

render("}");
--indentation;

// In case you want to copy to another DOT renderer, like for PNG exporting.
console.log(buffer.join("\n"));

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement(buffer.join("\n")));
});
