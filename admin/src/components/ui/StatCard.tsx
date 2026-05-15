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
    <div className="bg-vous-white border border-vous-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-nav uppercase tracking-[0.15em] text-vous-gray">
            {label}
          </p>
          <p className="font-serif text-3xl font-medium text-vous-black mt-2">
            {value}
          </p>
          {change && (
            <p className={`text-xs font-nav mt-1 ${isPositive ? "text-green-600" : "text-red-500"}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-vous-gold opacity-60">{icon}</div>
        )}
      </div>
    </div>
  );
}
