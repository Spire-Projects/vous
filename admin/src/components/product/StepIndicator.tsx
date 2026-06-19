import { Check, AlertCircle } from "lucide-react";

interface StepIndicatorProps {
  steps: { label: string; desc: string }[];
  current: number;
  onChange: (step: number) => void;
  stepErrors?: Record<number, string[]>;
}

export function StepIndicator({ steps, current, onChange, stepErrors }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {steps.map((s, i) => {
        const isCurrent = i === current;
        const isPast = i < current;
        const hasError = stepErrors && stepErrors[i] && stepErrors[i].length > 0;

        let baseClasses = "flex-1 flex items-center justify-center gap-1 py-1.5 text-[9px] font-nav uppercase tracking-wider border transition-colors ";
        if (isCurrent) {
          baseClasses += "bg-vous-black text-vous-white border-vous-black";
        } else if (hasError) {
          baseClasses += "bg-red-50 text-red-700 border-red-200";
        } else if (isPast) {
          baseClasses += "bg-white/90 text-vous-text border-vous-border";
        } else {
          baseClasses += "bg-vous-surface text-vous-text-secondary border-vous-border";
        }

        return (
          <div key={s.label} className="flex items-center gap-0.5 flex-1">
            <button
              type="button"
              onClick={() => onChange(i)}
              className={baseClasses}
              title={hasError ? `${s.desc} — Tiene errores` : s.desc}
            >
              {hasError ? (
                <AlertCircle size={10} />
              ) : isPast ? (
                <Check size={10} />
              ) : (
                <span className="text-[10px] font-bold">{i + 1}</span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
