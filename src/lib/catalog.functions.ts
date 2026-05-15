import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("active", true)
    .order("type", { ascending: true })
    .order("color", { ascending: true });
  if (error) throw new Error(error.message);
  return { products: data ?? [] };
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
