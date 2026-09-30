"use server";

import { createClient } from "@/lib/supabase/server";
import type { BusinessWithMenu, MenuCategory, MenuItem } from "@/types";

type BusinessRow = BusinessWithMenu & {
  menu_categories: (MenuCategory & { menu_items: MenuItem[] })[];
};

function sortMenu(business: BusinessRow): BusinessWithMenu {
  return {
    ...business,
    menu_categories: (business.menu_categories ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((cat) => ({
        ...cat,
        menu_items: (cat.menu_items ?? []).sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        ),
      })),
  };
}

export async function getPublicBusinessBySlug(
  slug: string,
  options?: { preview?: boolean }
): Promise<{ business: BusinessWithMenu | null; reason?: "not_found" | "unavailable" }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("businesses")
    .select(
      `
      *,
      menu_categories (
        *,
        menu_items (*)
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  const business = data as BusinessRow | null;

  if (error || !business) {
    return { business: null, reason: "not_found" };
  }

  const isOwner = user?.id === business.owner_id;
  const canView =
    (business.is_published && business.is_active) ||
    (options?.preview && isOwner);

  if (!canView) {
    return { business: null, reason: "unavailable" };
  }

  return { business: sortMenu(business) };
}

export async function getBusinessByOwner(): Promise<BusinessWithMenu | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("businesses")
    .select(
      `
      *,
      menu_categories (
        *,
        menu_items (*)
      )
    `
    )
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!data) return null;

  return sortMenu(data as BusinessRow);
}
