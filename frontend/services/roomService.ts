import api from '@/lib/api'

export interface Topic {
  id: number
  name: string
  room_count?: number
}

export interface Room {
  id: number
  name: string
  description: string
  host: {
    id: number
    username: string
    email: string
  }
  topic: Topic | null
  participants: any[]
  message_count: number
  participant_count: number
  created: string
  updated: string
}

export interface Message {
  id: number
  user: {
    id: number
    username: string
    email: string
  }
  room: number
  body: string
  created: string
  updated: string
}

export const roomService = {
  async getRooms(search?: string, topic?: string): Promise<Room[]> {
    const params = new URLSearchParams()
    if (search) params.append('q', search)
    if (topic) params.append('topic', topic)
    
    const response = await api.get(`/v1/rooms/?${params.toString()}`)
    // Handle paginated response
    return response.data.results || response.data
  },

  async getRoom(id: number): Promise<Room> {
    const response = await api.get(`/v1/rooms/${id}/`)
    return response.data
  },

  async createRoom(data: { name: string; description: string; topic_id?: number }): Promise<Room> {
    const response = await api.post('/v1/rooms/', data)
    return response.data
  },

  async updateRoom(id: number, data: Partial<Room>): Promise<Room> {
    const response = await api.put(`/v1/rooms/${id}/`, data)
    return response.data
  },

  async deleteRoom(id: number): Promise<void> {
    await api.delete(`/v1/rooms/${id}/`)
  },

  async joinRoom(id: number): Promise<void> {
    await api.post(`/v1/rooms/${id}/join/`)
  },

  async leaveRoom(id: number): Promise<void> {
    await api.post(`/v1/rooms/${id}/leave/`)
  },

  async getTopics(): Promise<Topic[]> {
    const response = await api.get('/v1/topics/')
    // Handle paginated response
    return response.data.results || response.data
  },

  async createTopic(name: string): Promise<Topic> {
    const response = await api.post('/v1/topics/', { name })
    return response.data
  },

  async getMessages(roomId: number): Promise<Message[]> {
    const response = await api.get(`/v1/messages/?room=${roomId}`)
    // Handle paginated response
    return response.data.results || response.data
  },

  async sendMessage(roomId: number, body: string): Promise<Message> {
    const response = await api.post('/v1/messages/', { room: roomId, body })
    return response.data
  },
}
