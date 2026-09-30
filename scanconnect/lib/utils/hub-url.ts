export function getHubUrl(slug: string, tableSlug?: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const path = tableSlug ? `/b/${slug}/table/${tableSlug}` : `/b/${slug}`;
  return `${base.replace(/\/$/, "")}${path}`;
}
