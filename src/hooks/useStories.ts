// src/hooks/useStories.ts
import { useEffect, useState } from 'react'
import { loadStories, subscribeToStories, Story } from '../stories'

export type StoryWithDates = Story & {
  created_at: string
  image_url?: string
}

export function useStories() {
  const [stories, setStories] = useState<StoryWithDates[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = async () => {
    try {
      setLoading(true)
      const data = await loadStories()
      const converted: StoryWithDates[] = data.map(s => ({
        ...s,
        created_at: s.createdAt,
        image_url: s.imageDataUrl,
      }))
      setStories(converted)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories')
      console.error('Error reloading stories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStories((updatedStories) => {
      const converted: StoryWithDates[] = updatedStories.map(s => ({
        ...s,
        created_at: s.createdAt,
        image_url: s.imageDataUrl,
      }))
      setStories(converted)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { stories, loading, error, reload }
}

export type Submission = {
  id: string
  name: string
  email: string
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const approveSubmission = async (id: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'approved' as const } : s))
    )
  }

  const rejectSubmission = async (id: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'rejected' as const } : s))
    )
  }

  const reload = async () => {
    setLoading(true)
    // In a real app, this would fetch from Supabase
    setTimeout(() => setLoading(false), 500)
  }

  useEffect(() => {
    reload()
  }, [])

  return { submissions, loading, approveSubmission, rejectSubmission, reload }
}
