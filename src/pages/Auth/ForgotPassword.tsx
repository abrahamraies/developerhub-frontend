import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { forgotPassword } from '../../api/auth'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
})

type FormData = yup.InferType<typeof schema>

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await forgotPassword(data.email)
      setEmailSent(true)
      toast.success('¡Correo de recuperación enviado!')
    } catch (error) {
      toast.error('Error al enviar el correo. Verifica el email.')
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
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700"
      >
        <div className="p-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Te enviaremos un enlace para restablecerla
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6">
          {!emailSent ? (
            <>
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                error={errors.email?.message}
                className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="cursor-pointer w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                          hover:from-blue-700 hover:to-purple-700 
                          transform hover:scale-[1.02] transition-all duration-200
                          shadow-md hover:shadow-lg"
              >
                Enviar enlace
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4">
                ✅
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                ¡Listo!
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Hemos enviado un enlace de recuperación al correo electrónico
                proporcionado. Revisa tu bandeja de entrada.
              </p>
            </div>
          )}
        </form>

        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            ¿Recuerdas tu contraseña?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPassword