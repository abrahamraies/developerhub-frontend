import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { exchangeCodeForToken } from '../../api/auth'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (!code) {
        toast.error('Código de autenticación no recibido')
        navigate('/settings')
        return
      }

      try {
        const response = await exchangeCodeForToken(code)
        localStorage.setItem('github_access_token', response.accessToken)
        toast.success(`Conectado como ${response.username}`)
        
        navigate('/settings')
      } catch (error) {
        console.error('Error en autenticación con GitHub:', error)
        toast.error('Error al conectar con GitHub')
        navigate('/settings')
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 dark:text-gray-300">Conectando con GitHub...</p>
    </div>
  )
}

export default AuthCallback