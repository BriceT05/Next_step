import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(url, anon)

export type GalleryItem = {
  id: string; label: string; sub: string; tag: string; image_url: string; video_url?: string; created_at: string
}
export type NewsArticle = {
  id: string; category: string; category_color: string; title: string; excerpt: string
  date: string; author: string; read_time: string; image_url: string; created_at: string
}
export type Partner = {
  id: string; name: string; full_name: string; logo_url: string; website?: string; created_at: string
}
export type Submission = {
  id: string; role: string; name: string; email: string; phone?: string; message?: string; created_at: string
}
