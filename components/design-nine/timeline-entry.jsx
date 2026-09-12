export function TimelineEntry({ icon: Icon, isLast = false, children }) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast ? (
        <div className="absolute top-7 bottom-0 left-[13px] w-px bg-border" />
      ) : null}
      <div className="z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary">
        <Icon className="size-3.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">{children}</div>
    </div>
  );
}
