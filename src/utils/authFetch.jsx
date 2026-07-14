import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

export function useAuthFetch() {
  const { token, logout } = useAuth()

  return useCallback(async (input, init = {}) => {
    const headers = new Headers(init.headers || {})

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    if (init.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(input, {
      ...init,
      headers,
    })

    if (response.status === 401) {
      logout()
    }

    return response
  }, [token, logout])
}
