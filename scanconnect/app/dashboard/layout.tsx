import Link from "next/link";
import { LayoutDashboard, UtensilsCrossed, Settings, LogOut, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/qr", label: "QR", icon: QrCode },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="dashboard-theme min-h-screen pb-20">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            ScanConnect
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-zinc-500 hover:text-white p-2 min-h-11 min-w-11">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs text-zinc-400 hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
