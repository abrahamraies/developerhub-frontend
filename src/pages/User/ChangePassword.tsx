import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/auth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Contraseña actual es requerida"),
  newPassword: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial")
    .required("Nueva contraseña es requerida"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required("Confirma la nueva contraseña"),
});

type FormData = yup.InferType<typeof schema>;

const ChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      navigate("/settings");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error?.response?.data?.message || "Error al cambiar la contraseña";
      toast.error(message);
      console.error(error);
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

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

      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Cambiar Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Protege tu cuenta con una contraseña segura
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
            label="Contraseña Actual"
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <Input
            label="Nueva Contraseña"
            id="newPassword"
            type="password"
            placeholder="••••••••"
            {...register("newPassword")}
            error={errors.newPassword?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <Input
            label="Confirmar Nueva Contraseña"
            id="confirmNewPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmNewPassword")}
            error={errors.confirmNewPassword?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <div className="flex flex-wrap gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              to="/settings"
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Actualizar Contraseña
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-blue-50/30 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300"
        >
          <strong>La contraseña debe:</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Tener al menos 8 caracteres</li>
            <li>Una letra mayúscula (A-Z)</li>
            <li>Una letra minúscula (a-z)</li>
            <li>Un número (0-9)</li>
            <li>Un carácter especial (!@#$%)</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChangePassword;
