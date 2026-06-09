import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "w-full border border-vous-border bg-white/90 px-4 py-2.5 text-sm font-sans text-vous-text placeholder:text-vous-text-muted rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
