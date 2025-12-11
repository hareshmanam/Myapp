import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStories } from '../hooks/useStories'
import { useAuth } from '../auth'

export default function Stories() {
  const { stories, loading } = useStories()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCat, setActiveCat] = useState('All')

  const categories = ['All', 'Inspirational Stories', 'Road Test Tips', 'Parking & Maneuvers', 'Lesson Plans', 'Checklists']

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setActiveCat(decodeURIComponent(category))
    }
  }, [searchParams])

  const categoryFiltered = activeCat === 'All'
    ? stories
    : stories.filter(s => s.category === activeCat)

  const searchFiltered = categoryFiltered.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container-rt py-12 text-center">
        <div className="animate-pulse text-gray-600">Loading stories...</div>
      </div>
    )
  }

  return (
    <main className="container-rt py-8">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="text-brand-600 hover:text-brand-700 mb-4 flex items-center gap-2">
          ← Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-2">All Stories</h1>
        <p className="text-gray-600">Total: {stories.length} stories</p>
      </div>

      {/* Search Section */}
      <section className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🔍 Search Stories</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, keyword, or content..."
          className="input w-full"
        />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {searchFiltered.length} story/stories matching your search
          </p>
        )}
      </section>

      {/* Category Filter */}
      <section className="card p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">📂 Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCat(cat)
                setSearchQuery('')
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCat === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Stories Grid */}
      {searchFiltered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchFiltered.map(story => (
            <div key={story.id} className="card p-5 hover:shadow-lg transition-shadow">
              {story.image_url && (
                <img src={story.image_url} alt={story.title} className="w-full h-48 object-cover rounded-lg mb-3" />
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>👁️ {story.views} views</span>
                <span>•</span>
                <span>📅 {new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.excerpt}</p>
              {story.category && (
                <span className="inline-block px-2 py-1 bg-brand-100 text-brand-700 text-xs rounded-full mb-3">
                  {story.category}
                </span>
              )}
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login')
                  } else {
                    navigate(`/story/${story.id}`)
                  }
                }}
                className="btn w-full"
              >
                {user ? 'Read Story' : 'Login to Read'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            {searchQuery 
              ? `No stories found matching "${searchQuery}"`
              : `No stories in ${activeCat} category`
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveCat('All')
            }}
            className="btn-ghost"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  )
}