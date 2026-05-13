import { Link } from "@tanstack/react-router";
import { Home, Scissors, Image as ImageIcon, CalendarCheck } from "lucide-react";

const items = [
  { to: "/" as const, label: "Home", Icon: Home, exact: true },
  { to: "/services" as const, label: "Services", Icon: Scissors, exact: false },
  { to: "/gallery" as const, label: "Gallery", Icon: ImageIcon, exact: false },
  { to: "/book" as const, label: "Book", Icon: CalendarCheck, exact: false },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-gold" }}
            >
              <Icon size={20} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
