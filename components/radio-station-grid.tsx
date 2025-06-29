"use client"

import { RadioStationCard } from "./radio-station-card"
import type { Station } from "@/lib/types"

interface RadioStationGridProps {
  stations: Station[]
}

export function RadioStationGrid({ stations }: RadioStationGridProps) {
  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No hay estaciones disponibles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stations.map((station) => (
        <RadioStationCard key={station.id} station={station} />
      ))}
    </div>
  )
}
