"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getStationById, updateStation } from "@/lib/stations"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Station } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import Image from "next/image"

function EditStationPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [station, setStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    coverImage: "",
    streamUrl: "",
    listeners: 0,
    description: "",
    generalDescription: "",
    hosts: "",
    frequency: "",
    location: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  })

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const fetchedStation = await getStationById(params.id)
        if (fetchedStation) {
          setStation(fetchedStation)
          setFormData({
            name: fetchedStation.name,
            genre: fetchedStation.genre,
            coverImage: fetchedStation.coverImage || "",
            streamUrl: fetchedStation.streamUrl,
            listeners: fetchedStation.listeners || 0,
            description: fetchedStation.description || "",
            generalDescription: fetchedStation.generalDescription || "",
            hosts: fetchedStation.hosts || "",
            frequency: fetchedStation.frequency || "",
            location: fetchedStation.location || "",
            website: fetchedStation.website || "",
            facebook: fetchedStation.social?.facebook || "",
            twitter: fetchedStation.social?.twitter || "",
            instagram: fetchedStation.social?.instagram || "",
            youtube: fetchedStation.social?.youtube || "",
            whatsapp: fetchedStation.social?.whatsapp || "",
          })
        }
      } catch (error) {
        console.error("Error fetching station:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchStation()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        ...formData,
        social: {
          facebook: formData.facebook || undefined,
          twitter: formData.twitter || undefined,
          instagram: formData.instagram || undefined,
          youtube: formData.youtube || undefined,
          whatsapp: formData.whatsapp || undefined,
        },
      }

      // Remover campos de redes sociales del objeto principal
      const { facebook, twitter, instagram, youtube, whatsapp, ...stationData } = updateData

      await updateStation(params.id, { ...stationData, social: updateData.social })
      router.push("/admin")
    } catch (error) {
      console.error("Error updating station:", error)
      alert("Error al actualizar la estación")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "listeners" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP)")
      return
    }

    if (file.size > maxSize) {
      alert("El archivo es demasiado grande. Máximo 5MB.")
      return
    }

    try {
      // Convertir a base64
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setFormData((prev) => ({
          ...prev,
          coverImage: base64,
        }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error al procesar la imagen:", error)
      alert("Error al procesar la imagen")
    }
  }

  if (initialLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Cargando estación...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!station) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Estación no encontrada</p>
          <Link href="/admin" className="text-primary hover:underline">
            Volver al panel de administración
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Estación</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Nombre de la Estación *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Género *
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="streamUrl" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  URL de Stream *
                </label>
                <input
                  type="url"
                  id="streamUrl"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Frecuencia
                </label>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder="ej: 101.5 FM"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ej: Ciudad de México"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="listeners" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Oyentes
                </label>
                <input
                  type="number"
                  id="listeners"
                  name="listeners"
                  value={formData.listeners}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Sitio Web
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Imagen de Portada</h2>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Formatos soportados: JPG, PNG, GIF, WebP. Máximo 5MB.
            </p>

            {/* Preview de la imagen */}
            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Vista previa:</p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  <Image
                    src={formData.coverImage || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Descripciones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Descripciones</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Descripción Corta
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="generalDescription"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Descripción General
                </label>
                <textarea
                  id="generalDescription"
                  name="generalDescription"
                  value={formData.generalDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="hosts" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Locutores
                </label>
                <textarea
                  id="hosts"
                  name="hosts"
                  value={formData.hosts}
                  onChange={handleChange}
                  rows={2}
                  placeholder="ej: Con nuestro equipo de locutores: Juan Horlando, Xiomara Castro..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Redes Sociales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="whatsapp" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  WhatsApp
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+504-9876-5432"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function EditStationPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <EditStationPageContent params={params} />
    </ProtectedRoute>
  )
}
