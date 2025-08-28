import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGitHubRepos, importGitHubRepo } from "../../api/github";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getMe } from "../../api/auth";

const ImportGitHubProjects = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("github_access_token");
    if (token) {
      setAccessToken(token);
    } else {
      toast.error("Conéctate con GitHub primero");
      navigate("/settings");
    }
  }, [navigate]);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
  
  const { data: repos, isLoading } = useQuery({
    queryKey: ["githubRepos", accessToken],
    queryFn: () => getGitHubRepos(accessToken!),
    enabled: !!accessToken,
  });

  const handleImport = async (owner: string, repoName: string) => {
    try {
      const project = await importGitHubRepo(owner, repoName);
      toast.success("Proyecto importado exitosamente");
      navigate(`/projects/${project.id}`);
    } catch (error) {
      toast.error("Error al importar el proyecto");
      console.log(error);
    }
  };

  if (!user) return <LoadingSpinner />;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Importar desde GitHub
        </h1>
        <Link to="/settings">
          <Button variant="secondary">Volver a Ajustes</Button>
        </Link>
      </div>

      {repos && repos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No tienes repositorios públicos en GitHub.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {repos?.map((repo) => {
            const [owner, repoName] = repo.full_name.split("/");
            return (
              <div
                key={repo.id}
                className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-md border border-white/20 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {repo.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {repo.language && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 rounded-lg text-sm">
                          {repo.language}
                        </span>
                      )}
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleImport(owner, repoName)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                  >
                    Importar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImportGitHubProjects;
