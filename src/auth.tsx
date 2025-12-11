import React, { createContext, useContext, useState, useEffect } from 'react'

export type Role = 'guest' | 'user' | 'admin'
export type User = { 
  id: string
  email: string
  name: string
  role: Role 
}

type AuthCtx = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('rtc_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('rtc_user')
      }
    }
    setLoading(false)
  }, [])

  async function login(email: string, password: string) {
    try {
      setLoading(true)
      
      if (!email || !password) {
        return { ok: false, error: 'Email and password required' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password 6+ chars' }
      }

      await new Promise(r => setTimeout(r, 800))

      const userData: User = {
        id: 'u' + Date.now(),
        email: email,
        name: email.split('@')[0],
        role: email.toLowerCase() === 'admin@rtc.com' ? 'admin' : 'user',
      }
      
      setUser(userData)
      localStorage.setItem('rtc_user', JSON.stringify(userData))
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      setLoading(true)
      
      if (!email || !password || !name) {
        return { ok: false, error: 'All fields required' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password 6+ chars' }
      }

      await new Promise(r => setTimeout(r, 800))

      const userData: User = {
        id: 'u' + Date.now(),
        email: email,
        name: name,
        role: email.toLowerCase() === 'admin@rtc.com' ? 'admin' : 'user',
      }
      
      setUser(userData)
      localStorage.setItem('rtc_user', JSON.stringify(userData))
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    setUser(null)
    localStorage.removeItem('rtc_user')
  }

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth error')
  return c
}