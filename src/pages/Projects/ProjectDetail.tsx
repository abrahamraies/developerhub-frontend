import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProject } from "../../api/projects";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import CommentForm from "../../features/comments/CommentForm";
import CommentsList from "../../features/comments/CommentsList";
import {
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import useAuthStore from "../../stores/authStore";
import { useState } from "react";
import ConfirmModal from "../../components/modal/ConfirmModal";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(id!),
    onSuccess: () => {
      toast.success("Proyecto eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["exploreProjects"] });
      navigate("/projects");
    },
    onError: () => {
      toast.error("Error al eliminar el proyecto");
    },
  });

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const { id: currentUserId } = useAuthStore();

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError) {
    toast.error("Error al cargar el proyecto");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">
          Error al cargar el proyecto
        </p>
      </div>
    );
  }

  const isOwner = currentUserId === project?.ownerId;

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

                    <div className="flex flex-wrap gap-2">
                      {project?.gitHubUrl && (
                        <a
                          href={project.gitHubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                        >
                          <CodeBracketIcon className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project?.discordUrl && (
                        <a
                          href={project.discordUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors shadow-sm"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Discord</span>
                        </a>
                      )}
                      {isOwner && (
                        <Link
                          to={`/projects/${project?.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Editar</span>
                        </Link>
                      )}
                      {isOwner && (
                        <button
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm hover:from-red-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {deleteMutation.isPending ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                          <span>
                            {deleteMutation.isPending
                              ? "Eliminando..."
                              : "Eliminar"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {project?.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        Creado por
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {project?.ownerUsername}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        Fecha de creación
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {project?.createdAt
                          ? new Date(project.createdAt).toLocaleDateString()
                          : "Desconocida"}
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
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  Tecnologías
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project?.tags.map((tag: string) => (
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
                    to="/projects"
                    variant="secondary"
                    className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
                  >
                    Volver a tus proyectos
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
                    to="/projects"
                    variant="secondary"
                    className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-md"
                  >
                    Volver a tus proyectos
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

      {isOwner && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Eliminar proyecto"
          message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectDetail;
