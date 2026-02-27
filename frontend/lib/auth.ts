import api from './api'
import { jwtDecode } from 'jwt-decode'

export interface User {
  id: number
  username: string
  email: string
  name?: string
  bio?: string
  avatar?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export const authService = {
  async register(username: string, email: string, password: string, password2: string, name?: string): Promise<AuthResponse> {
    const response = await api.post('/v1/auth/register/', { username, email, password, password2, name })
    const { access, refresh, user } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/v1/auth/login/', { email, password })
    const { access, refresh } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    
    const userResponse = await api.get('/v1/profile/')
    const user = userResponse.data
    localStorage.setItem('user', JSON.stringify(user))
    
    return { access, refresh, user }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token')
    if (!token) return false

    try {
      const decoded: any = jwtDecode(token)
      return decoded.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/v1/profile/')
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/v1/profile/update/', data)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  },
}
