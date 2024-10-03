import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Item } from '../types'

interface CellProps {
  item: Item | null
  onMerge: (fromId: number, toId: number) => void
  position: number
}

const Cell: React.FC<CellProps> = ({ item, onMerge, position }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: () => ({ id: position, item }),
    canDrag: !!item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item, position])

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (droppedItem: { id: number, item: Item }) => {
      if (droppedItem.id !== position) {
        onMerge(droppedItem.id, position)
      }
    },
    canDrop: (droppedItem: { id: number, item: Item }) => {
      if (!item) return true // Can always drop on an empty cell
      if (droppedItem.id === position) return false // Can't drop on itself
      return item.type === droppedItem.item.type && item.level === droppedItem.item.level
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
    }),
  }), [item, position, onMerge])

  const cellStyle = `w-16 h-16 flex items-center justify-center text-white font-bold rounded-lg ${
    item ? 'cursor-move' : 'cursor-default'
  } ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-gray-300' : ''}`

  const getBgColor = (type: string) => {
    const colors = {
      'A': 'bg-blue-500',
      'B': 'bg-green-500',
      'C': 'bg-yellow-500',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div ref={drop}>
      <div 
        ref={drag} 
        className={`${cellStyle} ${item ? getBgColor(item.type) : 'bg-gray-200'}`}
      >
        {item ? `${item.type}${item.level}` : ''}
      </div>
    </div>
  )
}

export default Cell