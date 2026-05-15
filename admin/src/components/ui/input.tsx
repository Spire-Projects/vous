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
      "w-full border border-vous-border bg-vous-surface px-3 py-2.5 text-sm font-sans text-vous-black placeholder:text-vous-gray focus:outline-none focus:border-vous-gold transition-colors disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
