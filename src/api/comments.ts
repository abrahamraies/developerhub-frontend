import api from './axiosConfig'

export const getComment = async (id: string) => {
  const response = await api.get(`/comments/${id}`)
  return response.data
}

export const deleteComment = async (id: string) => {
  const response = await api.delete(`/comments/${id}`)
  return response.data
}

export const getProjectComments = async (projectId: string) => {
  const response = await api.get(`/comments/project/${projectId}`)
  return response.data
}

export const createComment = async (projectId: string, content: string) => {
  const response = await api.post(`/comments/project/${projectId}`, { content })
  return response.data
}

export const getUserComments = async (userId: string) => {
  const response = await api.get(`/comments/user/${userId}`)
  return response.data
}