import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Ad = {
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
  const [ads, setAds] = useState<Ad[]>([])

  // All hooks MUST be called at the top level
  useEffect(() => {
    loadAds()
  }, [])

  // Now check AFTER hooks
  if (location.pathname === '/cms') {
    return null
  }

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

  function getDefaultAds(): Ad[] {
    return [
      // Page 1 (Home) - Ads 1-3
      {
        id: '1',
        restaurant_name: 'The Driving Diner',
        menu_link: 'https://example.com/menu1',
        address: '123 Main St, Downtown',
        offer: '20% OFF for New Drivers',
        content: 'Perfect place to relax after your driving lessons. Join us for a quick bite!',
        is_active: true,
      },
      {
        id: '2',
        restaurant_name: 'Roadside Cafe',
        menu_link: 'https://example.com/menu2',
        address: '456 Highway Ave, North Side',
        offer: 'Free Coffee with Any Meal',
        content: 'Cozy cafe with great views. Popular with driving test takers!',
        is_active: true,
      },
      {
        id: '3',
        restaurant_name: 'Pizza Palace',
        menu_link: 'https://example.com/menu3',
        address: '789 Oak Road, Central',
        offer: 'Buy 1 Get 1 Free Pizza',
        content: 'Fresh, delicious pizza made daily. Come celebrate your driving success!',
        is_active: true,
      },
      // Page 2 (About) - Ads 4-6
      {
        id: '4',
        restaurant_name: 'Burger Blast',
        menu_link: 'https://example.com/menu4',
        address: '321 Elm Street, Westside',
        offer: '15% Discount on Total Bill',
        content: 'Authentic burgers and shakes. Best comfort food in town!',
        is_active: true,
      },
      {
        id: '5',
        restaurant_name: 'Sushi Express',
        menu_link: 'https://example.com/menu5',
        address: '654 Pine Lane, Midtown',
        offer: 'Free Appetizer with Purchase',
        content: 'Fresh sushi and Japanese cuisine. Perfect for a special celebration!',
        is_active: true,
      },
      {
        id: '6',
        restaurant_name: 'Taco Paradise',
        menu_link: 'https://example.com/menu6',
        address: '987 Cedar Court, South Bay',
        offer: 'Happy Hour 4-6 PM Daily',
        content: 'Authentic Mexican flavors and great atmosphere. Fiesta time!',
        is_active: true,
      },
      // Page 3 (Contact) - Ads 7-9
      {
        id: '7',
        restaurant_name: 'Steak House Prime',
        menu_link: 'https://example.com/menu7',
        address: '111 Maple Road, Premium District',
        offer: 'Complimentary Dessert',
        content: 'Fine dining experience with premium steaks and wine selection.',
        is_active: true,
      },
      {
        id: '8',
        restaurant_name: 'Pasta Perfetto',
        menu_link: 'https://example.com/menu8',
        address: '222 Birch Avenue, Italian Quarter',
        offer: 'Family Bundle Deal - Save 25%',
        content: 'Homemade Italian pasta and sauces. Taste authenticity!',
        is_active: true,
      },
      {
        id: '9',
        restaurant_name: 'Organic Greens',
        menu_link: 'https://example.com/menu9',
        address: '333 Spruce Street, Health District',
        offer: '10% Off First Order',
        content: 'Farm-to-table organic cuisine. Healthy and delicious!',
        is_active: true,
      },
    ]
  }

  // Determine which ads to show based on page
  function getPageAds(): Ad[] {
    const activeAds = ads.filter(ad => ad.is_active)
    
    if (location.pathname === '/') {
      // Home page: Ads 1-3
      return activeAds.slice(0, 3)
    } else if (location.pathname === '/about') {
      // About page: Ads 4-6
      return activeAds.slice(3, 6)
    } else if (location.pathname === '/contact') {
      // Contact page: Ads 7-9
      return activeAds.slice(6, 9)
    }
    return []
  }

  const pageAds = getPageAds()

  if (pageAds.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container-rt">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Featured Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
            >
              {/* Restaurant Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🍽️ {ad.restaurant_name}
              </h3>

              {/* Offer Badge */}
              <div className="bg-green-50 border border-green-200 px-3 py-1 rounded-full inline-block mb-4">
                <p className="text-sm font-semibold text-green-700">
                  {ad.offer}
                </p>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {ad.content}
              </p>

              {/* Address */}
              <div className="flex items-start gap-2 mb-4">
                <span className="text-lg">📍</span>
                <p className="text-sm text-gray-700">{ad.address}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <a
                  href={ad.menu_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded font-semibold hover:bg-blue-700 transition text-sm text-center"
                >
                  View Menu
                </a>
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded font-semibold hover:bg-gray-300 transition text-sm">
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
