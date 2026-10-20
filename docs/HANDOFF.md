# HANDOFF — Monowara Hospital (mh)

> Read with `MH_MASTER_PLAN.md` (project knowledge) + `AGENTS.md`. Update at the end of every phase.

## Status

| Phase | State |
|---|---|
| **1 — Foundation & design system** | ✅ Done (2026-10-20) |
| 2 — Content migration + Homepage | 🟡 Homepage done (2026-10-20); full WP migration pending |
| 3 — Doctors & Departments | — |
| 4 — Packages, booking & content pages | — |
| 5 — Polish, SEO & demo | — |

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
- **Appointment is now a page, not a modal.** `AppointmentProvider` only turns `[data-appt]` clicks into `router.push('/appointment?for=<name>&kind=package')`. `/appointment` reads `?for`/`?kind` client-side (`AppointmentFromQuery` inside Suspense, so the page stays static) and prefills WhatsApp: doctors use `appointment.messageWith`, packages use `appointment.messagePackage`. The modal (Dialog) is still used by the mobile menu and the dock. ⚠️ The master plan §4.4 said "modal"; Sifat changed this on 2026-10-20 — confirm with the client.

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

## Next — Phase 2 remaining
1. `scripts/migrate-wp.mjs` (run locally — the build container can't reach monowarahospital.com): WP REST `/wp-json/wp/v2/{doctor,departments,pages,media}` → `data/doctors.js`, enrich `departments.js` / `facilities.js` / `diagnostics.js`, download images to `public/uploads/...`, drop junk (`doctor-2`, `doctor-3`), log inconsistencies (schedule conflicts, rezaul-haque/karim) to `data/_migration-report.md`.
2. ~~doctors/packages services~~ ✅ done — the migration only needs to fill `data/doctors.js` in the same shape.
3. ~~Full homepage~~ ✅ done. Still open on it: a WhatsApp desks band (proposal §3), patient stories once consent arrives, and BN doctor names.
