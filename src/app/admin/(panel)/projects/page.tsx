'use client'
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { DOMAINS } from '@/app/data/domains'
import { STATUS_LABEL } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import type { GalleryItem, NewsArticle } from '@/lib/supabase'
import { toMedia } from '@/lib/content'
import { deleteProject, moveProject } from '@/app/admin/actions'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import { Badge, DeleteButton, Loading, PageHeader, btnPrimary } from '@/app/admin/ui'

const STATUS_COLOR = { 'a-venir': '#1F6FB2', 'en-cours': '#3C8D4F', termine: '#55636A' } as const

export default function ProjectsAdmin() {
  const { projects, saved, reload } = useAdminProjects()
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null)
  const [news, setNews] = useState<Pick<NewsArticle, 'title' | 'excerpt'>[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('gallery_items').select('*').then(({ data }) => setGallery((data ?? []) as GalleryItem[]))
    supabase.from('news_articles').select('title, excerpt').then(({ data }) => setNews(data ?? []))
  }, [])

  const mediaCount = (slug: string) =>
    gallery === null || projects === null ? '…' : gallery.map(g => toMedia(g, projects)).filter(m => m.projectSlug === slug).length

  const newsCount = (title: string) =>
    news === null ? '…' : news.filter(a => `${a.title} ${a.excerpt}`.toLowerCase().includes(title.toLowerCase())).length

  const run = (task: () => Promise<{ error?: string }>) => {
    setError('')
    startTransition(async () => {
      const res = await task()
      if (res.error) setError(res.error)
      await reload()
    })
  }

  return (
    <div>
      <PageHeader title="Projets"
        intro="Tout le contenu des pages projet : textes, fiche rapide, activités, calendrier, photo. L'ordre ci-dessous est celui du site (menu, pages domaines, accueil).">
        <Link href="/admin/projects/nouveau" className={btnPrimary}>+ Nouveau projet</Link>
      </PageHeader>

      {!saved && projects !== null && (
        <p className="mb-6 rounded-xl bg-gold/10 border border-gold/30 text-ink text-sm px-4 py-3">
          Ce sont les six projets du cahier des charges. Ils seront enregistrés dans la base à ta première modification ; ensuite, tout se modifie ici.
        </p>
      )}
      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{error}</p>}

      {projects === null ? <Loading /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const domain = DOMAINS.find(d => d.slug === p.domainSlug) ?? DOMAINS[0]
            return (
              <article key={p.slug} className="bg-white border border-pearl rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative h-36 bg-cream">
                  {p.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: domain.color }} />
                  <span className="absolute top-3 left-3 bg-white/95 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: STATUS_COLOR[p.status] }}>
                    {STATUS_LABEL[p.status]}
                  </span>
                  {p.featured && (
                    <span className="absolute top-3 right-3 bg-gold text-ink text-xs font-bold px-2.5 py-1 rounded-full">À la une</span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-ns/90 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center" title="Position sur le site">
                    {i + 1}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <Badge color={domain.deep}>{domain.name} · {domain.theme}{p.domainToConfirm ? ' (à confirmer)' : ''}</Badge>
                  <h2 className="font-display font-semibold text-ink mt-2.5 leading-snug">{p.title}</h2>
                  <p className="text-muted text-xs mt-1">{p.period}{p.location ? ` · ${p.location}` : ''}</p>

                  <dl className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-xl bg-cream px-3 py-2">
                      <dt className="text-muted text-[11px]">Photos & vidéos</dt>
                      <dd className="font-display font-bold text-ns text-lg tabular-nums">{mediaCount(p.slug)}</dd>
                    </div>
                    <div className="rounded-xl bg-cream px-3 py-2">
                      <dt className="text-muted text-[11px]">Articles liés</dt>
                      <dd className="font-display font-bold text-ns text-lg tabular-nums">{newsCount(p.title)}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                    <Link href={`/admin/projects/${p.slug}`}
                      className="text-xs font-medium text-ns border border-ns/25 bg-white px-3 py-1.5 rounded-lg hover:bg-ns/5 hover:border-ns/50 transition">
                      Modifier
                    </Link>
                    <DeleteButton label={p.title} disabled={isPending} onConfirm={() => run(() => deleteProject(p.slug))} />
                    <span className="ml-auto flex gap-1">
                      <MoveButton label="Monter" disabled={isPending || i === 0} onClick={() => run(() => moveProject(p.slug, -1))} up />
                      <MoveButton label="Descendre" disabled={isPending || i === projects.length - 1} onClick={() => run(() => moveProject(p.slug, 1))} />
                    </span>
                  </div>
                  <div className="pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                    <Link href={`/admin/gallery?tag=${encodeURIComponent(p.title)}`} className="text-ns hover:underline">+ Ajouter un média</Link>
                    <a href={`/projets/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">Voir la page ↗</a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MoveButton({ label, onClick, disabled, up }: { label: string; onClick: () => void; disabled?: boolean; up?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className="w-8 h-8 rounded-lg border border-pearl bg-white text-ink flex items-center justify-center hover:border-ns hover:text-ns transition disabled:opacity-30 disabled:cursor-not-allowed">
      <svg className={`w-4 h-4 ${up ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}
