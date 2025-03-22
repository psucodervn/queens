import React, { PointerEventHandler } from 'react';

import { Level } from '@/lib/game/logic';
import Cross from './Cross';
import Queen from './Queen';

interface SquareProps {
  row: number;
  col: number;
  value: string;
  region: string;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerEnter: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  level: Level;
  isClashing: boolean;
}

// Square component with color regions and toggling between 'X', 'Q', and empty
const Square = ({
  row,
  col,
  value,
  region,
  onPointerDown,
  onPointerEnter,
  onPointerUp,
  level,
  isClashing,
  ...props
}: SquareProps) => {
  const boardSize = level.size;
  const colorRegions = level.colorRegions;
  const regionColors = level.regionColors;

  // Function to determine border classes
  const getBorderClasses = () => {
    const borderClasses: string[] = [];
    const adjacentSquares = [
      { position: 'top', value: row > 0 ? colorRegions[row - 1][col] : null },
      {
        position: 'right',
        value: col < boardSize - 1 ? colorRegions[row][col + 1] : null,
      },
      {
        position: 'bottom',
        value: row < boardSize - 1 ? colorRegions[row + 1][col] : null,
      },
      { position: 'left', value: col > 0 ? colorRegions[row][col - 1] : null },
    ];

    adjacentSquares.forEach(({ position, value: adjValue }) => {
      if (adjValue === ' ') {
        borderClasses.push(`thick-border-${position[0]}`); // Add thick border if adjacent square is empty
        borderClasses.push(`thick-outer-border-${position[0]}`);
      } else if (adjValue !== region) {
        borderClasses.push(`thick-border-${position[0]}`); // Add thick border if adjacent square has a different color
      }
    });

    return borderClasses;
  };

  const borderClasses = getBorderClasses().join(' '); // Get the border classes

  return (
    <div
      className={`square hover:brightness-75 ${borderClasses}`}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerUp={onPointerUp}
      style={{
        backgroundColor: regionColors[region],
        color: isClashing ? 'red' : 'black',
      }}
      draggable="false"
      {...props}
    >
      {value === 'Q' ? <Queen /> : value === 'X' ? <Cross /> : value}
    </div>
  );
};

export default Square;
