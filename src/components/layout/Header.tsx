import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import AuthButtons from './AuthButtons'
// import ThemeToggle from '../ui/ThemeToggle'

const Header = () => {
  return (
    <header className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-b border-white/20 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-xl text-blue-600 dark:text-white">DeveloperHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* <ThemeToggle /> */}
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header