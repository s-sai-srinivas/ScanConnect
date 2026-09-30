import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/data/business";
import { listTables } from "@/lib/actions/tables";
import { generateHubQR } from "@/lib/actions/qr";
import { ShareLink } from "@/components/qr/share-link";
import { QrPreview } from "@/components/qr/qr-preview";
import { TableList } from "@/components/qr/table-list";
import { PosterPreview } from "@/components/qr/poster-preview";

export default async function QrPage() {
  const business = await getBusinessByOwner();
  if (!business) redirect("/onboarding");

  const [qrDataUrl, tables] = await Promise.all([
    generateHubQR(business.slug),
    listTables(business.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">QR & Poster</h1>
        <p className="mt-1 text-sm text-zinc-400">
          One QR opens your full hub — menu, links, and contact.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Main hub QR</h2>
        <QrPreview dataUrl={qrDataUrl} label="Hub QR" />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Share hub link</h2>
        <ShareLink slug={business.slug} businessName={business.name} />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Printable poster</h2>
        <PosterPreview business={business} qrDataUrl={qrDataUrl} />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-2 text-lg font-semibold">Table QRs</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Optional — same hub with table context for waiter calls.
        </p>
        <TableList
          businessId={business.id}
          businessSlug={business.slug}
          tables={tables}
        />
      </section>
    </div>
  );
}
