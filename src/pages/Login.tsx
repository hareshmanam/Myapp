import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../auth'

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      if (!loginEmail.trim()) {
        setLoginError('Email required')
        setLoginLoading(false)
        return
      }

      if (!loginPassword.trim()) {
        setLoginError('Password required')
        setLoginLoading(false)
        return
      }

      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      // onAuthStateChanged will handle redirect
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setLoginError('Email not found')
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Wrong password')
      } else if (error.code === 'auth/invalid-credential') {
        setLoginError('Invalid email or password')
      } else {
        setLoginError(error.message)
      }
    } finally {
      setLoginLoading(false)
    }
  }

  // HANDLE SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')
    setSignupLoading(true)

    try {
      if (!signupName.trim()) {
        setSignupError('Name required')
        setSignupLoading(false)
        return
      }

      if (!signupEmail.trim()) {
        setSignupError('Email required')
        setSignupLoading(false)
        return
      }

      if (signupPassword !== signupConfirm) {
        setSignupError('Passwords do not match')
        setSignupLoading(false)
        return
      }

      if (signupPassword.length < 6) {
        setSignupError('Password must be at least 6 characters')
        setSignupLoading(false)
        return
      }

      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      
      await updateProfile(userCredential.user, {
        displayName: signupName,
      })

      setSignupError('✅ Account created! Redirecting...')
      
      setTimeout(() => {
        navigate('/')
      }, 1500)

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setSignupError('Email already in use')
      } else if (error.code === 'auth/invalid-email') {
        setSignupError('Invalid email')
      } else {
        setSignupError(error.message)
      }
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => { setTab('login'); setLoginError(''); setSignupError(''); }}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: tab === 'login' ? '#dbeafe' : 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: tab === 'login' ? '#0369a1' : '#6b7280',
              cursor: 'pointer',
              borderBottom: tab === 'login' ? '3px solid #0369a1' : 'none'
            }}
          >
            🔐 Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setLoginError(''); setSignupError(''); }}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: tab === 'signup' ? '#dbeafe' : 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: tab === 'signup' ? '#0369a1' : '#6b7280',
              cursor: 'pointer',
              borderBottom: tab === 'signup' ? '3px solid #0369a1' : 'none'
            }}
          >
            ✍️ Create Account
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {/* LOGIN TAB */}
          {tab === 'login' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Sign In</h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>Welcome back!</p>

              {loginError && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: '#991b1b', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loginLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: loginLoading ? 0.6 : 1
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loginLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: loginLoading ? 0.6 : 1
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    padding: '12px',
                    backgroundColor: loginLoading ? '#ccc' : '#0369a1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: loginLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #0369a1' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '13px' }}>Demo Admin:</p>
                <p style={{ margin: '0', fontSize: '13px' }}>Email: admin@rtc.com</p>
                <p style={{ margin: '0', fontSize: '13px' }}>Password: admin123456</p>
              </div>
            </div>
          )}

          {/* SIGNUP TAB */}
          {tab === 'signup' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>Join RTC Bliss Drive</p>

              {signupError && (
                <div style={{ 
                  backgroundColor: signupError.includes('✅') ? '#dcfce7' : '#fee2e2', 
                  color: signupError.includes('✅') ? '#166534' : '#991b1b', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {signupError}
                </div>
              )}

              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Full Name</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="John Doe"
                    disabled={signupLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: signupLoading ? 0.6 : 1
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={signupLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: signupLoading ? 0.6 : 1
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={signupLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: signupLoading ? 0.6 : 1
                    }}
                  />
                  <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>Min 6 characters</small>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>Confirm Password</label>
                  <input
                    type="password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    placeholder="••••••••"
                    disabled={signupLoading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: signupLoading ? 0.6 : 1
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={signupLoading}
                  style={{
                    padding: '12px',
                    backgroundColor: signupLoading ? '#ccc' : '#0369a1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: signupLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {signupLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
