import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-semibold hover:from-emerald-600 hover:to-amber-600 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-600 hover:to-orange-600 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-emerald-500/50 bg-transparent text-emerald-600 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-amber-500 hover:text-white hover:border-transparent transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-stone-400 to-stone-500 text-white font-semibold hover:from-stone-500 hover:to-stone-600 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-emerald-600 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-amber-500 hover:text-white transform hover:scale-[1.02] active:scale-[0.98]",
        link: "text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline",
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
