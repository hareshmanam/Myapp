import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import AdBanner from '../components/AdBanner'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-rt py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-blue-600">
            🚗 RTC Bliss Drive
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
            <Link to="/about" className="hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="hover:text-blue-600 font-medium">Contact</Link>
            {isAdmin && <Link to="/cms" className="hover:text-blue-600 font-medium text-yellow-600">⚙️ CMS</Link>}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                {isAdmin && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ ADMIN</span>}
                <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="container-rt py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 font-medium">Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 font-medium">About</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 font-medium">Contact</Link>
              {isAdmin && <Link to="/cms" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 font-medium text-yellow-600">⚙️ CMS</Link>}
              
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <>
                    <p className="text-sm text-gray-700 mb-2">{user.email}</p>
                    {isAdmin && <p className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded mb-3">⭐ ADMIN</p>}
                    <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full">
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Ads Banner - BEFORE Footer */}
      <AdBanner />

      {/* Footer */}
      <Footer />
    </div>
  )
}
