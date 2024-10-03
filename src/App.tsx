import React, { useState, useEffect, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Grid from './components/Grid'
import EnergyBar from './components/EnergyBar'
import Shop from './components/Shop'
import { Item } from './types'
import { Coins, RefreshCw } from 'lucide-react'

const GRID_SIZE = 6
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE
const ITEM_TYPES = ['A', 'B', 'C'] as const
const MAX_ENERGY = 100
const ENERGY_GENERATION_RATE = 2
const ENERGY_GENERATION_INTERVAL = 1000
const NEW_ITEM_ENERGY_COST = 10

function App() {
  const [items, setItems] = useState<(Item | null)[]>([])
  const [energy, setEnergy] = useState(MAX_ENERGY)
  const [gold, setGold] = useState(0)

  const initializeGrid = useCallback(() => {
    const initialItems: (Item | null)[] = Array.from({ length: TOTAL_CELLS }, (_, index) => {
      if (Math.random() > 0.5) {
        return {
          id: index,
          level: Math.floor(Math.random() * 3) + 1,
          position: index,
          type: ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
        }
      }
      return null
    })
    setItems(initialItems)
  }, [])

  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + ENERGY_GENERATION_RATE, MAX_ENERGY))
    }, ENERGY_GENERATION_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  const handleMerge = (fromId: number, toId: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const fromItem = newItems[fromId]
      const toItem = newItems[toId]

      if (fromItem && toItem && fromItem.level === toItem.level && fromItem.type === toItem.type) {
        const newLevel = fromItem.level + 1
        newItems[toId] = { ...toItem, level: newLevel }
        newItems[fromId] = null
      } else if (fromItem && !toItem) {
        newItems[toId] = { ...fromItem, position: toId }
        newItems[fromId] = null
      }

      return newItems
    })
  }

  const createNewItem = useCallback(() => {
    if (energy >= NEW_ITEM_ENERGY_COST) {
      const emptyPositions = items.reduce((acc, item, index) => {
        if (item === null) acc.push(index)
        return acc
      }, [] as number[])

      if (emptyPositions.length > 0) {
        const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
        const newItem: Item = {
          id: randomPosition,
          level: 1,
          position: randomPosition,
          type: ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
        }

        setItems((prevItems) => {
          const newItems = [...prevItems]
          newItems[randomPosition] = newItem
          return newItems
        })

        setEnergy((prevEnergy) => prevEnergy - NEW_ITEM_ENERGY_COST)
      }
    }
  }, [energy, items])

  const handleSellItem = (item: Item) => {
    setGold((prevGold) => prevGold + item.level)
    setItems((prevItems) => prevItems.map((i) => i?.id === item.id ? null : i))
  }

  const handleRestart = () => {
    setEnergy(MAX_ENERGY)
    setGold(0)
    initializeGrid()
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8">Merge Game</h1>
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            <Coins className="w-6 h-6 mr-2 text-yellow-500" />
            <span className="text-xl font-semibold">{gold}</span>
          </div>
          <button
            onClick={handleRestart}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Restart
          </button>
        </div>
        <EnergyBar energy={energy} maxEnergy={MAX_ENERGY} onCreateItem={createNewItem} />
        <div className="flex space-x-4">
          <Grid items={items} onMerge={handleMerge} gridSize={GRID_SIZE} />
          <Shop onSellItem={handleSellItem} />
        </div>
      </div>
    </DndProvider>
  )
}

export default App