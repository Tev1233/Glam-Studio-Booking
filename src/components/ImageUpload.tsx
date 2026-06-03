import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  bucket: "product-images" | "gallery-images";
  value: string;
  onChange: (path: string) => void;
};

export function ImageUpload({ bucket, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const displayedUrl = preview ?? (value?.startsWith("http") ? value : null);

  const upload = async (file: File) => {
    setErr("");
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image must be under 5MB");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      onChange(path);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {displayedUrl ? (
        <div className="relative">
          <img src={displayedUrl} alt="Preview" className="h-40 w-full rounded-sm border border-border object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange("");
            }}
            className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-foreground"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-card/40 text-xs text-muted-foreground hover:border-gold disabled:opacity-50"
        >
          <Upload size={20} />
          {busy ? "Uploading…" : "Click to upload image"}
        </button>
      )}
      {value && !displayedUrl && (
        <p className="truncate text-[10px] text-muted-foreground">Stored: {value}</p>
      )}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
