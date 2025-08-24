/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProject } from '../../api/projects'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import CommentForm from '../../features/comments/CommentForm'
import CommentsList from '../../features/comments/CommentsList'
import { CodeBracketIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
  })

  if (isLoading) return <LoadingSpinner fullScreen />
  if (isError) {
    toast.error('Error al cargar el proyecto')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">Error al cargar el proyecto</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700"
            >
              <div className="p-8">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {project?.title}
                  </h1>
                  <div className="flex gap-2">
                    {project?.gitHubUrl && (
                      <a
                        href={project.gitHubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <CodeBracketIcon className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {project?.discordUrl && (
                      <a
                        href={project.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        Discord
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project?.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Creado por</h3>
                    <p className="text-gray-600 dark:text-gray-300">{project?.ownerUsername}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Fecha de creación</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Desconocida'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tecnologías</h2>
              <div className="flex flex-wrap gap-3">
                {project?.tags.map((tag: any) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="hidden lg:block">
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Button
                  to="/dashboard"
                  variant="secondary"
                  className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
                >
                  Volver al Dashboard
                </Button>
                <Button
                  to="/explore"
                  variant="primary"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Explorar Proyectos
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700 sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Comentarios ({project?.comments.length})
                </h2>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <CommentForm projectId={id!} />
              <div className="mt-6 max-h-96 overflow-y-auto">
                <CommentsList comments={project?.comments || []} />
              </div>
            </motion.div>

            <div className="block lg:hidden">
               <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Button
                  to="/dashboard"
                  variant="secondary"
                  className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
                >
                  Volver al Dashboard
                </Button>
                <Button
                  to="/explore"
                  variant="primary"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Explorar Proyectos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectDetail