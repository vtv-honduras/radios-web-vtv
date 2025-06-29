import type { AdminUser } from "./types"

// Credenciales de admin (en producción esto debería estar en una base de datos segura)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  role: "admin" as const,
}

const AUTH_KEY = "radio_admin_auth"

export function login(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          username: ADMIN_CREDENTIALS.username,
          role: ADMIN_CREDENTIALS.role,
          loginTime: new Date().toISOString(),
        }),
      )
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return false

  try {
    const authData = JSON.parse(auth)
    // Verificar si la sesión no ha expirado (24 horas)
    const loginTime = new Date(authData.loginTime)
    const now = new Date()
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

    return hoursDiff < 24
  } catch {
    return false
  }
}

export function getAuthUser(): AdminUser | null {
  if (!isAuthenticated()) return null

  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return null

  try {
    const authData = JSON.parse(auth)
    return {
      username: authData.username,
      password: "", // No devolver la contraseña
      role: authData.role,
    }
  } catch {
    return null
  }
}
