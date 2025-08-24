import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { register } from '../../../api/auth'
import useAuthStore from '../../../stores/authStore'
import { toast } from 'react-hot-toast'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useNavigate } from 'react-router-dom'
import type { ApiError } from '../../../types'

const schema = yup.object().shape({
  username: yup.string()
    .required('Nombre de usuario es requerido')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres'),
  email: yup.string()
    .email('Email inválido')
    .required('Email es requerido'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Contraseña es requerida'),
})

type FormData = yup.InferType<typeof schema>

const RegisterForm = () => {
  const navigate = useNavigate()
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  
  const onSubmit = async (data: FormData) => {
    try {
      const response = await register(data.username, data.email, data.password)
      
      useAuthStore.getState().login(response)
      
      toast.success('Registro exitoso')
      navigate('/dashboard')
    } catch (err) {
      const error = err as ApiError
      toast.error(error.Message || 'Error al registrarse')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre de usuario"
        id="username"
        placeholder="tu_usuario"
        {...formRegister('username')}
        error={errors.username?.message}
        className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
      />
      
      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="tu@email.com"
        {...formRegister('email')}
        error={errors.email?.message}
        className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
      />
      
      <Input
        label="Contraseña"
        id="password"
        type="password"
        placeholder="••••••••"
        {...formRegister('password')}
        error={errors.password?.message}
        className="bg-gray-50/80 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:ring-primary"
      />
      
      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 
                  transform hover:scale-[1.02] transition-all duration-200
                  shadow-md hover:shadow-lg"
      >
        Registrarse
      </Button>
    </form>
  )
}

export default RegisterForm