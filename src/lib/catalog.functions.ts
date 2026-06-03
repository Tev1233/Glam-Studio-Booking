import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function sign(bucket: string, path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("active", true)
    .order("type", { ascending: true })
    .order("color", { ascending: true });
  if (error) throw new Error(error.message);
  const signed = await Promise.all(
    (data ?? []).map(async (p: any) => ({ ...p, image_url: await sign("product-images", p.image_url) })),
  );
  return { products: signed };
});

export const listStyles = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("styles")
    .select("*")
    .eq("active", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return { styles: data ?? [] };
});

export const listGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const signed = await Promise.all(
    (data ?? []).map(async (g: any) => ({ ...g, image_url: await sign("gallery-images", g.image_url) })),
  );
  return { items: signed };
});
