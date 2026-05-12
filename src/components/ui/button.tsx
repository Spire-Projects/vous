import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-nav text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-vous-soft-black text-white hover:bg-vous-gray-dark',
        gold: 'bg-vous-gold text-vous-soft-black hover:bg-vous-gold-light',
        outline: 'border border-vous-gray-light text-vous-soft-black hover:border-vous-soft-black',
        'outline-white': 'border border-white/40 text-white hover:border-vous-gold hover:text-vous-gold',
        ghost: 'text-vous-soft-black hover:text-vous-gold border-b border-vous-soft-black hover:border-vous-gold pb-0.5',
      },
      size: {
        default: 'px-8 py-3.5',
        sm: 'px-5 py-2.5',
        lg: 'px-10 py-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
