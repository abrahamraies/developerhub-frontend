export const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = window.document.documentElement
  
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) root.classList.add('dark')
    else root.classList.add('light')
    localStorage.setItem('theme', 'system')
  } else {
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }
}

export const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme === 'system' || !savedTheme) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  
  return savedTheme as 'light' | 'dark'
}