import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListAll } from "@/lib/admin.functions";
import { Package, Scissors, Image as ImageIcon, AlertCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/_admin/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchAll = useServerFn(adminListAll);
  const { data, isLoading } = useQuery({ queryKey: ["admin-all"], queryFn: () => fetchAll() });

  const styleCount = data?.styles.length ?? 0;
  const productCount = data?.products.length ?? 0;
  const galleryCount = data?.gallery?.length ?? 0;
  const lowStock = (data?.products ?? []).filter((p: any) => p.stock_qty <= 3).length;

  // Recent activity: combine 5 newest items across tables
  const recent = [
    ...(data?.products ?? []).map((p: any) => ({ kind: "Product", name: p.name, at: p.updated_at ?? p.created_at })),
    ...(data?.styles ?? []).map((s: any) => ({ kind: "Style", name: s.name, at: s.updated_at ?? s.created_at })),
    ...(data?.gallery ?? []).map((g: any) => ({ kind: "Gallery", name: g.title, at: g.updated_at ?? g.created_at })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your salon's inventory and content.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: productCount, icon: Package, accent: "text-gold" },
          { label: "Styles", value: styleCount, icon: Scissors, accent: "text-gold" },
          { label: "Gallery images", value: galleryCount, icon: ImageIcon, accent: "text-gold" },
          { label: "Low stock (≤3)", value: lowStock, icon: AlertCircle, accent: lowStock > 0 ? "text-destructive" : "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-md border border-border/60 bg-card/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className={s.accent} size={18} />
            </div>
            <p className={`mt-2 font-display text-4xl ${s.accent}`}>
              {isLoading ? "…" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 font-display text-xl">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/admin/products"
            className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 p-5 transition-colors hover:border-gold"
          >
            <Plus className="text-gold" size={18} />
            <div>
              <p className="font-medium">Add product</p>
              <p className="text-xs text-muted-foreground">Weaves, braids, shampoo, gel</p>
            </div>
          </Link>
          <Link
            to="/admin/gallery"
            className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 p-5 transition-colors hover:border-gold"
          >
            <Plus className="text-gold" size={18} />
            <div>
              <p className="font-medium">Upload to gallery</p>
              <p className="text-xs text-muted-foreground">Showcase recent work</p>
            </div>
          </Link>
          <Link
            to="/admin/styles"
            className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 p-5 transition-colors hover:border-gold"
          >
            <Plus className="text-gold" size={18} />
            <div>
              <p className="font-medium">Add style</p>
              <p className="text-xs text-muted-foreground">Bookable hairstyle</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="mb-3 font-display text-xl">Recent activity</h2>
        <div className="overflow-hidden rounded-md border border-border/60 bg-card/40">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : recent.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nothing yet — start by adding a product or gallery image.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((r, i) => (
                <li key={i} className="flex items-center justify-between p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="rounded-sm bg-muted px-2 py-0.5 text-xs">{r.kind}</span>
                    <span>{r.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
