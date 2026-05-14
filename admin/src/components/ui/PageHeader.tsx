interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-['Bodoni_Moda'] text-3xl font-medium text-[#1A1A1A] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#9E9E9E] mt-1 font-['Inter']">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
