type StatsCardProps = {
  title: string;
  value: string | number;
  valueClassName?: string;
};

export function StatsCard({
  title,
  value,
  valueClassName = "",
}: StatsCardProps) {
  return (
    <div className="premium-card premium-card-hover rounded-[1.5rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <strong className={`mt-2 block text-4xl font-black ${valueClassName}`}>
            {value}
          </strong>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-lg">
          ✦
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400" />
      </div>
    </div>
  );
}