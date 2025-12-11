import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth'

export default function Contact() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'contact' | 'story'>('story')
  
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState('')

  const [story, setStory] = useState({
    title: '',
    content: '',
    category: 'Inspirational Stories',
    author_name: user?.name || '',
    author_email: user?.email || '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [storySent, setStorySent] = useState(false)
  const [storyError, setStoryError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.name || !contact.email || !contact.message) {
      setContactError('Please fill all required fields')
      return
    }
    setContactSent(true)
    setContactError('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setStoryError('Image must be less than 5MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const submitStory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!story.title || !story.content) {
      setStoryError('Please fill in title and content')
      return
    }

    

    setSubmitting(true)
    setStoryError('')

    try {
      let imageUrl = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `story-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('stories')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('stories')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const { error } = await supabase.from('submissions').insert([{
        title: story.title,
        excerpt: story.content.slice(0, 150) + '...',
        content: story.content,
        category: story.category,
        image_url: imageUrl,
        video_url: videoUrl || null,
        author_name: story.author_name || 'Anonymous',
        author_email: story.author_email,
        status: 'pending',
        user_id: user?.id || null,
      }])

      if (error) throw error

      setStorySent(true)
      setStory({
        title: '',
        content: '',
        category: 'Inspirational Stories',
        author_name: user?.name || '',
        author_email: user?.email || '',
      })
      setImageFile(null)
      setImagePreview('')
      setVideoUrl('')
    } catch (error: any) {
      console.error('Error submitting story:', error)
      setStoryError(error.message || 'Failed to submit story')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container-rt py-12 space-y-10">
      <section className="card p-8 md:p-10 bg-gradient-to-br from-brand-50 to-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          We'd love to hear from you
        </h1>
        <p className="text-gray-700 mb-6">
          Contact us or share your driving journey to inspire others
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setTab('story')}
            className={tab === 'story' ? 'btn' : 'btn-ghost'}
          >
            📝 Share Your Story
          </button>
          <button
            onClick={() => setTab('contact')}
            className={tab === 'contact' ? 'btn' : 'btn-ghost'}
          >
            💬 Contact Us
          </button>
        </div>
      </section>

      {tab === 'story' && (
        <form onSubmit={submitStory} className="card p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Share Your Success Story</h2>
            <p className="text-sm text-gray-600">
              Your story will be reviewed by our admin team before publishing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Your Name</label>
              <input
                className="input"
                value={story.author_name}
                onChange={e => setStory({ ...story, author_name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                className="input"
                value={story.author_email}
                onChange={e => setStory({ ...story, author_email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Story Title *</label>
            <input
              className="input"
              value={story.title}
              onChange={e => setStory({ ...story, title: e.target.value })}
              placeholder="E.g., How I passed my road test on first try"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <select
              className="input"
              value={story.category}
              onChange={e => setStory({ ...story, category: e.target.value })}
            >
              <option>Inspirational Stories</option>
              <option>Road Test Tips</option>
              <option>Parking & Maneuvers</option>
              <option>Lesson Plans</option>
              <option>Checklists</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Your Story *</label>
            <textarea
              className="textarea"
              rows={8}
              value={story.content}
              onChange={e => setStory({ ...story, content: e.target.value })}
              placeholder="Share your journey, tips, and what helped you succeed..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Upload Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Video URL (optional)</label>
              <input
                type="url"
                className="input"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {storyError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {storyError}
            </div>
          )}

          {storySent ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✅ Thank you! Your story has been submitted and is awaiting admin approval.
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : '📤 Submit Story'}
            </button>
          )}

          
        </form>
      )}

      {tab === 'contact' && (
        <form onSubmit={submitContact} className="card p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Send us a message</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Name *</label>
              <input
                className="input"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email *</label>
              <input
                type="email"
                className="input"
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Subject</label>
            <input
              className="input"
              value={contact.subject}
              onChange={e => setContact({ ...contact, subject: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Message *</label>
            <textarea
              className="textarea"
              rows={6}
              value={contact.message}
              onChange={e => setContact({ ...contact, message: e.target.value })}
              required
            />
          </div>

          {contactError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {contactError}
            </div>
          )}

          {contactSent ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✅ Message sent! We'll get back to you soon.
            </div>
          ) : (
            <button type="submit" className="btn">Send Message</button>
          )}
        </form>
      )}
    </main>
  )
}