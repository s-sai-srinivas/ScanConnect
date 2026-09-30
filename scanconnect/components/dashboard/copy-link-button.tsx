"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CopyLinkButton({ slug }: { slug: string }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/b/${slug}`
      : `/b/${slug}`;

  return (
    <div className="flex gap-2">
      <Input readOnly value={`/b/${slug}`} className="border-zinc-700 bg-zinc-800 text-white" />
      <Button
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copied!");
        }}
      >
        Copy
      </Button>
    </div>
  );
}
