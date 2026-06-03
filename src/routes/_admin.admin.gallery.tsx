import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListAll, adminUpsertGallery, adminDeleteGallery } from "@/lib/admin.functions";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Admin · Gallery — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminGallery,
});

const empty = {
  id: undefined as string | undefined,
  title: "",
  description: "",
  image_url: "",
};

function AdminGallery() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(adminListAll);
  const upsert = useServerFn(adminUpsertGallery);
  const del = useServerFn(adminDeleteGallery);
  const { data, isLoading } = useQuery({ queryKey: ["admin-all"], queryFn: () => fetchAll() });

  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => setForm(empty);

  const save = async () => {
    if (!form.title || !form.image_url) {
      toast.error("Title and image are required");
      return;
    }
    setBusy(true);
    try {
      await upsert({
        data: {
          id: form.id,
          title: form.title,
          description: form.description || null,
          image_url: form.image_url,
        },
      });
      qc.invalidateQueries({ queryKey: ["admin-all"] });
      qc.invalidateQueries({ queryKey: ["public-gallery"] });
      toast.success(form.id ? "Image updated" : "Image added");
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
      qc.invalidateQueries({ queryKey: ["public-gallery"] });
      toast.success("Image removed");
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
        <h2 className="font-display text-2xl">Gallery images</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(data?.gallery ?? []).map((g: any) => (
              <div key={g.id} className="group relative overflow-hidden rounded-sm border border-border/60 bg-card">
                {g.image_url ? (
                  <img src={g.image_url} alt={g.title} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="aspect-square w-full bg-muted" />
                )}
                <div className="p-2">
                  <p className="truncate text-sm font-medium">{g.title}</p>
                  {g.description && <p className="truncate text-xs text-muted-foreground">{g.description}</p>}
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() =>
                      setForm({
                        id: g.id,
                        title: g.title,
                        description: g.description ?? "",
                        image_url: g.image_url ?? "",
                      })
                    }
                    className="rounded-sm bg-background/90 p-1.5"
                    aria-label="Edit"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setConfirmId(g.id)}
                    className="rounded-sm bg-background/90 p-1.5 text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            {data?.gallery?.length === 0 && (
              <p className="col-span-full p-4 text-sm text-muted-foreground">No gallery images yet.</p>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <h3 className="font-display text-xl">{form.id ? "Edit image" : "Add image"}</h3>
        <ImageUpload
          bucket="gallery-images"
          value={form.image_url}
          onChange={(p) => setForm({ ...form, image_url: p })}
        />
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
        />
        <textarea
          rows={3}
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-sm border border-border bg-background p-3 text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={busy || !form.title || !form.image_url}
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
        title="Delete image?"
        message="This will permanently remove the image from your gallery and storage."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
        busy={busy}
      />
    </div>
  );
}
