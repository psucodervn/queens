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
  alto,
  feijoa,
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
  size: level.size,
  colorRegions: level.board,
  regionColors: {
    A: lightWisteria,
    B: lightOrchid,
    C: anakiwa,
    D: bittersweet,
    E: nomad,
    F: chardonnay,
    G: celadon,
    H: saharaSand,
    I: altoMain,
    J: halfBaked,
    K: alto,
    L: feijoa,
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
