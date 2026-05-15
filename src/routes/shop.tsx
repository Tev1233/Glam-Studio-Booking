import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/catalog.functions";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Hair — Weaves & Braids | Glam Studio" },
      { name: "description", content: "Browse weaves and braiding hair in stock at Glam Studio Chinhoyi. Pick your colour and length." },
      { property: "og:title", content: "Shop Weaves & Braids — Glam Studio" },
      { property: "og:description", content: "Quality weaves and braiding hair, in stock now." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/shop" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shop Weaves & Braids — Glam Studio" },
      { name: "twitter:description", content: "Quality weaves and braiding hair, in stock now." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
  const [type, setType] = useState<"All" | "Weave" | "Braid">("All");
  const [color, setColor] = useState<string>("All");

  const products = data?.products ?? [];
  const colors = useMemo(() => Array.from(new Set(products.map((p: any) => p.color))), [products]);
  const filtered = products.filter(
    (p: any) => (type === "All" || p.type === type) && (color === "All" || p.color === color),
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Shop</span>
        <h1 className="mt-3 font-display text-5xl">Weaves & Braids</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
        <p className="text-foreground/80">Pick the weave or braiding hair you'd like used in your style.</p>
      </section>

      <div className="mx-auto max-w-6xl space-y-3 px-4">
        <div className="flex flex-wrap gap-2">
          {(["All", "Weave", "Braid"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`min-h-[40px] rounded-full border px-4 text-sm ${type === t ? "border-gold bg-gold text-primary-foreground" : "border-border"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...colors].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`min-h-[36px] rounded-full border px-3 text-xs ${color === c ? "border-gold bg-gold/15" : "border-border"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No products match your filter.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p: any) => (
              <article key={p.id} className="rounded-md border border-border/60 bg-card/40 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="h-10 w-10 rounded-full border border-border"
                    style={{ background: p.color_hex ?? "#000" }}
                    aria-hidden
                  />
                  <div className="flex-1">
                    <h2 className="font-display text-lg">{p.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {p.type} · {p.color}
                      {p.length_inches ? ` · ${p.length_inches}"` : ""}
                    </p>
                  </div>
                  <span className="font-display text-xl text-gold">${p.price}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {p.stock_qty > 0 ? `${p.stock_qty} in stock` : "Out of stock"}
                </p>
                <Link
                  to="/book"
                  search={{
                    service: p.type === "Weave" ? "weave" : "braids",
                    color: p.color,
                    product: p.name,
                  }}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-sm border border-gold text-sm text-gold hover:bg-gold hover:text-primary-foreground"
                >
                  Use this in my booking
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
