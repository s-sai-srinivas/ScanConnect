"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBusiness, updateBusiness, togglePublish } from "@/lib/actions/business";
import { createMenuItem } from "@/lib/actions/menu";
import {
  MENU_TEMPLATES,
  MENU_TEMPLATE_KEYS,
  type MenuTemplateKey,
} from "@/lib/templates/menu-templates";
import type { BusinessWithMenu } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShareLink } from "@/components/qr/share-link";

const STEPS = ["Business", "Details", "Menu", "Preview", "Publish"];

export function OnboardingWizard({
  existingBusiness,
}: {
  existingBusiness: BusinessWithMenu | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(existingBusiness ? 2 : 0);
  const [business, setBusiness] = useState(existingBusiness);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(existingBusiness?.name ?? "");
  const [template, setTemplate] = useState<MenuTemplateKey>(
    (existingBusiness?.menu_template as MenuTemplateKey) ?? "cafe"
  );
  const [phone, setPhone] = useState(existingBusiness?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(existingBusiness?.whatsapp ?? "");
  const [address, setAddress] = useState(existingBusiness?.address ?? "");
  const [website, setWebsite] = useState(existingBusiness?.website ?? "");
  const [instagram, setInstagram] = useState(existingBusiness?.instagram ?? "");
  const [hours, setHours] = useState(existingBusiness?.opening_hours ?? "");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemVeg, setItemVeg] = useState(true);

  async function handleStep1() {
    if (!name.trim()) {
      toast.error("Enter your business name");
      return;
    }
    setLoading(true);
    if (business) {
      setStep(1);
      setLoading(false);
      return;
    }
    const result = await createBusiness({ name: name.trim(), template });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setBusiness({
      ...(result.business as BusinessWithMenu),
      menu_categories: (result.business as BusinessWithMenu).menu_categories ?? [],
    });
    toast.success("Business created!");
    setStep(1);
    router.refresh();
  }

  async function handleStep2() {
    if (!business) return;
    setLoading(true);
    const result = await updateBusiness(business.id, {
      phone,
      whatsapp,
      website,
      instagram,
      address,
      opening_hours: hours,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStep(2);
  }

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    const firstCat = business.menu_categories?.[0];
    if (!firstCat) {
      toast.error("No categories found");
      return;
    }
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price)) {
      toast.error("Enter item name and price");
      return;
    }
    setLoading(true);
    const result = await createMenuItem({
      categoryId: firstCat.id,
      name: itemName.trim(),
      price,
      isVeg: itemVeg,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setItemName("");
    setItemPrice("");
    toast.success("Item added!");
    router.refresh();
  }

  async function handlePublish() {
    if (!business) return;
    setLoading(true);
    const result = await togglePublish(business.id, true);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStep(4);
  }

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/b/${business?.slug}`
      : `/b/${business?.slug}`;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/" className="mb-6 block text-center text-xl font-bold text-primary">
        ScanConnect
      </Link>

      <div className="mb-8 flex gap-1">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= step ? "bg-primary" : "bg-zinc-800"
            )}
            title={label}
          />
        ))}
      </div>

      {step === 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Step 1 — Your business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sunrise Cafe"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Menu template</Label>
              <div className="grid grid-cols-2 gap-2">
                {MENU_TEMPLATE_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTemplate(key)}
                    className={cn(
                      "rounded-lg border p-3 text-left text-sm transition-colors min-h-11",
                      template === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    )}
                  >
                    {MENU_TEMPLATES[key].label}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleStep1} disabled={loading}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && business && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Step 2 — Links & contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              These appear on your public hub — one place for all customer links.
            </p>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourrestaurant.com"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourcafe or full URL"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Opening hours</Label>
              <Input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Mon-Sun: 8AM - 10PM"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)} className="border-zinc-700">
                Back
              </Button>
              <Button className="flex-1" onClick={handleStep2} disabled={loading}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && business && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Step 3 — Add menu items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item name"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
              <Input
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="Price (₹)"
                type="number"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={itemVeg}
                  onChange={(e) => setItemVeg(e.target.checked)}
                />
                Vegetarian
              </label>
              <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                + Quick add item
              </Button>
            </form>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-700">
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue to preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && business && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Step 4 — Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              Preview your menu before publishing (only you can see it).
            </p>
            <Button asChild variant="secondary" className="w-full">
              <a href={`/b/${business.slug}?preview=true`} target="_blank" rel="noopener noreferrer">
                Open preview
              </a>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="border-zinc-700">
                Back
              </Button>
              <Button className="flex-1" onClick={handlePublish} disabled={loading}>
                Publish menu
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && business && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">You&apos;re live!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">Share your hub link with customers:</p>
            <ShareLink slug={business.slug} businessName={business.name} />
            <Button asChild className="w-full">
              <Link href="/dashboard/qr">Download QR & Poster</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-zinc-700">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
