import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ProjectListItem } from "../../types";

const ProjectCard = ({ project }: { project: ProjectListItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <Link to={`/projects/${project.id}`} className="block group">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {project.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center space-x-2">
          <img
            src={
              project.ownerProfileImageUrl ||
              `https://i.pravatar.cc/150?u=${project.ownerUsername}`
            }
            alt={project.ownerUsername}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 dark:ring-blue-400/30"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Por {project.ownerUsername}
          </span>
        </div>

        {project.description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium border border-blue-200 dark:border-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          <span>
            {project.commentCount}{" "}
            {project.commentCount === 1 ? "comentario" : "comentarios"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
