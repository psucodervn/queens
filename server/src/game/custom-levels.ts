import { createHash } from "crypto";
import {
  altoMain,
  anakiwa,
  bittersweet,
  celadon,
  chardonnay,
  halfBaked,
  lightOrchid,
  lightWisteria,
  nomad,
  saharaSand,
  turquoiseBlue,
  lavenderRose,
} from "./colors";
import * as raw6Levels from "./custom-levels/6";
import * as raw7Levels from "./custom-levels/7";
import * as raw8Levels from "./custom-levels/8";
import * as raw9Levels from "./custom-levels/9";
import * as raw10Levels from "./custom-levels/10";
import * as raw11Levels from "./custom-levels/11";
import * as raw12Levels from "./custom-levels/12";
import { Level } from "./types";

type RawLevel = {
  size: number;
  board: string[][];
};

const mapRawLevelToLevel = (level: RawLevel): Level => ({
  id: createHash("md5").update(JSON.stringify(level.board)).digest("hex"),
  size: level.size,
  colorRegions: level.board,
  regionColors: {
    A: lightWisteria,
    B: chardonnay,
    C: anakiwa,
    D: celadon,
    E: altoMain,
    F: bittersweet,
    G: saharaSand,
    H: nomad,
    I: lightOrchid,
    J: halfBaked,
    K: turquoiseBlue,
    L: lavenderRose,
  },
});

const size6Levels = Object.values(raw6Levels).map(mapRawLevelToLevel);
const size7Levels = Object.values(raw7Levels).map(mapRawLevelToLevel);
const size8Levels = Object.values(raw8Levels).map(mapRawLevelToLevel);
const size9Levels = Object.values(raw9Levels).map(mapRawLevelToLevel);
const size10Levels = Object.values(raw10Levels).map(mapRawLevelToLevel);
const size11Levels = Object.values(raw11Levels).map(mapRawLevelToLevel);
const size12Levels = Object.values(raw12Levels).map(mapRawLevelToLevel);

const customLevels = [
  ...size6Levels,
  ...size7Levels,
  ...size8Levels,
  ...size9Levels,
  ...size10Levels,
  ...size11Levels,
  ...size12Levels,
];

export { customLevels };
