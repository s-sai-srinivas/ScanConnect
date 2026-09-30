import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/data/business";
import { OnboardingWizard } from "@/components/onboarding/wizard";

export default async function OnboardingPage() {
  const business = await getBusinessByOwner();

  if (business?.is_published) {
    redirect("/dashboard");
  }

  return (
    <div className="dashboard-theme min-h-screen">
      <OnboardingWizard existingBusiness={business} />
    </div>
  );
}
