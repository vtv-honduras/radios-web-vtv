"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { isAuthenticated, getAuthUser, login as authLogin, logout as authLogout } from "@/lib/auth"
import type { AdminUser } from "@/lib/types"

type AuthContextType = {
  user: AdminUser | null
  isLoading: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación al cargar
    if (isAuthenticated()) {
      setUser(getAuthUser())
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    const success = authLogin(username, password)
    if (success) {
      setUser(getAuthUser())
    }
    return success
  }

  const logout = () => {
    authLogout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
