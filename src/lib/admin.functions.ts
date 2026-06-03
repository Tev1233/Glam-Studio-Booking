import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// Detect bucket from path heuristics. Paths stored look like "{uuid}.jpg" — we track bucket
// via the table's row context; the field stores the object path within its bucket.
async function signUrl(supabase: any, bucket: string, path: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

const styleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  category: z.enum(["Braids", "Weaves", "Natural", "Locs", "Other"]),
  description: z.string().trim().max(2000).optional().nullable(),
  base_price: z.number().min(0).max(100000),
  image_url: z.string().trim().max(2000).optional().nullable(),
  active: z.boolean().default(true),
});

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  type: z.enum(["Weave", "Braid", "Shampoo", "HairGel"]),
  color: z.string().trim().min(1).max(60),
  color_hex: z.string().trim().regex(/^#?[0-9a-fA-F]{3,8}$/).optional().nullable(),
  length_inches: z.number().int().min(0).max(60).optional().nullable(),
  price: z.number().min(0).max(100000),
  stock_qty: z.number().int().min(0).max(100000),
  description: z.string().trim().max(2000).optional().nullable(),
  image_url: z.string().trim().max(2000).optional().nullable(),
  active: z.boolean().default(true),
});

const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().nullable(),
  image_url: z.string().trim().min(1).max(2000),
});

export const adminUpsertStyle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => styleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("styles").upsert(data).select().single();
    if (error) throw new Error(error.message);
    return { style: row };
  });

export const adminDeleteStyle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("styles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("products").upsert(data).select().single();
    if (error) throw new Error(error.message);
    return { product: row };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row } = await context.supabase.from("products").select("image_url").eq("id", data.id).maybeSingle();
    if (row?.image_url && !row.image_url.startsWith("http")) {
      await context.supabase.storage.from("product-images").remove([row.image_url]);
    }
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => gallerySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("gallery").upsert(data).select().single();
    if (error) throw new Error(error.message);
    return { item: row };
  });

export const adminDeleteGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row } = await context.supabase.from("gallery").select("image_url").eq("id", data.id).maybeSingle();
    if (row?.image_url && !row.image_url.startsWith("http")) {
      await context.supabase.storage.from("gallery-images").remove([row.image_url]);
    }
    const { error } = await context.supabase.from("gallery").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListAll = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [styles, products, galleryRes] = await Promise.all([
      context.supabase.from("styles").select("*").order("category").order("name"),
      context.supabase.from("products").select("*").order("type").order("color"),
      context.supabase.from("gallery").select("*").order("created_at", { ascending: false }),
    ]);
    if (styles.error) throw new Error(styles.error.message);
    if (products.error) throw new Error(products.error.message);
    if (galleryRes.error) throw new Error(galleryRes.error.message);

    const productsSigned = await Promise.all(
      (products.data ?? []).map(async (p: any) => ({
        ...p,
        image_url: await signUrl(context.supabase, "product-images", p.image_url),
      })),
    );
    const gallerySigned = await Promise.all(
      (galleryRes.data ?? []).map(async (g: any) => ({
        ...g,
        image_url: await signUrl(context.supabase, "gallery-images", g.image_url),
      })),
    );
    return { styles: styles.data ?? [], products: productsSigned, gallery: gallerySigned };
  });
