import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../../api/auth";
import useAuthStore from "../../../stores/authStore";
import { toast } from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email es requerido"),
  password: yup.string().required("Contraseña es requerida"),
});

type FormData = yup.InferType<typeof schema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data.email, data.password);

      useAuthStore.getState().login(response);

      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 403) {
        toast.error("Debes verificar tu email antes de iniciar sesión");
      } else if (error.response?.status === 401) {
        toast.error("Credenciales inválidas");
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="tu@email.com"
        {...register("email")}
        error={errors.email?.message}
        className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
      />

      <Input
        label="Contraseña"
        id="password"
        type="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
        className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
      />

      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        className="cursor-pointer w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 
                  transform hover:scale-[1.02] transition-all duration-200
                  shadow-md hover:shadow-lg"
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;
