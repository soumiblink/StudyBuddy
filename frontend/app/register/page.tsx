'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await authService.register(formData.username, formData.email, formData.password, formData.password2, formData.name)
      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = err.response?.data
      if (typeof errorMsg === 'object') {
        setError(Object.values(errorMsg).flat().join(' '))
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-600 via-purple-600 to-violet-600 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent mb-2">
            Join StudyBud
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-200 focus:border-fuchsia-400 transition-all"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-200 focus:border-fuchsia-400 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-200 focus:border-fuchsia-400 transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-200 focus:border-fuchsia-400 transition-all"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-200 focus:border-fuchsia-400 transition-all"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-4 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mt-6"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-fuchsia-600 hover:text-violet-600 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
