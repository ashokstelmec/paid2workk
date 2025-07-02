import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-300 ease-in-out focus-visible:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ghost: "bg-white text-prime hover:text-navy",
        default: "bg-blue text-white hover:bg-blue/90",
        outline:
          "border border-blue bg-muted/50 hover:bg-background hover:brightness-110 text-blue",
        outline_danger:
          "border border-red bg-muted/50 hover:bg-background hover:brightness-110 text-red",
      },
      size: {
        default: "h-10 px-4 py-2",
        ghost: "h-9 px-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xs: "h-7 px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
