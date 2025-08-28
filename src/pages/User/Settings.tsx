import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/users";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// import ThemeToggle from "../../components/ui/ThemeToggle";
import useAuthStore from "../../stores/authStore";
import { getMe } from "../../api/auth";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Nombre de usuario es requerido")
    .max(50, "Máximo 50 caracteres"),
  profileImageUrl: yup.string().url("URL inválida").default(null),
});
type FormData = yup.InferType<typeof schema>;

const Settings = () => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
  const navigate = useNavigate();
  const { id, isAuthenticated } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user?.username || "",
      profileImageUrl: user?.profileImageUrl || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!id) throw new Error("No hay ID de usuario");
      return updateUser(id, {
        username: data.username,
        profileImageUrl: data.profileImageUrl,
      });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      toast.success("Perfil actualizado correctamente");

      navigate("/profile");
    },
    onError: (error) => {
      toast.error("Error al actualizar el perfil");
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (!isAuthenticated) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Ajustes del Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Actualiza tu información personal
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 p-6 space-y-6"
        >
          <Input
            label="Nombre de usuario"
            id="username"
            placeholder="tu_usuario"
            {...register("username")}
            error={errors.username?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <Input
            label="URL de la foto de perfil (opcional)"
            type="url"
            {...register("profileImageUrl")}
            placeholder="https://ejemplo.com/tu-foto.jpg"
            error={errors.profileImageUrl?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Integración con GitHub
            </label>
            {localStorage.getItem("github_access_token") ? (
              <Button
                variant="secondary"
                className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                to="/import/github"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Importar desde GitHub
              </Button>
            ) : (
              <a
                href="https://localhost:7265/api/auth/github"
                className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm transition-colors rounded-lg"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Conectar con GitHub
              </a>
            )}
          </div>

          {/* Para aplicar mas adelante */}
          {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tema de la interfaz
            </label>
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div> */}

          <div className="flex flex-wrap gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              to="/profile"
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Guardar Cambios
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            ¿Quieres cambiar tu contraseña?{" "}
            <Link
              to="/settings/password"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Cambiar contraseña
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
