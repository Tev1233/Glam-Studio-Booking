## Goal

Add a real backend (Lovable Cloud), an authenticated admin area to manage styles + weave/braid stock, customer-facing color & weave/braid product selection, improved gallery filtering, and complete OG/Twitter meta on every page.

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud, then create:

- `profiles` (id → auth.users, display_name) + auto-create trigger on signup.
- `app_role` enum (`admin`, `user`) + `user_roles` table + `has_role(uuid, app_role)` security-definer function (per the user-roles security pattern — never store role on profile).
- `styles` table — id, name, category (Braids/Weaves/Natural/Locs), description, base_price, image_url, active. RLS: public SELECT, admin INSERT/UPDATE/DELETE.
- `products` table (weave/braid hair to buy) — id, name, type (Weave/Braid), color, length, price, stock_qty, image_url, active. RLS: public SELECT, admin write.
- All tables: RLS on. Policies use `has_role(auth.uid(),'admin')` for writes.

## 2. Auth

- `/login` — email + password sign in, with sign-up tab. After signup, profile auto-created via trigger; user role defaults to `user`. Admins are promoted manually in the DB (note shown to user).
- `_authenticated/_admin` pathless layout routes that gate via `beforeLoad` + `has_role` check (calling a `requireSupabaseAuth` server fn `getMyRole`).

## 3. Admin pages (`/admin/*`, noindex)

- `/admin` dashboard — links to Styles + Products.
- `/admin/styles` — list + create/edit/delete styles (name, category, price, description, image URL).
- `/admin/products` — list + create/edit/delete weave/braid products with stock count and color.
- Own `head()` with `<meta name="robots" content="noindex,nofollow">` and own canonical.

## 4. Customer-facing product/color picker

- New public route `/shop` — browse weaves & braids (cards filterable by type Weave/Braid, color, length, price). "Add to booking" button passes selection to booking flow.
- Booking page (`/book`): when service is Braids or Weave, add a Color step that lets the customer pick from in-stock products of the matching type (or pick a color swatch from a curated list if no product chosen). Selection included in the WhatsApp message.
- Gallery "Book This Style" modal: add color picker (curated palette) before navigating to /book, passes `color` search param.

## 5. Gallery filtering improvements

- Existing filter (All/Braids/Weaves/Natural/Locs) kept.
- Add secondary filter chips for **available product colors** (sourced from `products` table) so users can see styles + jump straight to matching weave/braid stock.
- Add a search box for style names.
- Add sort (newest / name).

## 6. SEO — Open Graph + Twitter on every page

- `__root.tsx`: keeps sitewide defaults (`og:type=website`, `og:site_name`, twitter card, theme-color).
- Each route (`/`, `/services`, `/gallery`, `/book`, `/about`, `/shop`, `/login`, `/admin*`) gets a full `head()` with: `title`, `description`, `og:title`, `og:description`, `og:url`, `og:image` (using `hero.jpg` or category image), `twitter:title`, `twitter:description`, `twitter:image`. Admin/login routes add `robots: noindex,nofollow`.
- `public/robots.txt`: keep `Allow: /` and add `Disallow: /admin` and `Disallow: /login`.
- `sitemap.xml`: keep existing; add `/shop`. Exclude admin/login.

## 7. Technical notes

- New files:
  - `src/integrations/supabase/*` (auto from Cloud enable)
  - `src/lib/auth.functions.ts` — `getMyRole`, `getMyProfile` server fns
  - `src/lib/admin.functions.ts` — admin CRUD server fns (require auth + admin role check inside handler)
  - `src/lib/catalog.functions.ts` — public read of styles/products
  - `src/routes/login.tsx`
  - `src/routes/_authenticated.tsx`, `src/routes/_authenticated/_admin.tsx`
  - `src/routes/_authenticated/_admin/admin.tsx` (index), `admin.styles.tsx`, `admin.products.tsx`
  - `src/routes/shop.tsx`
  - `src/components/ColorPicker.tsx`
- Updated files: `book.tsx` (color step), `gallery.tsx` (extra filters + color in modal), all route `head()` blocks, `__root.tsx` twitter defaults, `robots.txt`, `sitemap[.]xml.ts`.
- Use `requireSupabaseAuth` middleware on all admin server fns; inside handler, verify `has_role(userId,'admin')` via the authenticated client and throw 403 if not admin.
- After enabling Cloud, surface the Cloud docs link and tell user how to promote themselves to admin (one INSERT into `user_roles`).

Plan complete — confirm to proceed.