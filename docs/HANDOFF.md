# HANDOFF — Monowara Hospital (mh)

> Read with `MH_MASTER_PLAN.md` (project knowledge) + `AGENTS.md`. Update at the end of every phase.

## Status

| Phase | State |
|---|---|
| **1 — Foundation & design system** | ✅ Done (2026-10-20) |
| 2 — Content migration + Homepage | ✅ Done (2026-10-20) — run `node scripts/fetch-wp-images.mjs` once locally |
| 3 — Doctors & Departments | ✅ Done (2026-10-20) |
| 4 — Packages, booking & content pages | ✅ Done (2026-10-21) |
| 5 — Polish, SEO & demo | 🟡 In progress — 5.1 done (2026-10-21) |

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
- [ ] **5.2 Quality & performance** — `loading.js` / `error.js` / `global-error.js`, image audit (`sizes`, eager only above the fold; `media/header-appointment.webp` is 630 KB, `header-packages` 263 KB → re-encode), a11y pass (focus order, contrast, form labels, dialog focus return, tap targets), motion polish, `data-wa-tap` → GA4-ready `dataLayer` hook, Lighthouse ≥ 90 mobile on home / doctor / department / packages (EN + BN).
- [ ] **5.3 BN pass + demo** — Bangla copy proofing (names, dictionaries, data), cross-device QA (390/768/1440 + real Android Chrome), Vercel project + env (`NEXT_PUBLIC_SITE_ENV=demo`, `NEXT_PUBLIC_SITE_URL`), client demo checklist + open-items list → design lock.

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

## Next — Phase 5 (Polish, SEO & demo)
Before starting: `npm install && node scripts/fetch-wp-images.mjs` (now 92 images incl. aesthetic), check photos, commit.
1. BN content pass (proof Bangla names/copy with the client's list), metadata + OG image per page (`opengraph-image` for doctors/articles), JSON-LD: Hospital + MedicalClinic (layout), BreadcrumbList on detail pages.
2. `app/sitemap.js` (all static params, EN + BN alternates), robots stays noindex on Vercel.
3. `loading.js` / `error.js` states, image audit (sizes, eager only above the fold), Lighthouse ≥ 90 mobile, a11y pass (focus order, contrast, labels, skip link), motion polish.
4. FAQ chatbot content from the client (dock already works), WhatsApp tap analytics hook (`data-wa-tap`) ready for GA4.
5. Cross-device QA, Vercel deploy, client demo checklist → design lock.
