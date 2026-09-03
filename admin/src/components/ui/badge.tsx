import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-nav font-semibold uppercase tracking-wider rounded-xl border backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:    "bg-vous-text text-white border-vous-text",
        gold:       "bg-amber-50/90 text-amber-700 border-amber-300/80",
        pending:    "bg-amber-50/90 text-amber-700 border-amber-300/80",
        payment:    "bg-blue-50/90 text-blue-700 border-blue-300/80",
        verifying:  "bg-purple-50/90 text-purple-700 border-purple-300/80",
        confirmed:  "bg-sky-50/90 text-sky-700 border-sky-300/80",
        preparing:  "bg-indigo-50/90 text-indigo-700 border-indigo-300/80",
        shipped:    "bg-teal-50/90 text-teal-700 border-teal-300/80",
        delivered:  "bg-emerald-50/90 text-emerald-700 border-emerald-300/80",
        cancelled:  "bg-red-50/90 text-red-700 border-red-300/80",
        active:     "bg-emerald-50/90 text-emerald-700 border-emerald-300/80",
        inactive:   "bg-gray-50/90 text-gray-500 border-gray-200/80",
        out_of_stock: "bg-red-50/90 text-red-700 border-red-300/80",
        outline:    "border-vous-border text-vous-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
