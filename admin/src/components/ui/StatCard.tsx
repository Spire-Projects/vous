import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: ReactNode;
}

export function StatCard({ label, value, change, isPositive, icon }: StatCardProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl p-6 shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-500/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-nav uppercase tracking-[0.2em] text-vous-text-secondary">
            {label}
          </p>
          <p className="font-serif text-3xl lg:text-4xl font-medium text-vous-text mt-3 tracking-tight truncate">
            {value}
          </p>
          {change && (
            <p className={`text-[11px] font-nav tracking-wide mt-2 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-vous-gold/30 group-hover:text-vous-gold/70 transition-colors duration-300 ml-3">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
