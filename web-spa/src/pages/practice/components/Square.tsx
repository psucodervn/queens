import { BoardItemValue } from '@/lib/game/board'
import { PointerEventHandler } from 'react'
import Cross from './Cross'
import Queen from './Queen'
import './Square.css'

interface SquareProps {
  value: BoardItemValue
  color: string
  onPointerDown: PointerEventHandler<HTMLElement>
  onPointerEnter: PointerEventHandler<HTMLElement>
  onPointerUp: PointerEventHandler<HTMLElement>
  isClashing: boolean
}

// Square component with color regions and toggling between 'X', 'Q', and empty
const Square = ({ value, color, onPointerDown, onPointerEnter, onPointerUp, isClashing, ...props }: SquareProps) => {
  // const regionColors = level.regionColors;

  return (
    <div
      className={`hover:brightness-75 box-border flex items-center justify-center cursor-pointer border border-black text-[24px]`}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerUp={onPointerUp}
      style={{
        backgroundColor: color,
        color: isClashing ? 'red' : 'black',
      }}
      draggable='false'
      {...props}
    >
      {value === 'Q' ? <Queen /> : value === 'X' ? <Cross /> : value}
    </div>
  )
}

export default Square
