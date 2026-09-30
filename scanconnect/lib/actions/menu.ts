"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { compressAndUploadImage } from "@/lib/utils/compress-image";

export async function createCategory(businessId: string, name: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("menu_categories")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  const { error } = await supabase.from("menu_categories").insert({
    business_id: businessId,
    name,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateCategory(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").update({ name }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function createMenuItem(input: {
  categoryId: string;
  name: string;
  price: number;
  isVeg?: boolean;
}) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", input.categoryId);

  const { error } = await supabase.from("menu_items").insert({
    category_id: input.categoryId,
    name: input.name,
    price: input.price,
    is_veg: input.isVeg ?? false,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateMenuItem(
  id: string,
  data: {
    name?: string;
    price?: number;
    is_veg?: boolean;
    is_available?: boolean;
    image_url?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function duplicateMenuItem(id: string) {
  const supabase = await createClient();
  const { data: item, error: fetchError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !item) return { error: "Item not found" };

  const { count } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", item.category_id);

  const { error } = await supabase.from("menu_items").insert({
    category_id: item.category_id,
    name: `${item.name} (Copy)`,
    price: item.price,
    is_veg: item.is_veg,
    is_available: item.is_available,
    image_url: item.image_url,
    sort_order: (count ?? 0) + 1,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function uploadMenuImage(formData: FormData) {
  const businessId = formData.get("businessId") as string;
  const file = formData.get("file") as File | null;

  if (!businessId || !file) return { error: "Missing file or business ID" };

  try {
    const url = await compressAndUploadImage(file, businessId);
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }
}

export async function uploadLogo(formData: FormData) {
  return uploadMenuImage(formData);
}

export async function reorderCategories(businessId: string, orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("menu_categories").update({ sort_order: index }).eq("id", id).eq("business_id", businessId)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePath("/dashboard/menu");
  revalidatePath(`/b/[slug]`, "layout");
  return { success: true };
}

export async function reorderMenuItems(categoryId: string, orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("menu_items").update({ sort_order: index }).eq("id", id).eq("category_id", categoryId)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePath("/dashboard/menu");
  revalidatePath(`/b/[slug]`, "layout");
  return { success: true };
}
