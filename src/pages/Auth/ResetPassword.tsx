import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { resetPassword } from '../../api/auth'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

// Esquema de validación
const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
})

type FormData = yup.InferType<typeof schema>

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🔐</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Token no válido</h2>
          <p className="text-gray-600 dark:text-gray-300">
            El enlace de restablecimiento no es válido o ha expirado.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await resetPassword(token, data.password)
      setResetSuccess(true)
      toast.success('¡Contraseña actualizada con éxito!')
    } catch (error) {
      toast.error('Error al restablecer la contraseña. El enlace puede haber expirado.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700"
      >
        <div className="p-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Elige una nueva contraseña segura
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6">
          {!resetSuccess ? (
            <>
              <Input
                label="Nueva Contraseña"
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
              />

              <Input
                label="Confirmar Contraseña"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                          hover:from-blue-700 hover:to-purple-700 
                          transform hover:scale-[1.02] transition-all duration-200
                          shadow-md hover:shadow-lg"
              >
                Restablecer Contraseña
              </Button>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-2">
                ✅
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                ¡Contraseña actualizada!
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <Button
                variant="primary"
                to="/login"
                className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                          hover:from-blue-700 hover:to-purple-700 
                          transform hover:scale-[1.02] transition-all duration-200
                          shadow-md hover:shadow-lg"
              >
                Ir al Inicio de Sesión
              </Button>
            </div>
          )}
        </form>

        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            ¿No solicitaste esto?{' '}
            <Link
              to="/"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400 transition-colors"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResetPassword