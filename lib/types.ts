export interface Station {
  id: string
  name: string
  genre: string
  coverImage: string
  streamUrl: string
  listeners?: number
  description?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  frequency?: string
  location?: string
  website?: string
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    whatsapp?: string
  }
  programs?: Array<{
    name: string
    time: string
    host: string
  }>
  tags?: string[]
  // Nuevos campos
  generalDescription?: string
  hosts?: string // Locutores generales como texto libre
  programming?: ProgramSegment[]
}

export interface ProgramSegment {
  id: string
  horaInicio: string // "08:00 AM"
  horaFin: string // "10:00 AM"
  segmento: string // "Mañanas alegres"
  locutores: string // "Con Juan Horlando y Xiomara Castro"
}

export interface AdminUser {
  email: string
  password: string
  role: "admin"
}

export interface AudioState {
  currentStation: Station | null
  currentIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  error: string | null
}

export interface ContactForm {
  name: string
  email: string
  message: string
}
