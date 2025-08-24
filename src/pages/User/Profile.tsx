import { useQuery } from '@tanstack/react-query'
import { getMe } from '../../api/auth'
import { getProjects } from '../../api/projects'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'

const Profile = () => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
  })

  const { data: projectsData } = useQuery({
    queryKey: ['userProjects'],
    queryFn: () => getProjects(),
    enabled: !!user,
  })

  const projects = projectsData?.items || []

  if (userLoading) return <LoadingSpinner />
  console.log(user)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mx-auto">
            <img
              src={user?.profileImageUrl || `https://i.pravatar.cc/150?u=${user?.id}`}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mt-4">
            {user?.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{user?.email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</h3>
            <p className="text-gray-600 dark:text-gray-300">Proyectos</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</h3>
            <p className="text-gray-600 dark:text-gray-300">Colaboraciones</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">7</h3>
            <p className="text-gray-600 dark:text-gray-300">Contribuciones</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Información del Perfil</h2>
          </div>

          <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <strong className="text-gray-900 dark:text-white">Nombre de usuario:</strong>{' '}
              {user?.username}
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Email:</strong> {user?.email}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <Button
            to="/dashboard"
            variant="secondary"
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
          >
            Volver al Dashboard
          </Button>
          <Button
            to="/settings"
            variant="primary"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Editar Perfil
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile