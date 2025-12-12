import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

type Story = {
  id: string
  title: string
  excerpt: string
  views: number
  category: string
  image_url?: string
  createdAt?: string
  isFree?: boolean
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [storiesByCategory, setStoriesByCategory] = useState<Record<string, Story[]>>({})
  const [mostRecent, setMostRecent] = useState<Story[]>([])
  const [mostPopular, setMostPopular] = useState<Story[]>([])
  const [visibleStories, setVisibleStories] = useState<Story[]>([])
  const { user } = useAuth()

  const freeStoriesLimit = 4

  useEffect(() => {
    loadStories()
  }, [])

  function loadStories() {
    try {
      const stored = localStorage.getItem('rtc_stories_v4')
      if (stored) {
        const data = JSON.parse(stored)
        processStories(data)
      } else {
        processStories(getDefaultStories())
      }
    } catch {
      processStories(getDefaultStories())
    }
  }

  function processStories(allStories: Story[]) {
    setStories(allStories)

    // Mark first 4 as free
    const storiesWithFreeAccess = allStories.map((story, index) => ({
      ...story,
      isFree: index < freeStoriesLimit,
    }))

    // Group by category
    const grouped = storiesWithFreeAccess.reduce((acc: Record<string, Story[]>, story) => {
      const cat = story.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(story)
      return acc
    }, {})
    setStoriesByCategory(grouped)

    // Most recent (by createdAt)
    const recent = [...storiesWithFreeAccess].sort(
      (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    )
    setMostRecent(recent)

    // Most popular (by views)
    const popular = [...storiesWithFreeAccess].sort((a, b) => b.views - a.views)
    setMostPopular(popular)

    // First 4 stories visible (or based on user access)
    setVisibleStories(storiesWithFreeAccess.slice(0, freeStoriesLimit))
  }

  function getDefaultStories(): Story[] {
    return [
      {
        id: '1',
        title: 'My First Road Test Experience',
        excerpt: 'Learn from my journey taking the road test for the first time',
        views: 245,
        category: 'Inspirational Stories',
        image_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Parallel Parking Tips & Tricks',
        excerpt: 'Master parallel parking with these proven techniques',
        views: 389,
        category: 'Parking & Maneuvers',
        image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Highway Driving for Beginners',
        excerpt: 'Everything you need to know about highway safety',
        views: 167,
        category: 'Road Test Tips',
        image_url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=500',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        title: 'Overcoming Road Test Anxiety',
        excerpt: 'Mental techniques to pass your test with confidence',
        views: 403,
        category: 'Inspirational Stories',
        image_url: 'https://images.unsplash.com/photo-1488644531892-75574b3fc6f1?w=500',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        title: '3-Point Turn Mastery',
        excerpt: 'Perfect your three-point turn in 5 minutes',
        views: 156,
        category: 'Parking & Maneuvers',
        image_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        title: 'Night Driving Safety Guide',
        excerpt: 'Stay safe when driving in low light conditions',
        views: 234,
        category: 'Road Test Tips',
        image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  const canReadMore = user !== null

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 mb-8">
        <div className="container-rt">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Welcome to On My Way to...
          </h1>
          <p className="text-lg text-gray-700">
            Stories, tips, and real journeys to help you pass with confidence
          </p>
        </div>
      </section>

      {/* CTA Box for Login */}
      {!canReadMore && (
        <section className="container-rt mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🔒 Want to read more stories?</h3>
            <p className="text-yellow-700 mb-4">
              Sign up to access all stories and unlock exclusive coupons!
            </p>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
              Sign Up / Login
            </Link>
          </div>
        </section>
      )}

      {/* Stories Grid - Visible Stories */}
      <section className="container-rt mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Stories</h2>
          <Link to="/stories" className="text-blue-600 hover:text-blue-700 font-bold">
            📚 View All Stories
          </Link>
        </div>

        {visibleStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleStories.map((story) => (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {story.image_url && (
                  <img
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {story.category}
                    </span>
                    {!story.isFree && !canReadMore && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        🔒 Unlock
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {story.excerpt}
                  </p>
                  <div className="text-xs text-gray-500">
                    👁 {story.views} views
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No stories available</p>
        )}
      </section>

      {/* Most Recent Section */}
      <section className="container-rt mb-12">
        <h2 className="text-2xl font-bold mb-6">Most Recent</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mostRecent.slice(0, 3).map((story) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {story.category}
              </span>
              <h3 className="font-bold text-lg mt-2 mb-2">{story.title}</h3>
              <p className="text-gray-600 text-sm">{story.excerpt}</p>
              <div className="text-xs text-gray-500 mt-3">
                👁 {story.views} views
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Most Popular Section */}
      <section className="container-rt mb-12">
        <h2 className="text-2xl font-bold mb-6">Most Popular</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mostPopular.slice(0, 3).map((story) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {story.category}
              </span>
              <h3 className="font-bold text-lg mt-2 mb-2">{story.title}</h3>
              <p className="text-gray-600 text-sm">{story.excerpt}</p>
              <div className="text-xs text-gray-500 mt-3">
                👁 {story.views} views
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-rt mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(storiesByCategory).map(([category, catStories]) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3">{category}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {catStories.length} stories
              </p>
              <Link
                to="/stories"
                className="text-blue-600 hover:text-blue-700 font-bold text-sm"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      {!canReadMore && (
        <section className="bg-blue-600 text-white py-12 mb-8">
          <div className="container-rt text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to unlock more stories?</h2>
            <p className="text-lg text-blue-100 mb-6">
              Sign up today and get access to all stories and exclusive coupons!
            </p>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 inline-block"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
