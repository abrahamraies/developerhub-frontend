import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { resendVerificationEmail } from '../../api/auth'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
})

type FormData = yup.InferType<typeof schema>

const ResendVerification = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await resendVerificationEmail(data.email)
      toast.success('Revisa tu correo para verificar tu cuenta')
    } catch (error) {
      toast.error('Error al reenviar el email')
      console.log(error)
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
        className="relative w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700 p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Reenviar email de verificación
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Ingresa tu email para reenviar el enlace de verificación.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Reenviar email
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            ¿Ya verificaste tu cuenta?{' '}
            <Link
              to="/login"
              className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResendVerification