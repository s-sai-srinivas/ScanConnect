import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/data/business";
import { getScanCounts } from "@/lib/data/analytics";
import { Badge } from "@/components/ui/badge";
import { ShareLink } from "@/components/qr/share-link";
import Link from "next/link";
import { QrCode } from "lucide-react";

export default async function DashboardPage() {
  const business = await getBusinessByOwner();

  if (!business) redirect("/onboarding");

  const scans = await getScanCounts(business.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant={business.is_published ? "default" : "outline"}>
            {business.is_published ? "Published" : "Draft"}
          </Badge>
          <Badge variant={business.is_open ? "veg" : "destructive"}>
            {business.is_open ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-400 mb-2">Your hub link (one QR → everything)</p>
        <ShareLink slug={business.slug} businessName={business.name} />
      </div>

      <Link
        href="/dashboard/qr"
        className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-primary hover:bg-primary/15 transition-colors"
      >
        <QrCode className="h-8 w-8" />
        <div>
          <p className="font-semibold">Download QR & Poster</p>
          <p className="text-sm text-primary/80">Print and put on your counter</p>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-2xl font-bold text-primary">{scans.total}</p>
          <p className="text-sm text-zinc-400">Total scans</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-2xl font-bold text-primary">{scans.today}</p>
          <p className="text-sm text-zinc-400">Scans today</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-2xl font-bold text-primary">
            {business.menu_categories.reduce((n, c) => n + c.menu_items.length, 0)}
          </p>
          <p className="text-sm text-zinc-400">Menu items</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-2xl font-bold text-primary">{business.menu_categories.length}</p>
          <p className="text-sm text-zinc-400">Categories</p>
        </div>
      </div>
    </div>
  );
}
