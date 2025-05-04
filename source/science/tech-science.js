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
const renderLink = (a, b) => render(`${a} -> ${b};`);
const renderImplied = (a, b) => render(`${a} -> ${b} [style="invis";];`);
const renderDependency = (a, b) => render(`${a} -> ${b} [style="dashed";];`);
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

const renderNodesBuildings = () => {
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
};

const renderNodesVoidspaceUpgrades = () => {
  render(
    `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(voidspaceUpgrades);
};

const renderNodesChronoforgeUpgrades = () => {
  render(
    `node [fillcolor="#eb9de4"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(chronoforgeUpgrades);
};

const renderNodesPrograms = () => {
  render(
    `node [fillcolor="#29472c"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
  );
  renderAll(programs);
};

const renderNodesTechs = () => {
  render(
    `node [fillcolor="#465666"; fontcolor="#ffffff"; fontname="sans-serif"; shape="box"; style="filled";];`,
  );
  renderAll(techs);
};

const renderNodesZigguratUpgrades = () => {
  render(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(zigguratUpgrades);
};

const renderNodesTranscendenceUpgrades = () => {
  render(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(transcendenceUpgrades);
};

const renderNodesReligionUpgrades = () => {
  render(
    `node [fillcolor="#f7f065"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(religionUpgrades);
};

const renderNodesUpgrades = () => {
  render(
    `node [fillcolor="#93ccc6"; fontcolor="#000000"; fontname="sans-serif"; shape="oval"; style="filled";];`,
  );
  renderAll(upgrades);
};

const renderNodesPlanets = () => {
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
      renderDependency(_.name, name);

      for (const tech of Array.isArray(building.requiredTech) ? building.requiredTech : []) {
        renderDependency(tech, name);
      }
    }
  }
};

render("digraph {");
++indentation;

render(`fontname="sans-serif";`);
render(`pad="0.5";`);
render(`rankdir="LR";`);

const DeclarationOrder = [
  "buildings",
  "chronoforgeUpgrades",
  "planets",
  "programs",
  "religionUpgrades",
  "techs",
  "transcendenceUpgrades",
  "upgrades",
  "voidspaceUpgrades",
  "zigguratUpgrades",
];
const DeclarationMap = {
  buildings: renderNodesBuildings,
  chronoforgeUpgrades: renderNodesChronoforgeUpgrades,
  planets: renderNodesPlanets,
  programs: renderNodesPrograms,
  religionUpgrades: renderNodesReligionUpgrades,
  techs: renderNodesTechs,
  transcendenceUpgrades: renderNodesTranscendenceUpgrades,
  upgrades: renderNodesUpgrades,
  voidspaceUpgrades: renderNodesVoidspaceUpgrades,
  zigguratUpgrades: renderNodesZigguratUpgrades,
};

for (const declaration of DeclarationOrder) {
  DeclarationMap[declaration].call(this);
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
    renderLink(_.name, unlock);
  }
  for (const unlock of [...(_.unlocks?.stages ?? [])]) {
    renderLink(_.name, `${unlock.bld}1`);
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
renderDependency("library", "calendar");
renderImplied("chronoforge", "blastFurnace");
renderImplied("chronoforge", "temporalBattery");
renderImplied("chronoforge", "temporalAccelerator");
// Some stuff is pre-unlocked in workshop.
renderDependency("workshop", "mineralHoes");
renderDependency("workshop", "ironHoes");
renderDependency("workshop", "mineralAxes");
renderDependency("workshop", "ironAxes");
renderDependency("workshop", "stoneBarns");
renderDependency("workshop", "reinforcedBarns");
// Makes sense, right?
renderImplied("cryochambers", "usedCryochambers");
renderDependency("unicornPasture", "unicornTomb");
// No sorrow, no pyramid.
//renderImplied("unicornPasture", "blackPyramid");
// No unobtainium, no pyramid/marker.
renderImplied("moonOutpost", "blackPyramid");
renderImplied("moonOutpost", "marker");
// ?
renderLink("dimensionalPhysics", "artificialGravity");
// No rockets, no launch.
renderDependency("rocketry", "orbitalLaunch");
// Need necrocorns, thus marker.
renderDependency("marker", "unicornGraveyard");
renderDependency("marker", "unicornNecropolis");
renderImplied("marker", "mausoleum");
// Needs void, thus Chronosphere.
renderImplied("chronosphere", "darkNova");
renderImplied("chronosphere", "mausoleum");
renderImplied("chronosphere", "holyGenocide");
// Theology chain.
renderLink("theology", "solarchant");
renderDependency("solarchant", "scholasticism");
renderDependency("scholasticism", "goldenSpire");
renderDependency("goldenSpire", "sunAltar");
renderDependency("sunAltar", "stainedGlass");
renderDependency("stainedGlass", "solarRevolution");
renderDependency("solarRevolution", "basilica");
renderDependency("basilica", "templars");
renderDependency("templars", "apocripha");
renderDependency("apocripha", "transcendence");
// No unobtainium, no crazy space stuff.
renderImplied("moonOutpost", "spaceElevator");
renderImplied("moonOutpost", "moonBase");
renderImplied("moonOutpost", "hydroponics");
// Probably need to register all upgrades...
//renderImplied("spaceBeacon", "relicStation");
// No pyramid, no elders, no relics.
renderDependency("blackPyramid", "cryptotheology");
// No pyramid, no elders, no TCs.
renderDependency("blackPyramid", "temporalImpedance");
// Fixes
renderDependency("ziggurat", "unicornTomb");
renderImplied("theology", "unicornTomb");

let previous = undefined;

renderDependency("transcendence", "blackObelisk");
for (const _ of Object.values(transcendenceUpgrades).sort((a, b) => a.tier - b.tier)) {
  if (previous) {
    renderDependency(previous.name, _.name);
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
