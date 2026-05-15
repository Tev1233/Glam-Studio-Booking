import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyRole } from "@/lib/auth.functions";
import { LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [{ name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const fetchRole = useServerFn(getMyRole);
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-role"],
    queryFn: () => fetchRole(),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">Checking access…</div>
      </SiteLayout>
    );
  }

  if (error || !data?.isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-24 text-center">
          <ShieldCheck className="mx-auto mb-4 text-gold" size={32} />
          <h1 className="font-display text-3xl">Admins only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in but don't have admin access. Ask the salon owner to grant your account the
            admin role from the backend.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/" className="inline-flex h-11 items-center rounded-sm border border-border px-4 text-sm">
              Home
            </Link>
            <button
              onClick={signOut}
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-gold px-4 text-sm font-medium text-primary-foreground"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Admin</span>
            <h1 className="font-display text-3xl">Salon Manager</h1>
          </div>
          <button
            onClick={signOut}
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-border px-3 text-sm"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border/60 pb-2">
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/styles", label: "Styles" },
            { to: "/admin/products", label: "Stock" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-sm px-3 py-2 text-sm text-foreground/80 hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </section>
    </SiteLayout>
  );
}
