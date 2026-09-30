"use client";

import { useEffect, useRef } from "react";
import { trackScan } from "@/lib/actions/scans";

export function ScanTracker({
  businessId,
  tableId,
}: {
  businessId: string;
  tableId?: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackScan(businessId, tableId);
  }, [businessId, tableId]);

  return null;
}
