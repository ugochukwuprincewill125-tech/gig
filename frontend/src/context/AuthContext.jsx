import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { tokens } from '../services/api'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [initialising, setInitialising] = useState(Boolean(tokens.access || tokens.refresh))

  // Restore the session on first load.
  useEffect(() => {
    let active = true
    if (!tokens.access && !tokens.refresh) return undefined
    authService
      .me()
      .then((me) => active && setUser(me))
      .catch(() => {
        tokens.clear()
        if (active) setUser(null)
      })
      .finally(() => active && setInitialising(false))
    return () => {
      active = false
    }
  }, [])

  // The API layer fires this when a refresh token is no longer valid.
  useEffect(() => {
    const onForcedLogout = () => {
      setUser(null)
      queryClient.removeQueries({ queryKey: ['orders'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
    }
    window.addEventListener('tgs:logout', onForcedLogout)
    return () => window.removeEventListener('tgs:logout', onForcedLogout)
  }, [queryClient])

  const login = useCallback(async (email, password) => {
    const me = await authService.login(email, password)
    setUser(me)
    return me
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    setUser(null)
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['dashboard'] })
    queryClient.removeQueries({ queryKey: ['addresses'] })
  }, [queryClient])

  const refreshUser = useCallback(async () => {
    const me = await authService.me()
    setUser(me)
    return me
  }, [])

  const value = useMemo(
    () => ({ user, setUser, isAuthenticated: Boolean(user), initialising, login, register, logout, refreshUser }),
    [user, initialising, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
