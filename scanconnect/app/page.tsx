import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
          ScanConnect
        </p>
        <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
          One QR. Every Link Your Customers Need.
        </h1>
        <p className="mt-4 max-w-md text-lg text-zinc-400">
          Menu, WhatsApp, Instagram, maps, delivery — one scan, one page. Your single source of truth.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/register">Create Free Business Page</Link>
        </Button>
        <p className="mt-6 text-sm text-zinc-500">
          Demo hub:{" "}
          <Link href="/b/demo-cafe" className="text-primary hover:underline">
            /b/demo-cafe
          </Link>
        </p>
      </main>
    </div>
  );
}
