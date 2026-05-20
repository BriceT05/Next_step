'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Counts {
  gallery: number
  news: number
  projects: number
  partners: number
  submissions: number
}

const SECTIONS = [
  { key: 'gallery', label: 'Éléments galerie', icon: '🖼️', href: '/admin/gallery', color: '#D9A657' },
  { key: 'news', label: 'Articles publiés', icon: '📰', href: '/admin/news', color: '#12A89D' },
  { key: 'projects', label: 'Projets en ligne', icon: '🚀', href: '/admin/projects', color: '#0A7F78' },
  { key: 'partners', label: 'Partenaires', icon: '🤝', href: '/admin/partners', color: '#D9A657' },
  { key: 'submissions', label: 'Candidatures reçues', icon: '📋', href: '/admin/submissions', color: '#12A89D' },
] as const

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ gallery: 0, news: 0, projects: 0, partners: 0, submissions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCounts() {
      const [g, n, p, pa, s] = await Promise.all([
        supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        supabase.from('news_articles').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('submissions').select('id', { count: 'exact', head: true }),
      ])
      setCounts({
        gallery: g.count ?? 0,
        news: n.count ?? 0,
        projects: p.count ?? 0,
        partners: pa.count ?? 0,
        submissions: s.count ?? 0,
      })
      setLoading(false)
    }
    fetchCounts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Tableau de bord</h1>
      <p className="text-[#74878B] text-sm mb-10">Vue d&apos;ensemble du contenu Next Step.sn</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="group bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 hover:border-[#D9A657]/30 hover:bg-white/5 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{s.icon}</span>
              <svg className="w-4 h-4 text-[#74878B]/40 group-hover:text-[#D9A657]/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-4xl font-extrabold mb-1 transition-colors" style={{ color: s.color }}>
              {loading ? '—' : counts[s.key]}
            </div>
            <div className="text-[#74878B] text-sm font-medium">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6">
        <h2 className="text-[#D9A657] font-semibold mb-5">Actions rapides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Publier un article', href: '/admin/news', icon: '📰' },
            { label: 'Ajouter une photo', href: '/admin/gallery', icon: '🖼️' },
            { label: 'Voir les candidatures', href: '/admin/submissions', icon: '📋' },
            { label: 'Voir le site', href: '/', icon: '🌐' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 bg-white/3 border border-[#74878B]/15 rounded-xl px-4 py-3 text-[#74878B] text-sm hover:text-white hover:border-[#D9A657]/30 transition-all"
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
