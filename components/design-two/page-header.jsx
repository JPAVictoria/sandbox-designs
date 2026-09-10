export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" />
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
