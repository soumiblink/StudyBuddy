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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Top Navigation */}
        <nav className="bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-teal-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/50">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  StudyBud
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Room
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-teal-500/50 transition-all"
                  >
                    {user?.username.charAt(0).toUpperCase()}
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-teal-500/30 py-2 z-20">
                        <div className="px-4 py-3 border-b border-teal-500/20">
                          <p className="font-semibold text-white">{user?.username}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => router.push('/profile')}
                          className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-teal-500/10 hover:text-teal-400 transition flex items-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition flex items-center gap-3"
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

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 py-8 animate-fade-in border-b border-teal-500/20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2 animate-slide-down">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-400 animate-slide-up">Discover and join study rooms or create your own</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900/50 py-6 border-b border-teal-500/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search study rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 shadow-lg text-white placeholder-gray-500 hover:border-teal-500/50 transform hover:scale-[1.01]"
                />
              </div>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-6 py-3 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 font-medium shadow-lg text-white cursor-pointer hover:border-teal-500/50 transform hover:scale-[1.01]"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Rooms</p>
                  <p className="text-3xl font-bold text-white">{rooms.length}</p>
                </div>
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">My Rooms</p>
                  <p className="text-3xl font-bold text-white">
                    {rooms.filter(r => r.host.id === user?.id).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Active Topics</p>
                  <p className="text-3xl font-bold text-white">{topics.length}</p>
                </div>
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Rooms Section */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-bold text-white mb-4">Study Rooms</h3>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500/20 border-t-teal-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 font-medium">Loading rooms...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 rounded-xl border border-teal-500/30">
                  <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-white mb-2">No rooms found</p>
                  <p className="text-gray-400">Create your first study room to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rooms.map((room, index) => (
                    <div
                      key={room.id}
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      className="bg-gray-800 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer p-5 border border-teal-500/30 hover:-translate-y-2 hover:border-teal-400 animate-fade-in-up group"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-white flex-1 pr-2 group-hover:text-teal-400 transition-colors duration-300">{room.name}</h3>
                        {room.topic && (
                          <span className="bg-teal-500/20 text-teal-400 text-xs px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transform transition-transform duration-300 group-hover:scale-110 border border-teal-500/30">
                            {room.topic.name}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-teal-500/20">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-teal-500/30">
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

            {/* Sidebar - Recent Activities */}
            <div className="space-y-6">
              {/* Recent Activities */}
              <div className="bg-gray-800 rounded-3xl p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {rooms.slice(0, 5).map((room) => (
                    <div key={room.id} className="flex items-start gap-3 pb-4 border-b border-teal-500/20 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-teal-500/30">
                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{room.name}</p>
                        <p className="text-xs text-gray-400">{room.message_count} messages</p>
                      </div>
                    </div>
                  ))}
                  {rooms.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
                  )}
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-gray-800 rounded-3xl p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.slice(0, 6).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.name)}
                      className="px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-full text-xs font-semibold hover:bg-teal-500/30 hover:shadow-md transition-all border border-teal-500/30"
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-teal-500/30">
              <h2 className="text-2xl font-bold mb-6 text-white">Create New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-teal-500/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-gray-500"
                    placeholder="e.g., Math Study Group"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-teal-500/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-gray-500"
                    rows={3}
                    placeholder="What's this room about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Topic</label>
                  <select
                    value={newRoom.topic_id}
                    onChange={(e) => setNewRoom({ ...newRoom, topic_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-teal-500/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-white"
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
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all font-semibold"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-600 transition-all font-semibold"
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
