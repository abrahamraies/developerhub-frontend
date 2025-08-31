import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProject } from "../../api/projects";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TagsInput from "./TagsInput";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const schema = yup
  .object()
  .shape({
    title: yup
      .string()
      .required("El título es requerido")
      .max(100, "El título no puede exceder 100 caracteres"),
    description: yup
      .string()
      .required("La descripción es requerida")
      .max(1000, "La descripción no puede exceder 1000 caracteres"),
    gitHubUrl: yup
      .string()
      .required("La URL de GitHub es requerida")
      .url("URL de GitHub inválida"),
    discordUrl: yup
      .string()
      .url("URL de Discord inválida")
      .nullable()
      .default(null),
    tags: yup
      .array()
      .of(yup.string().required())
      .min(1, "Al menos una etiqueta es requerida")
      .max(10)
      .required(),
  })
  .required();

type FormData = {
  title: string;
  description: string;
  gitHubUrl: string;
  discordUrl: string | null;
  tags: string[];
};

const CreateProjectForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const navigate = useNavigate();

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      discordUrl: null,
      tags: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        gitHubUrl: data.gitHubUrl,
        discordUrl: data.discordUrl || undefined,
        tags: data.tags,
      };

      await createProject(projectData);
      toast.success("Proyecto creado exitosamente");
      onSuccess?.();
      navigate("/projects");
    } catch (err) {
      const error = err as AxiosError;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendMessage = (error.response?.data as any)?.message;
      toast.error(backendMessage || "Error al crear proyecto");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Título del proyecto"
          {...register("title")}
          error={errors.title?.message}
          placeholder="Ej: Mi app de tareas"
          className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
        />

        <Input
          label="Descripción"
          as="textarea"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Describe tu proyecto, su propósito y tecnologías usadas..."
          className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
        />

        <Input
          label="URL de GitHub"
          type="text"
          {...register("gitHubUrl")}
          error={errors.gitHubUrl?.message}
          placeholder="https://github.com/usuario/proyecto"
          className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
        />

        <Input
          label="URL de Discord (opcional)"
          type="url"
          {...register("discordUrl")}
          error={errors.discordUrl?.message}
          placeholder="https://discord.gg/..."
          className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
        />

        <TagsInput name="tags" />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="cursor-pointer px-6 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Crear Proyecto
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateProjectForm;
