'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { logout } from './actions'

const navLinks = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/admin/gallery', label: 'Galerie', icon: '🖼️' },
  { href: '/admin/news', label: 'Actualités', icon: '📰' },
  { href: '/admin/projects', label: 'Projets', icon: '🚀' },
  { href: '/admin/partners', label: 'Partenaires', icon: '🤝' },
  { href: '/admin/submissions', label: 'Candidatures', icon: '📋' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#182426] border-r border-[#74878B]/15 flex-col hidden md:flex z-40">
      <div className="p-6 border-b border-[#74878B]/15 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D9A657]/40">
          <Image src="/logo-emblem.png" alt="NS" fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Next Step.sn</div>
          <div className="text-[#D9A657] text-xs font-semibold tracking-wide uppercase">Admin</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#D9A657]/10 text-[#D9A657] border border-[#D9A657]/20'
                  : 'text-[#74878B] hover:text-white hover:bg-white/5'
              }`}>
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#74878B]/15 space-y-2">
        <a href="/" className="flex items-center gap-2 text-[#74878B] text-sm hover:text-white transition-colors px-2 py-1">
          ← Voir le site
        </a>
        <form action={logout}>
          <button type="submit"
            className="w-full text-left text-red-400/70 text-sm hover:text-red-400 transition-colors flex items-center gap-2 px-2 py-1">
            ⏻ Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
