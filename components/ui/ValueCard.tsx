type ValueCardProps = {
  title: string;
  description: string;
  value: string;
  valueClassName?: string;
};

export function ValueCard({
  title,
  description,
  value,
  valueClassName = "",
}: ValueCardProps) {
  return (
    <div className="premium-card premium-card-hover rounded-[1.5rem] p-5">
      <p className="text-sm font-medium text-zinc-400">{title}</p>

      <strong className={`mt-3 block text-3xl font-black ${valueClassName}`}>
        {value}
      </strong>

      <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Calculado automaticamente
      </div>
    </div>
  );
}