"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QrTable } from "@/types";

const MAX_TABLES = 20;

function slugifyTableName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || "table";
}

export async function listTables(businessId: string): Promise<QrTable[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scanconnect_qr_tables")
    .select("*")
    .eq("business_id", businessId)
    .order("table_name");

  if (error) return [];
  return data ?? [];
}

export async function createTable(businessId: string, tableName: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("scanconnect_qr_tables")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  if ((count ?? 0) >= MAX_TABLES) {
    return { error: `Maximum ${MAX_TABLES} tables allowed` };
  }

  let qrSlug = slugifyTableName(tableName);
  const { data: existing } = await supabase
    .from("scanconnect_qr_tables")
    .select("qr_slug")
    .eq("business_id", businessId)
    .like("qr_slug", `${qrSlug}%`);

  if (existing && existing.length > 0) {
    const taken = new Set(existing.map((t) => t.qr_slug));
    let suffix = 2;
    while (taken.has(`${qrSlug}-${suffix}`)) suffix++;
    qrSlug = `${qrSlug}-${suffix}`;
  }

  const { data, error } = await supabase
    .from("scanconnect_qr_tables")
    .insert({
      business_id: businessId,
      table_name: tableName.trim(),
      qr_slug: qrSlug,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/qr");
  return { table: data };
}

export async function deleteTable(tableId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("scanconnect_qr_tables").delete().eq("id", tableId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/qr");
  return { success: true };
}
