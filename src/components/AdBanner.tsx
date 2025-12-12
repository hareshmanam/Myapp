import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type RestaurantAd = {
  id: string
  restaurant_name: string
  menu_link: string
  address: string
  offer: string
  content: string
  is_active: boolean
}

export default function AdBanner() {
  const location = useLocation()
  const [ads, setAds] = useState<RestaurantAd[]>([])

  useEffect(() => {
    loadAds()
  }, [])

  function loadAds() {
    const stored = localStorage.getItem('rtc_ads_full')
    if (stored) {
      try {
        setAds(JSON.parse(stored))
      } catch {
        setAds(getDefaultAds())
      }
    } else {
      setAds(getDefaultAds())
    }
  }

  function getDefaultAds(): RestaurantAd[] {
    return [
      { id: '1', restaurant_name: 'The Driving Diner', menu_link: 'https://example.com/menu1', address: '123 Main St, Downtown', offer: '20% OFF for New Drivers', content: 'Perfect place to relax after your driving lessons.', is_active: true },
      { id: '2', restaurant_name: 'Roadside Cafe', menu_link: 'https://example.com/menu2', address: '456 Highway Ave, North Side', offer: 'Free Coffee with Any Meal', content: 'Cozy cafe with great views.', is_active: true },
      { id: '3', restaurant_name: 'Pizza Palace', menu_link: 'https://example.com/menu3', address: '789 Oak Road, Central', offer: 'Buy 1 Get 1 Free Pizza', content: 'Fresh, delicious pizza made daily.', is_active: true },
      { id: '4', restaurant_name: 'Burger Blast', menu_link: 'https://example.com/menu4', address: '321 Elm Street, Westside', offer: '15% Discount on Total Bill', content: 'Authentic burgers and shakes.', is_active: true },
      { id: '5', restaurant_name: 'Sushi Express', menu_link: 'https://example.com/menu5', address: '654 Pine Lane, Midtown', offer: 'Free Appetizer with Purchase', content: 'Fresh sushi and Japanese cuisine.', is_active: true },
      { id: '6', restaurant_name: 'Taco Paradise', menu_link: 'https://example.com/menu6', address: '987 Cedar Court, South Bay', offer: 'Happy Hour 4-6 PM Daily', content: 'Authentic Mexican flavors.', is_active: true },
      { id: '7', restaurant_name: 'Steak House Prime', menu_link: 'https://example.com/menu7', address: '111 Maple Road, Premium District', offer: 'Complimentary Dessert', content: 'Fine dining experience.', is_active: true },
      { id: '8', restaurant_name: 'Pasta Perfetto', menu_link: 'https://example.com/menu8', address: '222 Birch Avenue, Italian Quarter', offer: 'Family Bundle Deal - Save 25%', content: 'Homemade Italian pasta.', is_active: true },
      { id: '9', restaurant_name: 'Organic Greens', menu_link: 'https://example.com/menu9', address: '333 Spruce Street, Health District', offer: '10% Off First Order', content: 'Farm-to-table organic cuisine.', is_active: true },
    ]
  }

  // Don't show ads on CMS page
  if (location.pathname === '/cms') {
    return null
  }

  // Determine which ads to show based on current page
  let adsToShow: RestaurantAd[] = []

  if (location.pathname === '/') {
    adsToShow = ads.slice(0, 3).filter(a => a.is_active)
  } else if (location.pathname === '/about') {
    adsToShow = ads.slice(3, 6).filter(a => a.is_active)
  } else if (location.pathname === '/contact') {
    adsToShow = ads.slice(6, 9).filter(a => a.is_active)
  } else {
    return null
  }

  if (adsToShow.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-rt">
        <h2 className="text-2xl font-bold mb-8">🍽️ Featured Partners</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adsToShow.map(ad => (
            <div key={ad.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">🍽️ {ad.restaurant_name}</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  {ad.offer}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{ad.content}</p>

              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <span>📍 {ad.address}</span>
              </div>

              <div className="flex gap-2">
                <a
                  href={ad.menu_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded text-center font-bold hover:bg-blue-200 transition text-sm"
                >
                  View Menu
                </a>
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded font-bold hover:bg-blue-700 transition text-sm">
                  Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
