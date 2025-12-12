import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Role = 'guest' | 'user' | 'admin'

export interface User {
  id: string
  email: string
  role: Role
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Generate proper UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Load user on mount
  useEffect(() => {
    const stored = localStorage.getItem('rtc_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
  }, [])

  async function login(email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    email = email.toLowerCase().trim()

    // Validate input
    if (!email) throw new Error('Email required')
    if (!password || password.length < 6) throw new Error('Password must be 6+ characters')

    // Check if admin
    const isAdmin = email === 'admin@rtc.com'

    // Create or get user with proper UUID
    const userId = generateUUID()  // Generate proper UUID instead of timestamp
    
    const user: User = {
      id: userId,
      email: email,
      role: isAdmin ? 'admin' : 'user'
    }

    // Store in localStorage
    localStorage.setItem('rtc_user', JSON.stringify(user))
    setUser(user)

    console.log('✅ Login successful:', { email, role: user.role })
  }

  async function logout() {
    localStorage.removeItem('rtc_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
