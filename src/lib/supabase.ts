import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzueuuioyaxoqnrsbodj.supabase.com'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dWV1dWlveWF4b3FucnNib2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTY0OTgsImV4cCI6MjA4MDk5MjQ5OH0.ePX9iLn2GaUpbJtATSkTbeRi3uLGgavBhAzV9S8CwEc'
export const supabase = createClient(supabaseUrl, supabaseKey)

export function isConfigured() {
  return !!supabaseUrl && !!supabaseKey
}

export type Story = {
  id: string
  title: string
  excerpt?: string
  content: string
  views: number
  likes: number
  created_at: string
  image_url?: string
  video_url?: string
  category?: string
  author_id?: string
  link_url?: string
}

export type User = {
  id: string
  email: string
  name?: string
  role?: 'admin' | 'user' | 'guest'
  created_at: string
}