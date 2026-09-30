"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackScan(
  businessId: string,
  tableId?: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("scans").insert({
    business_id: businessId,
    table_id: tableId ?? null,
  });

  if (error) {
    console.error("trackScan failed:", error.message);
    return;
  }

  if (tableId) {
    const { data: table } = await supabase
      .from("qr_tables")
      .select("scan_count")
      .eq("id", tableId)
      .single();

    if (table) {
      await supabase
        .from("qr_tables")
        .update({ scan_count: (table.scan_count ?? 0) + 1 })
        .eq("id", tableId);
    }
  }
}
