import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AdBanner from '../components/AdBanner'

export default function Layout() {
  const location = useLocation()
  
  const hideAds = location.pathname.startsWith('/cms') || 
                   location.pathname.startsWith('/login') ||
                   location.pathname.startsWith('/reset-password')

  return (
    <>
      <Navbar />
      <Outlet />
      {!hideAds && <AdBanner />}
      <Footer />
    </>
  )
}