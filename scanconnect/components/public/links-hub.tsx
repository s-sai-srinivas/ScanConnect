import type { Business } from "@/types";
import {
  Globe,
  AtSign,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";

type HubLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
};

function buildLinks(business: Business): HubLink[] {
  const links: HubLink[] = [];

  if (business.whatsapp) {
    links.push({
      label: "WhatsApp",
      href: `https://wa.me/91${business.whatsapp.replace(/\D/g, "").replace(/^91/, "")}`,
      icon: MessageCircle,
      external: true,
    });
  }
  if (business.phone) {
    links.push({
      label: "Call",
      href: `tel:${business.phone}`,
      icon: Phone,
    });
  }
  if (business.address) {
    links.push({
      label: "Directions",
      href: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
      icon: MapPin,
      external: true,
    });
  }
  if (business.instagram) {
    const ig = business.instagram.startsWith("http")
      ? business.instagram
      : `https://instagram.com/${business.instagram.replace("@", "")}`;
    links.push({ label: "Instagram", href: ig, icon: AtSign, external: true });
  }
  if (business.website) {
    const url = business.website.startsWith("http") ? business.website : `https://${business.website}`;
    links.push({ label: "Website", href: url, icon: Globe, external: true });
  }
  if (business.swiggy_url) {
    links.push({ label: "Order on Swiggy", href: business.swiggy_url, icon: UtensilsCrossed, external: true });
  }
  if (business.zomato_url) {
    links.push({ label: "Order on Zomato", href: business.zomato_url, icon: UtensilsCrossed, external: true });
  }
  if (business.google_reviews_url) {
    links.push({ label: "Leave a Review", href: business.google_reviews_url, icon: Star, external: true });
  }

  return links;
}

export function LinksHub({ business }: { business: Business }) {
  const links = buildLinks(business);

  if (links.length === 0) return null;

  return (
    <section className="mx-auto max-w-lg px-4 py-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Quick links
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {links.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex min-h-14 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-primary hover:bg-primary/5"
          >
            <Icon className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function HubAnchorNav({ hasMenu }: { hasMenu: boolean }) {
  if (!hasMenu) return null;

  return (
    <div className="mx-auto flex max-w-lg gap-2 px-4 pb-2">
      <a
        href="#links"
        className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 min-h-11 flex items-center"
      >
        Links
      </a>
      <a
        href="#menu"
        className="rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-primary min-h-11 flex items-center"
      >
        Menu
      </a>
    </div>
  );
}
