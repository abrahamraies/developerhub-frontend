import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../api/projects";
import ProjectCard from "../../features/projects/ProjectCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import type { ProjectsResponse } from "../../types";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getMe } from "../../api/auth";
import { isGitHubConnected } from "../../utils/github";
import GitHubImportButton from "../../components/modal/GitHubImportButton";

const Projects = () => {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery<ProjectsResponse>({
    queryKey: ["projects", page],
    queryFn: () => getUserProjects(user!.id, page),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError) {
    toast.error("Error al cargar proyectos");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">
          Error al cargar proyectos
        </p>
      </div>
    );
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

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Proyectos Creados
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver al dashboard
            </Button>

            <Link to="/projects/create">
              <Button
                variant="primary"
                className="cursor-pointer px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                + Nuevo Proyecto
              </Button>
            </Link>

            {isGitHubConnected() && (
              <GitHubImportButton>Importar desde GitHub</GitHubImportButton>
            )}
          </div>
        </motion.div>

        {data?.items && data.items.length > 0 ? (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {data.items.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                variant="secondary"
                className="px-4 py-2 text-sm"
              >
                ← Anterior
              </Button>
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Página {page} de {Math.ceil((data.totalCount || 0) / 10)}
              </span>
              <Button
                onClick={() => setPage((old) => old + 1)}
                disabled={
                  !data.items || page >= Math.ceil((data.totalCount || 0) / 10)
                }
                variant="secondary"
                className="px-4 py-2 text-sm"
              >
                Siguiente →
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h8a2 2 0 012 2v2M5 11H3m18 0h-2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              No hay proyectos aún
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Sé el primero en crear un proyecto y compartirlo con la comunidad.
            </p>
            <Link to="/projects/create">
              <Button
                variant="primary"
                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Crear tu primer proyecto
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
