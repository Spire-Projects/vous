import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-block px-2.5 py-0.5 text-[10px] font-nav font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:    "bg-vous-black text-vous-white",
        gold:       "bg-vous-gold/20 text-vous-gold",
        pending:    "bg-amber-100 text-amber-800",
        payment:    "bg-blue-100 text-blue-800",
        verifying:  "bg-purple-100 text-purple-800",
        confirmed:  "bg-sky-100 text-sky-800",
        preparing:  "bg-indigo-100 text-indigo-800",
        shipped:    "bg-teal-100 text-teal-800",
        delivered:  "bg-green-100 text-green-800",
        cancelled:  "bg-red-100 text-red-800",
        active:     "bg-green-100 text-green-800",
        inactive:   "bg-gray-100 text-gray-500",
        out_of_stock: "bg-red-100 text-red-700",
        outline:    "border border-vous-border text-vous-gray",
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
