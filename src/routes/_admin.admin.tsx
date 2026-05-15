import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListAll } from "@/lib/admin.functions";
import { Package, Scissors } from "lucide-react";

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
  const { data } = useQuery({ queryKey: ["admin-all"], queryFn: () => fetchAll() });

  const styleCount = data?.styles.length ?? 0;
  const productCount = data?.products.length ?? 0;
  const lowStock = (data?.products ?? []).filter((p: any) => p.stock_qty <= 3).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border/60 bg-card/40 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Styles</p>
          <p className="mt-2 font-display text-4xl text-gold">{styleCount}</p>
        </div>
        <div className="rounded-md border border-border/60 bg-card/40 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Products in stock</p>
          <p className="mt-2 font-display text-4xl text-gold">{productCount}</p>
        </div>
        <div className="rounded-md border border-border/60 bg-card/40 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Low stock (≤3)</p>
          <p className="mt-2 font-display text-4xl text-destructive">{lowStock}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/admin/styles"
          className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 p-5 hover:border-gold"
        >
          <Scissors className="text-gold" /> Manage Styles
        </Link>
        <Link
          to="/admin/products"
          className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 p-5 hover:border-gold"
        >
          <Package className="text-gold" /> Manage Weave & Braid Stock
        </Link>
      </div>
    </div>
  );
}
