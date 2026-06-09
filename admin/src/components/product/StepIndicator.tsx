import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { label: string; desc: string }[];
  current: number;
  onChange: (step: number) => void;
}

export function StepIndicator({ steps, current, onChange }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-0.5 flex-1">
          <button
            type="button"
            onClick={() => onChange(i)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[9px] font-nav uppercase tracking-wider border transition-colors ${
              i === current
                ? "bg-vous-black text-vous-white border-vous-black"
                : i < current
                  ? "bg-white/90 text-vous-text border-vous-border"
                  : "bg-vous-surface text-vous-text-secondary border-vous-border"
            }`}
          >
            {i < current ? (
              <Check size={10} />
            ) : (
              <span className="text-[10px] font-bold">{i + 1}</span>
            )}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
