'use client'

import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  arrow?: boolean
  href?: string
  target?: string
  rel?: string
  as?: 'button' | 'a'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant = 'primary', size = 'md', arrow = false, href, target, rel, as: _as, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      {
        'bg-[#A100FF] text-white hover:bg-[#8800DD] hover:shadow-[0_0_30px_rgba(161,0,255,0.5)] active:scale-95':
          variant === 'primary',
        'border border-white/20 text-white hover:border-white/50 hover:bg-white/5':
          variant === 'outline',
        'text-white hover:text-[#A100FF]': variant === 'ghost',
      },
      {
        'px-4 py-2 text-sm': size === 'sm',
        'px-6 py-3 text-sm': size === 'md',
        'px-8 py-4 text-base': size === 'lg',
      },
      className
    )

    if (href) {
      return (
        <a href={href} target={target} rel={rel} className={classes}>
          {children}
          {arrow && <ArrowRight className="w-4 h-4" />}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
        {arrow && <ArrowRight className="w-4 h-4" />}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
