import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  change,
  isPositive,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300/80 flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight truncate">
          {value}
        </p>
        {change && (
          <div
            className={`text-xs font-semibold mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-rose-50 text-rose-700 border border-rose-200/60"
            }`}
          >
            {change}
          </div>
        )}
      </div>
      {icon && (
        <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 text-[#8B6914] border border-[#C9A84C]/25 shrink-0 ml-3">
          {icon}
        </div>
      )}
    </div>
  );
}
