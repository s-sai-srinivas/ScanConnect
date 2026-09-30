"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Business } from "@/types";

type PosterPreviewProps = {
  business: Business;
  qrDataUrl: string;
};

export function PosterPreview({ business, qrDataUrl }: PosterPreviewProps) {
  const posterRef = useRef<HTMLDivElement>(null);

  async function downloadPoster() {
    if (!posterRef.current) return;

    const dataUrl = await toPng(posterRef.current, {
      width: 2480,
      height: 3508,
      pixelRatio: 1,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${business.slug}-poster-a4.png`;
    link.click();
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 p-4">
        <div
          ref={posterRef}
          className="mx-auto flex aspect-[2480/3508] w-full max-w-xs flex-col items-center justify-center bg-white p-10 text-center"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt=""
              className="mb-6 max-h-[120px] max-w-[200px] object-contain"
            />
          ) : (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
              {business.name.charAt(0)}
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="QR code"
            className="mb-6 h-[300px] w-[300px]"
          />

          <h2 className="mb-2 text-2xl font-bold text-zinc-900">{business.name}</h2>
          <p className="text-base text-zinc-500">Scan for menu, links & more</p>

          {business.whatsapp && (
            <p className="mt-4 text-sm text-zinc-400">WhatsApp: {business.whatsapp}</p>
          )}
        </div>
      </div>

      <Button onClick={downloadPoster} className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download A4 Poster
      </Button>
    </div>
  );
}
