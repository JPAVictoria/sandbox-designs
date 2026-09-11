export function StatStrip({ stats }) {
  return (
    <div className="flex rounded-lg border border-border">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={
            index === 0
              ? "flex-1 px-4 py-3"
              : "flex-1 border-l border-border px-4 py-3"
          }
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
