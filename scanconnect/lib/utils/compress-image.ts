"use server";

import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

const MAX_SIZE = 10 * 1024 * 1024;

export async function compressAndUploadImage(file: File, businessId: string): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error("File must be under 10MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const compressed = await sharp(buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const filename = `${businessId}/${crypto.randomUUID()}.webp`;
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(filename, compressed, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(filename);

  return publicUrl;
}
