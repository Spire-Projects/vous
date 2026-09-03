interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8 lg:mb-10">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-vous-text leading-none tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-vous-text-secondary mt-3 font-sans tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
