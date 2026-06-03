import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListAll, adminUpsertProduct, adminDeleteProduct } from "@/lib/admin.functions";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { HAIR_COLORS } from "@/lib/colors";
import { ImageUpload } from "@/components/ImageUpload";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/products")({
  head: () => ({
    meta: [
      { title: "Admin · Products — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProducts,
});

const empty = {
  id: undefined as string | undefined,
  name: "",
  type: "Weave" as "Weave" | "Braid" | "Shampoo" | "HairGel",
  color: "Natural Black",
  color_hex: "#0d0d0d",
  length_inches: null as number | null,
  price: 0,
  stock_qty: 0,
  description: "",
  image_url: "",
  active: true,
};

function AdminProducts() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(adminListAll);
  const upsert = useServerFn(adminUpsertProduct);
  const del = useServerFn(adminDeleteProduct);
  const { data, isLoading } = useQuery({ queryKey: ["admin-all"], queryFn: () => fetchAll() });

  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => setForm(empty);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const list = data?.products ?? [];
    if (!s) return list;
    return list.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(s) ||
        p.color?.toLowerCase().includes(s) ||
        p.type?.toLowerCase().includes(s),
    );
  }, [data, search]);

  const save = async () => {
    setBusy(true);
    try {
      await upsert({
        data: {
          ...form,
          price: Number(form.price),
          stock_qty: Number(form.stock_qty),
          length_inches: form.length_inches ? Number(form.length_inches) : null,
          color_hex: form.color_hex || null,
          description: form.description || null,
          image_url: form.image_url || null,
        },
      });
      qc.invalidateQueries({ queryKey: ["admin-all"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(form.id ? "Product updated" : "Product added");
      reset();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirmId) return;
    setBusy(true);
    try {
      await del({ data: { id: confirmId } });
      qc.invalidateQueries({ queryKey: ["admin-all"] });
      toast.success("Product deleted");
      setConfirmId(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Products</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, color, type…"
              className="h-10 w-64 rounded-sm border border-border bg-background pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">Loading…</td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">No products found.</td>
                </tr>
              )}
              {filtered.map((p: any) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-sm object-cover" />
                    ) : (
                      <div
                        className="h-12 w-12 rounded-sm border border-border"
                        style={{ background: p.color_hex ?? "#000" }}
                        aria-hidden
                      />
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.color}
                      {p.length_inches ? ` · ${p.length_inches}"` : ""}
                    </p>
                  </td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3 text-right">${Number(p.price).toFixed(2)}</td>
                  <td className={`p-3 text-right ${p.stock_qty <= 3 ? "text-destructive" : ""}`}>
                    {p.stock_qty}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setForm({
                            ...p,
                            color_hex: p.color_hex ?? "",
                            description: p.description ?? "",
                            image_url: p.image_url && p.image_url.startsWith("http") ? "" : p.image_url ?? "",
                          })
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-sm border border-border px-3 text-xs"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="inline-flex h-9 items-center gap-1 rounded-sm border border-destructive/60 px-3 text-xs text-destructive"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <h3 className="font-display text-xl">{form.id ? "Edit product" : "Add product"}</h3>
        <ImageUpload
          bucket="product-images"
          value={form.image_url}
          onChange={(p) => setForm({ ...form, image_url: p })}
        />
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        >
          <option value="Weave">Weave</option>
          <option value="Braid">Braid</option>
          <option value="Shampoo">Shampoo</option>
          <option value="HairGel">Hair Gel</option>
        </select>
        <select
          value={form.color}
          onChange={(e) => {
            const swatch = HAIR_COLORS.find((c) => c.name === e.target.value);
            setForm({ ...form, color: e.target.value, color_hex: swatch?.hex ?? form.color_hex });
          }}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        >
          {HAIR_COLORS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Length (in)"
            value={form.length_inches ?? ""}
            onChange={(e) =>
              setForm({ ...form, length_inches: e.target.value === "" ? null : Number(e.target.value) })
            }
            className="h-11 rounded-sm border border-border bg-background px-3 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="h-11 rounded-sm border border-border bg-background px-3 text-sm"
          />
        </div>
        <input
          type="number"
          min={0}
          placeholder="Stock quantity"
          value={form.stock_qty}
          onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <textarea
          rows={3}
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-sm border border-border bg-background p-3 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={busy || !form.name}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-sm bg-gold text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Plus size={14} /> {form.id ? "Update" : "Add"}
          </button>
          {form.id && (
            <button onClick={reset} className="h-11 rounded-sm border border-border px-3 text-sm">
              Cancel
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete product?"
        message="This will remove the product and its uploaded image."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
        busy={busy}
      />
    </div>
  );
}
