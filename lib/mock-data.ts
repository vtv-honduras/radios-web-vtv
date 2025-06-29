import mockStations from "@/data/mock-stations.json"
import type { Station } from "./types"

export function getMockStations(): Station[] {
  return mockStations.stations.map((station) => ({
    ...station,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

export function getMockStationById(id: string): Station | null {
  const station = mockStations.stations.find((s) => s.id === id)
  if (!station) return null

  return {
    ...station,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
