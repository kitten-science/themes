import * as sass from "sass-embedded";
const result = sass.compile("source/_root.scss");
process.stdout.write(result.css + "\n");
