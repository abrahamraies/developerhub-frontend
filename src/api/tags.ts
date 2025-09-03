import api from './axiosConfig'

export const getTags = async () => {
  const response = await api.get('/tags')
  return response.data
}