import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse } from '../types'

type AuthState = {
  id: string | null
  token: string | null
  username: string | null
  email: string | null
  profileImageUrl: string | null
  role: string | null
  isAuthenticated: boolean
  login: (data: LoginResponse) => void
  logout: () => void
}


const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      token: null,
      username: null,
      email: null,
      profileImageUrl: null,
      role: null,
      isAuthenticated: false,
      login: (data) => set({
        id: data.id,
        token: data.token,
        isAuthenticated: true,
      }),
      logout: () => {
        set({
          id: null,
          token: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('github_access_token')
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore