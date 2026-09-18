interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  category?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  category,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
      <div>
        {category && (
          <div className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#C9A84C]/10 text-[#8B6914] border border-[#C9A84C]/30 mb-2">
            {category}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2.5 flex-wrap">{action}</div>}
    </div>
  );
}
