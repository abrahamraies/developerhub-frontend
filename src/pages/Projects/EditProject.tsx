import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProject, updateProject } from '../../api/projects'
import { toast } from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const schema = yup.object().shape({
  title: yup.string().required('Título es requerido').max(100, 'Máximo 100 caracteres'),
  description: yup.string().required('Descripción es requerida'),
  gitHubUrl: yup.string().url('URL de GitHub inválida').required('URL de GitHub es requerida'),
  discordUrl: yup.string().url('URL de Discord inválida').default(null).optional(),
  tags: yup.array().of(yup.string().required()).min(1, 'Agrega al menos un tag').required()
})

type FormData = yup.InferType<typeof schema>

const EditProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id
  })

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateProject(id!, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['project', id], updatedProject)
      queryClient.invalidateQueries({ queryKey: ['exploreProjects'] })
      toast.success('Proyecto actualizado correctamente')
      navigate(`/projects/${id}`)
    },
    onError: (error) => {
      toast.error('Error al actualizar el proyecto')
      console.error(error)
    }
  })

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        gitHubUrl: project.gitHubUrl,
        discordUrl: project.discordUrl || '',
        tags: project.tags
      })
    }
  }, [project, reset])

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data)
  }

  if (projectLoading) return <LoadingSpinner fullScreen />
  if (!project) return <div>Proyecto no encontrado</div>

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

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Editar Proyecto
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Actualiza la información de tu proyecto
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
            label="Título"
            id="title"
            placeholder="Nombre del proyecto"
            {...register('title')}
            error={errors.title?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 bg-gray-50/80 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="URL de GitHub"
            type="url"
            id="gitHubUrl"
            placeholder="https://github.com/usuario/repositorio"
            {...register('gitHubUrl')}
            error={errors.gitHubUrl?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <Input
            label="URL de Discord (opcional)"
            type="url"
            id="discordUrl"
            placeholder="https://discord.gg/..."
            {...register('discordUrl')}
            error={errors.discordUrl?.message}
            className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              placeholder="Presiona Enter para agregar tags"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const input = e.target as HTMLInputElement
                  const value = input.value.trim()
                  if (value) {
                    const currentTags = [...(watch('tags') || [])]
                    if (!currentTags.includes(value)) {
                      setValue('tags', [...currentTags, value])
                    }
                    input.value = ''
                  }
                }
              }}
              className="w-full px-3 py-2 bg-gray-50/80 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {watch('tags')?.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                  onClick={() => setValue('tags', watch('tags')!.filter(t => t !== tag))}
                >
                  {tag} <span className="font-bold">×</span>
                </span>
              ))}
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/projects/${id}`)}
              className="cursor-pointer px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Guardar Cambios
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

export default EditProject