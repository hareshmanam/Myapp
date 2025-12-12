import { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'

type Story = {
  id?: string
  title: string
  excerpt: string
  content: string
  video_url: string
  image_url: string
  views: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  author_name: string
  author_email: string
  createdAt?: string
}

type RestaurantAd = {
  id: string
  restaurant_name: string
  menu_link: string
  address: string
  offer: string
  content: string
  is_active: boolean
}

export default function CMS() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'stories' | 'ads'>('stories')
  const [stories, setStories] = useState<Story[]>([])
  const [ads, setAds] = useState<RestaurantAd[]>([])
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [editingAd, setEditingAd] = useState<RestaurantAd | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    } else {
      loadData()
    }
  }, [user, navigate])

  function loadData() {
    setLoading(true)
    
    // Load stories
    const storedStories = localStorage.getItem('rtc_stories_v4')
    if (storedStories) {
      try {
        setStories(JSON.parse(storedStories))
      } catch {
        setStories([])
      }
    }

    // Load ads
    const storedAds = localStorage.getItem('rtc_ads_full')
    if (storedAds) {
      try {
        setAds(JSON.parse(storedAds))
      } catch {
        setAds(getDefaultAds())
      }
    } else {
      setAds(getDefaultAds())
    }
    
    setLoading(false)
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

  const saveStory = (story: Story) => {
    const newStories = story.id
      ? stories.map(s => s.id === story.id ? story : s)
      : [...stories, { ...story, id: Date.now().toString(), createdAt: new Date().toISOString() }]
    
    setStories(newStories)
    localStorage.setItem('rtc_stories_v4', JSON.stringify(newStories))
    setEditingStory(null)
    alert('✅ Story saved!')
  }

  const deleteStory = (id?: string) => {
    if (!id) return
    if (window.confirm('Delete this story?')) {
      const newStories = stories.filter(s => s.id !== id)
      setStories(newStories)
      localStorage.setItem('rtc_stories_v4', JSON.stringify(newStories))
      alert('✅ Story deleted!')
    }
  }

  const saveAd = (ad: RestaurantAd) => {
    const newAds = ads.map(a => a.id === ad.id ? ad : a)
    setAds(newAds)
    localStorage.setItem('rtc_ads_full', JSON.stringify(newAds))
    setEditingAd(null)
    alert('✅ Ad saved!')
  }

  const saveAllAds = () => {
    localStorage.setItem('rtc_ads_full', JSON.stringify(ads))
    alert('✅ All ads saved!')
  }

  const toggleAdActive = (id: string) => {
    setAds(ads.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a))
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin only</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading...</p></div>
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-rt">
        <h1 className="text-4xl font-bold mb-8">⚙️ CMS Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button onClick={() => setActiveTab('stories')} className={`px-6 py-3 font-bold ${activeTab === 'stories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            📚 Stories ({stories.length})
          </button>
          <button onClick={() => setActiveTab('ads')} className={`px-6 py-3 font-bold ${activeTab === 'ads' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            🍽️ Restaurant Ads ({ads.length})
          </button>
        </div>

        {/* STORIES TAB */}
        {activeTab === 'stories' && (
          <div>
            <button onClick={() => setEditingStory({ title: '', excerpt: '', content: '', video_url: '', image_url: '', views: 0, category: 'Inspirational Stories', status: 'approved', author_name: 'Admin', author_email: user?.email || '' })} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 mb-6">
              + Add Story
            </button>

            {editingStory && (
              <div className="bg-white p-6 rounded-lg shadow mb-6 border-2 border-blue-500">
                <h2 className="text-2xl font-bold mb-4">{editingStory.id ? 'Edit Story' : 'Add New Story'}</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Title" value={editingStory.title} onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                  <input type="text" placeholder="Excerpt" value={editingStory.excerpt} onChange={(e) => setEditingStory({ ...editingStory, excerpt: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                  <textarea placeholder="Content" value={editingStory.content} onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })} className="w-full border border-gray-300 p-2 rounded" rows={5} />
                  <input type="text" placeholder="Image URL" value={editingStory.image_url} onChange={(e) => setEditingStory({ ...editingStory, image_url: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                  <input type="text" placeholder="Video URL" value={editingStory.video_url} onChange={(e) => setEditingStory({ ...editingStory, video_url: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                  <select value={editingStory.category} onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })} className="w-full border border-gray-300 p-2 rounded">
                    <option>Inspirational Stories</option>
                    <option>Parking & Maneuvers</option>
                    <option>Road Test Tips</option>
                  </select>
                  <select value={editingStory.status} onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value as any })} className="w-full border border-gray-300 p-2 rounded">
                    <option value="pending">⏳ Pending Review</option>
                    <option value="approved">✅ Approved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => saveStory(editingStory)} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Save Story</button>
                    <button onClick={() => setEditingStory(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-500">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {stories.length === 0 ? (
                <div className="bg-gray-100 p-8 rounded text-center text-gray-600">No stories yet.</div>
              ) : (
                stories.map((story) => (
                  <div key={story.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{story.title}</h3>
                          {story.status === 'approved' && <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">✅ Approved</span>}
                          {story.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded">⏳ Pending</span>}
                        </div>
                        <p className="text-gray-600 text-sm">{story.excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingStory(story)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">Edit</button>
                        <button onClick={() => deleteStory(story.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ADS TAB */}
        {activeTab === 'ads' && (
          <div>
            <button onClick={saveAllAds} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 mb-6">💾 Save All Ads</button>

            <div className="space-y-6">
              {ads.map((ad, index) => (
                <div key={ad.id} className={`bg-white p-6 rounded-lg shadow border-2 ${[1,2,3].includes(parseInt(ad.id)) ? 'border-blue-300' : [4,5,6].includes(parseInt(ad.id)) ? 'border-purple-300' : 'border-orange-300'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Ad #{ad.id} - Page {[1,2,3].includes(parseInt(ad.id)) ? 'Home' : [4,5,6].includes(parseInt(ad.id)) ? 'About' : 'Contact'}</h3>
                      <p className="text-gray-500 text-sm">{ad.restaurant_name}</p>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={ad.is_active} onChange={() => toggleAdActive(ad.id)} className="w-4 h-4" />
                      <span className="text-sm font-bold">{ad.is_active ? '✅ Active' : '⭕ Inactive'}</span>
                    </label>
                  </div>

                  {editingAd?.id === ad.id ? (
                    <div className="space-y-4">
                      <input type="text" placeholder="Restaurant Name" value={editingAd.restaurant_name} onChange={(e) => setEditingAd({ ...editingAd, restaurant_name: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                      <input type="text" placeholder="Menu Link URL" value={editingAd.menu_link} onChange={(e) => setEditingAd({ ...editingAd, menu_link: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                      <input type="text" placeholder="Address" value={editingAd.address} onChange={(e) => setEditingAd({ ...editingAd, address: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                      <input type="text" placeholder="Special Offer" value={editingAd.offer} onChange={(e) => setEditingAd({ ...editingAd, offer: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
                      <textarea placeholder="Content/Description" value={editingAd.content} onChange={(e) => setEditingAd({ ...editingAd, content: e.target.value })} className="w-full border border-gray-300 p-2 rounded" rows={3} />
                      <div className="flex gap-2">
                        <button onClick={() => saveAd(editingAd)} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Save</button>
                        <button onClick={() => setEditingAd(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <p><span className="font-bold">Restaurant:</span> {ad.restaurant_name}</p>
                      <p><span className="font-bold">Offer:</span> {ad.offer}</p>
                      <p><span className="font-bold">Address:</span> {ad.address}</p>
                      <p><span className="font-bold">Content:</span> {ad.content}</p>
                      <button onClick={() => setEditingAd(ad)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 w-full">Edit Ad</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
