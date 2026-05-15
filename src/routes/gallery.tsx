import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { gallery, type GalleryItem } from "@/lib/gallery";
import { useState } from "react";
import { X } from "lucide-react";

const filters = ["All", "Braids", "Weaves", "Natural", "Locs"] as const;
type Filter = (typeof filters)[number];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Glam Studio Hairstyles" },
      { name: "description", content: "Recent braids, weaves, naturals and locs from Glam Studio Chinhoyi." },
      { property: "og:title", content: "Gallery — Glam Studio" },
      { property: "og:description", content: "Browse our hairstyle gallery and book your favourite look." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glam Studio" },
      { property: "og:url", content: "/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gallery — Glam Studio" },
      { name: "twitter:description", content: "Browse our hairstyle gallery and book your favourite look." },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<GalleryItem | null>(null);

  const items = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Inspiration</span>
        <h1 className="mt-3 font-display text-5xl">Gallery</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
      </section>

      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap justify-center gap-2 px-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-h-[44px] rounded-full border px-5 text-sm transition-colors ${
              filter === f ? "border-gold bg-gold text-primary-foreground" : "border-border text-foreground/80 hover:border-gold/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {items.map((g) => (
            <button
              key={g.label}
              onClick={() => setOpen(g)}
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-card"
            >
              <img src={g.src} alt={g.label} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3 text-left">
                <p className="text-xs text-cream">{g.label}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4"
        >
          <button
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full border border-border p-2 text-foreground"
            onClick={() => setOpen(null)}
          >
            <X size={20} />
          </button>
          <div className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={open.src} alt={open.label} className="max-h-[75vh] w-auto rounded-sm object-contain" />
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              <h2 className="font-display text-2xl">{open.label}</h2>
              <Link
                to="/book"
                search={{ service: open.serviceId, style: open.label }}
                className="inline-flex h-12 items-center justify-center rounded-sm bg-gold px-6 text-sm font-medium text-primary-foreground"
              >
                Book This Style
              </Link>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
