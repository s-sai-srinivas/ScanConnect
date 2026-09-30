import { notFound } from "next/navigation";
import { getPublicBusinessBySlug } from "@/lib/data/business";
import { getTableBySlug } from "@/lib/data/tables";
import { BusinessHub } from "@/components/public/public-menu";

export default async function TableHubPage({
  params,
}: {
  params: Promise<{ slug: string; tableSlug: string }>;
}) {
  const { slug, tableSlug } = await params;
  const { business } = await getPublicBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const table = await getTableBySlug(business.id, tableSlug);
  if (!table) {
    notFound();
  }

  return (
    <BusinessHub
      business={business}
      tableId={table.id}
      tableName={table.table_name}
    />
  );
}
