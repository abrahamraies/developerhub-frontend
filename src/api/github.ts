import type { GitHubRepoDto } from '../types'
import api from './axiosConfig'


export const importGitHubRepo = async (owner: string, repoName: string) => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}')
  const devHubToken = authStorage?.state?.token ?? authStorage?.token

  const githubToken = localStorage.getItem('github_access_token')

  if (!devHubToken) {
    throw new Error('No estás autenticado en DeveloperHub')
  }

  if (!githubToken) {
    throw new Error('No tienes una conexión con GitHub')
  }

  const response = await api.post('/auth/github/import', null, {
    params: {
      owner,
      repoName,
      token: githubToken
    },
    headers: {
      Authorization: `Bearer ${devHubToken}`
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

export const getGitHubRepo = async (owner: string, repoName: string, accessToken: string) => {
  const response = await api.get('/auth/github/repo', {
    params: { owner, repoName, token: accessToken }
  })
  return response.data as GitHubRepoDto
}