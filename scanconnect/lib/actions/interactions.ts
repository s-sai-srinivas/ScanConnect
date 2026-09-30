"use server";

import { createClient } from "@/lib/supabase/server";
import type { InteractionType } from "@/types";

export async function logInteraction(
  businessId: string,
  type: InteractionType,
  tableId?: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("interactions").insert({
    business_id: businessId,
    type,
    table_id: tableId ?? null,
  });

  if (error) {
    console.error("logInteraction failed:", error.message);
  }
}
