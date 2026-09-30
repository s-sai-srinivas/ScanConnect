"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Business } from "@/types";
import { updateBusiness, togglePublish, toggleOpen } from "@/lib/actions/business";
import { uploadLogo } from "@/lib/actions/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function SettingsForm({ business }: { business: Business }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: business.name,
    phone: business.phone ?? "",
    whatsapp: business.whatsapp ?? "",
    instagram: business.instagram ?? "",
    website: business.website ?? "",
    swiggy_url: business.swiggy_url ?? "",
    zomato_url: business.zomato_url ?? "",
    google_reviews_url: business.google_reviews_url ?? "",
    address: business.address ?? "",
    opening_hours: business.opening_hours ?? "",
  });
  const [published, setPublished] = useState(business.is_published ?? false);
  const [open, setOpen] = useState(business.is_open ?? true);

  async function saveProfile() {
    setLoading(true);
    const result = await updateBusiness(business.id, form);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Saved!");
      router.refresh();
    }
  }

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("businessId", business.id);
    fd.set("file", file);
    setLoading(true);
    const upload = await uploadLogo(fd);
    if (upload.error) {
      toast.error(upload.error);
      setLoading(false);
      return;
    }
    const result = await updateBusiness(business.id, { logo_url: upload.url });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Logo updated!");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your business profile</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Menu published</Label>
          <Switch
            checked={published}
            onCheckedChange={async (v) => {
              setPublished(v);
              const r = await togglePublish(business.id, v);
              if (r.error) toast.error(r.error);
              else router.refresh();
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Open today</Label>
          <Switch
            checked={open}
            onCheckedChange={async (v) => {
              setOpen(v);
              const r = await toggleOpen(business.id, v);
              if (r.error) toast.error(r.error);
              else router.refresh();
            }}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="space-y-2">
          <Label>Logo</Label>
          <Input type="file" accept="image/*" onChange={handleLogo} className="border-zinc-700 bg-zinc-800 text-white" />
        </div>
        {(
          [
            "name",
            "phone",
            "whatsapp",
            "instagram",
            "website",
            "swiggy_url",
            "zomato_url",
            "google_reviews_url",
            "address",
            "opening_hours",
          ] as const
        ).map((field) => (
            <div key={field} className="space-y-2">
              <Label className="capitalize">{field.replace("_", " ")}</Label>
              <Input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
        ))}
        <Button onClick={saveProfile} disabled={loading} className="w-full">
          Save changes
        </Button>
      </div>
    </div>
  );
}
