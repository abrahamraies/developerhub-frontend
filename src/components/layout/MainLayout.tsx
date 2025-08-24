import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const hideSidebarPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']

type MainLayoutProps = {
  children: ReactNode
  hideHeader?: boolean
  hideFooter?: boolean
}

const MainLayout = ({ children, hideHeader = false, hideFooter = false }: MainLayoutProps) => {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const showSidebar = isAuthenticated && !hideSidebarPaths.includes(location.pathname)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showSidebar && <Sidebar />}

      <div className={showSidebar ? 'flex-1 md:ml-64' : 'w-full'}>
        {!hideHeader && <Header />}
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}

export default MainLayout