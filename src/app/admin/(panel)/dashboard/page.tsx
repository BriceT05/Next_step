'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Submission } from '@/lib/supabase'
import { countSubmissions, getSubmissions } from '@/app/admin/actions'
import { Badge, Card, PageHeader, roleOf } from '@/app/admin/ui'

// Les demandes sont comptées côté serveur (données personnelles) ; les autres tables sont publiques.
const STATS = [
  { key: 'submissions', table: null, label: 'Demandes reçues', href: '/admin/submissions' },
  { key: 'gallery', table: 'gallery_items', label: 'Photos & vidéos', href: '/admin/gallery' },
  { key: 'news', table: 'news_articles', label: 'Articles publiés', href: '/admin/news' },
  { key: 'partners', table: 'partners', label: 'Partenaires', href: '/admin/partners' },
] as const

const ACTIONS = [
  { label: 'Publier un article', href: '/admin/news' },
  { label: 'Ajouter une photo ou une vidéo', href: '/admin/gallery' },
  { label: 'Ajouter un partenaire', href: '/admin/partners' },
  { label: 'Voir les pages projets', href: '/admin/projects' },
]

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function DashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({})
  const [latest, setLatest] = useState<Submission[] | null>(null)

  useEffect(() => {
    Promise.all(STATS.map(s => s.table
      ? supabase.from(s.table).select('id', { count: 'exact', head: true }).then(r => r.count ?? 0)
      : countSubmissions()))
      .then(results => setCounts(Object.fromEntries(STATS.map((s, i) => [s.key, results[i]]))))
    getSubmissions(5).then(setLatest)
  }, [])

  return (
    <div>
      <PageHeader title="Tableau de bord" intro="Bienvenue dans l'espace d'administration de Next Step.sn. Tout ce que tu publies ici apparaît sur le site." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {STATS.map(s => (
          <Link key={s.key} href={s.href}
            className="group bg-white border border-pearl rounded-2xl p-5 shadow-sm hover:border-ns/40 hover:shadow transition">
            <div className="font-display text-3xl sm:text-4xl font-bold text-ns tabular-nums">
              {counts[s.key] ?? <span className="inline-block w-10 h-8 rounded bg-pearl/70 animate-pulse align-middle" />}
            </div>
            <div className="text-muted text-sm mt-1 group-hover:text-ink transition">{s.label} →</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card title="Dernières demandes" className="lg:col-span-3">
          {latest === null ? (
            <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-12 rounded-xl bg-pearl/60 animate-pulse" />)}</div>
          ) : latest.length === 0 ? (
            <p className="text-muted text-sm">Aucune demande pour l&apos;instant. Les formulaires du site (inscription, bénévolat, partenariat, contact, mur des rêves) arrivent ici.</p>
          ) : (
            <ul className="divide-y divide-pearl">
              {latest.map(s => {
                const role = roleOf(s.role)
                return (
                  <li key={s.id} className="py-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Badge color={role.color}>{role.label}</Badge>
                    <span className="font-medium text-ink text-sm">{s.name || 'Sans nom'}</span>
                    <span className="text-muted text-xs ml-auto">{fmt(s.created_at)}</span>
                  </li>
                )
              })}
            </ul>
          )}
          <Link href="/admin/submissions" className="inline-block mt-4 text-sm font-semibold text-ns hover:underline">
            Toutes les demandes →
          </Link>
        </Card>

        <Card title="Actions rapides" className="lg:col-span-2">
          <div className="space-y-2">
            {ACTIONS.map(a => (
              <Link key={a.href + a.label} href={a.href}
                className="flex items-center justify-between rounded-xl border border-pearl px-4 py-3 text-sm font-medium text-ink hover:border-ns hover:text-ns transition">
                {a.label}<span aria-hidden className="text-gold-ink">→</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
