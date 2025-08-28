import type { GitHubRepoDto } from '../types'
import api from './axiosConfig'


export const importGitHubRepo = async (owner: string, repoName: string) => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}')
  const token = authStorage?.state?.token ?? authStorage?.token

  const response = await api.post('/auth/github/import', null, {
    params: { owner, repoName },
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
  return response.data
}

export const getGitHubRepos = async (accessToken: string) => {
  const response = await api.get('/auth/github/repos', {
    params: { token: accessToken }
  })
  return response.data as GitHubRepoDto[]
}