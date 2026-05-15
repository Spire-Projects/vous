import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cast: @radix-ui/react-checkbox omits className/children from types in React 19.
 */
type CheckboxRef = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement> & {
      checked?: boolean | "indeterminate";
      defaultChecked?: boolean;
      required?: boolean;
      onCheckedChange?: (checked: boolean | "indeterminate") => void;
      disabled?: boolean;
      name?: string;
      value?: string;
    }
>;
type IndicatorRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> &
    React.RefAttributes<HTMLSpanElement> & { forceMount?: true }
>;

const _Checkbox = CheckboxPrimitive.Root as unknown as CheckboxRef;
const _Indicator = CheckboxPrimitive.Indicator as unknown as IndicatorRef;

export const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    checked?: boolean | "indeterminate";
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
    disabled?: boolean;
    name?: string;
    value?: string;
  }
>(({ className, ...props }, ref) => (
  <_Checkbox
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 border border-vous-border bg-vous-white transition-colors data-[state=checked]:bg-vous-gold data-[state=checked]:border-vous-gold focus-visible:outline-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <_Indicator className="flex items-center justify-center text-vous-white">
      <Check size={10} strokeWidth={3} />
    </_Indicator>
  </_Checkbox>
));
Checkbox.displayName = "Checkbox";
