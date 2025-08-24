import api from './axiosConfig'
import type { Project, ProjectsResponse, ProjectListItem } from '../types'

export const getProjects = async (
  page = 1,
  size = 10,
  filters: { search?: string; tags?: string[] } = {}
): Promise<ProjectsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.tags && filters.tags.length > 0 && { tags: filters.tags.join(',') })
  })

  const response = await api.get<ProjectsResponse>(`/projects?${params}`)
  return response.data
}

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`)
  return response.data
}

export const createProject = async (data: {
  title: string
  description: string
  gitHubUrl: string
  discordUrl?: string
  tags: string[]
}): Promise<Project> => {
  const response = await api.post<Project>('/projects', data)
  return response.data
}

export const updateProject = async (id: string, data: {
  title?: string
  description?: string
  gitHubUrl?: string
  discordUrl?: string
  tags?: string[]
}): Promise<void> => {
  await api.put(`/projects/${id}`, data)
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`)
}

export const getUserProjects = async (userId: string, pageNumber = 1, pageSize = 10): Promise<ProjectListItem[]> => {
  const response = await api.get<ProjectListItem[]>(`/projects/user/${userId}`, {
    params: { pageNumber, pageSize }
  })
  return response.data
}

export const getProjectsByTag = async (tagName: string, pageNumber = 1, pageSize = 10): Promise<ProjectListItem[]> => {
  const response = await api.get<ProjectListItem[]>(`/projects/tag/${tagName}`, {
    params: { pageNumber, pageSize }
  })
  return response.data
}