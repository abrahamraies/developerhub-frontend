import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../api/auth'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        toast.error('Token no proporcionado')
        setLoading(false)
        return
      }

      try {
        await verifyEmail(token)
        setSuccess(true)
        toast.success('Email verificado correctamente')
      } catch (error) {
        toast.error('Error al verificar el email')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    handleVerify()
  }, [token])

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
        {loading ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verificando...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Por favor espera mientras verificamos tu email.
            </p>
          </>
        ) : success ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              ¡Email verificado!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Iniciar sesión
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verificación fallida
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              El enlace de verificación no es válido o ha expirado.
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              className="cursor-pointer px-6 py-2"
            >
              Volver al inicio de sesión
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default VerifyEmail