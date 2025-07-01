"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Loader2 } from "lucide-react"
import { getAllStations } from "@/lib/station.service"
import type { Station } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"

function AdminPageContent() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations()
        setStations(data)
      } catch (error) {
        console.error("Error al obtener estaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estaciones Registradas</h1>
        <Link
          href="/admin/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} />
          Nueva Estación
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-gray-500 dark:text-gray-300" size={24} />
          <span className="ml-2 text-gray-500 dark:text-gray-300">Cargando estaciones...</span>
        </div>
      ) : stations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay estaciones registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <Link
              key={station.id}
              href={`/admin/edit/${station.id}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={station.coverImage || "/placeholder.svg"}
                  alt={station.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{station.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{station.genre}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {station.isActive === false ? "Inactiva" : "Activa"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  )
}
