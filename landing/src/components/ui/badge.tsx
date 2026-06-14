import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-nav text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        outline: "border border-black text-black",
        ghost: "bg-black/10 text-black/50",
        dark: "bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
