"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";
import { getHubUrl } from "@/lib/utils/hub-url";

type ShareLinkProps = {
  slug: string;
  businessName?: string;
  dark?: boolean;
};

export function ShareLink({ slug, businessName, dark = true }: ShareLinkProps) {
  const url = getHubUrl(slug);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  }

  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName ?? "Business Hub",
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      await copyLink();
    }
  }

  return (
    <div className="space-y-2">
      <Input
        readOnly
        value={url}
        className={
          dark
            ? "border-zinc-700 bg-zinc-800 text-white text-sm"
            : "border-zinc-200 bg-white text-zinc-900 text-sm"
        }
      />
      <div className="flex gap-2">
        <Button onClick={copyLink} className="flex-1">
          Copy link
        </Button>
        <Button variant="outline" onClick={shareLink} className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
