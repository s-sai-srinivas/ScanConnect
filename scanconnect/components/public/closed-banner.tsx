import type { Business } from "@/types";

export function ClosedBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm font-medium text-amber-900">
      We&apos;re currently closed — menu shown for reference
    </div>
  );
}

export function BusinessHeader({
  business,
  tableName,
}: {
  business: Business;
  tableName?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/95 backdrop-blur px-4 py-4">
      <div className="mx-auto max-w-lg">
        {tableName && (
          <div className="mb-2 flex justify-center">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {tableName}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
        {business.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logo_url}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
            {business.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-zinc-900">{business.name}</h1>
          {business.opening_hours && (
            <p className="truncate text-sm text-zinc-500">{business.opening_hours}</p>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
