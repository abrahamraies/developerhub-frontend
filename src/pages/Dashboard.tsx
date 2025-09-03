import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";
import { getUserProjects } from "../api/projects";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import MainLayout from "../components/layout/MainLayout";
import type { ProjectListItem } from "../types";
import { Link } from "react-router-dom";
import { isGitHubConnected } from "../utils/github";
import GitHubImportButton from "../components/modal/GitHubImportButton";

const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['userProjects'],
    queryFn: () => getUserProjects(user!.id),
    enabled: !!user,
  })

  const projects = projectsData?.items || []

  if (userLoading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-purple-400">
            Bienvenido, {user?.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Tu centro de control en DeveloperHub
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {projects.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Tus Proyectos</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔍</h3>
            <p className="text-gray-600 dark:text-gray-300">Descubre nuevos proyectos en la comunidad</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">💬</h3>
            <p className="text-gray-600 dark:text-gray-300">Conéctate con otros devs en Discord</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Tus Proyectos
              </h2>
              {isGitHubConnected() && (
                <GitHubImportButton>Importar desde GitHub</GitHubImportButton>
              )}
            </div>
          </div>

          <div className="p-6">
            {projectsLoading ? (
              <p className="text-gray-500 dark:text-gray-400">
                Cargando proyectos...
              </p>
            ) : projects.length > 0 ? (
                <ul className="space-y-4">
                  {projects.map((project: ProjectListItem) => (
                    <li
                      key={project.id}
                      className="p-5 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <Link to={`/projects/${project.id}`} className="block">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-white hover:underline">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-5">
                  No tienes proyectos aún.
                </p>
                <Button
                  variant="primary"
                  to="/projects/create"
                  className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow"
                >
                  Crear tu primer proyecto
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <Button
            to="/explore"
            variant="secondary"
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
          >
            Explorar Proyectos
          </Button>
          <Button
            to="/profile"
            variant="primary"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Ver Perfil
          </Button>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;