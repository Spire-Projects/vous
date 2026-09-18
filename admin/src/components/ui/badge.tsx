import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border-slate-200/80",
        gold: "bg-[#C9A84C]/10 text-[#8B6914] border-[#C9A84C]/30",
        pending: "bg-amber-50 text-amber-700 border-amber-200/80",
        payment: "bg-blue-50 text-blue-700 border-blue-200/80",
        verifying: "bg-amber-50 text-amber-800 border-amber-200/80",
        confirmed: "bg-sky-50 text-sky-700 border-sky-200/80",
        preparing: "bg-amber-50 text-amber-800 border-amber-200/80",
        shipped: "bg-teal-50 text-teal-700 border-teal-200/80",
        delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        cancelled: "bg-rose-50 text-rose-700 border-rose-200/80",
        active: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        inactive: "bg-slate-100 text-slate-500 border-slate-200/80",
        out_of_stock: "bg-rose-50 text-rose-700 border-rose-200/80",
        outline: "border-slate-200 text-slate-600 bg-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
