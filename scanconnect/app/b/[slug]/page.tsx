import { getPublicBusinessBySlug } from "@/lib/data/business";
import { BusinessHub } from "@/components/public/public-menu";

export default async function PublicMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { business, reason } = await getPublicBusinessBySlug(slug, {
    preview: preview === "true",
  });

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">
            {reason === "unavailable" ? "Menu not available" : "Menu not found"}
          </h1>
          <p className="mt-2 text-zinc-500">
            {reason === "unavailable"
              ? "This menu hasn't been published yet."
              : "Check the link and try again."}
          </p>
        </div>
      </div>
    );
  }

  return <BusinessHub business={business} />;
}
