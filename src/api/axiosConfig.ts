import axios from 'axios'
import { toast } from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import type { ApiError } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7265/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Sesión expirada, por favor inicia sesión nuevamente')
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } else if (error.response?.data) {
      const apiError = error.response.data as ApiError
      toast.error(apiError.Message || 'Error en la solicitud')
    }
    return Promise.reject(error)
  }
)

export default api