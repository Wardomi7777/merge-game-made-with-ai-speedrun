import React from 'react'
import Cell from './Cell'
import { Item } from '../types'

interface GridProps {
  items: (Item | null)[]
  onMerge: (fromId: number, toId: number) => void
  gridSize: number
}

const Grid: React.FC<GridProps> = ({ items, onMerge, gridSize }) => {
  return (
    <div 
      className="grid gap-2 bg-white p-4 rounded-lg shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        width: `${gridSize * 4 + 2}rem`, // Adjust the width based on the grid size
      }}
    >
      {items.map((item, index) => (
        <Cell key={index} item={item} onMerge={onMerge} position={index} />
      ))}
    </div>
  )
}

export default Grid