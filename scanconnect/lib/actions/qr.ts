"use server";

import QRCode from "qrcode";
import { getHubUrl } from "@/lib/utils/hub-url";

export async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export async function generateHubQR(
  slug: string,
  tableSlug?: string
): Promise<string> {
  const url = getHubUrl(slug, tableSlug);
  return generateQR(url);
}

export { getHubUrl };
