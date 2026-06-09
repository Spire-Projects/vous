import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 rounded-xl",
  {
    variants: {
      variant: {
        default:
          "bg-vous-text text-white hover:bg-vous-gold shadow-lg shadow-black/10 hover:shadow-amber-500/15 hover:-translate-y-0.5",
        gold:
          "bg-vous-gold text-white shadow-lg shadow-amber-500/20 hover:bg-vous-gold-bright hover:-translate-y-0.5",
        outline:
          "border border-vous-text text-vous-text hover:bg-vous-text hover:text-white",
        ghost:
          "text-vous-text-secondary hover:text-vous-text hover:bg-amber-50/60",
        danger:
          "bg-red-600 text-white shadow-lg shadow-red-500/15 hover:bg-red-700 hover:-translate-y-0.5",
        "outline-gold":
          "border border-vous-gold text-vous-gold hover:bg-vous-gold hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 px-3 text-[10px]",
        lg:      "h-11 px-6",
        icon:    "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
