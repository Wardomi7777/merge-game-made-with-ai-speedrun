import React from 'react'
import { Battery } from 'lucide-react'

interface EnergyBarProps {
  energy: number
  maxEnergy: number
  onCreateItem: () => void
}

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy, onCreateItem }) => {
  const percentage = (energy / maxEnergy) * 100

  return (
    <div className="w-full max-w-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Battery className="w-6 h-6 mr-2 text-blue-500" />
          <span className="text-lg font-semibold">Energy: {energy}/{maxEnergy}</span>
        </div>
        <button
          onClick={onCreateItem}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={energy < 10}
        >
          Create Item (10 Energy)
        </button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default EnergyBar