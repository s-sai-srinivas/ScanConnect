import Image from "next/image";
import type { MenuItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const unavailable = item.is_available === false;

  return (
    <article
      className={cn(
        "flex gap-3 rounded-xl border border-zinc-100 bg-white p-3 shadow-sm",
        unavailable && "opacity-70"
      )}
    >
      {item.image_url ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-2xl">
          🍽️
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "text-lg font-semibold text-zinc-900",
              unavailable && "line-through"
            )}
          >
            {item.name}
          </h3>
          {item.is_veg && <Badge variant="veg">Veg</Badge>}
          {unavailable && <Badge variant="destructive">Out of stock</Badge>}
        </div>
        <p className="mt-1 text-base font-semibold text-primary">{formatPrice(item.price)}</p>
      </div>
    </article>
  );
}
