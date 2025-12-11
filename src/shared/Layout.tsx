import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import AdBanner from '../components/AdBanner'
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
      <header className="bg-brand-600 text-white sticky top-0 z-50">
        <div className="container-rt py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            🚗 RTC
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-brand-100">Home</Link>
            <Link to="/stories" className="hover:text-brand-100">Stories</Link>
            <Link to="/about" className="hover:text-brand-100">About</Link>
            <Link to="/contact" className="hover:text-brand-100">Contact</Link>
            {isAdmin && <Link to="/cms" className="hover:text-brand-100 font-bold text-yellow-300">CMS (Admin)</Link>}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm">{user.email}</p>
                  <p className={`text-xs font-bold ${isAdmin ? 'text-yellow-300' : 'text-gray-200'}`}>
                    {isAdmin ? '⭐ ADMIN' : 'User'}
                  </p>
                </div>
                <button onClick={handleLogout} className="btn-sm">Logout</button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-sm">Login</button>
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
          <div className="md:hidden bg-brand-700 border-t border-brand-500">
            <nav className="container-rt py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-100">Home</Link>
              <Link to="/stories" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-100">Stories</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-100">About</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-100">Contact</Link>
              {isAdmin && <Link to="/cms" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-100 font-bold text-yellow-300">CMS (Admin)</Link>}
              
              <div className="border-t border-brand-500 pt-4">
                {user ? (
                  <>
                    <p className="text-sm mb-2">{user.email}</p>
                    <p className={`text-xs font-bold mb-3 ${isAdmin ? 'text-yellow-300' : 'text-gray-200'}`}>
                      {isAdmin ? '⭐ ADMIN' : 'User'}
                    </p>
                    <button onClick={handleLogout} className="btn-sm w-full">Logout</button>
                  </>
                ) : (
                  <button onClick={() => {
                    navigate('/login')
                    setMobileMenuOpen(false)
                  }} className="btn-sm w-full">Login</button>
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

      {/* Ads */}
      <AdBanner />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-rt text-center text-sm text-gray-400">
          <p>&copy; 2024 RTC Bliss Drive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}