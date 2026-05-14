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
    <div className="bg-white border border-[#E8E5E1] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E]">
            {label}
          </p>
          <p className="font-['Bodoni_Moda'] text-3xl font-medium text-[#1A1A1A] mt-2">
            {value}
          </p>
          {change && (
            <p
              className={`text-xs font-['Montserrat'] mt-1 ${
                isPositive ? "text-green-600" : "text-red-500"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-[#C9A84C] opacity-60">{icon}</div>
        )}
      </div>
    </div>
  );
}
