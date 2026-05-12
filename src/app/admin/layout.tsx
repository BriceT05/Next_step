import AdminSidebar from './AdminSidebar'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Next Step.sn' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1E20] flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-6 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
