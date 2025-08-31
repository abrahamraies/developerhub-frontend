export type User = {
  id: string
  username: string
  email: string
  gitHubUrl: string | null
  discordUrl: string | null
  profileImageUrl: string
  role: 'User' | 'Moderator' | 'Admin'
}

export type Project = {
  id: string
  title: string
  description: string
  gitHubUrl: string
  discordUrl: string | null
  ownerId: string
  ownerUsername: string
  createdAt: string
  tags: string[]
  comments: Comment[]
}

export type UpdateProjectDto = {
  title?: string
  description?: string
  gitHubUrl?: string
  discordUrl?: string
  tags?: string[]
}

export type ProjectListItem = {
  id: string
  title: string
  description: string
  ownerId: string
  ownerUsername: string
  ownerProfileImageUrl: string | null
  createdAt: string
  commentCount: number
  tags: string[]
}

export type ProjectsResponse = {
  items: ProjectListItem[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

export type Comment = {
  id: string
  content: string
  userId: string
  username: string
  createdAt: string
}

export type Tag = {
  id: string
  name: string
}

export type UsersResponse = {
  items: User[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

export type LoginResponse = {
  id: string
  token: string
}

export type RegisterResponse = LoginResponse

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export type GitHubRepoDto = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  stargazers_count: number
  forks_count: number
}