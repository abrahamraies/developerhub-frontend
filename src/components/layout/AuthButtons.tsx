import useAuthStore from '../../stores/authStore'
import Button from '../ui/Button'

const AuthButtons = () => {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? (
    <Button
      to="/dashboard"
      variant="primary"
      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow hover:shadow-md transform hover:scale-[1.02] transition-all"
    >
      Dashboard
    </Button>
  ) : (
    <div className="flex items-center space-x-2">
      <Button
        to="/login"
        variant="secondary"
        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
      >
        Iniciar Sesión
      </Button>
      <Button
        to="/register"
        variant="primary"
        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow hover:shadow-md transform hover:scale-[1.02] transition-all"
      >
        Registrarse
      </Button>
    </div>
  )
}

export default AuthButtons