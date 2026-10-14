'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/actions'

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z" />,
  gallery: <path d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  news: <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2M7 8h6M7 12h6M7 16h4" />,
  projects: <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9L9.5 8 12 3z" />,
  partners: <path d="M17 20h5v-2a3 3 0 00-5.4-1.8M17 20H7m10 0v-2c0-.7-.1-1.3-.4-1.8M7 20H2v-2a3 3 0 015.4-1.8M7 20v-2c0-.7.1-1.3.4-1.8m0 0a5 5 0 019.2 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  submissions: <path d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0h-3.6a1 1 0 00-.9.6l-.9 1.8a1 1 0 01-.9.6h-3.4a1 1 0 01-.9-.6l-.9-1.8a1 1 0 00-.9-.6H4" />,
}

const NAV = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { href: '/admin/submissions', label: 'Demandes reçues', icon: 'submissions' },
  { href: '/admin/gallery', label: 'Photos & vidéos', icon: 'gallery' },
  { href: '/admin/news', label: 'Actualités', icon: 'news' },
  { href: '/admin/projects', label: 'Projets', icon: 'projects' },
  { href: '/admin/partners', label: 'Partenaires', icon: 'partners' },
]

function Icon({ name }: { name: string }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/60 bg-white">
        <Image src="/logo-emblem.png" alt="" fill sizes="40px" className="object-cover" />
      </div>
      <div className="leading-tight">
        <div className="font-display font-bold text-white text-sm">Next Step.sn</div>
        <div className="text-gold text-[11px] font-semibold tracking-[0.14em] uppercase">Administration</div>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = (
    <nav className="flex-1 p-3 space-y-1" aria-label="Administration">
      {NAV.map(link => {
        const active = pathname.startsWith(link.href)
        return (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              active ? 'bg-white text-ns shadow-sm' : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}>
            <span className={active ? 'text-gold-ink' : ''}><Icon name={link.icon} /></span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  const footer = (
    <div className="p-3 border-t border-white/10 space-y-1">
      <a href="/" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-white/75 text-sm hover:text-white hover:bg-white/10 transition">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6m0-6L10 14M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" />
        </svg>
        Voir le site
      </a>
      <form action={logout}>
        <button type="submit"
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-white/75 text-sm hover:text-white hover:bg-white/10 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 16l4-4m0 0l-4-4m4 4H8m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* Bureau */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-ns flex-col z-40">
        <div className="px-5 py-6 border-b border-white/10"><Brand /></div>
        {links}
        {footer}
      </aside>

      {/* Mobile */}
      <header className="md:hidden sticky top-0 z-40 bg-ns">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="admin-mobile-nav"
            className="p-2 rounded-lg text-white hover:bg-white/10">
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
        {open && <div id="admin-mobile-nav" className="border-t border-white/10">{links}{footer}</div>}
      </header>
    </>
  )
}
