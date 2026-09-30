import { createClient } from "@/lib/supabase/server";

export async function getScanCounts(businessId: string) {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalResult, todayResult] = await Promise.all([
    supabase
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId),
    supabase
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("created_at", today.toISOString()),
  ]);

  return {
    total: totalResult.count ?? 0,
    today: todayResult.count ?? 0,
  };
}
