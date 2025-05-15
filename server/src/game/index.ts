import { levels } from "./levels";

const levelsArray = Object.values(levels);
let lastLevelIndex = -1;

function rotateCounterClockwise(board: string[][], rotations: number) {
  for (let i = 0; i < rotations; i++) {
    board = board.map((row) => row.reverse());
    board = board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  return board;
}

export function getRandomLevel(rotateBoard = true) {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * levelsArray.length);
  } while (randomIndex === lastLevelIndex);

  lastLevelIndex = randomIndex;
  const level = levelsArray[randomIndex];

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
