"use client";

import type { MenuCategory } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryNav({
  categories,
  activeId,
  onSelect,
}: {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="sticky top-[73px] z-10 border-b border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-11",
              activeId === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
