import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListAll, adminUpsertProduct, adminDeleteProduct } from "@/lib/admin.functions";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { HAIR_COLORS } from "@/lib/colors";

export const Route = createFileRoute("/_admin/admin/products")({
  head: () => ({
    meta: [
      { title: "Admin · Stock — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProducts,
});

const empty = {
  id: undefined as string | undefined,
  name: "",
  type: "Weave" as "Weave" | "Braid",
  color: "Natural Black",
  color_hex: "#0d0d0d",
  length_inches: null as number | null,
  price: 0,
  stock_qty: 0,
  image_url: "",
  active: true,
};

function AdminProducts() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(adminListAll);
  const upsert = useServerFn(adminUpsertProduct);
  const del = useServerFn(adminDeleteProduct);
  const { data } = useQuery({ queryKey: ["admin-all"], queryFn: () => fetchAll() });

  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const reset = () => setForm(empty);

  const save = async () => {
    setErr("");
    setBusy(true);
    try {
      await upsert({
        data: {
          ...form,
          price: Number(form.price),
          stock_qty: Number(form.stock_qty),
          length_inches: form.length_inches ? Number(form.length_inches) : null,
          color_hex: form.color_hex || null,
          image_url: form.image_url || null,
        },
      });
      qc.invalidateQueries({ queryKey: ["admin-all"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      reset();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-all"] });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-2">
        <h2 className="font-display text-2xl">Weave & braid stock</h2>
        <ul className="divide-y divide-border/60 rounded-md border border-border/60">
          {(data?.products ?? []).map((p: any) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-6 w-6 rounded-full border border-border"
                  style={{ background: p.color_hex ?? "#000" }}
                  aria-hidden
                />
                <div>
                  <p className="font-medium">
                    {p.name} <span className="text-xs text-muted-foreground">· {p.type}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.color}
                    {p.length_inches ? ` · ${p.length_inches}"` : ""} · ${p.price} ·{" "}
                    <span className={p.stock_qty <= 3 ? "text-destructive" : ""}>{p.stock_qty} in stock</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setForm({
                      ...p,
                      color_hex: p.color_hex ?? "",
                      image_url: p.image_url ?? "",
                    })
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-border px-3 text-xs"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-destructive/60 px-3 text-xs text-destructive"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </li>
          ))}
          {data?.products.length === 0 && <li className="p-4 text-sm text-muted-foreground">No stock yet.</li>}
        </ul>
      </div>
      <aside className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <h3 className="font-display text-xl">{form.id ? "Edit product" : "Add product"}</h3>
        <input
          placeholder="Name (e.g. Brazilian Body Wave)"
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
        <input
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
        {err && <p className="text-xs text-destructive">{err}</p>}
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
    </div>
  );
}
