type ColorVariant = 'emerald' | 'rose' | 'sky' | 'amber' | 'purple' | 'teal';

interface InfraStatCardProps {
  icon: string;
  value: number;
  label: string;
  color: ColorVariant;
}

const TEXT_COLORS: Record<ColorVariant, string> = {
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
  teal: 'text-teal-400',
};

export function InfraStatCard({
  icon,
  value,
  label,
  color,
}: InfraStatCardProps) {
  return (
    <div className='p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-all'>
      <div className='text-2xl mb-1'>{icon}</div>
      <div className={`text-2xl font-bold ${TEXT_COLORS[color]}`}>{value}</div>
      <div className='text-xs text-neutral-500'>{label}</div>
    </div>
  );
}
