import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/data/business";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const business = await getBusinessByOwner();
  if (!business) redirect("/onboarding");
  return <SettingsForm business={business} />;
}
