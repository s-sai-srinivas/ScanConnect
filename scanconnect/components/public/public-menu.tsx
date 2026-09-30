"use client";

import { useState } from "react";
import type { BusinessWithMenu } from "@/types";
import { BusinessHeader, ClosedBanner } from "./closed-banner";
import { CategoryNav } from "./category-nav";
import { MenuItemCard } from "./menu-item-card";
import { ActionBar, ViralCta } from "./action-bar";
import { LinksHub, HubAnchorNav } from "./links-hub";
import { ScanTracker } from "./scan-tracker";

type BusinessHubProps = {
  business: BusinessWithMenu;
  tableId?: string;
  tableName?: string;
};

export function BusinessHub({ business, tableId, tableName }: BusinessHubProps) {
  const categories = business.menu_categories;
  const hasMenu = categories.some((c) => c.menu_items.length > 0);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  const scrollToCategory = (id: string) => {
    setActiveId(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-36">
      <ScanTracker businessId={business.id} tableId={tableId} />
      {!business.is_open && <ClosedBanner />}
      <BusinessHeader business={business} tableName={tableName} />
      <HubAnchorNav hasMenu={hasMenu} />

      <div id="links">
        <LinksHub business={business} />
      </div>

      {hasMenu && (
        <>
          {categories.length > 0 && (
            <CategoryNav
              categories={categories}
              activeId={activeId}
              onSelect={scrollToCategory}
            />
          )}

          <main id="menu" className="mx-auto max-w-lg space-y-8 px-4 py-6 scroll-mt-24">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 -mb-4">
              Menu
            </h2>
            {categories.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-36">
                <h3 className="mb-3 text-xl font-bold text-zinc-900">{cat.name}</h3>
                <div className="space-y-3">
                  {cat.menu_items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </main>
        </>
      )}

      {!hasMenu && (
        <p className="text-center text-zinc-500 py-8 px-4">
          Menu coming soon — use the links above to connect
        </p>
      )}

      <ViralCta />
      <ActionBar business={business} tableId={tableId} tableName={tableName} />
    </div>
  );
}

/** @deprecated Use BusinessHub — kept for imports during transition */
export const PublicMenu = BusinessHub;
