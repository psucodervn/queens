import { levels } from "./levels";
import { customLevels } from "./custom-levels";

const levelsArray = Object.values(levels);
let lastLevelIndex = -1;

function rotateCounterClockwise(board: string[][], rotations: number) {
  for (let i = 0; i < rotations; i++) {
    board = board.map((row) => row.reverse());
    board = board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  return board;
}

export function getRandomLevel({
  rotateBoard = true,
  useCustomLevel = true,
}: {
  rotateBoard?: boolean;
  useCustomLevel?: boolean;
}) {
  let levels = useCustomLevel ? customLevels : levelsArray;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * levels.length);
  } while (randomIndex === lastLevelIndex);

  lastLevelIndex = randomIndex;
  const level = levels[randomIndex];
  console.log(level, randomIndex);

  if (!rotateBoard) {
    return level;
  }

  // rotate counter-clockwise random times
  const rotations = Math.floor(Math.random() * 4);
  const colorRegions = rotateCounterClockwise(level.colorRegions, rotations);

  return {
    ...level,
    colorRegions,
  };
}
