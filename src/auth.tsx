import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

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
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          role: session.user.email === 'admin@rtc.com' ? 'admin' as Role : 'user' as Role,
        }
        setUser(userData)
        localStorage.setItem('rtc_user', JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem('rtc_user')
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          role: session.user.email === 'admin@rtc.com' ? 'admin' as Role : 'user' as Role,
        }
        setUser(userData)
        localStorage.setItem('rtc_user', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { ok: false, error: error.message }
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || 'User',
          role: email === 'admin@rtc.com' ? 'admin' as Role : 'user' as Role,
        }
        setUser(userData)
        localStorage.setItem('rtc_user', JSON.stringify(userData))
        return { ok: true }
      }

      return { ok: false, error: 'Login failed' }
    } catch (error: any) {
      return { ok: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        return { ok: false, error: error.message }
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          role: 'user' as Role,
        }
        setUser(userData)
        localStorage.setItem('rtc_user', JSON.stringify(userData))
        return { ok: true }
      }

      return { ok: false, error: 'Signup failed' }
    } catch (error: any) {
      return { ok: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem('rtc_user')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('AuthProvider missing')
  return c
}