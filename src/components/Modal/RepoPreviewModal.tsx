import { useEffect, useState } from 'react'
import { getGitHubRepo } from '../../api/github'
import { toast } from 'react-hot-toast'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import { motion } from 'framer-motion'
import type { GitHubRepoDto } from '../../types'

const RepoPreviewModal = ({ 
  owner, 
  repoName, 
  accessToken, 
  onClose, 
  onImport 
}: { 
  owner: string;
  repoName: string;
  accessToken: string;
  onClose: () => void;
  onImport: () => void;
}) => {
  const [repo, setRepo] = useState<GitHubRepoDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const data = await getGitHubRepo(owner, repoName, accessToken)
        setRepo(data)
      } catch (error) {
        toast.error('Error al cargar el repositorio')
        console.error(error)
        onClose()
      } finally {
        setLoading(false)
      }
    }
    fetchRepo()
  }, [owner, repoName, accessToken, onClose])

  if (loading) return <LoadingSpinner />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{repo?.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              &times;
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{repo?.description}</p>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div><strong>Lenguaje:</strong> {repo?.language || 'No especificado'}</div>
            <div><strong>Estrellas:</strong> {repo?.stargazers_count}</div>
            <div><strong>Forks:</strong> {repo?.forks_count}</div>
            <div><strong>URL:</strong> <a href={repo?.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{repo?.html_url}</a></div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {repo?.topics.map(topic => (
              <span
                key={topic}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onImport()
              onClose()
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Importar Proyecto
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RepoPreviewModal