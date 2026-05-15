import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListAll, adminUpsertStyle, adminDeleteStyle } from "@/lib/admin.functions";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/styles")({
  head: () => ({
    meta: [
      { title: "Admin · Styles — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminStyles,
});

const empty = {
  id: undefined as string | undefined,
  name: "",
  category: "Braids" as "Braids" | "Weaves" | "Natural" | "Locs" | "Other",
  description: "",
  base_price: 0,
  image_url: "",
  active: true,
};

function AdminStyles() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(adminListAll);
  const upsert = useServerFn(adminUpsertStyle);
  const del = useServerFn(adminDeleteStyle);
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
          base_price: Number(form.base_price),
          description: form.description || null,
          image_url: form.image_url || null,
        },
      });
      qc.invalidateQueries({ queryKey: ["admin-all"] });
      qc.invalidateQueries({ queryKey: ["styles"] });
      reset();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this style?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-all"] });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-2">
        <h2 className="font-display text-2xl">Styles</h2>
        <ul className="divide-y divide-border/60 rounded-md border border-border/60">
          {(data?.styles ?? []).map((s: any) => (
            <li key={s.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.category} · ${s.base_price} {!s.active && "· hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...s, description: s.description ?? "", image_url: s.image_url ?? "" })}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-border px-3 text-xs"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => remove(s.id)}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-destructive/60 px-3 text-xs text-destructive"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </li>
          ))}
          {data?.styles.length === 0 && <li className="p-4 text-sm text-muted-foreground">No styles yet.</li>}
        </ul>
      </div>
      <aside className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <h3 className="font-display text-xl">{form.id ? "Edit style" : "Add style"}</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as any })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        >
          {["Braids", "Weaves", "Natural", "Locs", "Other"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          placeholder="Base price (USD)"
          value={form.base_price}
          onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <input
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <textarea
          rows={3}
          placeholder="Description"
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
