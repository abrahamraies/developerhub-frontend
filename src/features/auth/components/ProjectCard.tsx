import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../../../types'

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Link to={`/projects/${project.id}`} className="block">
            <h3 className="text-lg font-medium hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {project.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const ProjectCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex gap-2">
            <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard