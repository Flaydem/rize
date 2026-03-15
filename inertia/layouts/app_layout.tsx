import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { type ReactNode, useState, useEffect } from 'react'

interface Props {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  const { auth, flash } = usePage<{ auth: { user: any }; flash: { success?: string; error?: string } }>().props
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const user = auth?.user
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: '⬡' },
    { href: '/ideas', label: 'Coffre aux idees', icon: '◆' },
    { href: '/validator', label: 'Validateur', icon: '◇' },
  ]

  const adminItems = [
    { href: '/admin/source-items', label: 'Sources', icon: '▦' },
    { href: '/admin/ideas/review', label: 'Moderation', icon: '▧' },
  ]

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-nb-border">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => isMobile && setSidebarOpen(false)}>
          <span className="text-xl font-black tracking-tight">
            <span className="text-nb-white">Ri</span><span className="bg-nb-red px-1 text-white">ze</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = typeof window !== 'undefined' && window.location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-nb-red-muted text-nb-red'
                  : 'text-nb-gray-400 hover:text-nb-white hover:bg-nb-surface'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="pt-6 pb-1 px-3 text-[10px] font-bold text-nb-gray-600 uppercase tracking-widest">Admin</div>
            {adminItems.map((item) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-nb-red-muted text-nb-red'
                      : 'text-nb-gray-400 hover:text-nb-white hover:bg-nb-surface'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-nb-border">
        <Link href="/settings" onClick={() => isMobile && setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-nb-gray-400 hover:text-nb-white hover:bg-nb-surface transition-colors">
          <span>⚙</span>
          <span>{user?.fullName || 'Parametres'}</span>
        </Link>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-nb-black flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-nb-dark border-r border-nb-border flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-nb-dark border-r border-nb-border flex flex-col z-50">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="bg-nb-dark border-b border-nb-border px-4 md:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-nb-gray-500 hover:text-nb-white transition-colors text-lg">
            ☰
          </button>
          <div className="md:hidden" />
          <div className="hidden md:block" />
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-[12px] md:text-sm text-nb-gray-500 truncate max-w-[150px] md:max-w-none">{user?.email}</span>
            <button
              onClick={() => router.post('/logout')}
              className="text-[12px] md:text-sm text-nb-gray-500 hover:text-nb-red transition-colors flex-shrink-0"
            >
              Deconnexion
            </button>
          </div>
        </header>

        {/* Flash messages */}
        {flash?.success && (
          <div className="mx-4 md:mx-6 mt-4 p-3 bg-nb-green-muted border border-nb-green/20 text-nb-green rounded-lg text-sm">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mx-4 md:mx-6 mt-4 p-3 bg-nb-red-muted border border-nb-red/20 text-nb-red rounded-lg text-sm">
            {flash.error}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
