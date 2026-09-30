"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function QrPreview({
  dataUrl,
  label = "Hub QR",
}: {
  dataUrl: string;
  label?: string;
}) {
  function downloadPng() {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${label.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`${label} code`}
        className="h-64 w-64 rounded-xl border border-zinc-700 bg-white p-2"
      />
      <Button onClick={downloadPng}>
        <Download className="mr-2 h-4 w-4" />
        Download PNG
      </Button>
    </div>
  );
}
