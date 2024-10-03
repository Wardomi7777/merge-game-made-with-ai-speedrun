import React from 'react'
import { useDrop } from 'react-dnd'
import { Item } from '../types'
import { ShoppingBag } from 'lucide-react'

interface ShopProps {
  onSellItem: (item: Item) => void
}

const Shop: React.FC<ShopProps> = ({ onSellItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (droppedItem: { id: number, item: Item }) => {
      onSellItem(droppedItem.item)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onSellItem])

  return (
    <div
      ref={drop}
      className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg ${
        isOver ? 'bg-yellow-200' : 'bg-yellow-100'
      } border-2 border-yellow-500 cursor-pointer`}
    >
      <ShoppingBag className="w-12 h-12 text-yellow-500 mb-2" />
      <span className="text-sm font-semibold text-yellow-700">Shop</span>
    </div>
  )
}

export default Shop