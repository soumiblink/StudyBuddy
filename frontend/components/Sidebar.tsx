'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          StudyBud
        </h1>
        <p className="text-sm text-gray-400 mt-1">Welcome, {user?.username}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
