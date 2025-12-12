// src/stories.ts - Updated with Supabase real-time
import { supabase } from './lib/supabase'
import type { Story as SupabaseStory } from './lib/supabase'

export type Story = {
  id: string
  title: string
  excerpt: string
  content: string
  views: number
  likes: number
  createdAt: string
  imageDataUrl?: string
  videoUrl?: string
  category?: string
}

// Convert Supabase story to app story
function toAppStory(s: SupabaseStory): Story {
  return {
    id: s.id,
    title: s.title,
    excerpt: s.excerpt || s.content.slice(0, 120) + '...',
    content: s.content,
    views: s.views,
    likes: s.likes,
    createdAt: s.created_at,
    imageDataUrl: s.image_url || undefined,
    videoUrl: s.video_url || undefined,
    category: s.category || undefined,
  }
}

// Load stories from Supabase
export async function loadStories(): Promise<Story[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(toAppStory)
  } catch (error) {
    console.error('Error loading stories:', error)
    // Fallback to localStorage
    return loadStoriesLocal()
  }
}

// Save story to Supabase
export async function saveStory(story: Omit<Story, 'id' | 'views' | 'likes' | 'createdAt'>) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert([{
        title: story.title,
        excerpt: story.excerpt,
        content: story.content,
        category: story.category,
        image_url: story.imageDataUrl,
        video_url: story.videoUrl,
      }])
      .select()
      .single()

    if (error) throw error
    return toAppStory(data)
  } catch (error) {
    console.error('Error saving story:', error)
    return null
  }
}

// Get single story
export async function getStory(id: string): Promise<Story | null> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return toAppStory(data)
  } catch (error) {
    console.error('Error getting story:', error)
    return null
  }
}

// Increment views
export async function incrementView(id: string) {
  try {
    const { data: story } = await supabase
      .from('stories')
      .select('views')
      .eq('id', id)
      .single()

    if (story) {
      await supabase
        .from('stories')
        .update({ views: story.views + 1 })
        .eq('id', id)
    }

    // Update read tracking
    const readSet = getReadSet()
    if (!readSet.has(id)) {
      readSet.add(id)
      setReadSet(readSet)
      setReadCount(getReadCount() + 1)
    }
  } catch (error) {
    console.error('Error incrementing view:', error)
  }
}

// Toggle like
export async function toggleLike(id: string) {
  try {
    const likedIds = getLikedIds()
    const isLiked = likedIds.has(id)

    const { data: story } = await supabase
      .from('stories')
      .select('likes')
      .eq('id', id)
      .single()

    if (story) {
      const newLikes = isLiked
        ? Math.max(0, story.likes - 1)
        : story.likes + 1

      await supabase
        .from('stories')
        .update({ likes: newLikes })
        .eq('id', id)

      if (isLiked) {
        likedIds.delete(id)
      } else {
        likedIds.add(id)
      }
      setLikedIds(likedIds)
    }

    return await loadStories()
  } catch (error) {
    console.error('Error toggling like:', error)
    return []
  }
}

// Subscribe to real-time updates
export function subscribeToStories(callback: (stories: Story[]) => void) {
  const channel = supabase
    .channel('stories-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stories',
      },
      async () => {
        const stories = await loadStories()
        callback(stories)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Top stories by likes
export async function topByLikes(limit = 3): Promise<Story[]> {
  const stories = await loadStories()
  return stories.sort((a, b) => b.likes - a.likes).slice(0, limit)
}

// Most recent stories
export async function mostRecent(limit = 3): Promise<Story[]> {
  const stories = await loadStories()
  return stories
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Most viewed stories
export async function mostViewed(limit = 3): Promise<Story[]> {
  const stories = await loadStories()
  return stories.sort((a, b) => b.views - a.views).slice(0, limit)
}

// LocalStorage helpers (fallback)
const KEY_LIKED = 'rtc_liked_ids'
const KEY_READSET = 'rtc_read_set'
const KEY_READCOUNT = 'rtc_read_count'

export function getLikedIds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY_LIKED) || '[]'))
  } catch {
    return new Set()
  }
}

export function setLikedIds(ids: Set<string>) {
  localStorage.setItem(KEY_LIKED, JSON.stringify(Array.from(ids)))
}

export function getReadSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY_READSET) || '[]'))
  } catch {
    return new Set()
  }
}

export function setReadSet(ids: Set<string>) {
  localStorage.setItem(KEY_READSET, JSON.stringify(Array.from(ids)))
}

export function getReadCount(): number {
  try {
    return parseInt(localStorage.getItem(KEY_READCOUNT) || '0', 10)
  } catch {
    return 0
  }
}

export function setReadCount(n: number) {
  localStorage.setItem(KEY_READCOUNT, String(n))
}

// Fallback functions for localStorage
function loadStoriesLocal(): Story[] {
  try {
    const defaults = [
      {
        id: 'story-1',
        title: 'How I passed my road test on the first try',
        excerpt: 'Tips from practice to paperwork.',
        content: "Here's exactly how I prepared...",
        views: 12,
        likes: 5,
        createdAt: '2025-09-01T10:00:00Z',
        category: 'Inspirational Stories',
      },
    ]
    return JSON.parse(localStorage.getItem('rtc_stories_v4') || JSON.stringify(defaults))
  } catch {
    return []
  }
}