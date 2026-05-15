import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * Cast: @radix-ui/react-label omits className/children from types in React 19.
 * Type-level workaround — no runtime impact.
 */
type LabelRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.LabelHTMLAttributes<HTMLLabelElement>> &
    React.RefAttributes<HTMLLabelElement>
>;
const _Label = LabelPrimitive.Root as unknown as LabelRef;

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <_Label
    ref={ref}
    className={cn(
      "block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
