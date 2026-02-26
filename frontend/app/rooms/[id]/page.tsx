'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { roomService, Room } from '@/services/roomService'
import { authService } from '@/lib/auth'

interface ChatMessage {
  id: number
  user_id: number
  username: string
  message: string
  created: string
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = parseInt(params.id as string)
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = authService.getCurrentUser()

  useEffect(() => {
    loadRoom()
    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadRoom = async () => {
    try {
      const roomData = await roomService.getRoom(roomId)
      setRoom(roomData)
      
      const messagesData = await roomService.getMessages(roomId)
      setMessages(
        messagesData.map((msg) => ({
          id: msg.id,
          user_id: msg.user.id,
          username: msg.user.username,
          message: msg.body,
          created: msg.created,
        }))
      )
    } catch (error) {
      console.error('Failed to load room:', error)
      router.push('/dashboard')
    }
  }

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/`
    const websocket = new WebSocket(wsUrl)

    websocket.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message_id,
            user_id: data.user_id,
            username: data.username,
            message: data.message,
            created: data.created,
          },
        ])
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    setWs(websocket)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !ws || !user || !connected) return

    ws.send(
      JSON.stringify({
        type: 'message',
        message: newMessage,
        user_id: user.id,
      })
    )

    setNewMessage('')
  }

  const handleDeleteRoom = async () => {
    if (!room || !confirm('Are you sure you want to delete this room?')) return

    try {
      await roomService.deleteRoom(roomId)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to delete room:', error)
    }
  }

  if (!room) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
            <div className="text-gray-700 text-lg font-semibold">Loading room...</div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-violet-50 rounded-xl transition-all"
                  title="Back to dashboard"
                >
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    {room.name}
                    <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
                      connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                      {connected ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {room.host.username}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg className="w-4 h-4 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {room.participant_count} online
                    </span>
                  </div>
                </div>
              </div>
              
              {user?.id === room.host.id && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-violet-50 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20">
                        <button
                          onClick={handleDeleteRoom}
                          className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3 font-semibold"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Room
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-800 text-xl font-bold mb-2">No messages yet</p>
                <p className="text-gray-600">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-lg px-5 py-3.5 rounded-3xl shadow-md ${
                      msg.user_id === user?.id
                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                    }`}
                  >
                    <div className={`text-xs font-bold mb-1.5 ${
                      msg.user_id === user?.id ? 'text-violet-100' : 'text-violet-600'
                    }`}>
                      {msg.username}
                    </div>
                    <div className="break-words text-base leading-relaxed">{msg.message}</div>
                    <div className={`text-xs mt-1.5 ${
                      msg.user_id === user?.id ? 'text-violet-200' : 'text-gray-500'
                    }`}>
                      {new Date(msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white/90 backdrop-blur-md px-6 py-5 shadow-xl border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={connected ? "Type your message..." : "Connecting..."}
                  disabled={!connected}
                  className="w-full px-6 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-full focus:ring-4 focus:ring-violet-200 focus:border-violet-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-base"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={!connected || !newMessage.trim()}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center gap-2 font-bold text-base"
              >
                <span>Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
