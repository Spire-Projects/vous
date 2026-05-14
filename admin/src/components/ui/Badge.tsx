interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] font-['Montserrat'] font-semibold uppercase tracking-wider rounded-sm ${className}`}
    >
      {label}
    </span>
  );
}
