import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[80px] border border-vous-border bg-vous-white px-3 py-2 text-[13px] font-sans text-vous-black placeholder:text-vous-gray focus:outline-none focus:border-vous-black resize-y transition-colors disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
