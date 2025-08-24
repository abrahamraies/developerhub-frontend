import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { applyTheme, getCurrentTheme } from '../../utils/theme'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark' | 'system') || 'system'
  })

  const currentTheme = getCurrentTheme()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }

  const renderIcon = () => {
    if (currentTheme === 'dark') {
      return <SunIcon className="h-5 w-5" />
    } else {
      return <MoonIcon className="h-5 w-5" />
    }
  }

  const label = {
    system: 'Sistema',
    light: 'Modo Claro',
    dark: 'Modo Oscuro',
  }[theme]

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 backdrop-blur-md border border-white/20 dark:border-white/20 transition-all duration-200 shadow-sm hover:shadow"
        aria-label={`Cambiar tema: actualmente ${label}`}
      >
        {renderIcon()}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
          {label}
        </span>
        <span className="flex sm:hidden w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
      </button>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Cambiar a {theme === 'light' ? 'oscuro' : theme === 'dark' ? 'sistema' : 'claro'}
      </div>
    </div>
  )
}

export default ThemeToggle