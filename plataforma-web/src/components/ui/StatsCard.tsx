interface StatsCardProps {
  label: string;
  value: number | string;
  gradient?: 'blue' | 'indigo' | 'slate';
}

export function StatsCard({ label, value, gradient = 'slate' }: StatsCardProps) {
  const gradientStyles = {
    blue: 'from-blue-50/80 border-blue-100/80 text-blue-600',
    indigo: 'from-indigo-50/80 border-indigo-100/80 text-indigo-600',
    slate: 'from-slate-50 border-slate-200/80 text-slate-500',
  };

  return (
    <div className={`bg-gradient-to-br ${gradientStyles[gradient].split(' ')[0]} via-white to-white p-4 rounded-2xl border ${gradientStyles[gradient].split(' ')[1]} shadow-sm`}>
      <span className={`text-xs font-semibold uppercase tracking-wider ${gradientStyles[gradient].split(' ')[2]}`}>
        {label}
      </span>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}