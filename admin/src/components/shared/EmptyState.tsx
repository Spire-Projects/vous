import type { LucideIcon } from "lucide-react";
import { ImageOff } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = ImageOff,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-3xl border border-border bg-white p-8 sm:p-14 shadow-xs ${className}`}
    >
      <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-amber-50 text-vous-gold-dark border border-vous-gold/30 shadow-xs mb-4">
        <Icon className="size-7 sm:size-8" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight font-nav">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
