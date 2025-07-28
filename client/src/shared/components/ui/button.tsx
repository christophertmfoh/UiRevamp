import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white font-semibold hover:brightness-110 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "gradient-destructive text-white font-semibold hover:brightness-110 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-[var(--gradient-brand-start)]/50 bg-transparent text-[var(--gradient-brand-start)] hover:gradient-primary hover:text-white hover:border-transparent transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-[var(--gradient-brand-start)] hover:gradient-primary hover:text-white transform hover:scale-[1.02] active:scale-[0.98]",
        link: "text-[var(--gradient-brand-start)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
