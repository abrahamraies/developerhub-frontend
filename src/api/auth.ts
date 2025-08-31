import api from './axiosConfig'
import type { LoginResponse, RegisterResponse, User, ChangePasswordData } from '../types'
import type { AxiosError } from 'axios'

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password })
    return response.data
  } catch (error) {
    const apiError = error as AxiosError
    throw apiError
  }
}

export const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', { username, email, password })
    return response.data
  } catch (error) {
    const apiError = error as AxiosError
    throw apiError
  }
}

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email })
}

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await api.post('/auth/reset-password', { token, newPassword })
}

export const changePassword = async (data: ChangePasswordData) => {
  const response = await api.post('/auth/change-password', data)
  return response.data
}

export const exchangeCodeForToken = async (code: string) => {
  const response = await api.post('/auth/github/callback', { code })
  return response.data
}

export const verifyEmail = async (token: string) => {
  const response = await api.get('/auth/verify-email', {
    params: { token }
  })
  return response.data
}

export const resendVerificationEmail = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email })
  return response.data
}