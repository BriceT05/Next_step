import AdminSidebar from './AdminSidebar'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink md:flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 md:ml-64 px-4 py-6 sm:px-8 sm:py-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
