import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import type { Story } from '../stories'

type Ad = {
  id: string
  title: string
  description: string
  link_url: string
  button_text: string
  is_active: boolean
}

export default function CMS() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [tab, setTab] = useState<'stories' | 'create-story' | 'ads'>('stories')
  const [stories, setStories] = useState<Story[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Story form state
  const [newStory, setNewStory] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Inspirational Stories',
    link_url: '',
    video_url: '',
  })

  // Ad form state
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    link_url: '',
    button_text: 'Learn More',
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      nav('/login', { state: { next: '/cms' } })
      return
    }
    loadStories()
    loadAds()
  }, [user, nav])

  // Load stories from localStorage
  const loadStories = () => {
    try {
      const stored = localStorage.getItem('rtc_stories_v4')
      if (stored) {
        setStories(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error loading stories:', e)
    }
  }

  // Load ads from localStorage
  const loadAds = () => {
    try {
      const stored = localStorage.getItem('rtc_ads')
      if (stored) {
        setAds(JSON.parse(stored))
      } else {
        const defaultAds: Ad[] = [
          { id: '1', title: '', description: '', link_url: '', button_text: 'Learn More', is_active: false },
          { id: '2', title: '', description: '', link_url: '', button_text: 'Learn More', is_active: false },
          { id: '3', title: '', description: '', link_url: '', button_text: 'Learn More', is_active: false },
        ]
        setAds(defaultAds)
      }
    } catch (e) {
      console.error('Error loading ads:', e)
    }
  }

  // Create new story
  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStory.title || !newStory.content) {
      setMessage('Please fill in title and content')
      return
    }

    try {
      setLoading(true)
      const story: Story = {
        id: 'story-' + Date.now(),
        title: newStory.title,
        excerpt: newStory.excerpt || newStory.content.slice(0, 120) + '...',
        content: newStory.content,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        category: newStory.category,
        link_url: newStory.link_url || undefined,
        video_url: newStory.video_url || undefined,
      }

      const updatedStories = [story, ...stories]
      localStorage.setItem('rtc_stories_v4', JSON.stringify(updatedStories))
      setStories(updatedStories)

      setMessage('✓ Story created successfully!')
      setNewStory({ title: '', excerpt: '', content: '', category: 'Inspirational Stories', link_url: '', video_url: '' })
      setTab('stories')

      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete story
  const handleDeleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      const updated = stories.filter(s => s.id !== id)
      localStorage.setItem('rtc_stories_v4', JSON.stringify(updated))
      setStories(updated)
      setMessage('✓ Story deleted!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Save ad
  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAd) return

    if (!adForm.title) {
      setMessage('Please enter an ad title')
      return
    }

    const updatedAds = ads.map(a =>
      a.id === editingAd.id
        ? {
            ...a,
            title: adForm.title,
            description: adForm.description,
            link_url: adForm.link_url,
            button_text: adForm.button_text,
            is_active: true,
          }
        : a
    )

    localStorage.setItem('rtc_ads', JSON.stringify(updatedAds))
    setAds(updatedAds)
    setEditingAd(null)
    setAdForm({ title: '', description: '', link_url: '', button_text: 'Learn More' })
    setMessage('✓ Ad updated!')
    setTimeout(() => setMessage(''), 3000)
  }

  // Toggle ad active/inactive
  const toggleAd = (id: string) => {
    const updatedAds = ads.map(a =>
      a.id === id ? { ...a, is_active: !a.is_active } : a
    )
    localStorage.setItem('rtc_ads', JSON.stringify(updatedAds))
    setAds(updatedAds)
  }

  // Clear ad
  const handleClearAd = (id: string) => {
    if (window.confirm('Clear this ad?')) {
      const updatedAds = ads.map(a =>
        a.id === id
          ? { id: a.id, title: '', description: '', link_url: '', button_text: 'Learn More', is_active: false }
          : a
      )
      localStorage.setItem('rtc_ads', JSON.stringify(updatedAds))
      setAds(updatedAds)
      setMessage('✓ Ad cleared!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <main className="container-rt py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin CMS Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}! Manage your content here.</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setTab('stories')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'stories'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Stories ({stories.length})
          </button>
          <button
            onClick={() => setTab('create-story')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'create-story'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ✍️ Create Story
          </button>
          <button
            onClick={() => setTab('ads')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'ads'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📢 Manage Ads
          </button>
        </div>

        {/* Stories Tab */}
        {tab === 'stories' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">All Stories</h2>
            {stories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No stories yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stories.map(story => (
                  <div key={story.id} className="card p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{story.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <span>👁️ {story.views} views</span>
                          {story.category && <span>📁 {story.category}</span>}
                          {story.link_url && <span>🔗 Has Link</span>}
                          {story.video_url && <span>📹 Has Video</span>}
                          <span>📅 {new Date(story.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="btn-ghost px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Story Tab */}
        {tab === 'create-story' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Create New Story</h2>
            <form onSubmit={handleCreateStory} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  placeholder="e.g., How I Passed My Road Test"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                  className="input"
                >
                  <option>Inspirational Stories</option>
                  <option>Road Test Tips</option>
                  <option>Parking & Maneuvers</option>
                  <option>Lesson Plans</option>
                  <option>Checklists</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt (Short Summary)
                </label>
                <input
                  type="text"
                  value={newStory.excerpt}
                  onChange={(e) => setNewStory({ ...newStory, excerpt: e.target.value })}
                  placeholder="Brief summary of the story..."
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Story Content *
                </label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                  placeholder="Write your full story here..."
                  className="textarea"
                  rows={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={newStory.video_url}
                  onChange={(e) => setNewStory({ ...newStory, video_url: e.target.value })}
                  placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">Paste full YouTube video URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Useful Link URL (Optional)
                </label>
                <input
                  type="url"
                  value={newStory.link_url}
                  onChange={(e) => setNewStory({ ...newStory, link_url: e.target.value })}
                  placeholder="e.g., https://example.com"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">Link to related resource or website</p>
              </div>

              <button type="submit" disabled={loading} className="btn">
                {loading ? 'Publishing...' : '✓ Publish Story'}
              </button>
            </form>
          </div>
        )}

        {/* Ads Tab */}
        {tab === 'ads' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Manage Advertisements (3 Slots)</h2>

            {editingAd && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-4">Editing Ad #{editingAd.id}</h3>
                <form onSubmit={handleSaveAd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Title
                    </label>
                    <input
                      type="text"
                      value={adForm.title}
                      onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                      placeholder="e.g., Learn to Drive Safe"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={adForm.description}
                      onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                      placeholder="Ad description..."
                      className="textarea"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Link URL
                    </label>
                    <input
                      type="url"
                      value={adForm.link_url}
                      onChange={(e) => setAdForm({ ...adForm, link_url: e.target.value })}
                      placeholder="https://example.com"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={adForm.button_text}
                      onChange={(e) => setAdForm({ ...adForm, button_text: e.target.value })}
                      placeholder="Learn More"
                      className="input"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="btn">
                      ✓ Save Ad
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAd(null)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {ads.map(ad => (
                <div key={ad.id} className="card p-4 border-2 border-gray-200">
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-500">Ad Slot #{ad.id}</p>
                  </div>

                  {ad.title ? (
                    <>
                      <h3 className="font-semibold mb-2">{ad.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          ad.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ad.is_active ? '✓ Active' : 'Paused'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => toggleAd(ad.id)}
                          className="btn-ghost w-full text-sm py-2"
                        >
                          {ad.is_active ? '⏸️ Pause' : '▶️ Activate'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAd(ad)
                            setAdForm({
                              title: ad.title,
                              description: ad.description,
                              link_url: ad.link_url,
                              button_text: ad.button_text,
                            })
                          }}
                          className="btn-ghost w-full text-sm py-2"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleClearAd(ad.id)}
                          className="btn-ghost w-full text-sm py-2 text-red-600 hover:bg-red-50"
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 text-center mb-4">Empty ad slot</p>
                      <button
                        onClick={() => {
                          setEditingAd(ad)
                          setAdForm({ title: '', description: '', link_url: '', button_text: 'Learn More' })
                        }}
                        className="btn w-full text-sm py-2 justify-center"
                      >
                        ➕ Add Ad
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-gray-600 text-sm">Total Stories</p>
          <p className="text-3xl font-bold text-brand-600">{stories.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 text-sm">Total Views</p>
          <p className="text-3xl font-bold text-brand-600">
            {stories.reduce((sum, s) => sum + s.views, 0)}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 text-sm">Stories with Videos</p>
          <p className="text-3xl font-bold text-brand-600">
            {stories.filter(s => s.video_url).length}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 text-sm">Active Ads</p>
          <p className="text-3xl font-bold text-brand-600">{ads.filter(a => a.is_active).length}/3</p>
        </div>
      </div>
    </main>
  )
}
