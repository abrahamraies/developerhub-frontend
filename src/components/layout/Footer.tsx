import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-t border-white/20 dark:border-gray-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} DeveloperHub. Todos los derechos reservados.
        <div className="mt-2 space-x-4">
          <Link to="https://abrahamraies.github.io/Portfolio/" className="hover:underline">
            Sobre mi
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer