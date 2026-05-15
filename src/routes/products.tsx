import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/catalog.functions";
import { waLink } from "@/lib/contact";
import { useMemo, useState } from "react";

const TYPES = ["All", "Shampoo", "HairGel", "Weave", "Braid"] as const;
type T = (typeof TYPES)[number];

const LABELS: Record<string, string> = {
  Shampoo: "Shampoo",
  HairGel: "Hair Gel",
  Weave: "Weave",
  Braid: "Braiding Hair",
};

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Shampoo, Hair Gel & Weaves | Glam Studio" },
      { name: "description", content: "Buy shampoo, hair gel, weaves and braiding hair from Glam Studio Chinhoyi. Order via WhatsApp." },
      { property: "og:title", content: "Products — Glam Studio" },
      { property: "og:description", content: "Quality shampoo, hair gel, weaves and braiding hair in stock." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glam Studio" },
      { property: "og:url", content: "/products" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Products — Glam Studio" },
      { name: "twitter:description", content: "Quality shampoo, hair gel, weaves and braiding hair in stock." },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
  const [type, setType] = useState<T>("All");

  const products = data?.products ?? [];
  const filtered = useMemo(
    () => (type === "All" ? products : products.filter((p: any) => p.type === type)),
    [products, type],
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Shop</span>
        <h1 className="mt-3 font-display text-5xl">Products</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
        <p className="text-foreground/80">Shampoo, hair gel, weaves and braiding hair — order via WhatsApp.</p>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`min-h-[40px] rounded-full border px-4 text-sm ${type === t ? "border-gold bg-gold text-primary-foreground" : "border-border"}`}
            >
              {t === "All" ? "All" : LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p: any) => (
              <article key={p.id} className="rounded-md border border-border/60 bg-card/40 p-5">
                <div className="flex items-center gap-3">
                  {(p.type === "Weave" || p.type === "Braid") && (
                    <span
                      className="h-10 w-10 rounded-full border border-border"
                      style={{ background: p.color_hex ?? "#000" }}
                      aria-hidden
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="font-display text-lg">{p.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {LABELS[p.type] ?? p.type}
                      {p.color && p.color !== "N/A" ? ` · ${p.color}` : ""}
                      {p.length_inches ? ` · ${p.length_inches}"` : ""}
                    </p>
                  </div>
                  <span className="font-display text-xl text-gold">${p.price}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {p.stock_qty > 0 ? `${p.stock_qty} in stock` : "Out of stock"}
                </p>
                <a
                  href={waLink(`Hi Glam Studio, I'd like to order: ${p.name} ($${p.price}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-sm border border-gold text-sm text-gold hover:bg-gold hover:text-primary-foreground"
                >
                  Order on WhatsApp
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
