// Helper function to create an empty board
export const createEmptyBoard = (size: number): string[][] => {
  return Array(size)
    .fill(' ')
    .map(() => Array(size).fill(' ')); // Create an empty board based on the size parameter
};

export const createInitialBoardForBuilder = (size: number, fill: string): string[][] => {
  return Array(size)
    .fill(fill)
    .map(() => Array(size).fill(fill)); // Create an empty board based on the size parameter
};
