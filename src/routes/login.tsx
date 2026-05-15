import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: search.redirect ?? "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — Glam Studio" },
      { name: "description", content: "Sign in to Glam Studio." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Sign in — Glam Studio" },
      { property: "og:description", content: "Staff login for Glam Studio." },
      { property: "og:url", content: "/login" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Sign in — Glam Studio" },
      { name: "twitter:description", content: "Staff login." },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

const credSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error: e } = await supabase.auth.signInWithPassword(parsed.data);
        if (e) throw e;
        navigate({ to: search.redirect ?? "/" });
      } else {
        const { error: e } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (e) throw e;
        setInfo("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 pb-24 pt-20">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Staff Area</span>
          <h1 className="mt-3 font-display text-4xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
          <div className="gold-divider mx-auto my-6 w-24" />
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-sm border border-border/60 p-1">
          <button
            onClick={() => setMode("signin")}
            className={`min-h-[40px] rounded-sm text-sm ${mode === "signin" ? "bg-gold text-primary-foreground" : ""}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`min-h-[40px] rounded-sm text-sm ${mode === "signup" ? "bg-gold text-primary-foreground" : ""}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-md border border-border/60 bg-card/40 p-6">
          <label className="block text-sm">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12 w-full rounded-sm border border-border bg-background px-3 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-sm border border-border bg-background px-3 outline-none focus:border-gold"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-gold">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-gold text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="underline-offset-4 hover:underline">
              Back to site
            </Link>
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
