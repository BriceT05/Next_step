'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import type { Submission } from '@/lib/supabase'
import { TEAM } from '@/app/data/site'

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

// ── Équipe ────────────────────────────────────────────────
export type TeamMemberInput = {
  name: string; post: string; role: 'titulaire' | 'adjoint' | 'membre'; parent_id: string | null
  domain_slug: string | null; photo_url: string; bio: string; quote: string; sort_order: number
}

/** La page Équipe et les pages domaines affichent les membres : on les régénère tout de suite. */
function refreshTeamPages() {
  revalidatePath('/qui-sommes-nous/notre-equipe')
  revalidatePath('/domaines/[slug]', 'page')
}

export async function addTeamMember(data: TeamMemberInput) {
  await checkAuth()
  const { error } = await adminClient().from('team_members').insert(data)
  refreshTeamPages()
  return { error: error?.message }
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await checkAuth()
  const { error } = await adminClient().from('team_members').update(data).eq('id', id)
  refreshTeamPages()
  return { error: error?.message }
}

export async function deleteTeamMember(id: string) {
  await checkAuth()
  const { error } = await adminClient().from('team_members').delete().eq('id', id)
  refreshTeamPages()
  return { error: error?.message }
}

/** Recopie l'organigramme par défaut (site.ts) dans la base, pour n'avoir plus qu'à saisir noms et photos. */
export async function seedTeam() {
  await checkAuth()
  const ids = new Map(TEAM.map(m => [m.id, crypto.randomUUID()]))
  const row = (m: (typeof TEAM)[number]) => ({
    id: ids.get(m.id)!, name: m.name, post: m.post, role: m.role, parent_id: m.parent ? ids.get(m.parent) ?? null : null,
    domain_slug: m.domainSlug ?? null, photo_url: m.photo ?? '', bio: m.bio ?? '', quote: m.quote ?? '', sort_order: m.order,
  })
  // les titulaires d'abord, pour que les adjoints puissent s'y rattacher
  const db = adminClient()
  const first = await db.from('team_members').insert(TEAM.filter(m => !m.parent).map(row))
  if (first.error) return { error: first.error.message }
  const second = await db.from('team_members').insert(TEAM.filter(m => m.parent).map(row))
  refreshTeamPages()
  return { error: second.error?.message }
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

/** Les demandes contiennent des données personnelles : lues uniquement côté serveur (RLS bloque la clé publique). */
export async function getSubmissions(limit?: number): Promise<Submission[]> {
  await checkAuth()
  let q = adminClient().from('submissions').select('*').order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data } = await q
  return (data ?? []) as Submission[]
}

export async function countSubmissions(): Promise<number> {
  await checkAuth()
  const { count } = await adminClient().from('submissions').select('id', { count: 'exact', head: true })
  return count ?? 0
}

export async function deleteSubmission(id: string) {
  await checkAuth()
  await adminClient().from('submissions').delete().eq('id', id)
}
