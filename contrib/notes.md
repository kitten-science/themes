# Notes about Themes

## Village Layout

### Jobs

- Job list is very narrow by nature.
- Some jobs could include action items.

### Loadouts

- A layout problem.
- Would be cool as `ol` items that stack on the right maybe? (Works: https://codepen.io/oliversalzburg/pen/)ZYYQgJe

### Management

- Happiness/Festival should be at the top
- Send Hunters is job action
- Manage Jobs is leader action
- Promote Kittens is leader action
- Unwrap present can't be too call-to-actiony, because people stash those

### Census

- Should be at the bottom.
- Yet, should ideally be right below the jobs, to sandwich the leader in between.

### Final Order

1.  Happiness/Festival
2.  Woodcutter
3.  Farmer
4.  Scholar
5.  Hunter + Send hunters
6.  Miner
7.  Priest
8.  Geologist
9.  Engineer
10. Clear job assignments, Unwrap present box
11. Leader
12. Census

#### Leader

.currentGovernment
    - .currentLeader:1
        - span.name: Ruby Silver                            ROW 2
        - text: , Philosopher (Religion bonus) [rank 12]    ROW 2
            alt , No trait :<                               HIDE
    - .currentLeader:2
        - text: exp: 162.56K (39%)                          ROW 1
    - .currentLeader:3
        - text: Job bonus: ×9.3 (Scholar)                   ROW 1
    - a:1
        - text: Promote (412.50K exp, 325 gold)             BUTTON
    - a:2
        - text: Unassign Leader                             BUTTON

.simLeader (optional)
    - span.name: Ruby Silver                                HIDE (possibly replace .currentLeader:1)
    - .info text: , 7 years old, Philosopher (rank 12)      HIDE (possibly replace .currentLeader:1)
            alt:  , 7 years old, None (rank 6)              HIDE (possibly replace .currentLeader:1)
    - span.skill: Scholar +1502% (master 100%)              ROW 1
        repeats
    - Promote                                               BUTTON
    - Favorite                                              BUTTON
    - Make Leader                                           BUTTON
    - Unassign (from job)                                   BUTTON

- Manage Jobs                                               BUTTON
- Promote Kittens                                           BUTTON



## Kittens Game Color Theory

### 10 Basic Rules

1. _Metallic_ resources are `"gray"`/`#808080`.
1. _Special_ stuff and p1 messages derive from **blue/purple/violet** space. Think eludium, void, antimatter, paragon.
   Distinct from **pink** scale, which is parchment/culture/elderBox.
1. UI elements use **grayscale**, sometime slightly pitched.
1. _Radioactive_ stuff is **green**. TimeCrystals are radioactive.
1. _Science_/_Knowledge_ stuff and p3 messages are **blue**. `#01A9DB`
1. **Red** is for p0 messages (+noRes), unobtainium, blood, and necrocorns.
1. Rare resources are **orange** and glow.
1. Uncommon resources and p2 messages are **orange**. (Not correctly positioned on color scale!)
1. At the yellow edge of the scale is only blackcoin `"gold"`/`#FFD700` and kerosene (bugged).
1. Kittens derive their color from the catscale.

### Derived Model Properties

1. _Metallic_ resources can use the **grayscale**.
1. _Radioactive_ stuff is **green**, glows.
1. **Red** (edge) is unchanged, for signal value, and must be respected.
1. The **red/orange/yellow** space can be refactored and repurposed.
1. Message priority aligns with resource rarity. Priority should not be communicated by color only!
1. **Blue** (edge) is unchanged, for signal value, and refers to _Science_/_Knowledge_.
1. The **blue/purple/violet/pink** can be relocated.
1. Non-contributors can be colored freely. Manpower, tMythril, UI borders, 

## Kittens Game Color Palette

Now maintained at </source/icons/icons.js>.

- ref: <https://developer.mozilla.org/en-US/docs/Web/CSS/named-color>
- ref: <https://en.wikipedia.org/wiki/Web_colors>
