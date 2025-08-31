import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getGitHubRepos, importGitHubRepo, getGitHubRepo } from "../../api/github"
import { toast } from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { getMe } from "../../api/auth"
import { motion } from "framer-motion"
import type { AxiosError } from "axios"
import type { GitHubRepoDto } from "../../types"

const ImportGitHubProjects = () => {
  const [selectedRepo, setSelectedRepo] = useState<{
    owner: string
    repoName: string
  } | null>(null)
  const [previewData, setPreviewData] = useState<GitHubRepoDto | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("github_access_token")
    if (token) {
      setAccessToken(token)
    } else {
      toast.error("Conéctate con GitHub primero")
      navigate("/settings")
    }
  }, [navigate])

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  })

  const { data: repos, isLoading: reposLoading } = useQuery({
    queryKey: ["githubRepos", accessToken],
    queryFn: () => getGitHubRepos(accessToken!),
    enabled: !!accessToken,
  })

  useEffect(() => {
    if (selectedRepo && accessToken) {
      const loadPreview = async () => {
        setIsPreviewLoading(true)
        try {
          const data = await getGitHubRepo(selectedRepo.owner, selectedRepo.repoName, accessToken)
          setPreviewData(data)
        } catch (error) {
          toast.error("Error al cargar el repositorio")
          console.error("Error al cargar el repositorio:", error)
          setSelectedRepo(null)
        } finally {
          setIsPreviewLoading(false)
        }
      }
      loadPreview()
    }
  }, [selectedRepo, accessToken])

  const handleImport = async (owner: string, repoName: string) => {
    try {
      const project = await importGitHubRepo(owner, repoName)
      toast.success("Proyecto importado exitosamente")
      navigate(`/projects/${project.id}`)
    } catch (err) {
      const error = err as AxiosError
      console.error("Error al importar:", error)
      toast.error(error.message || "Error al importar el proyecto")
    } finally {
      setSelectedRepo(null) // Cerrar modal
    }
  }

  if (!user) return <LoadingSpinner fullScreen />
  if (reposLoading) return <LoadingSpinner fullScreen />

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-700/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Importar desde GitHub
            </h1>
            <Link to="/settings">
              <Button variant="secondary" className="px-4 py-2 text-sm">
                Volver a Ajustes
              </Button>
            </Link>
          </motion.div>

          {repos && repos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No tienes repositorios públicos</h3>
              <p className="text-gray-500 dark:text-gray-400">Intenta crear uno o cambiar la visibilidad.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {repos?.map((repo) => {
                const [owner, repoName] = repo.full_name.split("/")
                return (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{repo.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{repo.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {repo.language && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600">
                              {repo.language}
                            </span>
                          )}
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:flex-row md:items-start">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedRepo({ owner, repoName })}
                          className="cursor-pointer md:self-start px-4 py-2 text-sm"
                        >
                          Previsualizar
                        </Button>
                        <Button
                          onClick={() => handleImport(owner, repoName)}
                          className="cursor-pointer md:self-start px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                        >
                          Importar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </motion.div>

      {selectedRepo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRepo(null)}
        >
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {isPreviewLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
              </div>
            ) : previewData ? (
              <>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{previewData.name}</h2>
                    <button
                      onClick={() => setSelectedRepo(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                      &times;
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{previewData.description}</p>

                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div><strong>Lenguaje:</strong> {previewData.language || 'No especificado'}</div>
                    <div><strong>Estrellas:</strong> {previewData.stargazers_count}</div>
                    <div><strong>Forks:</strong> {previewData.forks_count}</div>
                    <div><strong>URL:</strong> <a href={previewData.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{previewData.html_url}</a></div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {previewData.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <Button variant="secondary" className="cursor-pointer" onClick={() => setSelectedRepo(null)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleImport(selectedRepo.owner, selectedRepo.repoName)}
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Importar Proyecto
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No se pudo cargar la previsualización.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImportGitHubProjects