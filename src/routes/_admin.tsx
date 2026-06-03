import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyRole } from "@/lib/auth.functions";
import { LayoutDashboard, LogOut, Package, Image as ImageIcon, Settings, ShieldCheck, Menu, X, Scissors } from "lucide-react";
import { useState } from "react";

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

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/styles", label: "Styles", icon: Scissors, exact: false },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const fetchRole = useServerFn(getMyRole);
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-role"],
    queryFn: () => fetchRole(),
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    // Non-admin: redirect to homepage as required
    if (typeof window !== "undefined") {
      navigate({ to: "/" });
    }
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-24 text-center">
          <ShieldCheck className="mx-auto mb-4 text-gold" size={32} />
          <h1 className="font-display text-3xl">Admins only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Redirecting you to the home page…
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
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-12 pt-8">
        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "fixed inset-y-0 left-0 z-20 w-64 translate-x-0" : "fixed -translate-x-full"
          } top-0 h-screen overflow-y-auto border-r border-border/60 bg-card/95 p-5 backdrop-blur transition-transform md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-56 md:translate-x-0 md:bg-card/40`}
        >
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Admin</span>
            <h2 className="font-display text-2xl">Salon Manager</h2>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-gold"
                activeProps={{ className: "bg-muted text-gold" }}
                activeOptions={{ exact: item.exact }}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={signOut}
            className="mt-6 flex w-full items-center gap-3 rounded-sm border border-border px-3 py-2.5 text-sm hover:border-destructive hover:text-destructive"
          >
            <LogOut size={14} /> Sign out
          </button>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </SiteLayout>
  );
}
