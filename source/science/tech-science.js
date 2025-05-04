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
const renderImplied = (a, b) => render(`${a} -> ${b} [style="invis";];`);
const renderRelated = (a, b) => render(`${a} -> ${b} [style="dashed";];`);
const renderAll = subject => {
  for (const _ of Object.values(subject)) {
    if (OrphanedItems.includes(_.name)) {
      continue;
    }

    render(
      `${_.name} [label="   ${_.label}   "; tooltip="ID: ${_.name}\\n${renderPrices(_.prices ?? [])}";];`,
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
      `${_.name} [label="   ${_.stages[0].label}   "; tooltip="ID: ${_.name}:0\\n${renderPrices(_.stages[0].prices)}";];`,
    );
    render(
      `${_.name}1 [label="   ${_.stages[1].label}   "; tooltip="ID: ${_.name}:1\\n${renderPrices(_.stages[1].prices)}";];`,
    );
    continue;
  }

  render(
    `${_.name} [label="   ${_.label}   "; tooltip="ID: ${_.name}\\n${renderPrices(_.prices)}";];`,
  );
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

// Space Programs
render(
  `node [fillcolor="#29472c"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
);
renderAll(programs);

// Techs
render(
  `node [fillcolor="#465666"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
);
renderAll(techs);

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

// Upgrades
render(
  `node [fillcolor="#93ccc6"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
);
renderAll(upgrades);

// Planets
for (const _ of Object.values(planets)) {
  if (OrphanedItems.includes(_.name)) {
    continue;
  }

  render(
    `${_.name} [label="   ${_.label}   "; tooltip="ID: ${_.name}"; fillcolor="#ffffff"; fontcolor="#000000"; fontname="sans-serif"; shape="circle"; style="filled";];`,
  );

  buffer.push(
    indent(
      `node [fillcolor="#9ef0a5"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
      indentation,
    ),
  );
  for (const building of _.buildings) {
    const name = building.name === "hydroponics" ? "hydroponicsBuilding" : building.name;
    render(
      `${name} [label="   ${building.label}   "; tooltip="ID: ${building.name}\\n${renderPrices(building.prices)}";];`,
    );
    renderRelated(_.name, name);

    for (const tech of Array.isArray(building.requiredTech) ? building.requiredTech : []) {
      renderRelated(tech, name);
    }
  }
}

// Render unlocks
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
    // Some stuff unlocks itself. Bug in game metadata.
    if (_.name === unlock) {
      continue;
    }
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
renderRelated("library", "calendar");
renderImplied("chronoforge", "blastFurnace");
renderImplied("chronoforge", "temporalBattery");
renderImplied("chronoforge", "temporalAccelerator");
// Some stuff is pre-unlocked in workshop.
renderRelated("workshop", "mineralHoes");
renderRelated("workshop", "ironHoes");
renderRelated("workshop", "mineralAxes");
renderRelated("workshop", "ironAxes");
renderRelated("workshop", "stoneBarns");
renderRelated("workshop", "reinforcedBarns");
// Makes sense, right?
renderImplied("cryochambers", "usedCryochambers");
renderRelated("unicornPasture", "unicornTomb");
// No sorrow, no pyramid.
//renderImplied("unicornPasture", "blackPyramid");
// No unobtainium, no pyramid/marker.
renderImplied("moonOutpost", "blackPyramid");
renderImplied("moonOutpost", "marker");
// ?
render("dimensionalPhysics -> artificialGravity;");
// No rockets, no launch.
renderRelated("rocketry", "orbitalLaunch");
// Need necrocorns, thus marker.
renderRelated("marker", "unicornGraveyard");
renderRelated("marker", "unicornNecropolis");
renderImplied("marker", "mausoleum");
// Needs void, thus Chronosphere.
renderImplied("chronosphere", "darkNova");
renderImplied("chronosphere", "mausoleum");
renderImplied("chronosphere", "holyGenocide");
// Theology chain.
render("theology -> solarchant;");
renderRelated("solarchant", "scholasticism");
renderRelated("scholasticism", "goldenSpire");
renderRelated("goldenSpire", "sunAltar");
renderRelated("sunAltar", "stainedGlass");
renderRelated("stainedGlass", "solarRevolution");
renderRelated("solarRevolution", "basilica");
renderRelated("basilica", "templars");
renderRelated("templars", "apocripha");
renderRelated("apocripha", "transcendence");
// No unobtainium, no crazy space stuff.
renderImplied("moonOutpost", "spaceElevator");
renderImplied("moonOutpost", "moonBase");
renderImplied("moonOutpost", "hydroponics");
// Probably need to register all upgrades...
//renderImplied("spaceBeacon", "relicStation");
// No pyramid, no elders, no relics.
renderRelated("blackPyramid", "cryptotheology");
// No pyramid, no elders, no TCs.
renderRelated("blackPyramid", "temporalImpedance");

let previous = undefined;

renderRelated("transcendence", "blackObelisk");
for (const _ of Object.values(transcendenceUpgrades).sort((a, b) => a.tier - b.tier)) {
  if (previous) {
    renderRelated(previous.name, _.name);
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
