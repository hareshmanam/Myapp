import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import type { Story } from '../stories'

export default function StoryDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [allStories, setAllStories] = useState<Story[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rtc_stories_v4')
      if (stored) {
        const stories = JSON.parse(stored)
        setAllStories(stories)
        
        const found = stories.find((s: Story) => s.id === id)
        if (found) {
          setStory(found)
          
          const updated = stories.map((s: Story) =>
            s.id === id ? { ...s, views: (s.views || 0) + 1 } : s
          )
          localStorage.setItem('rtc_stories_v4', JSON.stringify(updated))
          
          const count = parseInt(localStorage.getItem('read_count') || '0')
          localStorage.setItem('read_count', String(count + 1))
        } else {
          console.error('Story not found:', id)
          setStory(null)
        }
      }
    } catch (e) {
      console.error('Error loading story:', e)
    } finally {
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="container-rt py-12 text-center">
        <p className="text-gray-600">Loading story...</p>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="container-rt py-12 text-center">
        <p className="text-gray-600 mb-4">Story not found</p>
        <button onClick={() => nav('/')} className="btn">
          ← Back to Home
        </button>
      </div>
    )
  }

  const getDate = (dateStr: string) => {
    try {
      if (!dateStr) return 'Recently'
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'Recently'
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return 'Recently'
    }
  }

  const relatedStories = allStories
    .filter((s: Story) => s.id !== id)
    .slice(0, 2)

  return (
    <main className="container-rt py-8">
      <button onClick={() => nav(-1)} className="text-brand-600 hover:text-brand-700 mb-6 flex items-center gap-2">
        ← Back
      </button>

      <article className="card p-8 md:p-10 max-w-3xl mx-auto">
        <div className="mb-6">
          {story.category && (
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full mb-3">
              {story.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span>📅 {getDate(story.createdAt)}</span>
            <span>👁️ {story.views || 0} views</span>
          </div>
        </div>

        {story.image_url && (
          <img
            src={story.image_url}
            alt={story.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
          <p className="whitespace-pre-wrap">{story.content}</p>
        </div>

        {story.video_url && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">📹 Video</h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={story.video_url.includes('watch?v=') 
                  ? story.video_url.replace('watch?v=', 'embed/')
                  : story.video_url
                }
                title={story.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {story.link_url && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-3">🔗 Useful Link</h3>
            <a
              href={story.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-block"
            >
              Visit Resource →
            </a>
          </div>
        )}

        {relatedStories.length > 0 && (
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">More Stories</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedStories.map((s: Story) => (
                <button
                  key={s.id}
                  onClick={() => nav(`/story/${s.id}`)}
                  className="card p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <h4 className="font-semibold mb-2">{s.title}</h4>
                  <p className="text-sm text-gray-600">{s.excerpt}</p>
                  <div className="text-xs text-gray-500 mt-3">👁️ {s.views || 0} views</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}