import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStories } from '../hooks/useStories'
import { useAuth } from '../auth'

const FREE_STORY_LIMIT = 4

export default function Home() {
  const { stories, loading } = useStories()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [readCount, setReadCount] = useState(0)

  useEffect(() => {
    const count = parseInt(localStorage.getItem('read_count') || '0')
    setReadCount(count)
  }, [])

  const categories = ['Inspirational Stories', 'Road Test Tips', 'Parking & Maneuvers']

  const getStoriesByCategory = (category: string) => {
    return stories.filter(s => s.category === category).slice(0, 6)
  }

  if (loading) {
    return (
      <div className="container-rt py-12 text-center">
        <div className="animate-pulse text-gray-600">Loading stories...</div>
      </div>
    )
  }

  return (
    <main className="container-rt py-8 space-y-12">
      <section className="card p-8 md:p-10 bg-gradient-to-br from-brand-50 to-white">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-brand-700 bg-clip-text text-transparent">
            Welcome to On My Way to......
          </span>
        </h1>
        <p className="mt-3 text-gray-700 text-lg">
          Stories, tips, and real journeys to help you pass with confidence
        </p>
      </section>

      {!user && (
        <div className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-amber-900">🔒 Want to read more stories?</h3>
              <p className="text-amber-800 text-sm mt-1">
                Sign up to access all {stories.length} stories and unlock exclusive coupons!
              </p>
            </div>
            <button onClick={() => navigate('/login')} className="btn">Sign Up / Login</button>
          </div>
        </div>
      )}

      {user && (
        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="text-lg font-semibold mb-2">📖 Reading Progress</h3>
          <p className="text-sm text-gray-700 mb-3">
            Read 20 stories to unlock 15% OFF coupon at Local Eats!
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(100, (readCount / 20) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{readCount}/20 stories read</p>
          {readCount >= 20 && (
            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="font-semibold text-green-900">
                🎉 Coupon Code: <span className="text-xl">UNLOCK15</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stories by Category */}
      {categories.map(category => {
        const categoryStories = getStoriesByCategory(category)
        return categoryStories.length > 0 ? (
          <section key={category}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-1 w-16 rounded bg-brand-600"></span>
              <h2 className="text-2xl font-semibold">{category}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryStories.map(story => (
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
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/stories?category=' + encodeURIComponent(category))}
                className="btn-ghost text-lg"
              >
                Read More Stories →
              </button>
            </div>
          </section>
        ) : null
      })}

      {/* View All Stories Button */}
      <div className="text-center py-6">
        <button
          onClick={() => navigate('/stories')}
          className="btn px-8 py-3 text-lg"
        >
          📚 View All Stories
        </button>
      </div>
    </main>
  )
}