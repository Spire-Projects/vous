import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/30 disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-[0.98]",
        gold: "bg-[#C9A84C] hover:bg-[#B8960F] text-slate-950 font-semibold shadow-xs active:scale-[0.98]",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80 shadow-xs",
        amber:
          "bg-amber-50/90 text-amber-800 border border-amber-300/70 hover:bg-amber-100/80 shadow-xs",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
        danger:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:scale-[0.98]",
        "outline-gold":
          "border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#8B6914] hover:bg-[#C9A84C]/20 shadow-xs",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  },
);
Button.displayName = "Button";
