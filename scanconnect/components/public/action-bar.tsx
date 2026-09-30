"use client";

import Link from "next/link";
import type { Business } from "@/types";
import type { InteractionType } from "@/types";
import { whatsappLink } from "@/lib/utils";
import { logInteraction } from "@/lib/actions/interactions";
import { MessageCircle, Phone, MapPin, Bell } from "lucide-react";

type ActionBarProps = {
  business: Business;
  tableId?: string;
  tableName?: string;
};

function buildMessages(business: Business, tableName?: string) {
  const orderMsg = `New order request from ${business.name}`;
  const waiterMsg = tableName
    ? `Customer at ${tableName} needs assistance at ${business.name}`
    : `Customer needs assistance at ${business.name}`;
  return { orderMsg, waiterMsg };
}

export function ActionBar({ business, tableId, tableName }: ActionBarProps) {
  const { orderMsg, waiterMsg } = buildMessages(business, tableName);

  async function handleInteraction(
    type: InteractionType,
    href: string,
    e: React.MouseEvent
  ) {
    e.preventDefault();
    await logInteraction(business.id, type, tableId);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const actions = [
    {
      label: "Order",
      href: business.whatsapp ? whatsappLink(business.whatsapp, orderMsg) : undefined,
      icon: MessageCircle,
      primary: true,
      interactionType: "whatsapp_order" as InteractionType,
    },
    {
      label: "Call",
      href: business.phone ? `tel:${business.phone}` : undefined,
      icon: Phone,
      interactionType: undefined,
    },
    {
      label: "Maps",
      href: business.address
        ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}`
        : undefined,
      icon: MapPin,
      interactionType: undefined,
    },
    {
      label: "Waiter",
      href: business.whatsapp ? whatsappLink(business.whatsapp, waiterMsg) : undefined,
      icon: Bell,
      interactionType: "call_waiter" as InteractionType,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
        {actions.map(({ label, href, icon: Icon, primary, interactionType }) =>
          href ? (
            <a
              key={label}
              href={href}
              target={interactionType ? undefined : label === "Maps" ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={
                interactionType
                  ? (e) => handleInteraction(interactionType, href, e)
                  : undefined
              }
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-xs font-medium transition-colors ${
                primary
                  ? "bg-primary text-primary-foreground"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ) : (
            <span
              key={label}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-xs text-zinc-300"
            >
              <Icon className="h-5 w-5" />
              {label}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export function ViralCta() {
  return (
    <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-6 text-center">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-primary transition-colors"
      >
        Powered by <span className="font-semibold text-zinc-700">ScanConnect</span>
        {" · "}
        Get your own business hub →
      </Link>
    </div>
  );
}
