"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MENU_TEMPLATES, type MenuTemplateKey } from "@/lib/templates/menu-templates";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string): Promise<string> {
  const supabase = await createClient();
  let slug = slugify(base);
  if (!slug) slug = "my-business";

  let candidate = slug;
  let n = 2;

  while (true) {
    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${slug}-${n}`;
    n++;
  }
}

export async function createBusiness(input: {
  name: string;
  template: MenuTemplateKey;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const existing = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing.data) return { error: "You already have a business" };

  const slug = await uniqueSlug(input.name);
  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
      name: input.name,
      slug,
      owner_id: user.id,
      menu_template: input.template,
    })
    .select()
    .single();

  if (error || !business) return { error: error?.message ?? "Failed to create business" };

  const template = MENU_TEMPLATES[input.template];
  const categories = template.categories.map((name, i) => ({
    business_id: business.id,
    name,
    sort_order: i,
  }));

  const { error: catError } = await supabase.from("menu_categories").insert(categories);
  if (catError) return { error: catError.message };

  const { data: full } = await supabase
    .from("businesses")
    .select(`*, menu_categories (*)`)
    .eq("id", business.id)
    .single();

  revalidatePath("/dashboard");
  return { business: full ?? business };
}

export async function updateBusiness(
  id: string,
  data: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    instagram?: string;
    swiggy_url?: string;
    zomato_url?: string;
    google_reviews_url?: string;
    address?: string;
    opening_hours?: string;
    logo_url?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await createClient();
  const { data: biz } = await supabase.from("businesses").select("slug").eq("id", id).single();
  const { error } = await supabase
    .from("businesses")
    .update({ is_published: published })
    .eq("id", id);

  if (error) return { error: error.message };
  if (biz?.slug) revalidatePath(`/b/${biz.slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleOpen(id: string, open: boolean) {
  const supabase = await createClient();
  const { data: biz } = await supabase.from("businesses").select("slug").eq("id", id).single();
  const { error } = await supabase.from("businesses").update({ is_open: open }).eq("id", id);

  if (error) return { error: error.message };
  if (biz?.slug) revalidatePath(`/b/${biz.slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}
