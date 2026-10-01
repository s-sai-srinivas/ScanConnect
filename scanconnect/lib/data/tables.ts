import { createClient } from "@/lib/supabase/server";
import type { QrTable } from "@/types";

export async function getTableBySlug(
  businessId: string,
  tableSlug: string
): Promise<QrTable | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scanconnect_qr_tables")
    .select("*")
    .eq("business_id", businessId)
    .eq("qr_slug", tableSlug)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
