'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Gamepad2, 
  Zap,
  User,
  ChevronDown
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Teambuilder', href: '/dashboard/teambuilder', icon: Gamepad2 },
    // { name: 'Intercambios', href: '/dashboard/trades', icon: Zap }, // Future
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-black tracking-tight text-white hover:opacity-90 transition-opacity">
                PK<span className="text-pokemon-blue">DeX</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4 items-center">
              {navLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 max-w-xs bg-slate-800 rounded-full py-1.5 pl-4 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-pokemon-blue border border-white/10 hover:border-white/30 transition-all"
                >
                  <span className="text-gray-300 font-medium truncate max-w-[150px]">
                    {userEmail || 'Entrenador'}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pokemon-blue to-blue-600 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown */}
              {isUserMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold ${
                    isActive(item.href)
                      ? 'bg-pokemon-blue text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-4 border-t border-white/10"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
