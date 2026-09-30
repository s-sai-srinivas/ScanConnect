import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/data/business";
import { MenuEditor } from "@/components/menu/menu-editor";

export default async function MenuPage() {
  const business = await getBusinessByOwner();
  if (!business) redirect("/onboarding");
  return <MenuEditor business={business} />;
}
