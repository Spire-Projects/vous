import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-nav text-[12px] uppercase tracking-[0.12em] font-semibold transition-colors duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-vous-black text-vous-white hover:bg-vous-black/80",
        gold:
          "bg-vous-gold text-vous-black hover:bg-vous-gold-muted",
        outline:
          "border border-vous-black text-vous-black hover:bg-vous-black hover:text-vous-white",
        ghost:
          "text-vous-black hover:bg-vous-border",
        danger:
          "bg-red-600 text-white hover:bg-red-700",
        "outline-gold":
          "border border-vous-gold text-vous-gold hover:bg-vous-gold hover:text-vous-black",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 px-3 text-[11px]",
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
