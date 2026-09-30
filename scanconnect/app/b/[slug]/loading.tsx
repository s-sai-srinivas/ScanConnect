export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="animate-pulse border-b border-zinc-100 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-zinc-200" />
            <div className="h-3 w-24 rounded bg-zinc-200" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-200" />
        ))}
      </div>
    </div>
  );
}
