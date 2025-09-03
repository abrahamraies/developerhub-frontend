import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projects";
import ProjectCard from "../features/projects/ProjectCard";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { ProjectsResponse, Tag } from "../types";
import { getTags } from "../api/tags";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data: tags = [], isLoading: tagsLoading } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const { data, isLoading, isError } = useQuery<ProjectsResponse>({
    queryKey: ["exploreProjects", page, search, selectedTags],
    queryFn: () => getProjects(page, 10, { search, tags: selectedTags }),
    placeholderData: (prev) => prev,
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setPage(1);
  };

  if (isLoading && page === 1) return <LoadingSpinner fullScreen />;

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">
          Error al cargar proyectos
        </p>
      </div>
    );

  const projects = data?.items || [];
  const hasProjects = projects.length > 0;
  const totalPages = Math.ceil((data?.totalCount || 0) / 10);

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
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
              Explorar Proyectos
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Descubre proyectos interesantes y colabora con la comunidad
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            onMouseDown={(e: { preventDefault: () => void }) => {
              if (window.history.length === 1) {
                e.preventDefault();
                navigate("/dashboard");
              }
            }}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 p-6 mb-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar proyectos
            </label>
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="w-full bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filtrar por tecnologías
            </label>
            {tagsLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cargando tags...
              </p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay tags disponibles
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag.name)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            {(search || selectedTags.length > 0) && (
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="text-sm px-4 py-2"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {!hasProjects ? (
            <div className="text-center py-16">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                No se encontraron proyectos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta ajustar tu búsqueda o filtros.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  ← Anterior
                </Button>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Página {page} de {totalPages || 1}
                </span>
                <Button
                  onClick={() => setPage((old) => old + 1)}
                  disabled={page >= totalPages}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  Siguiente →
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Explore;
