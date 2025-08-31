export const isGitHubConnected = (): boolean => {
  return !!localStorage.getItem('github_access_token')
}