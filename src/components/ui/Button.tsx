/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Link as RouterLink, type LinkProps } from 'react-router-dom'

type CommonButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  to?: string
}

type ButtonAsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsLinkProps = Omit<LinkProps, 'to'> & { to: string }

type ButtonProps = CommonButtonProps & 
  (ButtonAsButtonProps | ButtonAsLinkProps)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  to,
  ...props
}, ref) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  }[variant]

  const isLink = to !== undefined
  const Component = isLink ? RouterLink : 'button'

  const MotionComponent = motion.create(Component)

    return (
      <MotionComponent
        ref={ref as any}
        to={isLink ? to : undefined}
        className={`${baseClasses} ${variantClasses} ${className}`}
        disabled={loading || ('disabled' in props && props.disabled)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        {...(props as any)}
      >
        {loading ? 'Loading...' : children}
      </MotionComponent>
    )
})

Button.displayName = 'Button'

export default Button