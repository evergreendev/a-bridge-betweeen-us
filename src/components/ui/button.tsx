import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  // Base button styles
  // Taller buttons, larger fonts, and sliding hover overlay
  'relative isolate overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded text-base font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 before:content-[""] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-out',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        // Increased heights and paddings
        sm: 'h-10 rounded px-4 text-base',
        default: 'h-12 px-10 text-base',
        lg: 'h-14 rounded px-12 text-lg',
        icon: 'h-12 w-12',
      },
      variant: {
        // Each variant defines its base bg/text plus the sliding overlay color via --hover-bg
        default:
          'bg-[#c1272d] text-white hover:bg-[#c1272d] [--hover-bg:#193a9d] before:bg-[var(--hover-bg)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive [--hover-bg:#a11212] before:bg-[var(--hover-bg)]',
        secondary:
          'border border-[#c1272d] bg-white text-[#c1272d] hover:bg-white [--hover-bg:#c1272d] before:bg-[var(--hover-bg)] hover:text-white',
        outline:
          'border border-border bg-background hover:bg-background [--hover-bg:hsl(var(--card))] before:bg-[var(--hover-bg)] hover:text-accent-foreground',
        ghost:
          'hover:bg-transparent [--hover-bg:hsl(var(--card))] before:bg-[var(--hover-bg)] hover:text-accent-foreground',
        link:
          'text-primary items-start justify-start underline-offset-4 hover:underline',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
