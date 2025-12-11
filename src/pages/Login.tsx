import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { login, signup, user } = useAuth()
  const nav = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      nav('/')
    }
  }, [user, nav])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let res
      if (isSignup) {
        if (!name.trim()) {
          setError('Please enter your name')
          setLoading(false)
          return
        }
        res = await signup(email, password, name)
        if (res.ok) {
          setSuccess('Account created! Redirecting...')
          setTimeout(() => nav('/'), 1500)
        } else {
          setError(res.error || 'Signup failed')
        }
      } else {
        res = await login(email, password)
        if (res.ok) {
          setSuccess('Login successful! Redirecting...')
          setTimeout(() => nav('/'), 1500)
        } else {
          setError(res.error || 'Login failed')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            🚗
          </div>
          <h1 className="text-3xl font-bold">On My Way to...</h1>
          <p className="text-gray-600 mt-1">
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              required
            />
            {!isSignup && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full justify-center mt-6"
          >
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t pt-6">
          <p className="text-center text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError('')
                setSuccess('')
                setEmail('')
                setPassword('')
                setName('')
              }}
              className="text-brand-600 font-medium ml-1 hover:underline"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-900 font-medium">💡 How it works:</p>
          <p className="text-xs text-blue-800 mt-2">
            ✓ See 4 free stories as guest
          </p>
          <p className="text-xs text-blue-800">
            ✓ Sign up to access all stories
          </p>
          <p className="text-xs text-blue-800">
            ✓ Read 20 stories to unlock coupon
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          <Link to="/" className="text-brand-600 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </main>
  )
}