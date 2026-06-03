import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, User as UserIcon, Database } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin · Settings — Glam Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-2xl">Settings</h2>

      <div className="space-y-4 rounded-md border border-border/60 bg-card/40 p-5">
        <div className="flex items-center gap-3">
          <UserIcon className="text-gold" />
          <h3 className="font-display text-xl">Account</h3>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email ?? "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">User ID</span>
            <span className="truncate font-mono text-xs">{user?.id ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-gold" />
          <h3 className="font-display text-xl">Security</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Role-based access is enforced at the database level via row-level security policies and a
          security-definer <code className="rounded bg-muted px-1">has_role()</code> function. Admin role
          assignments live in a separate <code className="rounded bg-muted px-1">user_roles</code> table,
          which prevents privilege escalation.
        </p>
      </div>

      <div className="space-y-3 rounded-md border border-border/60 bg-card/40 p-5">
        <div className="flex items-center gap-3">
          <Database className="text-gold" />
          <h3 className="font-display text-xl">Storage</h3>
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• <span className="text-foreground">product-images</span> — admin upload, public read</li>
          <li>• <span className="text-foreground">gallery-images</span> — admin upload, public read</li>
        </ul>
      </div>
    </div>
  );
}
