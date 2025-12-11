import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Ad = {
  id: string
  title: string
  description: string
  link_url: string
  button_text: string
  is_active: boolean
}

export default function AdBanner() {
  const [ads, setAds] = useState<Ad[]>([])
  const location = useLocation()

  useEffect(() => {
    loadAds()
  }, [location.pathname])

  const loadAds = () => {
    try {
      const stored = localStorage.getItem('rtc_ads')
      if (stored) {
        const allAds = JSON.parse(stored)
        const activeAds = allAds.filter((a: Ad) => a.is_active && a.title && a.title.trim() !== '')
        
        if (activeAds.length > 0) {
          const pageAds = getPageAds(activeAds)
          setAds(pageAds)
        }
      }
    } catch (e) {
      console.error('Error loading ads:', e)
      setAds([])
    }
  }

  const getPageAds = (allActiveAds: Ad[]) => {
    const pagePath = location.pathname
    const pageHash = pagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const startIndex = pageHash % Math.max(1, allActiveAds.length)
    
    const adsToShow = []
    for (let i = 0; i < Math.min(3, allActiveAds.length); i++) {
      adsToShow.push(allActiveAds[(startIndex + i) % allActiveAds.length])
    }
    return adsToShow
  }

  if (ads.length === 0) {
    return (
      <div className="py-8 border-t border-b bg-gray-50">
        <div className="container-rt">
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No active advertisements</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 border-t border-b bg-gray-50">
      <div className="container-rt">
        <h2 className="text-lg font-semibold mb-6 text-center">Featured Partners</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {ads.map((ad, idx) => (
            <div
              key={`${ad.id}-${idx}`}
              className="card p-6 bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{ad.description}</p>
              {ad.link_url && (
                <a
                  href={ad.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full justify-center text-center"
                >
                  {ad.button_text}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}