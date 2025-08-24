import api from './axiosConfig'

export const getTags = async () => {
  const response = await api.get('/tags')
  return response.data
}

export const getTag = async (id: string) => {
  const response = await api.get(`/tags/${id}`)
  return response.data
}

export const getTagByName = async (name: string) => {
  const response = await api.get(`/tags/name/${name}`)
  return response.data
}

export const createTag = async (name: string) => {
  const response = await api.post('/tags', { name })
  return response.data
}

export const updateTag = async (id: string, name: string) => {
  const response = await api.put(`/tags/${id}`, { name })
  return response.data
}

export const deleteTag = async (id: string) => {
  const response = await api.delete(`/tags/${id}`)
  return response.data
}