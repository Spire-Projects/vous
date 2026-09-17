import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[80px] border border-vous-border bg-white/90 px-4 py-2.5 text-[13px] font-sans text-vous-text placeholder:text-vous-text-muted rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-y transition-all disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
