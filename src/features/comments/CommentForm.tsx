// CommentForm.tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createComment } from '../../api/comments'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import type { ApiError } from '../../types'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'

const schema = yup.object().shape({
  content: yup
    .string()
    .required('El comentario es requerido')
    .min(5, 'El comentario debe tener al menos 5 caracteres')
    .max(500, 'El comentario no puede exceder 500 caracteres'),
})

const CommentForm = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const content = watch('content')
  const onSubmit = async (data: { content: string }) => {
    try {
      await createComment(projectId, data.content)
      toast.success('Comentario agregado')

      // ✅ Invalidamos la query de comentarios del proyecto
      await queryClient.invalidateQueries({ queryKey: ['project', projectId] })

      reset()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.Message || 'Error al agregar comentario')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6"
    >
      <div className="relative">
        <textarea
          rows={3}
          placeholder="Escribe tu comentario..."
          {...register('content')}
          className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-700/60 backdrop-blur-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white resize-none transition-all duration-200 ${
            errors.content
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          }`}
        />
        <div className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{500 - (content?.length || 0)}</span>
        </div>
      </div>

      {errors.content?.message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-red-500 text-sm mt-1 px-1"
        >
          {errors.content.message}
        </motion.div>
      )}

      <div className="flex justify-end mt-3">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="px-5 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
        >
          Publicar Comentario
        </Button>
      </div>
    </motion.form>
  )
}

export default CommentForm