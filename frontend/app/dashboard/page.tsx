'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { roomService, Room, Topic } from '@/services/roomService'
import { authService } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const user = authService.getCurrentUser()
  const [rooms, setRooms] = useState<Room[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: '', description: '', topic_id: '' })

  useEffect(() => {
    loadData()
  }, [searchTerm, selectedTopic])

  const loadData = async () => {
    try {
      const [roomsData, topicsData] = await Promise.all([
        roomService.getRooms(searchTerm, selectedTopic),
        roomService.getTopics(),
      ])
      setRooms(roomsData)
      setTopics(topicsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const roomData = {
        name: newRoom.name,
        description: newRoom.description,
        topic_id: newRoom.topic_id ? parseInt(newRoom.topic_id) : undefined,
      }
      await roomService.createRoom(roomData)
      setShowCreateModal(false)
      setNewRoom({ name: '', description: '', topic_id: '' })
      loadData()
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  StudyBud
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full hover:shadow-lg transition-all hover:scale-105 font-semibold"
                >
                  + Create Room
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition-all"
                  >
                    {user?.username.charAt(0).toUpperCase()}
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user?.username}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => router.push('/profile')}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-violet-50 transition flex items-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search study rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
              />
            </div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all font-medium"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rooms Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl">
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">No rooms found</p>
              <p className="text-gray-600">Create your first study room to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => router.push(`/rooms/${room.id}`)}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-2xl transition-all cursor-pointer p-6 border border-gray-100 hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{room.name}</h3>
                    {room.topic && (
                      <span className="bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 text-xs px-3 py-1 rounded-full font-semibold">
                        {room.topic.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {room.host.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{room.host.username}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {room.message_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {room.participant_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Create New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                    placeholder="e.g., Math Study Group"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                    rows={3}
                    placeholder="What's this room about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                  <select
                    value={newRoom.topic_id}
                    onChange={(e) => setNewRoom({ ...newRoom, topic_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-2xl hover:shadow-lg transition-all font-semibold"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl hover:bg-gray-200 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
