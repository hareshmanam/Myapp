import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const link = 'text-sm text-gray-600 hover:text-gray-900 transition-colors'
  const active = 'text-sm text-brand-600 font-semibold'
  
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container-rt h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
            🚗
          </div>
          <span className="font-bold text-lg hidden sm:inline">RTC Bliss Drive</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? active : link}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? active : link}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? active : link}>Contact</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/cms" className={({ isActive }) => isActive ? active : link}>CMS</NavLink>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs font-medium text-brand-900">{user.name}</span>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-brand-600 text-white text-xs rounded-full">Admin</span>
                )}
              </div>
              <button onClick={logout} className="btn-ghost text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </nav>
    </header>
  )
}