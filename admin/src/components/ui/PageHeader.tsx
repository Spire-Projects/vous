interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-vous-black leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-vous-gray mt-1 font-sans">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
