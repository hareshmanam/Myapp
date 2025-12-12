import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'

export type User = {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          role: firebaseUser.email === 'admin@rtc.com' ? 'admin' : 'user',
        }
        setUser(userData)
        localStorage.setItem('currentUser', JSON.stringify(userData))
      } else {
        // User is logged out
        setUser(null)
        localStorage.removeItem('currentUser')
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || 'User',
        role: userCredential.user.email === 'admin@rtc.com' ? 'admin' : 'user',
      }
      setUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      localStorage.removeItem('currentUser')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
