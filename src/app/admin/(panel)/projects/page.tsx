'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DOMAINS } from '@/app/data/domains'
import { PROJECTS, STATUS_LABEL } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import type { GalleryItem, NewsArticle } from '@/lib/supabase'
import { toMedia } from '@/lib/content'
import { Badge, PageHeader } from '@/app/admin/ui'

export default function ProjectsAdmin() {
  const [mediaCount, setMediaCount] = useState<Record<string, number> | null>(null)
  const [newsCount, setNewsCount] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    supabase.from('gallery_items').select('*').then(({ data }) => {
      const c: Record<string, number> = {}
      for (const m of ((data ?? []) as GalleryItem[]).map(toMedia)) if (m.projectSlug) c[m.projectSlug] = (c[m.projectSlug] ?? 0) + 1
      setMediaCount(c)
    })
    supabase.from('news_articles').select('title, excerpt').then(({ data }) => {
      const c: Record<string, number> = {}
      for (const a of (data ?? []) as Pick<NewsArticle, 'title' | 'excerpt'>[]) {
        const text = `${a.title} ${a.excerpt}`.toLowerCase()
        for (const p of PROJECTS) if (text.includes(p.title.toLowerCase())) c[p.slug] = (c[p.slug] ?? 0) + 1
      }
      setNewsCount(c)
    })
  }, [])

  const count = (n: Record<string, number> | null, slug: string) => (n === null ? '…' : n[slug] ?? 0)

  return (
    <div>
      <PageHeader title="Projets"
        intro="Les six projets du cahier des charges. Leurs textes sont fixés avec l'association ; ici, tu enrichis chaque page projet avec des photos, des vidéos et des articles." />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROJECTS.map(p => {
          const domain = DOMAINS.find(d => d.slug === p.domainSlug)!
          return (
            <article key={p.slug} className="bg-white border border-pearl rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-36">
                <Image src={p.cover} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: domain.color }} />
                <span className="absolute top-3 left-3 bg-white/95 text-ink text-xs font-semibold px-2.5 py-1 rounded-full">
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <Badge color={domain.deep}>{domain.name} · {domain.theme}{p.domainToConfirm ? ' (à confirmer)' : ''}</Badge>
                <h2 className="font-display font-semibold text-ink mt-2.5 leading-snug">{p.title}</h2>
                <p className="text-muted text-xs mt-1">{p.period}</p>

                <dl className="grid grid-cols-2 gap-2 mt-4">
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-muted text-[11px]">Photos & vidéos</dt>
                    <dd className="font-display font-bold text-ns text-lg tabular-nums">{count(mediaCount, p.slug)}</dd>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-muted text-[11px]">Articles liés</dt>
                    <dd className="font-display font-bold text-ns text-lg tabular-nums">{count(newsCount, p.slug)}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                  <Link href={`/admin/gallery?tag=${encodeURIComponent(p.title)}`} className="text-ns hover:underline">+ Ajouter un média</Link>
                  <a href={`/projets/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">Voir la page ↗</a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
