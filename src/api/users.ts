import api from './axiosConfig'

export const getUsers = async (page = 1, size = 10) => {
  const response = await api.get('/users', {
    params: { page, size }
  })
  return response.data
}

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const updateUser = async (id: string, data: {
  username?: string
  email?: string
  gitHubUrl?: string
  discordUrl?: string
  profileImageUrl?: string
  role?: number
}) => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const updateUserRole = async (userId: string, role: number) => {
  const response = await api.put(`/users/${userId}/role`, { role })
  return response.data
}