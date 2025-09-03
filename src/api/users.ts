import api from './axiosConfig'

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