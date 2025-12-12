import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      // Validation
      if (!name.trim()) {
        setMessage('❌ Name required')
        setLoading(false)
        return
      }

      if (!email.trim()) {
        setMessage('❌ Email required')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setMessage('❌ Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setMessage('❌ Password must be 6+ characters')
        setLoading(false)
        return
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      setMessage('✅ Account created successfully! Redirecting...')
      
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setMessage('❌ Email already in use')
      } else if (error.code === 'auth/invalid-email') {
        setMessage('❌ Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        setMessage('❌ Password is too weak')
      } else {
        setMessage(`❌ ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>Create Account</h1>

      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (message.includes('✅') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '4px',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1
            }}
          />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Min 6 characters</small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ margin: '0', color: '#666' }}>
          Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</a>
        </p>
      </div>

      <hr style={{ margin: '30px 0' }} />

      <div style={{ backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '4px', borderLeft: '4px solid #2196F3' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Test Admin Account:</p>
        <p style={{ margin: '5px 0' }}>Email: <code>admin@rtc.com</code></p>
        <p style={{ margin: '5px 0' }}>Password: <code>admin123456</code></p>
      </div>
    </div>
  )
}
