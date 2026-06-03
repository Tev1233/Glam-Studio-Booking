import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

export function ConfirmDialog({ open, title, message, onCancel, onConfirm, busy }: Props) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-3 flex items-center gap-3">
          <AlertTriangle className="text-destructive" />
          <h3 className="font-display text-xl">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="h-10 rounded-sm border border-border px-4 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="h-10 rounded-sm bg-destructive px-4 text-sm font-medium text-destructive-foreground disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
