'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { authService, User } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ username: '', name: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const userData = await authService.getProfile()
      setUser(userData)
      setFormData({ 
        username: userData.username, 
        name: userData.name || '',
        bio: userData.bio || '' 
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const updatedUser = await authService.updateProfile(formData)
      setUser(updatedUser)
      setEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Back to Dashboard</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            My Profile
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl font-medium ${
              message.includes('success') 
                ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                : 'bg-red-100 text-red-700 border-2 border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8 pb-8 border-b border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>

            {!editing ? (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <p className="text-lg text-gray-900">{user.name || 'Not set'}</p>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Bio</label>
                  <p className="text-lg text-gray-900 leading-relaxed">{user.bio || 'No bio yet'}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl hover:shadow-lg transition-all font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setFormData({ 
                        username: user.username, 
                        name: user.name || '',
                        bio: user.bio || '' 
                      })
                    }}
                    className="flex-1 px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
