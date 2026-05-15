import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { waLink } from "@/lib/contact";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Glam Studio" },
      { name: "description", content: "Glam Studio is a Chinhoyi hair salon serving women since 2015." },
      { property: "og:title", content: "About — Glam Studio" },
      { property: "og:description", content: "Quality, community and local pride in every appointment." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glam Studio" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About — Glam Studio" },
      { name: "twitter:description", content: "Quality, community and local pride in every appointment." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { t: "Quality", d: "Trusted products and patient hands. We take the time your hair deserves." },
  { t: "Community", d: "We're more than a salon — we're part of the neighbourhood we grew up in." },
  { t: "Local Pride", d: "Made in Chinhoyi, made for Chinhoyi. Real prices, real people." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</span>
        <h1 className="mt-3 font-display text-5xl">About Glam Studio</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
        <p className="text-foreground/85">
          Glam Studio has been serving the women of Chinhoyi since 2015. We specialise in braids, weaves, relaxers and natural
          hair — using quality products and giving every client the time and care they deserve. From a first set of cornrows
          to a wedding-day install, we've been here for every chapter.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="aspect-[16/10] overflow-hidden rounded-md border border-border/60 bg-card">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-card to-background">
            <p className="text-sm italic text-muted-foreground">Team photo coming soon</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-md border border-border/60 bg-card/40 p-6">
              <h3 className="font-display text-2xl text-gold">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center">
        <h2 className="font-display text-3xl">Ready when you are</h2>
        <p className="mt-3 text-muted-foreground">Send us a message — we usually reply within the hour.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={waLink("Hi Glam Studio!")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-gold px-6 text-sm font-medium text-primary-foreground"
          >
            WhatsApp Us
          </a>
          <Link
            to="/book"
            className="inline-flex h-12 items-center justify-center rounded-sm border border-gold px-6 text-sm font-medium text-gold"
          >
            Book Online
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
