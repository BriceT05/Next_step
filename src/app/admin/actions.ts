'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_auth')?.value
  if (token !== process.env.ADMIN_TOKEN) redirect('/admin/login')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Email ou mot de passe incorrect' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', process.env.ADMIN_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  redirect('/admin/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin/login')
}

// ── Gallery ───────────────────────────────────────────────
export async function addGalleryItem(data: { label: string; sub: string; tag: string; image_url: string; video_url?: string }) {
  await checkAuth()
  await adminClient().from('gallery_items').insert(data)
}

export async function updateGalleryItem(id: string, data: { label: string; sub: string; tag: string; image_url: string; video_url?: string }) {
  await checkAuth()
  await adminClient().from('gallery_items').update(data).eq('id', id)
}

export async function deleteGalleryItem(id: string) {
  await checkAuth()
  await adminClient().from('gallery_items').delete().eq('id', id)
}

// ── News ──────────────────────────────────────────────────
export async function addNewsArticle(data: {
  category: string; category_color: string; title: string; excerpt: string
  date: string; author: string; read_time: string; image_url: string
}) {
  await checkAuth()
  await adminClient().from('news_articles').insert(data)
}

export async function updateNewsArticle(id: string, data: {
  category: string; category_color: string; title: string; excerpt: string
  date: string; author: string; read_time: string; image_url: string
}) {
  await checkAuth()
  await adminClient().from('news_articles').update(data).eq('id', id)
}

export async function deleteNewsArticle(id: string) {
  await checkAuth()
  await adminClient().from('news_articles').delete().eq('id', id)
}

// ── Partners ──────────────────────────────────────────────
export async function addPartner(data: { name: string; full_name: string; logo_url: string; website?: string }) {
  await checkAuth()
  await adminClient().from('partners').insert(data)
}

export async function updatePartner(id: string, data: { name: string; full_name: string; logo_url: string; website?: string }) {
  await checkAuth()
  await adminClient().from('partners').update(data).eq('id', id)
}

export async function deletePartner(id: string) {
  await checkAuth()
  await adminClient().from('partners').delete().eq('id', id)
}

// ── Submissions ───────────────────────────────────────────
export async function addSubmission(data: { role: string; name: string; email: string; phone?: string; message?: string }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return
  const { createClient } = await import('@supabase/supabase-js')
  const db = createClient(url, key)
  await db.from('submissions').insert(data)
}

export async function deleteSubmission(id: string) {
  await checkAuth()
  await adminClient().from('submissions').delete().eq('id', id)
}
