# HANDOFF — Monowara Hospital (mh)

> Read with `MH_MASTER_PLAN.md` (project knowledge) + `AGENTS.md`. Update at the end of every phase.

## Status

| Phase | State |
|---|---|
| **1 — Foundation & design system** | ✅ Done (2026-10-20) |
| 2 — Content migration + Homepage | ✅ Done (2026-10-20) — run `node scripts/fetch-wp-images.mjs` once locally |
| 3 — Doctors & Departments | ✅ Done (2026-10-20) |
| 4 — Packages, booking & content pages | ✅ Done (2026-10-21) |
| 5 — Polish, SEO & demo | ✅ Done (2026-10-21) — Vercel deploy + client demo by Sifat (`docs/DEMO_CHECKLIST.md`) |

---

## Fonts + doctors rail (2026-10-24)
- **Latin font → Google Sans** (Sifat: Newsreader + Hanken Grotesk read as "AI template"). Self-hosted from `@fontsource-variable/google-sans@5.3.2` (OFL) → `app/fonts/google-sans-latin-wght-{normal,italic}.woff2` (variable 400–700, ~36 KB each, italic only fetched if used). `lib/fonts.js` exports `googleSans` (`--font-gsans`); `--font-sans` and `--font-display` both use it. Headings 500 / −0.02em.
- **Accent phrase (`*word*`) is colour-only now** — no italic serif (`Emphasis.js`); loader EN word no longer italic.
- **Bangla font → Google Sans Bengali** (Sifat: Hind Siliguri's ১ read like a letter). One variable file `public/fonts/bn/google-sans-bengali-wght.v1.woff2` (75 KB, 400–700) replaces Hind 400/500/600 + Tiro (~300 KB); used for BN body **and** headings (no more serif BN headings). `--font-bn` in globals.css; `--font-hind`/`--font-tiro` kept as aliases. BN preload = this one file.
- `scripts/og-card.py` now uses Google Sans (Latin + Bengali), accent = teal colour (no italic); `public/og/default-{en,bn}.jpg` re-rendered.
- Old font files deleted (nothing references them): `app/fonts/newsreader-*`, `app/fonts/hanken-*`, `public/fonts/bn/hind-*`, `public/fonts/bn/tiro-*`.
- **Hero:** background contour lines (ContourLines + Drift) removed from `Hero.js` (Sifat). `ContourLines` stays in `ui/Ornaments.js` (unused on home now).
- **Doctors rail:** the cards scrolled vertically (hidden scrollbar) — `overflow-x: auto` makes overflow-y `auto` too. Added `overflow-y-hidden` to `Rail.js`. Horizontal scrolling unchanged.

---

## Post-Phase-5: homepage motion + doctor card photo (2026-10-21)
- **Why no animation package until now:** deliberate — the site used one IntersectionObserver + Web Animations API (`components/motion/Reveal.js`, 0 KB dependency) to protect LCP on slow phones. Sifat asked for a premium, light homepage motion layer → added **`motion@13.5.1`** (framer-motion, `motion/react`), pinned exact (14.x was a 3-week-old major).
- `components/motion/Motion.js` — `MotionRoot` (LazyMotion `strict` + async `features.js` chunk, `MotionConfig reducedMotion="user"`), `FadeUp`, `Stagger`/`StaggerItem`, `DrawRule`, `PhotoReveal`, `Drift` (scroll parallax, off with reduced motion). Calm only: expo ease, 0.85–1.3 s, no springs/loops/count-ups.
- **Scope = homepage only** (`app/[lang]/page.js` wraps in `<MotionRoot>`). Every `m.*` must be inside it, otherwise it stays at `initial` (invisible). Inner pages keep `RevealObserver` unchanged.
- `Section` got an opt-in `animate` prop (header rises + hairline rule draws) — default off, other pages untouched.
- What moves: hero photo + contour lines drift on scroll · QuickPanel uses the CSS `data-enter` (above the fold — never an opacity-0 motion element in the first viewport; the hero h1 stays the LCP) · Centres content stagger (cells stay opaque — `gap-px bg-line` grid would flash) · Maternity photo unclips + settles, "মাতৃত্ব" fades in, rows stagger · Packages cards stagger (hover lift now uses `translate`, not `transform`, because motion owns `transform`) · doctor cards rise per card (off-screen rail cards animate when scrolled to) · talks, Visit us rows, CTA band + WhatsApp desks.
- **Doctor card photo:** `aspect-3/2` → `aspect-6/5`, focal `50% 18%`. WP portraits are 268×386 (0.69): 3:2 showed only forehead→chin; 6:5 shows head + shoulders, card +~40 px (laptop 4-up still fits). Photos are low-res → soft on 2× screens until the hospital sends originals (B1 upload: ≥ 800 px wide).
- Verified: `npm run build` ✅, `eslint` ✅ on changed files, Playwright 1440 + 390 + reduced-motion: nothing left hidden in view, no horizontal overflow, no page errors.
- **Sifat:** run `npm install` once (new dependency).
- **Key numbers back on the homepage** (Sifat, 18:13 — client's concept PDF had a stat row; overrides revision 3 "no stats"). `KeyNumbers` redesigned, placed right under the QuickPanel: hairline-separated columns (2×2 on mobile), large serif numeral + unit as an italic teal accent (`33`+, `24`/7, `7` days — split by regex, works with Bangla digits), short teal rule that draws in, staggered rise. Still static figures (no count-up, no white stat cards). Data = `data/home.js` `keyNumbers` (admin-editable; ⚠ client to confirm 33+ years and 100 beds).

---

## Phase 5 — Polish, SEO & demo (3 steps)
Each step is written to the repo + ticked before the next starts. On resume: continue at the first unticked step.
- [x] **5.1 SEO foundation** (2026-10-21)
  - `lib/seo/metadata.js` → `pageMeta({ lang, path, title, description, image?, type?, absoluteTitle?, publishedTime?, modifiedTime? })`. Every page's `generateMetadata` now returns it (24 pages + home). **Why:** Next merges metadata *shallowly* — pages that set `alternates: { canonical }` or `openGraph` were wiping the layout's hreflang and `og:siteName/locale`. Now every page emits canonical + `hreflang` en/bn/x-default + full OG (url, siteName, locale + alternateLocale, title, description, images) + `twitter:card`.
  - OG images: branded 1200×630 JPEG per language `public/og/default-{en,bn}.jpg` (rendered by `scripts/og-card.py` with the site's own fonts + building photo; re-run after logo/photo change). Pages with a photo list it first and the card as fallback. Note: content photos are WebP — fine for Facebook/Google; **B1:** sharp writes a JPEG `og` rendition on upload so WhatsApp previews always show the doctor photo.
  - `lib/seo/schema.js` + `components/seo/JsonLd.js`: `Hospital` (one `@id` = `${SITE_URL}/#hospital`, phones in E.164, 24/7 hours, socials) in the root layout; `MedicalClinic` with `parentOrganization` on `/mh-aesthetic` and `/bhrpc`; `BreadcrumbList` on doctor, department, facility, diagnostic, package, article, job, legal and management pages. Physician + MedicalWebPage now reference the hospital `@id`. Address is split by hand (⚠ B1: structured address fields in Settings).
  - `app/sitemap.js` — 288 URLs (144 EN + 144 BN, matches the 4.9 crawl), each with xhtml hreflang alternates, `lastmod` from `updatedAt`, image entries for doctors/departments/facilities/diagnostics/articles. Built from the same `lib/api` services → admin additions appear after cache revalidation. `robots.js` unchanged: `Disallow: /` unless `NEXT_PUBLIC_SITE_ENV=production`, then it advertises the sitemap.
  - Removed now-unused `href` imports; changed files formatted with Prettier (4 spaces, width 100 — same as the repo).
  - Verified: `npm run build` ✅, `eslint .` ✅, `next start` + curl on `/`, `/bn`, doctor, BN article, facility, MH Aesthetic: correct canonical/hreflang/OG per language, JSON-LD parses; sitemap XML valid, 288 unique URLs.
- [x] **5.2 Quality & performance** (2026-10-21)
  - **Error states:** `app/[lang]/error.js` (localised via `useParams`, Next 16 `retry()`, digest shown as a reference; the [lang] layout — emergency top bar, header, dock — still renders around it) and `app/global-error.js` (own `<html>`, no data fetching, EN/BN from the URL, hotline + emergency from `NEXT_PUBLIC_FALLBACK_HOTLINE/_EMERGENCY`, see `.env.example`). Copy in `lib/i18n/errorCopy.js` (client-safe, not the whole dictionary). Verified with a temporary crashing route in EN + BN.
  - **No `loading.js`:** a segment-wide one breaks the prerender of the `[...rest]` 404 catch-all, and every streaming page already has its own `<Suspense>`. Instead `PageSkeleton` and the `/doctors` results fallback are now ≥ 1 screen tall (`min-h-svh`) → the footer starts below the fold and streamed content no longer shifts it (CLS 0.215/0.301 → 0 on department / BN doctors).
  - **Images:** `sizes` + eager/lazy audit — all correct (only hero / page header / detail photos are eager). New `scripts/optimize-media.mjs` (dry run by default, `--write`): header photos ≤ 1920 w, portrait sources cropped to 3:2 around the slot's `position`, WebP q72 — saved 816 KB (`header-appointment` 615 → 241 KB, `header-packages` 257 → 146 KB). Same rules for the B1 upload pipeline.
  - **Accessibility (axe-core, WCAG 2.2 AA + best practice, 27 routes × 390/1366): 39 issues → 0.** `--color-ink-3` #66797a → #58696a (was 3.6–4.3:1 on paper/paper-2/mint, now ≥ 4.5:1 everywhere, still lighter than ink-2); top bar is a labelled region (`dict.topbar.label`); `/doctors` result count is the page's `h2`; lead article card is an `h2`; MH Aesthetic desk card no longer a nested `<aside>`; home "Visit us" phone links underlined. Keyboard: skip link first, dialogs trap focus and return it to the trigger on Esc; form fields now show a teal focus ring (was a 1px border change only).
  - **Hero LCP:** the home hero used the JS reveal (`data-reveal` = opacity 0 until hydration + IntersectionObserver), so on slow phones the main heading appeared ~4 s late. Above-the-fold hero now uses `data-enter` — a pure-CSS entrance that starts at first paint (title translates only, no opacity/clip, so it's the LCP at first paint). Scroll reveals below the fold unchanged.
  - **Bangla fonts:** moved from next/font to `@font-face` in `globals.css` with stable versioned URLs `public/fonts/bn/*.v1.woff2` (immutable cache header in `next.config.mjs`); the layout preloads Tiro 400 + Hind 400 **on BN pages only** (next/font preloads per route, and EN/BN share one route). BN header swap shift 0.11–0.34 → 0–0.013. On EN, the "বাংলা" switch label uses the system Bangla font, so EN pages no longer download Hind (3 × ~70 KB); only Tiro is still fetched for the footer wordmark. `scripts/og-card.py` reads the new paths.
  - **WhatsApp / call tap analytics:** `components/analytics/TapTracker.js` — one delegated capture listener for every `wa.me` and `tel:` link (no per-link tagging needed) → `window.dataLayer.push({ event: "contact_tap", channel, desk, number, section, page_path, lang })`. `section` = nearest `data-track` (topbar, hero, dock, doctor-card, appointment, mobile-menu) → id → landmark. No analytics script loaded yet (B4: GTM/GA4 reads the queue; B3 can POST it to `/api/v1/taps` for the admin board).
  - **Lighthouse (mobile, simulated slow 4G, local `next start`)** — Accessibility 100, Best practices 100 everywhere; SEO 69 = only `is-crawlable` (demo is `noindex` on purpose → 100 on production). Performance without the intro loader: EN home 90, doctor 89, department 80–95, packages 85, directory 88; BN 76–78. With the loader (first visit): −2…−10. Observed (unthrottled) LCP 0.3–1.3 s. What's left is bytes before LCP under the 1.6 Mbps model: Latin fonts ~154 KB + Bangla ~150 KB (BN) + Next/React JS ~170 KB; fonts are already subset (Bangla = Bengali glyphs only). Re-measure with PageSpeed Insights on Vercel (CDN + Brotli) in 5.3.
  - Intro loader decision → resolved in 5.3 (homepage only).
  - Old Bangla font files in `app/fonts/` deleted by Sifat (moved to `public/fonts/bn/`).
  - Verified: `npm run build` ✅, `eslint .` ✅, esbuild on all changed JS ✅, axe 0 violations, keyboard pass, tap events checked in EN + BN.
- [x] **5.3 BN pass + demo** (2026-10-21)
  - **Intro loader → homepage only** (Sifat's decision): the boot script now shows it only on `/` and `/bn` (first view per session; still skipped with `?ref=call` and reduced motion). Inner pages — where search traffic lands — never wait for it. Verified: `/`, `/bn` show it; `/doctors`, `/bn/departments/…`, `/emergency`, `/?ref=call` don't.
  - **BN pass (automated scan of dictionaries + every `{en,bn}` field in data/, then a crawl of all 144 BN pages for visible English text / ASCII digits):** dictionaries complete (no missing keys). Fixed: 48 doctor affiliations had no Bangla (26 institutions → Bangla names added); package inclusions were plain English strings → now `{en,bn}` like every other translatable field (`data/packages.js`, rendered with `t()` in PackageCard, home Packages, package detail). Kept in English on purpose (standard in BD): degrees, BMDC numbers, HbA1c, emails, phone examples in form errors. Two affiliations used pre-2024 names → updated to the institutes' current official names, marked CONFIRM in `data/doctors.js`. Bangla copy still needs a native proofread by the hospital (names are our transliterations).
  - **Cross-device QA crawl** (all 288 sitemap URLs at 390 and 1440 + 70 at 768): 0 non-200, 0 horizontal overflow, 0 page errors, 0 broken own images. Only failures: YouTube thumbnails through `/_next/image` (the sandbox can't reach i.ytimg.com — works on Vercel).
  - **Vercel readiness:** `package.json` `engines.node >=20.9.0` (Next 16 requirement). Env vars, deploy steps, pre-demo checks, a 15-minute demo script, the consolidated list of what the hospital must send, and the design-lock sign-off list are in **`docs/DEMO_CHECKLIST.md`**.
  - Verified: `npm run build` ✅, `eslint .` ✅, esbuild ✅.

---

## Pre-backend audit (2026-10-21) — fixed before B1
Checked the code against the proposal (§3, §5.1–5.5, §7, §8) and **ran the whole site in API mode** against a mock Express/Mongo API (ISO dates, `limit` ≤ 100, populated departments, a renamed slug, `/uploads` served like Nginx): `next build` ✅, 288 URLs × EN/BN crawled — 0 errors. The contract this produced is **`docs/API_CONTRACT.md`** (read it before writing mh-api).

| # | Problem (would break in B1–B4) | Fix |
|---|---|---|
| 1 | **Admin uploads would 404 in `next/image`.** Next reads the `public/` file list once at server start; uploads land in `/var/www/mh/uploads` later. | `MEDIA_ORIGIN` env: `apiGet` makes every `/uploads/…` path absolute and `next.config.mjs` allows it in `remotePatterns` → images are fetched through Nginx. Static demo unchanged. Verified (optimizer 200). |
| 2 | **Date crash.** Article date and doctor leave assumed `"YYYY-MM-DD"`; Mongo returns ISO → `RangeError: Invalid time value` (article page + every doctor card). | `lib/utils/dates.js` (`toDhakaDay`, `formatDhakaDate`) accepts both; used in DoctorStatus, article page, JSON-LD. |
| 3 | `getDoctors({ limit: 500 })` in sitemap, static params, appointment form, departments, BHRPC, MH Aesthetic — a validating API (limit ≤ 100) → 400 → **build fails**. | `getAllDoctors()` pages through (`DOCTORS_PAGE_MAX = 100`). |
| 4 | Doctors carry a populated department name, but were cached only under `doctors` → renaming a department in the admin left stale names. | `departments` tag added to doctors / aesthetic / BHRPC services. |
| 5 | No timeout on API calls — a hung API would hang SSR. | `AbortSignal.timeout(API_TIMEOUT_MS ?? 8000)`. |
| 6 | Slug rename in the admin → old Google/WhatsApp links 404. | API resolves `previousSlugs`; doctor/department/package/article pages 308 to the new slug, canonical uses the current slug. |
| 7 | Proposal §5.4 "Google title and description for every page" — only departments supported it. | `seo` collection (keyed by path) + `getSeoOverrides()`; `pageMeta()` is now async and applies it (same language only). No page changes needed. |
| 8 | `settings.noticeBar` (proposal §5.4 Content) was never rendered. | `components/layout/NoticeBar.js` above the top bar; plain text, optional internal/external link. |
| 9 | Patient stories (proposal §3) were never rendered. | Shown under Expert talks, **only with `consent.confirmed`**. Shape documented in `data/home.js`. |
| 10 | Visit Us lacked landline + ambulance (proposal §3). | Shown when set and different from emergency; Dhaka landlines format as `02-…`. |
| 11 | Blank optional settings (map, hours, socials, address, invalid `bookingMode`) would crash pages. | `normaliseSettings()` fills defaults (map links fall back to a name+address search). |
| 12 | `t()` returned "" when only Bangla was filled; talk titles read `.bn` directly. | `t()` falls back to any filled language; talk titles use it. |

Not changed (decisions): only the **first** active hero slide is used (single-hero design — the admin should edit one hero, not a slider); key numbers ~~stay hidden (Sifat's revision 3)~~ → shown again under the QuickPanel (2026-10-21, see Post-Phase-5); old-WordPress redirects stay in `data/redirects.mjs` (build-time) — admin slug renames use `previousSlugs` instead.

---

## Post-Phase-4: photo headers + media slots (2026-10-21)
- `components/ui/PageHeader.js` — inner-page header; with a media slot it is a photo band (image + deep-teal wash strongest behind the copy, bottom fade; falls back to a plain teal band if the file is missing), without one the paper band. Used by doctors, departments, diagnostics, packages, health-tips, gallery, expert-talks, careers, contact, patients-visitors, management, BHRPC; emergency + MH Aesthetic keep their own headers with the same slot images.
- `data/media.js` + `lib/api/media.js` `getMedia()` → `{ [key]: { src, alt, position, overlay } }`. This is the contract for the admin **Media management** page (one row per slot: upload → `/uploads/media/…`, `revalidateTag("media")`).
- `scripts/fetch-stock-images.mjs` downloads the 11 Unsplash placeholders (sandbox can't reach Unsplash). Own photos processed from Sifat's downloads: 8 `uploads/aesthetic/*` (treatment cards now show), `media/header-bhrpc.webp`, `media/header-mh-aesthetic.webp`, `aesthetic/reception.webp` (shown above the aesthetic desk card).
- Root-level copies in `public/` (Hydra-fecial-img…, section-bg.webp, bread-2-2.webp, …) are now duplicates and can be deleted.
- Round 2: `/appointment` now uses PageHeader (`header.appointment`, Unsplash slot, so it shows only after running the fetch script) + numbered visit steps on the left; `/packages/[slug]` (photo by category: maternity→bhrpc, surgical→careers, checkup→packages) and `/careers/[slug]` use photo headers too. Legal pages, 404 and detail pages with their own photo stay plain on purpose.
- Dev warnings fixed: `[...rest]` catch-all `export const instant = false` (404 needs no instant shell); the theme/loader boot `<script>` goes through `components/layout/BootScript.js` (rendered only in SSR/hydration, so a client re-render, e.g. a 404, no longer creates a `<script>` tag). `/talks` → 308 `/expert-talks`.
- Footer wordmark: viewBox `-4 -26 1008 196` (Bangla vowel signs were clipped at the top), solid `#1a3639` instead of `paper/6` alpha (overlapping glyphs showed seams).
- `/about` header: own building photo (`header.about`) full-bleed with a paper wash + ink copy (light photo, so no teal wash). Reveal "clip": after the wipe the held `clip-path` is swapped for `none` — a held clip kept the old box size and cut multi-line Bangla hero titles after the font swap / EN↔BN switch.
- Every display numeral (section numbers, steps, service lists, 404) is now upright, no italic. The italic accent stays only for `<Emphasis>` words.

## Phase 4 — Packages, booking & content pages (2026-10-21) ✅
Each step is written to the repo + ticked before the next starts. On resume: continue at the first unticked step.
- [x] 4.0 Dev errors: "URL data outside `<Suspense>`" on every `[slug]` page (`partialPrefetching` is on) → page body moved into `<XContent>` inside `<Suspense fallback={<PageSkeleton/>}>` (doctors, departments, facilities, diagnostics, legal). `priority` (deprecated in Next 16) → `loading="eager" fetchPriority="high"`; diagnostics index: first 3 images eager (LCP warning).
- [x] 4.1 Detail content + layout (done: `data/department-content.js` — description, 4–7 services, 4–6 conditions for all 22 departments; `data/service-content.js` — facility description/features/`whenTo`, diagnostic description/tests/timing/preparation; merged into the docs. Old site had only generic copy — kept its facts (pathology 7am–12pm, haemo + peritoneal dialysis), no invented figures. New `components/services/Blocks.js`: `Prose` (serif lede), `ListCard`, `NumberedList`, `VisitSteps` (3-step deep-teal band). Department page: overview + conditions → numbered services → doctors → your visit → packages → chips. Facility/diagnostic page: overview + features/tests (+ timing/prep) → emergency "when to come" band → your visit. ⚠ Client to review all medical copy.)
- [x] 4.2 MH Aesthetic data (done: `data/aesthetic.js` singleton — about, mission/vision, phone 01329-672808, WhatsApp …807, email, Sat–Fri 10–7, 8 treatments with images, team ids; `lib/api/aesthetic.js` `getAesthetic()` populates the team. Old aesthetic page lists Dr. Ahmed Ali and Dr. Syeda Samina Mahjabin → `doctor-2`/`doctor-3` profiles **activated** (68 active doctors; doctor-3 renamed to `dr-syeda-samina-mahjabin`, redirect updated — CONFIRM). 8 aesthetic photos added to `fetch-wp-images.mjs` (92 total).)
- [x] 4.3 Packages (done: `/packages` — category chips via `?category=` inside `<Suspense>`, grouped sections, price note; `/packages/[slug]` — description, who it's for, typical stay, inclusions card, Call for Price + WhatsApp, department doctors, related packages; `components/packages/PackageCard.js`; `data/package-content.js` (description/whoFor/typicalStay ⚠ CONFIRM stays); `getPackageBySlug`; dict `packages.*`)
- [x] 4.4 `/appointment` + `bookingMode` (done: `components/booking/BookingForm.js` — name, BD mobile validation, department → doctor, preferred date (min = today in Dhaka, set after mount), note, honeypot; `?for=` preselects the doctor. Static phase submit = validated WhatsApp hand-off with all fields; B3 swaps it for `POST /api/v1/appointments`. `numbers` (default) = panel only, `both` = panel + form, `form` = form first. Preview: set `bookingMode: "both"` in `data/settings.js`.)
- [x] 4.5 `/bhrpc` + `/mh-aesthetic` (done: `data/bhrpc.js` + `getBhrpc()` — about, who it's for, services, 7-doctor team from the old page, maternity packages, visit steps; full name ⚠ CONFIRM. `/mh-aesthetic` — dark hero over `hero/mh-aesthetic.webp`, about + mission/vision, aesthetic desk card (own phone/WhatsApp/email/hours), 8 treatment cards with "Ask on WhatsApp" to the aesthetic number, team cards use the aesthetic WhatsApp. BHRPC "topics" links added in 4.7 with the articles.)
- [x] 4.6 `/about`, `/about/management`, `/patients-visitors`, `/emergency` (done: `data/site-pages.js` — about (story, 4 pillars, mission/vision from the old site; **no stats**) and patients-visitors sections with menu anchors `#visiting-hours` `#admission` `#billing` `#corporate-insurance` `#feedback`, ⚠ CONFIRM flags on hours/payment/insurance; `management = []` → empty state until the hospital sends names (old site had "Mr. ABC" placeholders); `getSitePage`, `getManagement`; emergency page = call-first (big emergency number, hotline, directions, when-to-come from the emergency facility doc, what to bring). New `check` icon.)
- [x] 4.7 Health tips, gallery, expert talks (done: `data/articles.js` — 6 EN/BN articles: the 4 old BHRPC topics (pregnancy diabetes, high BP, thalassaemia, genetic counselling) + dengue + heart-attack signs, ⚠ medical review, `author: null` until a doctor agrees to a byline; `/health-tips` lead story + category sections, `/health-tips/[slug]` with MedicalWebPage JSON-LD, disclaimer with emergency number, related, BHRPC CTA; old BHRPC URLs now 308 to the matching article. `data/gallery.js` (12 own photos, hospital/diagnostic) + `components/content/GalleryGrid.js` filter + native-dialog lightbox (arrows/Esc). `/expert-talks` uses the homepage talks list with LiteYouTube. BHRPC page now lists the pregnancy articles. `getArticles`, `getArticleBySlug`, `getGallery`.)
- [x] 4.8 Careers + Contact (done: `data/careers.js` — only the always-open CV bank (no real openings known; no invented jobs), `getJobs`/`getJobBySlug`; `/careers` list, `/careers/[slug]` with `components/forms/ApplyForm.js` — name/phone/email/position, CV PDF/DOC/DOCX ≤5 MB validated in the browser, honeypot; static submit = email fallback (mailto with subject) because files need the backend — B3: multipart POST → multer. `/contact` — every number/desk/email/hours/socials, `ContactForm` (validated → WhatsApp hand-off; B3: POST + Nodemailer), map + directions. Shared `components/forms/Fields.js`.)
- [x] 4.9 QA (done: crawler from `/` + `/bn` reached 288 internal pages, 0 non-200; Playwright 390/768/1440 on 50 routes (25 × EN/BN): no horizontal overflow, 0 console errors; dev pass: 0 browser errors. Dev-server log noise about `instant` validation came only from images missing in the build sandbox (public/ isn't copied there) — not a code issue.)


**New routes** (EN + BN, all static or PPR): `/packages`, `/packages/[slug]`, `/appointment` (+ optional form), `/bhrpc`, `/mh-aesthetic`, `/about`, `/about/management`, `/patients-visitors`, `/emergency`, `/health-tips`, `/health-tips/[slug]`, `/gallery`, `/expert-talks`, `/careers`, `/careers/[slug]`, `/contact`. Every proposal page now exists.

**New data (Mongo-shaped)**: `department-content`, `service-content`, `package-content`, `aesthetic`, `bhrpc`, `site-pages` (+ `management`), `articles`, `gallery`, `careers`. Services: `getAesthetic`, `getBhrpc`, `getPackageBySlug`, `getSitePage`, `getManagement`, `getArticles`, `getArticleBySlug`, `getGallery`, `getJobs`, `getJobBySlug`, `getFacilityBySlug`, `getDiagnosticBySlug`.

**Decisions**
1. All forms (booking, contact, careers) validate in the browser and degrade without a backend: booking/contact → WhatsApp hand-off with every field; careers → email fallback (files need the API). Each has a honeypot and length limits; B3 replaces the submit with POST + server-side zod, rate limit, Nodemailer, multer.
2. No invented records: no fake jobs, management names, testimonials or statistics. Empty states instead.
3. Medical copy is general patient information, written to be safe ("follow the desk's instructions"), and flagged for the hospital's review.
4. `doctor-2` / `doctor-3` are MH Aesthetic team members per the old aesthetic page → activated (68 doctors).
5. `[slug]` pages read params inside `<Suspense>` (partialPrefetching); `priority` → `loading="eager"`.

**Pending (client)**: review of all medical copy (departments, facilities, diagnostics, packages, articles); BHRPC full name; aesthetic email/WhatsApp; visiting hours, payment methods, insurance partners; management names/photos/messages; real job openings; package inclusions + typical stays; MH Aesthetic doctor confirmations.

---

## Phase 3 — Doctors & Departments (2026-10-20) ✅
Work in steps; each step is written to the repo + ticked before the next starts. On resume: read this list, continue at the first unticked step.
- [x] 3.1 `/doctors` directory (done: `app/[lang]/doctors/page.js`; `getDoctors` q also matches specialty + department name; DoctorCard shows `scheduleNote`; dict `doctors.*`) — filters (department, day, q) via GET query = `getDoctors()` params, results in `<Suspense>` (searchParams = runtime API), pagination, empty state, `scheduleNote` on cards
- [x] 3.2 `/doctors/[slug]` (done: `app/[lang]/doctors/[slug]/page.js`, 132 static paths, hidden doctors 404, dict `doctor.*`) — profile, full weekly timetable, BMDC, affiliation, Book + WhatsApp, related doctors, Physician JSON-LD, `generateStaticParams`
- [x] 3.3 `/departments` index + `/departments/[slug]` (done: numbered editorial list + facilities/diagnostics links; detail = summary, doctors, related packages via new `package.departments[]` + `getPackages({department})`, all-departments chip nav; dict `departments.*`)
- [x] 3.4 `/facilities/[slug]`, `/diagnostics` index + `/diagnostics/[slug]` (done: shared `components/services/ServiceDetail.js` — 24/7 tag, call desk / emergency number for emergency+ambulance, Book, timing/preparation box for diagnostics, sibling chips; `getFacilityBySlug` / `getDiagnosticBySlug`; dict `services.*`)
- [x] 3.5 Leave badge + "Available today" (done: `components/doctor/DoctorStatus.js`, client-only after mount in Asia/Dhaka time → no hydration mismatch; on cards + profile). QA 390/768/1440: no overflow on 9 new routes; dev hydration warnings 0.


**New routes** (all statically generated, EN + BN): `/doctors` (filters in `<Suspense>`), `/doctors/[slug]` (66×2), `/departments`, `/departments/[slug]` (22×2), `/facilities/[slug]` (10×2), `/diagnostics`, `/diagnostics/[slug]` (6×2).

**Decisions**
1. Directory filters are a plain GET form; only the result list reads `searchParams` (runtime API) inside `<Suspense>`, so the header/shell is prerendered and it works without JS. Inputs whitelisted (department slug, day ∈ WEEK, q ≤ 60 chars, page ≤ 50) — same rules the API validator will use.
2. Search `q` matches name (EN/BN), degrees, specialty and department name.
3. "Today / On leave" is computed in the browser (Dhaka time) after mount — static HTML can't know the date, and rendering it on the server would break caching/hydration.
4. Packages ↔ departments via `package.departments[]` (ids) — the admin will edit this list.
5. Emergency + ambulance facility pages call the emergency number; others call the hotline + Book.
6. No `/facilities` index page (master plan §2 lists only `facilities/[slug]`); the departments index lists them.

**Pending**: real department descriptions/services (admin), diagnostic timing + preparation notes (client), facility/department photos after `fetch-wp-images.mjs`, doctor portraits for 5 doctors.

---

## Phase 2 (part 2) — content migration + WhatsApp desks (2026-10-20)

**Why not the WP REST script:** `/wp-json/wp/v2/types` exposes only post/page/media — the Medilink theme's `medilink_doctor` / `medilink_departments` types are not in REST. Content was read from the old site's sitemaps page by page (the build machine itself can't reach monowarahospital.com). Full log: `data/_migration-report.md`.

**Done**
- `data/doctors.js` — all **68** old profiles (66 active; `doctor-2`/`doctor-3` are MH Aesthetic stubs → `isActive:false` until confirmed). Same shape as before plus `affiliation{en,bn}`, `scheduleNote{en,bn}` (shown when no fixed timetable), `legacyUrl`. Bangla name/designation/specialty for every doctor (our transliteration). Slugs are clean `dr-<name>` (no titles); 9 existing slugs kept. Schedule typos normalised (am/pm swaps, duplicate rows, a row without a day) — each listed in the report.
- `data/departments.js` — EN/BN summaries for all 22, `image` → `/uploads/departments/<slug>.webp`, `legacySlugs`.
- `data/facilities.js`, `data/diagnostics.js` — EN/BN summaries, images, `legacySlugs`.
- `data/redirects.mjs` + `next.config.mjs redirects()` — **115** permanent redirects from old WP URLs (doctors, specialist pages, facilities filed under `/departments`, wrong-slug pairs from master plan §3, BHRPC articles → `/health-tips`, pages like `/appointment-form`, `/our-doctors`, `/pregnancy-care`, MH Aesthetic treatments). Trailing-slash URLs take 2 hops (Next strips the slash first) — fine for SEO.
- `scripts/fetch-wp-images.mjs` — downloads 84 photos into `public/uploads/{doctors,departments,facilities}/` (doctors cropped 4:5 → 600×750 WebP via sharp, others ≤1200px WebP). Skips existing files; `--force` re-downloads; failures → `scripts/fetch-wp-images.log`.
- Homepage `CtaBand` now lists **every active WhatsApp desk** (label, number, "Main desk" tag on the primary) beside the Book button — the proposal §3 "multiple highlighted numbers" band, without adding another section. New dict keys `home.desksTitle`, `home.desksPrimary` (EN + BN).

**Decisions**
1. Slug fixes over old URLs (e.g. `jannatul-ferdousi` was actually Prof. Rowshan Ara Begum) — the old URL 308s to the new one.
2. Name conflicts on the old site resolved toward the page heading unless the photo/URL/bio all disagree with it (e.g. Rezaul *Karim*, not *Haque*). All flagged ⚠ CONFIRM in the report.
3. Non-physicians: physiotherapist and dietitian shown without "Dr."; PhD nutritionist uses ড. (not ডা.) in Bangla.
4. Old profile phone (+880 1715-839400) is the front desk → not stored per doctor.
5. Department/facility images are wired in data but not rendered yet (Phase 3 pages), so nothing breaks before the download script runs. Home Centres still use their existing photos.

**Fixes (21:30)**
- Hydration mismatch on every `[data-reveal]` element (Phase 1 bug): `RevealObserver` (root layout) added `is-in` before streamed page segments hydrated. Now reveals use the Web Animations API (`el.animate`, `fill:"forwards"`) and never write classes/attributes onto server HTML; `.is-in` rules + transitions removed from `globals.css`. Dev check EN/BN: 0 hydration warnings, nothing left hidden after scrolling.
- `MODULE_TYPELESS_PACKAGE_JSON` warning: `next.config.mjs` loads the redirect map through plain Node → renamed to `data/redirects.mjs`. **Delete the old `data/redirects.js`** (no longer imported).

**Verified**: `npm run build` ✅, `eslint .` ✅. `next start` + curl: `/`, `/bn`, `/bn/appointment` 200; `/doctors/consultant-dr-israt-zebin/` → `/doctors/dr-ishrat-jabeen`, `/departments/gyne-obs-specialist` → `/departments/gynaecology-obstetrics`, `/pregnancy-care` → `/packages?category=maternity` (308). Playwright 1440/390 EN + BN: CTA band OK, no horizontal overflow.

**Pending (client)** — see `data/_migration-report.md`: 5 doctors have no portrait anywhere on the old site (`photo: null`), Bangla name proofreading, 11 profiles with no degrees, 7 without a timetable, 59 BMDC numbers, ⚠ name/photo conflicts (Rezaul Karim/Haque, Gobinda Banik photo filename, Ishaq/Eshaque, Swapan's surname, Munny Momotaz's rank), whether Dr. Ahmed Ali / Dr. Mehzabeen are current MH Aesthetic doctors.

---

## Phase 2 (part 1) — homepage per client concept + Sifat's review fixes (2026-10-20)

Client picked `MH_Website_Concept.pdf` as the homepage. The page now follows its section order. Changes from the concept: teal instead of navy, "Call for Price" instead of prices, "Test reports" became Emergency, and the "clear prices" heading was reworded.

**Homepage** (`app/[lang]/page.js` → `components/home/*`)
- `Hero`: deep-teal band with rounded bottom and fine contour lines (taken from the old slider artwork). Left side has the copy, with `*33 years*` as the accent. Buttons: bright-teal "Book an appointment", a white Emergency pill with a red pulse, and a WhatsApp line. Right side shows the hospital's own building inside the logo's arch, with the keystone lens on top, a hairline outline arch, and a floating "Emergency & admission 24/7" card. Hero data comes from `data/hero.js` slide 1 (media now set).
- `QuickPanel`: card overlapping the hero. It has a GET search form (`/doctors?department=&q=`, the same params the API will take, works without JS) and 4 actions: Book, Packages, Emergency, WhatsApp.
- `KeyNumbers` (static, no count-up) and `Centres` (8, a hairline editorial grid instead of icon cards).
- `Maternity`: photo + 3 packages, each with Call for Price. `Packages`: 4 check-ups with inclusions and Call for Price, plus surgical chips. Every Call for Price opens the appointment modal with the package as context.
- `Doctors`: scroll-snap rail of `DoctorCard`s (arch portrait, department, degrees, compressed schedule via `lib/utils/schedule.js`, Book + WhatsApp). `Talks`: click-to-load YouTube (`LiteYouTube`, youtube-nocookie, thumbnail only until play). `VisitUs` (lazy map iframe) and `CtaBand`.

**Data / services added**: `data/doctors.js` (9 real profiles from the old site), `data/packages.js` (proposal list), `data/home.js` (keyNumbers, centres, talks with real YouTube titles, stories = []), `data/legal.js`. Services: `lib/api/doctors.js` (`getDoctors({department, day, q, featured, page, limit})` with populate, `getFeaturedDoctors`, `getDoctorBySlug`), `lib/api/packages.js`, `content.getHomeContent()`, `lib/api/pages.js` (legal).

**Images**: Sifat's downloads were copied into `public/uploads/{hero,facilities,doctors}/` with clean names (see `data/_placeholders.md`). The root-level duplicates in `public/` can be deleted.

**Fixes from review**
- Footer: the Bangla wordmark is now an SVG scaled to the container, so it is always fully visible. Social icons (react-icons `fa6`, server-rendered, no client JS) sit on the left under the address. Bottom line now reads "© 2026 … All rights reserved. · Website by STR Solutions LTD." linking to https://strsltd.com/. Extra bottom padding on mobile so the dock doesn't cover it.
- 404 redesigned: arch illustration with a flat-lined pulse, Back home + Book buttons, 4 "where to next" links, emergency line.
- The "Quick answers" dock button is now a light card (it used to disappear against the dark footer).
- TopBar pulse dot changed to true red (#ff2d20).
- New `app/[lang]/legal/[slug]` (terms, privacy-policy, patient-rights; EN + BN). Each page has a sticky contents list, numbered sections, a draft notice and a contact box.

**Premium pass (same day, after review "too white / hero image design")**
- Hero rebuilt: arch-framed photo removed. Building photo now sits as a right-side panel feathered into deep teal with a CSS mask (sharp — portrait crop, no upscaling). Key numbers moved into the hero under a hairline. On mobile the photo sits behind the copy under a dark wash.
- Page colour rhythm: deep teal (hero) → paper (search card) → **deep teal** Centres (photo reveals on hover) → paper Maternity → **mint** Packages → warm paper-2 Doctors → **deep teal** Expert talks → **mint** Visit us → teal CTA → ink footer. New tokens `--color-mint`, `--color-mint-2`, utility `paper-grain-dark`; `Section` tones `mint` and `deep` (dark tones recolour eyebrow, rule, accent and header links).

**Revision 3 (Sifat, 20:00): concept-style hero, no stats, fewer teal sections, appointment = page**
- Hero now follows the concept layout in teal: gradient teal band with a rounded bottom, copy on the left, the building in a rounded 5:4 photo card on the right (`hero/hospital-building-card.webp`, set via `slide.cardMedia`), an offset hairline frame, a "Own building" tag and a floating 24/7 badge. **No stats anywhere** (`data/home.js` keyNumbers are kept for admin but not rendered).
- Centres and Expert talks are back to light (no full-teal sections apart from the hero). Light tints only: paper / mint / paper-2.
- **Appointment is now a page, not a modal.** `AppointmentProvider` only turns `[data-appt]` clicks into `router.push('/appointment?for=<name>&kind=package')`. `/appointment` reads `?for`/`?kind` client-side (`AppointmentFromQuery` inside Suspense, so the page stays static) and prefills WhatsApp: doctors use `appointment.messageWith`, packages use `appointment.messagePackage`. The modal (Dialog) is still used by the mobile menu and the dock. ✅ **Client confirmed (2026-10-20): appointment stays a page.** This replaces master plan §4.4 ("modal").

**Revision 4**: Centres cards fade in the centre's photo under a teal gradient on hover/focus (text turns white; falls back to the building photo). Footer Terms link was covered by the fixed dock on desktop → dock container is `pointer-events-none` (buttons re-enabled) and the footer bottom bar has `md:pr-24`.

**Deps**: `react-icons@^5.7.0` added → run `npm install`.
**Config**: `images.remotePatterns` for `i.ytimg.com/vi/**` (YouTube thumbnails).

---

## Phase 1 — what was built

**Routing / i18n**
- `proxy.js` — EN is unprefixed (rewrite `/x` → `/en/x`), BN under `/bn/...`, `/en/*` 308-redirects to the unprefixed URL (one canonical per page). Matcher skips `_next`, `uploads`, `api`, `admin`, metadata files and anything with an extension.
- Root layout lives at `app/[lang]/layout.js` (`generateStaticParams` → en, bn; required with Cache Components). `app/layout.js` + `app/page.js` scaffold files removed.
- `app/[lang]/[...rest]/page.js` → `notFound()` so unknown URLs render `[lang]/not-found.js` inside the site shell (localised via `next/root-params`).
- `lib/i18n/` — `config.js` (`locales`, `href(lang, path)`, `stripLocale`), `getDictionary.js` (server-only), `t.js` (`t(field, lang)` with EN fallback, `digits()` for Bangla numerals — display only, never in `tel:`/`wa.me`), `dictionaries/en.json` + `bn.json`.

**Data layer (backend-ready)**
- `lib/api/client.js` — the one switch: `DATA_SOURCE=static|api`, `API_URL`, `apiGet()`, plus `active/byOrder/clone` helpers so static filtering mirrors the future Mongo query.
- Services (all `"use cache"` + `cacheTag` + `cacheLife("hours")`, signatures = future REST): `settings.getSettings()`, `content.getHero()/getFaqs({category})`, `departments.getDepartments({featured})/getDepartmentBySlug()`, `services.getFacilities()/getDiagnostics()`, `navigation.getNavigation()` (menu built from live collections).
- `data/` mock collections in Mongo shape (`_id`, `slug`, `{en,bn}`, `isActive`, `order`, timestamps): `settings`, `hero` (4 slides), `faqs` (4 seeds), `departments` (22 specialties, 5 flagged `isFeatured` = centres of excellence), `facilities` (10), `diagnostics` (6). `data/_placeholders.md` lists every value to confirm.
- `public/uploads/{doctors,departments,facilities,packages,hero,gallery,talks,misc}/` created (`.gitkeep`).

**Design system** (`app/globals.css` `@theme`)
- Colour: brand teal sampled from `logo.png` = **#009EA6** (`teal-500`). Text/links use `teal-700` (#006A70) for AA contrast. Ink `#0C2A2D`, paper `#F6F3EC`, paper-2, card, line. `emergency` (#C2402C) is reserved for emergency UI only. `wa` green only on the WhatsApp mark, always on white/ink chips.
- Type (self-hosted OFL woff2 in `app/fonts/`, via `next/font/local` — no Google Fonts call at build/runtime): **Newsreader** (display serif) + **Hanken Grotesk** (UI/body); **Tiro Bangla** (Bangla display / graphic type) + **Hind Siliguri** (Bangla UI/body). Bangla faces have `unicode-range` + `preload:false`, so EN pages never download them. Stacks list the Bangla face first so Bangla glyphs never fall through to a system font.
- Fluid scale tokens `text-display/h1/h2/h3`, utilities `eyebrow` (auto un-tracks for Bangla), `rule`, `paper-grain`, `link-underline`.
- Motion: `RevealObserver` (one IntersectionObserver, `data-reveal` / `data-reveal="clip"` — clip variant needs a direct `<span>` child). Calm easing, `prefers-reduced-motion` honoured, no-JS = visible.

**UI kit** (`components/ui/`): `Button` (+`buttonClass`; `appointment`/`context` props), `Container`, `Section` (number + eyebrow + rule header), `Badge`, `Dialog` (native `<dialog>`: center / right sheet / bottom sheet), `Icon` + `WhatsAppMark` (inline SVG, no icon lib), `Emphasis` (`*phrase*` in admin text → one italic-serif accent, no HTML injection).

**Layout shell** (`components/layout/`, wired in `app/[lang]/layout.js`)
- `TopBar` — emergency line (pulsing dot), address, primary WhatsApp, `LangSwitch` (keeps the current path).
- `Header` (server) → `HeaderShell` (sticky, hairline on scroll) + `HeaderNav` (xl+: hover-intent/click/Esc, Departments mega-menu with featured centres + facilities with 24/7 badges) + `MobileNav` (< xl: right sheet, `<details>` accordions, Book/Call/WhatsApp footer).
- `Footer` — contact block, link columns, socials, legal links, DGHS licence (auto-hidden until set), Bangla wordmark as a graphic element.
- `FloatingDock` — WhatsApp desk picker + "Quick answers" FAQ chips (answer reveal + WhatsApp fallback).
- `AppointmentProvider` + `AppointmentPanel` — **any** `[data-appt]` element or link to `/appointment` (`/bn/appointment`) opens the "Call for Appointment" modal (capture-phase delegation; modified clicks still open the real page). Hotline, labelled WhatsApp desks with prefilled message (includes doctor/package via `data-appt-context` or `?for=`), other numbers, emergency note. `data-wa-tap` attribute on every WhatsApp link for later tap analytics.
- `Loader` — pure CSS (zero animation JS): arch draws → keystone lens → ECG pulse → Bangla/English wordmark → doorway-shaped mask opens to reveal the page; hidden at 3.45 s by CSS even if JS fails. Gate script in `<head>` shows it only on first visit per session, never on `/emergency`, `?ref=call` or reduced-motion. SSR page renders underneath. Skip button.

**Pages**: `/` (Phase-1 hero + 4 quick actions, real settings data), `/appointment` (static, no-JS booking surface; form comes in Phase 4), `not-found`, `robots.js` (disallow all unless `NEXT_PUBLIC_SITE_ENV=production`; layout metadata also `noindex` until then).

**Config**: `next.config.mjs` — removed `experimental.agentFeedback`; added security headers, `poweredByHeader:false`, image formats avif/webp + `qualities`. `.env.example` added (and un-ignored).

## Decisions (and why)
1. **No GSAP in Phase 1.** Loader + reveals are CSS/IO only → zero animation JS on every page. If a later section genuinely needs timeline choreography, GSAP is dynamically imported inside that one client component, never globally.
2. Self-hosted fonts instead of `next/font/google` — the build no longer depends on fonts.googleapis.com (offline/CI/VPS safe) and EN pages skip Bangla font bytes.
3. Desktop nav switches at `xl` (1280px), not `lg`: six items + logo + CTA don't fit at 1024, and Bangla labels are longer.
4. Native `<dialog>` for modal/sheets — focus trap, Esc, inert background for free; no Radix/Headless dependency.
5. Appointment modal via event delegation, so server components stay server components.
6. Avoided per master plan §5: glass cards, gradient text, count-ups, icon-in-square card grids, Inter/Jakarta. Kept from the premium-web-design skill: lower-left hero composition, one italic-serif accent phrase, 390/768/1440 QA.

## Verified
- `npm run build` ✅ (14 static pages; `/`, `/bn`, `/appointment`, `/bn/appointment` prerendered static), `eslint .` ✅ clean.
- Playwright at 1440 / 768 / 390: no horizontal overflow, no console errors; mega-menu, mobile drawer, WhatsApp sheet, FAQ chips, modal from header CTA (URL unchanged), EN↔BN switch keeps path and sets `<html lang>`, loader plays once per session and is skipped on `/emergency`, `/en/*` → 308.

## Pending / open (client)
See `data/_placeholders.md` and master plan §7 — WhatsApp desk labels + primary, emergency/ambulance/landline, email domain, DGHS licence, 33+ vs 34+, logo as SVG (header uses `public/logo.png` 300×64), real photography, chatbot Q&A list.

Not done in this environment: `git commit` (no shell on the Windows machine from this session — files were written into the repo directly; commit locally).

## Next — after design lock (backend track)
Before: Sifat deploys to Vercel and runs the client demo with `docs/DEMO_CHECKLIST.md`; collect the §4 items; client signs §5.
1. **B1 `mh-api`** (Express, modular): Mongoose models mirroring `data/*` (incl. `{en,bn}` package inclusions, structured settings address, media slots), auth (JWT HttpOnly cookie + refresh), RBAC, zod, rate limit, custom NoSQL sanitising, multer + sharp (same rules as `scripts/optimize-media.mjs`; also a JPEG OG rendition per upload), Nodemailer.
2. **B2 admin** in `app/admin` (all proposal §5.4 modules + FAQ, hero, media slots, WhatsApp tap analytics from `contact_tap` events).
3. **B3** `DATA_SOURCE=api`, `revalidateTag` on admin save, forms POST to the API.
4. **B4** VPS (Nginx, PM2, SSL, Mongo auth + backups), `NEXT_PUBLIC_SITE_ENV=production`, GA4/GTM reading `dataLayer`, Search Console + sitemap.
