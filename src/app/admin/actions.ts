'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import type { NewsArticle, Submission, SubmissionStatus } from '@/lib/supabase'
import { PARTNER_TYPES, PARTNERS, type PartnerType, REGIONS, TEAM } from '@/app/data/site'
import { DOMAINS } from '@/app/data/domains'
import { PROJECTS, STATUS_LABEL, type ProjectData } from '@/app/data/projects'
import { projectToRow } from '@/lib/projects'
import type { DomainOverrides, DomainText } from '@/lib/domains'
import {
  MIN_PASSWORD_LENGTH, SESSION_COOKIE, checkCredentials, currentAdminEmail, getStoredCredentials, isValidSession, sessionValue,
  storeCredentials,
} from '@/lib/admin-auth'
import {
  type AboutSettings, type EventSettings, type GeneralSettings, type HistorySettings, type RegionsSettings, type Stat,
  SOCIAL_NETWORKS, phoneDigits,
} from '@/lib/settings'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function checkAuth() {
  const cookieStore = await cookies()
  if (!(await isValidSession(cookieStore.get(SESSION_COOKIE)?.value))) redirect('/admin/login')
}

async function setSessionCookie(version: number) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionValue(version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const version = await checkCredentials(email, password)
  if (version === null) return { error: 'E-mail ou mot de passe incorrect' }

  await setSessionCookie(version)
  redirect('/admin/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

// ── Compte admin ──────────────────────────────────────────
export async function getAccount() {
  await checkAuth()
  const stored = await getStoredCredentials()
  return { email: stored?.email ?? process.env.ADMIN_EMAIL ?? '', fromEnv: !stored }
}

/** Change l'e-mail de connexion et/ou le mot de passe ; déconnecte les autres appareils. */
export async function changeCredentials(input: { currentPassword: string; email: string; newPassword: string }) {
  await checkAuth()
  const currentEmail = await currentAdminEmail()
  if ((await checkCredentials(currentEmail, input.currentPassword)) === null) {
    return { error: 'Le mot de passe actuel est incorrect.' }
  }
  const email = input.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "L'adresse e-mail n'est pas valide." }
  // sans nouveau mot de passe, on garde l'actuel (changement d'e-mail seul)
  const password = input.newPassword || input.currentPassword
  if (input.newPassword) {
    if (input.newPassword.length < MIN_PASSWORD_LENGTH) {
      return { error: `Le nouveau mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.` }
    }
    if (input.newPassword === input.currentPassword) return { error: "Le nouveau mot de passe doit être différent de l'actuel." }
  }
  const { version, error } = await storeCredentials(email, password)
  if (error || version === undefined) return { error: error ?? 'Enregistrement impossible.' }
  await setSessionCookie(version)
  return {}
}

// ── Gallery ───────────────────────────────────────────────
export async function addGalleryItem(data: { label: string; sub: string; tag: string; image_url: string; video_url?: string }) {
  await checkAuth()
  await adminClient().from('gallery_items').insert(data)
  refreshSite()
}

export async function updateGalleryItem(id: string, data: { label: string; sub: string; tag: string; image_url: string; video_url?: string }) {
  await checkAuth()
  await adminClient().from('gallery_items').update(data).eq('id', id)
  refreshSite()
}

export async function deleteGalleryItem(id: string) {
  await checkAuth()
  await adminClient().from('gallery_items').delete().eq('id', id)
  refreshSite()
}

// ── News ──────────────────────────────────────────────────
export type NewsInput = {
  category: string; category_color: string; title: string; excerpt: string; body: string
  date: string; author: string; read_time: string; image_url: string
  published: boolean; project_slug: string | null
}

/** Tous les articles, brouillons compris : la clé publique ne voit que les articles publiés. */
export async function getAllNews(): Promise<NewsArticle[]> {
  await checkAuth()
  const { data } = await adminClient().from('news_articles').select('*').order('created_at', { ascending: false })
  return (data ?? []) as NewsArticle[]
}

export async function addNewsArticle(data: NewsInput) {
  await checkAuth()
  const { error } = await adminClient().from('news_articles').insert(data)
  refreshSite()
  return { error: error?.message }
}

export async function updateNewsArticle(id: string, data: NewsInput) {
  await checkAuth()
  const { error } = await adminClient().from('news_articles').update(data).eq('id', id)
  refreshSite()
  return { error: error?.message }
}

export async function deleteNewsArticle(id: string) {
  await checkAuth()
  await adminClient().from('news_articles').delete().eq('id', id)
  refreshSite()
}

// ── Partners ──────────────────────────────────────────────
export type PartnerInput = { name: string; full_name: string; logo_url: string; website?: string; type: PartnerType }

const checkPartnerType = (data: PartnerInput) =>
  data.type in PARTNER_TYPES ? null : 'Choisis le type de partenaire.'

/**
 * Tant que la table est vide, le site affiche la liste par défaut (data/site.ts).
 * Au premier ajout, on la recopie en base pour que ces partenaires ne disparaissent pas.
 */
async function ensurePartnersSeeded(db: ReturnType<typeof adminClient>) {
  const { count, error } = await db.from('partners').select('id', { count: 'exact', head: true })
  if (error) return error.message
  if ((count ?? 0) > 0) return null
  const { error: insertError } = await db.from('partners').insert(PARTNERS.map(p => ({
    name: p.name, full_name: '', logo_url: p.logo ?? '', website: p.website ?? null, type: p.type,
  })))
  return insertError?.message ?? null
}

export async function addPartner(data: PartnerInput) {
  await checkAuth()
  const invalid = checkPartnerType(data)
  if (invalid) return { error: invalid }
  const db = adminClient()
  const seedError = await ensurePartnersSeeded(db)
  if (seedError) return { error: seedError }
  const { error } = await db.from('partners').insert(data)
  refreshSite()
  return { error: error?.message }
}

export async function updatePartner(id: string, data: PartnerInput) {
  await checkAuth()
  const invalid = checkPartnerType(data)
  if (invalid) return { error: invalid }
  const { error } = await adminClient().from('partners').update(data).eq('id', id)
  refreshSite()
  return { error: error?.message }
}

/** Ajoute en base les partenaires de la liste par défaut qui n'y sont pas encore (même nom). */
export async function seedPartners() {
  await checkAuth()
  const db = adminClient()
  const { data, error } = await db.from('partners').select('name')
  if (error) return { error: error.message }
  const known = new Set((data ?? []).map(r => r.name))
  const missing = PARTNERS.filter(p => !known.has(p.name))
  if (missing.length === 0) return {}
  const { error: insertError } = await db.from('partners').insert(missing.map(p => ({
    name: p.name, full_name: '', logo_url: p.logo ?? '', website: p.website ?? null, type: p.type,
  })))
  refreshSite()
  return { error: insertError?.message }
}

export async function deletePartner(id: string) {
  await checkAuth()
  await adminClient().from('partners').delete().eq('id', id)
  refreshSite()
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

// ── Projets ───────────────────────────────────────────────
/** Un projet apparaît partout (menu, accueil, domaines, galerie, formulaires) : on régénère tout le site. */
function refreshSite() {
  revalidatePath('/', 'layout')
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const clean = (s: unknown) => (typeof s === 'string' ? s.trim() : '')

/** Nettoie un projet envoyé par le formulaire ; renvoie un message d'erreur s'il est incomplet. */
function checkProject(p: ProjectData): { project?: ProjectData; error?: string } {
  const project: ProjectData = {
    slug: clean(p.slug),
    title: clean(p.title),
    subtitle: clean(p.subtitle),
    domainSlug: clean(p.domainSlug),
    domainToConfirm: Boolean(p.domainToConfirm),
    status: p.status,
    period: clean(p.period),
    location: clean(p.location),
    featured: Boolean(p.featured),
    cover: clean(p.cover),
    summary: clean(p.summary),
    facts: (p.facts ?? []).map(f => ({ label: clean(f.label), value: clean(f.value) })).filter(f => f.label && f.value),
    project: clean(p.project),
    motivation: clean(p.motivation),
    objectives: clean(p.objectives),
    activities: (p.activities ?? []).map(a => ({ icon: a.icon, title: clean(a.title), text: clean(a.text) })).filter(a => a.title),
    results: (p.results ?? []).map(clean).filter(Boolean),
    calendar: (p.calendar ?? []).map(s => ({ when: clean(s.when), label: clean(s.label) })).filter(s => s.label),
    applyLabel: clean(p.applyLabel) || "S'inscrire",
  }
  if (!project.title) return { error: 'Le titre du projet est obligatoire.' }
  if (!SLUG_RE.test(project.slug)) return { error: "L'adresse de la page ne peut contenir que des lettres minuscules sans accent, des chiffres et des tirets." }
  if (!DOMAINS.some(d => d.slug === project.domainSlug)) return { error: 'Choisis le domaine du projet.' }
  if (!(project.status in STATUS_LABEL)) return { error: 'Statut inconnu.' }
  return { project }
}

/**
 * Tant que la table est vide, le site affiche les six projets par défaut.
 * Avant la première modification, on les recopie en base pour que rien ne disparaisse.
 */
async function ensureProjectsSeeded(db: ReturnType<typeof adminClient>) {
  const { count, error } = await db.from('projects').select('id', { count: 'exact', head: true })
  if (error) return error.message
  if ((count ?? 0) > 0) return null
  const { error: insertError } = await db.from('projects').insert(PROJECTS.map((p, i) => projectToRow(p, (i + 1) * 10)))
  return insertError?.message ?? null
}

/** Crée (originalSlug = null) ou modifie un projet. */
export async function saveProject(originalSlug: string | null, input: ProjectData) {
  await checkAuth()
  const { project, error } = checkProject(input)
  if (!project) return { error }
  const db = adminClient()
  const seedError = await ensureProjectsSeeded(db)
  if (seedError) return { error: seedError }

  if (project.slug !== originalSlug) {
    const { data: taken } = await db.from('projects').select('id').eq('slug', project.slug).maybeSingle()
    if (taken) return { error: `L'adresse « ${project.slug} » est déjà utilisée par un autre projet.` }
  }

  if (originalSlug) {
    const { data: before } = await db.from('projects').select('data').eq('slug', originalSlug).maybeSingle()
    const { slug, data } = projectToRow(project, 0)
    const { error: updateError } = await db.from('projects')
      .update({ slug, data, updated_at: new Date().toISOString() }).eq('slug', originalSlug)
    if (updateError) return { error: updateError.message }
    // Les médias sont rangés par titre de projet : on les suit si le titre change.
    const oldTitle = (before?.data as Partial<ProjectData> | undefined)?.title
    if (oldTitle && oldTitle !== project.title) {
      await db.from('gallery_items').update({ tag: project.title }).eq('tag', oldTitle)
    }
    // Les articles liés suivent le projet si son adresse change.
    if (project.slug !== originalSlug) {
      await db.from('news_articles').update({ project_slug: project.slug }).eq('project_slug', originalSlug)
    }
  } else {
    const { data: last } = await db.from('projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const { error: insertError } = await db.from('projects').insert(projectToRow(project, (last?.sort_order ?? 0) + 10))
    if (insertError) return { error: insertError.message }
  }
  refreshSite()
  return { slug: project.slug }
}

export async function deleteProject(slug: string) {
  await checkAuth()
  const db = adminClient()
  const seedError = await ensureProjectsSeeded(db)
  if (seedError) return { error: seedError }
  const { count } = await db.from('projects').select('id', { count: 'exact', head: true })
  if ((count ?? 0) <= 1) return { error: 'Impossible de supprimer le dernier projet : le site doit en garder au moins un.' }
  const { error } = await db.from('projects').delete().eq('slug', slug)
  if (error) return { error: error.message }
  refreshSite()
  return {}
}

/** Fait monter (-1) ou descendre (+1) un projet dans l'ordre d'affichage. */
export async function moveProject(slug: string, step: -1 | 1) {
  await checkAuth()
  const db = adminClient()
  const seedError = await ensureProjectsSeeded(db)
  if (seedError) return { error: seedError }
  const { data, error } = await db.from('projects').select('id, slug').order('sort_order', { ascending: true })
  if (error || !data) return { error: error?.message ?? 'Lecture impossible' }
  const i = data.findIndex(r => r.slug === slug)
  const j = i + step
  if (i < 0 || j < 0 || j >= data.length) return {}
  ;[data[i], data[j]] = [data[j], data[i]]
  const results = await Promise.all(data.map((r, k) => db.from('projects').update({ sort_order: (k + 1) * 10 }).eq('id', r.id)))
  const failed = results.find(r => r.error)
  if (failed?.error) return { error: failed.error.message }
  refreshSite()
  return {}
}

// ── Réglages généraux ─────────────────────────────────────
async function saveSetting(key: 'general' | 'stats' | 'event' | 'history' | 'about' | 'domains' | 'regions', value: unknown) {
  const { error } = await adminClient().from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) return { error: error.message }
  refreshSite()
  return {}
}

export async function saveGeneralSettings(input: GeneralSettings) {
  await checkAuth()
  const email = clean(input.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "L'adresse e-mail n'est pas valide." }
  const phones = (input.phones ?? []).map(p => clean(p.display)).filter(Boolean)
    .map(display => ({ display, wa: phoneDigits(display) }))
  if (phones.length === 0) return { error: 'Indique au moins un numéro de téléphone (le premier sert pour WhatsApp).' }
  if (phones.some(p => p.wa.length < 9)) return { error: "Un numéro de téléphone semble incomplet : écris-le avec l'indicatif, ex. +221 77 000 00 00." }
  const socials = (input.socials ?? [])
    .filter(s => SOCIAL_NETWORKS.includes(s.name))
    .map(s => ({ name: s.name, href: clean(s.href) }))
    .filter(s => s.href)
  const badLink = socials.find(s => !/^https?:\/\//.test(s.href))
  if (badLink) return { error: `Le lien ${badLink.name} doit commencer par https://` }
  return saveSetting('general', { slogan: clean(input.slogan), city: clean(input.city), email, phones, socials })
}

export async function saveStats(input: Stat[]) {
  await checkAuth()
  const stats = (input ?? [])
    .map(s => ({ value: Math.round(Number(s.value)), suffix: clean(s.suffix).slice(0, 4), label: clean(s.label) }))
    .filter(s => s.label)
  if (stats.some(s => !Number.isFinite(s.value) || s.value < 0)) return { error: 'Chaque chiffre doit être un nombre positif.' }
  if (stats.length > 12) return { error: '12 chiffres clés au maximum.' }
  return saveSetting('stats', stats)
}

export async function saveEvent(input: EventSettings) {
  await checkAuth()
  const event: EventSettings = {
    enabled: Boolean(input.enabled),
    title: clean(input.title),
    subtitle: clean(input.subtitle),
    dateLabel: clean(input.dateLabel),
    date: clean(input.date),
    domainSlug: clean(input.domainSlug),
    href: clean(input.href),
    buttonLabel: clean(input.buttonLabel) || "Je m'inscris",
  }
  if (event.enabled && !event.title) return { error: "Donne un titre à l'événement." }
  if (Number.isNaN(new Date(event.date).getTime())) return { error: "Indique la date et l'heure de l'événement." }
  if (!DOMAINS.some(d => d.slug === event.domainSlug)) return { error: 'Choisis le domaine (il donne la couleur du bloc).' }
  if (event.href && !event.href.startsWith('/') && !event.href.startsWith('https://')) return { error: 'Le lien du bouton doit commencer par / (page du site) ou https://' }
  return saveSetting('event', event)
}

/** Textes d'un domaine ; un champ vide reprend le texte d'origine. */
export async function saveDomain(slug: string, input: DomainText) {
  await checkAuth()
  if (!DOMAINS.some(d => d.slug === slug)) return { error: 'Domaine inconnu.' }
  const { data, error } = await adminClient().from('site_settings').select('value').eq('key', 'domains').maybeSingle()
  if (error) return { error: error.message }
  const all = ((data?.value as DomainOverrides | undefined) ?? {})
  all[slug] = {
    name: clean(input.name), theme: clean(input.theme), slogan: clean(input.slogan), mission: clean(input.mission),
    cover: clean(input.cover), presentation: (input.presentation ?? []).map(clean).filter(Boolean),
  }
  return saveSetting('domains', all)
}

export async function saveRegions(input: RegionsSettings) {
  await checkAuth()
  const regions: RegionsSettings = Object.fromEntries(REGIONS.map(r => [r.name, {
    done: (input[r.name]?.done ?? []).map(clean).filter(Boolean),
    projects: (input[r.name]?.projects ?? []).map(clean).filter(Boolean),
  }]))
  return saveSetting('regions', regions)
}

export async function saveHistory(input: HistorySettings) {
  await checkAuth()
  const history: HistorySettings = {
    title: clean(input.title),
    paragraphs: (input.paragraphs ?? []).map(clean).filter(Boolean),
    steps: (input.steps ?? [])
      .map(s => ({ date: clean(s.date), title: clean(s.title), text: clean(s.text), image: clean(s.image) || undefined }))
      .filter(s => s.title),
  }
  if (!history.title) return { error: 'Le titre de la page est obligatoire.' }
  if (history.paragraphs.length < 2) return { error: "Écris au moins deux paragraphes (les deux premiers sont repris sur la page d'accueil)." }
  return saveSetting('history', history)
}

export async function saveAbout(input: AboutSettings) {
  await checkAuth()
  const about: AboutSettings = {
    mission: clean(input.mission),
    vision: clean(input.vision),
    values: (input.values ?? []).map(v => ({ name: clean(v.name), text: clean(v.text) })).filter(v => v.name),
  }
  if (!about.mission || !about.vision) return { error: 'La mission et la vision sont obligatoires.' }
  return saveSetting('about', about)
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

const STATUSES: SubmissionStatus[] = ['nouvelle', 'en-cours', 'traitee', 'archivee']

/** Change le statut et/ou les notes internes d'une demande. */
export async function updateSubmission(id: string, patch: { status?: SubmissionStatus; notes?: string }) {
  await checkAuth()
  const data: { status?: SubmissionStatus; notes?: string } = {}
  if (patch.status !== undefined) {
    if (!STATUSES.includes(patch.status)) return { error: 'Statut inconnu.' }
    data.status = patch.status
  }
  if (patch.notes !== undefined) data.notes = patch.notes.slice(0, 5000)
  const { error } = await adminClient().from('submissions').update(data).eq('id', id)
  return { error: error?.message }
}
