import api from './axiosConfig'

export const createComment = async (projectId: string, content: string) => {
  const response = await api.post(`/comments/project/${projectId}`, { content })
  return response.data
}

export const getUserComments = async (userId: string) => {
  const response = await api.get(`/comments/user/${userId}`)
  return response.data
}