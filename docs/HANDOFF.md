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
| **Design lock** | ✅ Client locked the design (2026-10-27) → backend track |
| **B1.1 + B1.2 — mh-back scaffold, models, seed, public API** | ✅ Done (2026-10-27) — see below |
| **B1.3 — auth, RBAC, activity log** | ✅ Done (2026-10-27) — see below |
| **B1.4 — roles update, uploads, mail, forms, inboxes, export** | ✅ Done (2026-10-27) — see below |
| **B2.1 — admin shell, login, forced password, fetch wrapper, role menu** | ✅ Done (2026-10-27) — see below |
| **B2.2 — inboxes (bookings/messages/applications), staff accounts, activity log** | ✅ Done (2026-10-27) — see below |
| **B2.3 — doctors module + overview charts + dev fixes** | ✅ Done (2026-10-27) — see below |
| **B2.4 — departments, facilities, diagnostics + account menu top-right** | ✅ Done (2026-10-27) — see below |
| **B2.5–B2.9 — packages, settings + notice bar, hero + image slots, homepage blocks + stories, FAQs + careers** | ✅ Done (2026-10-27) — see below |
| **B2.10–B2.13 — Aesthetic/BHRPC, articles + gallery, pages + management, SEO + tap analytics + B2 QA** | ✅ Done (2026-10-27) — **B2 complete** |
| B3 — site reads the API (`DATA_SOURCE=api`), revalidate on save, forms wired, SEO overrides applied | ⏭ Next |

---

## ▶ START HERE (next chat = B3 — connect the public site to mh-back)
**Repos:** `E:\Works\monowara-hospital\mh-front` (Next.js 16, JS) · `E:\Works\monowara-hospital\mh-back` (Express 5 + Mongoose 9, ESM).
**Local:** API `http://localhost:5036/api` · dashboard `http://localhost:3000/admin` (front `.env`: `NEXT_PUBLIC_ADMIN_API_URL=http://localhost:5036/api`). Public host later: `https://api.monowarahospital.com/api/<resource>` (no `/v1`).
**Contract:** `docs/API_CONTRACT.md` — public GETs, admin auth, forms, uploads, inboxes, **admin doctors + stats**.
**Roles:** `super_admin` · `opd_incharge` · `graphics_design` · `marketer` — map only in `mh-back/src/lib/permissions.js`.
**Tests:** mh-back `npm test` (7 suites: parity 163, auth, forms/uploads/inbox, doctors-admin 43, services-admin 23, content-admin 55, **final-admin 42**) + `npm run check`; mh-front `npm run build` + `npx eslint .`.
**Pattern to copy for every module.** List-type collections = **config only**: backend `crudRouter()` (`src/lib/crud.js` — options `required`, `sluggable`, `slugFrom`, `label`, `search`, `query/filter`, `check`, `inUse`, `beforeSave`; gives list/get/create/patch/delete + `PUT /order`), frontend one entry in `lib/admin/collections.js` (field types `L Lopt list bool text select image heroImage seo departments department date youtube href consent number textNull ref ids path treatments pillars sections`, `sections`, `list` columns/badges, `orderable`, `group` tabs; modes `singleton`, `noCreate`, `fieldsFor(doc)`, `viewUrl`, `bulkUpload`) rendered by `components/admin/collection/{CollectionList,CollectionEditor,fields,form}.js`, plus two 10-line pages under `app/admin/<name>/`. Singletons/special screens (Settings, Notice, Image slots, Doctors) are hand-written. The B2.3 doctors notes below still describe the editor conventions:
- Backend `src/modules/<m>/admin.routes.js` mounted in `src/routes.js` under `admin`: `GET /options` (select data) · `GET /` (all incl. hidden, filters, paged) · `GET /:id` · `POST /` · `PATCH /:id` (partial, `.strict()`) · `DELETE /:id` (409 `IN_USE` when referenced → "hide instead"). Shared helpers `src/lib/admin.js`: `zL/zLRequired/zLOptional`, `zSlug`, `zId`, `zImage(folder)`, `applyPatch` (→ activity `changes`), `setSlug` (old slug → `previousSlugs`), `slugify`, `onLeaveToday`. Log `<m>.create|update|delete`. Leave a `// B3: revalidateTag(...)` line where the save happens. Add a `test/<m>-admin.test.mjs` to `npm test`.
- Frontend `app/admin/<m>/page.js` (list) + `app/admin/<m>/[id]/page.js` (`new` = create), each with `export const instant = false` + `<Suspense>`. Components in `components/admin/<m>/` — list (URL filters via `useUrlState`, `useAdminGet`), editor (`FormSection`, `LText` EN/বাংলা, `Toggle`, sticky save bar sending only changed keys, beforeunload guard, delete dialog), pure `<m>Form.js` (doc ⇄ form). Flip `ready: true` in `lib/admin/config.js` `NAV`, add activity labels.
**B3 plan (connect the site):** 1) `lib/api/*` switch on `DATA_SOURCE=api` → fetch mh-back public GETs with `cacheTag` per resource (read `node_modules/next/dist/docs` for `"use cache"`/`cacheTag`/`revalidateTag` in 16) and keep the mock path for the Vercel demo; 2) mh-back calls a secret-protected Next route `POST /api/revalidate { tags }` at every `// B3: revalidateTag(...)` line; 3) wire the public forms (booking, contact, careers apply with CV) to the B1.4 endpoints; 4) apply SEO overrides (`/api/seo` public read by path) in `generateMetadata`; 5) render Management on About and the article doctor byline; 6) full site QA against the live API.

---

## B2.10–B2.13 — Programmes, articles, gallery, pages, SEO, tap analytics (2026-10-27)
| Step | Backend (`/api/admin/…`) | Screen | Who |
|---|---|---|---|
| B2.10 | `programs/aesthetic` + `programs/bhrpc` singletons (GET/PATCH), `programs/options` | `/admin/aesthetic` · `/admin/bhrpc` (tabs). Ordered doctor team picker, treatments cards (name/summary/photo/show), contact desk, BHRPC who-for/services lists + reading list (article picker) | OPD |
| B2.11 | `articles` (+ `articles/options` doctors for bylines — graphics can't read `/admin/doctors`) · `gallery` | `/admin/articles` (category filter, sections editor, publish date, "Scheduled" badge, written by / reviewed by) · `/admin/gallery` (**Upload photos** = multi-file bulk upload into the current category, arrows = gallery order, "Caption missing" badge) | Graphics |
| B2.12 | `pages` (site → pages.manage, legal → legal.manage; fixed set) · `management` | `/admin/pages` (About: text/pillars/mission/vision; Patients & Visitors: sections with **#anchors kept**, bullet points, "Confirmed by the hospital" switch; legal: paragraphs separated by a blank line, Draft switch) · `/admin/management` (tab) | Graphics (legal: super admin) |
| B2.13 | `seo` overrides + `seo/paths` · public `POST /api/events/tap` → `tapstats` · `stats/overview.taps` | `/admin/seo` (page picker with suggestions, EN/BN counters 60/155, share image) · Overview **WhatsApp & call taps** (daily bars, by desk / number / section) for marketer + super admin | Marketer |

**Generic layer:** `crudRouter({ sort })`; `collections.js` modes `singleton`, `noCreate` (+ `noFilters`, `noOrder`, `listNote`), `fieldsFor(doc)`, `viewUrl(doc)`, `bulkUpload`; new field types `number textNull ref ids path treatments pillars sections(variant article|site|legal)` with a shared `Repeater`. `TapTracker` now also sends a `sendBeacon` (text/plain, no preflight) to `${NEXT_PUBLIC_ADMIN_API_URL}/events/tap`; with the env unset (Vercel demo) only the dataLayer push happens. Icons `images`, `news` added.

**Decisions:** article/gallery categories are a fixed select (keys must exist in the site dictionaries `tips.categories` / `gallery.categories`); page slugs/anchors can't change from the dashboard (menus link to them); the tap board counts taps only — no visitor data.

**Verified:** mh-back `npm run check` ✅ · `npm test` 7 suites ✅ (`final-admin` 42: roles per module, team/topic validation, treatment slugs, article rules + BHRPC delete guard, byline options, gallery, management, page types/permissions/anchors/legal paragraphs, SEO duplicate path + paths, beacon origin/junk/upsert, taps stats) · mh-front build ✅, eslint clean · Playwright B2.10–B2.13 22/22 (incl. real beacon from the public homepage counted on the overview, graphics/marketer menus, marketer at 390 px).

**Pending / for Sifat:** restart both servers; front `.env` must have `NEXT_PUBLIC_ADMIN_API_URL` for the tap beacon (already there locally; production = `https://api.monowarahospital.com/api`). Run `npm run seed` again if your local DB predates the articles/gallery/pages seed. Client to provide: Management people + chairman's message, legal text review (pages are marked Draft), Aesthetic clinic phone/WhatsApp, more gallery photos.

**Next — B3** (see START HERE).

---

## B2.5–B2.9 — Packages, settings, hero, image slots, homepage blocks, stories, FAQs, careers (2026-10-27)
**Generic layer (refactor of B2.4):** `crudRouter()` gained `required`, `sluggable:false`, `slugFrom`, `label`, `search`, `check(body, req, doc)`, `beforeSave(doc, body, req)` and **`PUT /order { ids }`** (arrow reordering, one `<entity>.reorder` log entry). Frontend B2.4 `components/admin/services/*` replaced by `components/admin/collection/*` + `lib/admin/collections.js` (same screens/behaviour for departments/facilities/diagnostics; B2.4 Playwright suite re-run 16/16). New helpers in `src/lib/admin.js`: `zDay`, `zPath`, `zUrl(hosts)`, `zPosition`, `zPhone`.

| Step | Backend (`/api/admin/…`) | Screen | Who |
|---|---|---|---|
| B2.5 | `packages` — category (maternity/surgical/checkup), inclusions, departments (must exist, deduped), image, featured. **No price field** (Call for Price). Delete blocked while a homepage centre links to it | `/admin/packages` (category filter, department checkboxes) | OPD |
| B2.6 | `settings` GET (settings or notice perm) · `PATCH /` (super admin): hotline/emergency/ambulance/landline, extra desk numbers, **WhatsApp desks** (exactly one active primary, stable ids from the label, order = position), booking mode, hero interval 2–15 s, email, address, hours, DGHS licence, years, socials (each on its own domain, https), Google Maps embed/directions (google hosts only) · `PATCH /notice` (graphics): on/off, text, internal or https link | `/admin/settings` (numbered sections, desk reorder, booking mode cards) · `/admin/notice` (live preview) | Super admin · Graphics |
| B2.7 | `hero` slides (label, eyebrow, title with `*accent*`, subtitle, image {src from /uploads/hero, alt, position}); reorder; can't delete the last visible slide · `media` slots: GET + PATCH src/alt/position/overlay only (keys are code-defined); a replaced slot becomes `source: own` | `/admin/hero` (arrows, live title-over-photo preview, focal-point presets) · `/admin/media` (cards per slot, upload cropped 3:2 around the chosen point, darkening slider for header bands, "Stock photo" badge) | Graphics |
| B2.8 | `keynumbers`, `centres` (internal link only; photo from home/departments/facilities/diagnostics/media), `talks` (11-char YouTube id) · `stories` — **consent**: `recordedBy` is stamped server-side from the session when consent is confirmed and cleared when withdrawn; the client can't send it; public `/api/home` still filters on consent | `/admin/keynumbers` · `/centres` · `/talks` (tabs; paste any YouTube link → id + thumbnail) · `/admin/stories` ("No consent — not shown" badge) | Graphics |
| B2.9 | `faqs` (question/answer required, topic key lowercased) · `jobs` (department must exist, deadline as Dhaka day, delete blocked while applications point at it → hide) | `/admin/faqs` (arrows = chatbot order) · `/admin/jobs` | OPD |

**Public site diffs:** `careers/[slug]` — renamed slug → 308, canonical on the current slug, and the deadline is formatted (`formatDhakaDate`) instead of printing the raw ISO date from the API.

**Shared UI:** `ImageUpload` gained `query` (upload `?position=`), `imgStyle`, `overlay`, `removable`; `PositionPicker` (Left/Centre/Right/Top/Bottom + free "x% y%"); `ListEditor` moved to `collection/fields.js`.

**Verified**: mh-back `npm run check` (91 files) ✅ · `npm test` 6 suites ✅ (new `content-admin.test.mjs` 55: roles per module, package rules (no price, category required, unknown dept, centre-link delete guard), settings (desk reorder + new id, one-primary rule ×2, social/map host checks, phone, email lowercase), notice (text required to switch on, href internal/https, graphics-only), hero (reorder → public order, duplicate ids, image required, last visible slide guard), media (replace → own, key immutable, role), key number, centre link, YouTube id, stories consent stamp/clear + public filtering, FAQs, jobs (Dhaka deadline, applications guard, hidden not public), activity) · mh-front build ✅, eslint clean · Playwright: B2.5–B2.9 23/23 + B2.1/2.2 25/25 + doctors 17/17 + services 16/16.

**Pending / for Sifat**: restart both servers. Settings → DGHS licence + years serving are empty/old in the seed — fill from the client. Replace "Stock photo" image slots with the hospital's own photos as they arrive. Commit both repos.

**Next — B2.10: MH Aesthetic & BHRPC** (`programs.manage`, OPD).

---

## B2.4 — Departments, facilities, diagnostics + account menu (2026-10-27)
**Shell (Sifat's feedback):** the sidebar bottom had name/role/My account/Sign out and grew too tall → sidebar bottom now only **View website**; the account menu (initials avatar, name, role → My account / Sign out, closes on outside click/Esc) sits **top-right** in a slim sticky top bar on desktop and in the mobile header. Nav items can claim extra paths (`also`) — "Departments & services" stays active on facilities/diagnostics.

**Backend (departments.manage = OPD in-charge + super admin)**
- `src/lib/crud.js` — `crudRouter({ Model, entity, permission, fields, filter, query, inUse, check })`: list (all incl. hidden, `q`, `status`), get, create (slug from English name, `-2` on clash, appended last), strict partial PATCH (slug rename → `previousSlugs`, before/after in activity), DELETE with `inUse` → 409 `IN_USE`.
- `departments/admin.routes.js` (name, summary, description ≤ 6000, services/conditions ≤ 40 rows, image `/uploads/departments`, isFeatured, seo{title,description}, isActive, order; delete blocked while doctors or packages point at it; `legacySlugs` read-only) · `facilities/admin.routes.js` (+ features, whenTo, is24x7) · `diagnostics/admin.routes.js` (+ tests, timing, preparation).
- mh-front public pages `facilities/[slug]` and `diagnostics/[slug]`: old slug → 308 to the current one + canonical uses the current slug (departments/doctors already did this) — needed now that slugs can be renamed.

**Frontend** `/admin/departments | /facilities | /diagnostics` (tabs) and `/<kind>/new | /<kind>/<id>`:
- List: numbered in website order, thumbnail, summary, badges (Hidden, Featured, 24/7, **Bangla missing**), search, shown/hidden filter.
- Editor (config in `components/admin/services/kinds.js`): Name & summary + web address (old WordPress links listed), Page content (description, repeatable EN/বাংলা rows with add/remove/move up-down), Visit information (facility: when to come, 24/7; diagnostic: timing, preparation), Image (shared `components/admin/ImageUpload.js`), Google listing (department SEO title/description with 60/155 counters), On the website (show/hide, featured, order), Delete (typed confirm; 409 reason shown). Same save bar / changed-keys-only PATCH / unsaved guard as doctors.

**Verified**: mh-back `npm run check` (84 files) ✅ · `npm test` 5 suites ✅ (new `services-admin.test.mjs` 23: roles, featured/hidden filters, services/SEO patch, rename + public old-slug resolve + doctors-by-old-department-slug, legacySlugs/foreign image/41-row rejects, delete 409/200, facility whenTo→null + duplicate slug, diagnostic create/delete, activity) · mh-front build ✅, eslint clean · Playwright: services 16/16 (sidebar bottom only View website, top-right menu + Esc, 22 departments, row reorder, add service, SEO, rename → public resolves, delete blocked by doctors, nav active on facilities, facility 24/7 save, diagnostic create → delete, mobile menu, 390 px no overflow, no errors) + B2.1/B2.2 25/25 + doctors 17/17 re-run.

**Pending / for Sifat**: restart both servers → `/admin/departments`. Many Bangla summaries/descriptions are filled; the "Bangla missing" badge shows the rest. Commit both repos.

**Next — B2.5: packages** (category, Call-for-Price only, inclusions EN/BN list, related departments multi-select, image, featured/order; delete blocked if referenced by home blocks).

---

## B2.3 — Doctors module, overview charts, dev fixes (2026-10-27)
**Fixes (from Sifat's dev run)**
1. *Hydration warning `cz-shortcut-listen`* — a browser extension (ColorZilla) writes that attribute on `<body>` before React hydrates. Not our bug; `suppressHydrationWarning` on `<html>`/`<body>` in `app/admin/layout.js` (same as the public layout).
2. *"Could not validate that a segment in your UI has instant navigation" (/admin)* — Next 16 dev-only instant-navigation validation: admin pages render only after the client session check, so the prerender has no page UI to inspect. `export const instant = false` in `app/admin/layout.js` **and every admin `page.js`** (the flag is per segment). Public site keeps validation. Verified in `next dev`: no error, no hydration warning (extension attribute simulated).
3. `next/image` `priority` → `loading="eager"` on the admin logos (Next 16 LCP warning).

**Doctors (opd_incharge + super_admin)**
- mh-back `src/modules/doctors/admin.routes.js` + `src/lib/admin.js`. Validation mirrors the model: chamber times HH:MM, end after start, **same-day overlaps rejected**, stored in week order; leave `{from?, until, note?}` as Dhaka days → Dhaka-midnight Dates ("on leave" counts the whole last day); photo only `/uploads/doctors/...`; BMDC/phone charset; department must exist; `legacyUrl`/unknown fields rejected. Create: slug from the English name **without the academic title** (`Prof. Dr. X` → `dr-x`, same as migrated slugs), `-2` on clash, appended to the end of the order. Rename: old slug → `previousSlugs` (public API + doctor page already 308 to the new URL). Delete: blocked (409) while the doctor is on the Aesthetic/BHRPC team or an article byline; UI recommends hiding instead (typed "delete" confirmation).
- mh-front `/admin/doctors`: search, department, shown/hidden, quick filters (Homepage, On leave today, No photo, No BMDC, No chamber time), chamber-day strip per row. `/admin/doctors/new` + `/admin/doctors/<id>`: 5 numbered sections — Profile (EN/বাংলা side by side, web address with redirect note), Photo (upload → WebP), Chamber times (weekly editor, add/remove, "same times Sat–Thu", inline overlap errors, note-instead-of-times), Leave, On the website (show/hide, homepage, order). Sticky save bar ("3 unsaved changes"), sends only changed fields, Discard, unsaved-changes guard.

**Overview charts** — `GET /api/admin/stats/overview?days=30` (blocks per permission; plain finds, no aggregation): booking requests per day (bar chart, hover tooltip, hidden data table), by status, most requested doctors, messages per day, applications by status, and a **doctor directory** strip (shown / hidden / on leave today / no photo / no BMDC / no chamber time — red = to-do, each tile opens the filtered list). Dependency-free SVG (`components/admin/charts.js`), single teal series, no legend.

**Verified**: mh-back `npm run check` (80 files) ✅ · `npm test` all 4 suites ✅ (new `doctors-admin.test.mjs` 43 checks: list/filters/roles, create + slug rules, validation (overlap, end<start, external photo, strict, legacyUrl), rename + previousSlugs + public resolve, leave dates + on-leave-today, delete 409/200, activity, stats windows/roles) · mh-front build ✅, `eslint .` clean · Playwright prod build: B2.1/B2.2 suite 25/25 again + doctors/overview 17/17 (filters in URL, overlap blocks save, leave, BMDC, slug rename → old slug resolves, photo upload → WebP path, create → redirect, delete, delete-in-use message, chart tooltip, directory tiles, 390 px no overflow, no page errors).

**Pending / for Sifat**
1. Restart both dev servers; open `/admin/doctors`. Fill BMDC numbers (overview shows how many are missing).
2. Commit both repos.
3. Website changes from admin appear on the public pages after B3 (cache revalidation); until then restart `next dev` / rebuild to see them.

**Next — B2.4:** departments + facilities + diagnostics (one editor shape, `legacySlugs` read-only, services/conditions lists, image upload, SEO fields, delete blocked while doctors/packages point at it).

---

## B2.1 + B2.2 — Admin dashboard shell, auth screens, inboxes, staff accounts, activity log (2026-10-27)
**Decisions**
1. **Browser calls the API directly** (no `/api` rewrite through Next): same as production (`monowarahospital.com` → `api.monowarahospital.com` = same site, CORS + credentials), no extra hop on the 1-vCPU box. `NEXT_PUBLIC_ADMIN_API_URL`; a loopback API host follows the page's loopback hostname, so `localhost:3000` and `127.0.0.1:3000` both work in dev.
2. `/admin` is its **own root layout** (`app/admin/layout.js`: no Loader/TopBar/Header, `lang="en"`, `robots: noindex,nofollow`). Moving between `/admin` and the public site is a full page load (Next: different root layouts) — intended. `proxy.js` already skipped `/admin`.
3. **No `/admin/login` route** — `AdminProvider` renders the login form *in place* when signed out, so the alert-mail deep link (`/admin/bookings/<id>`) lands on that booking right after sign-in. Same for the forced password change.
4. Everything under `/admin` is client-rendered behind the session gate (static shells at build); mh-back is the real guard (requireAuth + permission on every route).
5. Filters/pages/open item live in the URL (`?status=new&q=…&page=2&open=<id>`) → shareable, back button works. `/admin/<inbox>/<id>` (email links) = same screen with that item open; closing returns to the list URL.
6. Opening a **new message** auto-marks it Read (one PATCH, logged). Bookings: status + serial + staff note; when confirmed, the WhatsApp button pre-fills a Bangla confirmation with doctor, day, chamber time and serial.
7. Temporary passwords are generated in the browser (`crypto.getRandomValues`, no 0/O/1/l/I) and shown **once** in a hand-over step.

**Done — mh-front** (all new except `.env.example`)
- `app/admin/layout.js`, `page.js` (overview), `bookings|messages|applications/page.js` + `[id]/page.js`, `users/page.js`, `activity/page.js`, `account/page.js`, `[...missing]/page.js` + `not-found.js` (unknown/not-yet-built modules → admin 404 inside the shell).
- `lib/admin/api.js` — `adminFetch`: `credentials: include`, `X-Requested-With: mh-admin`, **single-flight refresh** (parallel 401s share one `/auth/refresh`), `409 REFRESH_RACE` → retry, other 401 → `signed-out` event, `403 PASSWORD_CHANGE_REQUIRED` → event; `adminDownload` (blob + server file name). `lib/admin/config.js`, `lib/admin/format.js`.
- `components/admin/`: `AdminProvider` (session gate, reasons: idle/expired/revoked, **cross-tab sign-in/out via BroadcastChannel**), `session.js`, `AdminShell` (role menu, new-count badges polled every 60 s + on focus, mobile drawer), `LoginScreen` (Bangla wordmark side, no stock photo), `PasswordForm` (forced + voluntary, live rule check), `InboxScreen` + `InboxDetail` (status tabs with counts, search, date filters, pager, Excel export, detail sheet: call/WhatsApp/email, CV download, status/serial/note), `UsersScreen` (add / edit name-role-active / reset password / force sign-out; own role & active locked; role picker explains each role), `ActivityScreen` (type/person/date filters, before→after table, failed sign-ins in red), `Overview` (new counts, "what you manage", recent activity), `AccountScreen` (change password, sign out on all devices), `ui.js`, `hooks.js`.
- `.env.example`: `NEXT_PUBLIC_ADMIN_API_URL`.

**Done — mh-back (diffs)**
1. **Bug fix `src/modules/auth/cookies.js`:** the access cookie had `Max-Age` = token TTL (10 min) → the browser deleted it exactly when the JWT expired → API saw no cookie → `AUTH_REQUIRED` instead of `TOKEN_EXPIRED` → staff would be signed out every 10 minutes. Cookie now expires with the session; the JWT inside still expires in 10 min. Test added.
2. `src/modules/inbox/routes.js`: `handledByName` on list / get / patch (one `$in` lookup; `handledBy` id unchanged). Test added.
3. `src/middlewares/security.js`: CORS `exposedHeaders: ["Content-Disposition"]` (download file names).
4. `.env.example`: `ADMIN_URL` comment (origin only, no `/admin`).

**Verified**: mh-back `npm run check` (77 files) ✅ · `npm test` parity 163/163, auth all ✅ (+1), forms/uploads/inbox all ✅ (+2) · mh-front `npm run build` ✅ (admin routes static shells, `[id]` partial prerender) · `npx eslint .` clean · esbuild ✅ · **Playwright e2e against the real mh-back app (in-memory driver, seeded)**: 25/25 — wrong password, deep link kept after login, message auto-read, badges 6→5 after confirm, status tab in URL, Bangla WhatsApp text with serial, handler name, Excel download name, pager, `[id]` deep link + close, CV download, create user + hand-over, own role locked, activity filters + changes, not-ready module 404, other tab follows sign-out, forced password for a new user, marketer sees no front desk + "No access" on `/admin/bookings`, 390 px no overflow, no console errors · **token expiry** (TTL 1 min, two tabs, 66 s idle): 3 parallel 401s → exactly one refresh, both tabs stay signed in, no reuse alarm.

**Pending / for Sifat**
1. mh-front `.env`: `NEXT_PUBLIC_ADMIN_API_URL=http://localhost:5036/api` → restart `npm run dev`.
2. mh-back `.env`: `ADMIN_URL=http://localhost:3000` (email links); `CORS_ORIGINS` must contain the origin you open the dashboard on (default has both localhost/127.0.0.1:3000). Restart the API (cookie fix).
3. Open `http://localhost:3000/admin` → sign in with the super admin from `npm run create-admin`. Create real staff accounts from **Staff accounts**.
4. VPS (B4): `NEXT_PUBLIC_ADMIN_API_URL=https://api.monowarahospital.com/api` at **build time** (NEXT_PUBLIC_ is inlined), `CORS_ORIGINS=https://monowarahospital.com`, `COOKIE_SECURE=true`, `ADMIN_URL=https://monowarahospital.com`.
5. Commit both repos.

**Next — B2.3: doctors module** (see START HERE plan).

---

## B1.4 — Client roles, uploads, mail, public forms, inboxes, Excel export (2026-10-27)
**Roles changed (client decision):** `super_admin`, `opd_incharge`, `graphics_design`, `marketer` — the old `admin` role is gone.
Map (only in `src/lib/permissions.js`): super_admin = everything (+ users, settings, activity log, **legal pages**); opd_incharge = doctors/chamber times, departments/facilities/diagnostics, packages, Aesthetic/BHRPC, bookings, messages, careers, **FAQs**; graphics_design = hero, homepage blocks, image slots, gallery, health tips & news, patient stories, notice bar, About/Patients & Visitors/Management pages; marketer = SEO only. Bold = my assumption, one-line change if the client disagrees.

**Done**
1. **Uploads** (`src/modules/uploads`) — `POST /api/admin/uploads/:folder`, permission per folder, multer in memory (raw file never hits disk) → sharp decode-check (non-images, SVG, HEIC → 415), auto-rotate, EXIF/GPS stripped, WebP at a per-folder max width (same rules as `scripts/optimize-media.mjs`; media slots cropped to 3:2 around `position`), 1200×630 JPEG OG rendition for share-able folders, random-suffixed safe names, atomic write. sharp cache off + concurrency 1 for the 1-vCPU VPS. Dev: `SERVE_UPLOADS=true` serves `UPLOAD_DIR` at `/uploads`.
2. **Mail** (`src/lib/mailer.js`) — Nodemailer pool from `SMTP_*`, plain text only, header CR/LF stripped, never throws (logged), alerts are fire-and-forget to `ADMIN_EMAIL` with a dashboard link (`ADMIN_URL`).
3. **Public forms** (`src/modules/forms`) — field names match the existing `BookingForm`/`ContactForm`/`ApplyForm`: `POST /api/contact`, `/api/appointments`, `/api/careers/apply`. Allow-listed Origin, per-IP limits (5/10 min; apply 3/30 min), honeypot → silent 202, BD mobile normalised, names/subjects forced single-line, control chars stripped. Appointments: only when `bookingMode` is form/both; date window today…+60 (Dhaka), chamber weekday + leave checks, duplicate guard, slot + doctor/department name snapshots. CV: type by magic bytes (PDF/DOC/DOCX), ≤ 5 MB, stored under `PRIVATE_DIR/cv/YYYY-MM/<random>.<ext>` (never web-served).
4. **Inboxes** (`src/modules/inbox`) — `messages`, `bookings`, `applications` collections; one router factory: list (+ status tab counts), filters, `PATCH` status/staffNote (+ booking `serial`) with handledBy/At and before/after activity entries, `export.xlsx` (exceljs, ≤ 5000 rows, formula-injection-safe cells, export logged), CV download (attachment, nosniff, logged).
5. Error handler: Multer errors → 413/400; Express-internal 4xx (static 404) keep their status without leaking paths.
6. Deps (pinned): `multer 2.4.0`, `sharp 0.35.5`, `nodemailer 10.0.16`, `exceljs 4.4.0`. New env: `UPLOAD_DIR`, `PRIVATE_DIR`, `SERVE_UPLOADS`, `UPLOAD_MAX_MB`, `CV_MAX_MB`, `SMTP_*`, `MAIL_FROM`, `ADMIN_EMAIL`, `ADMIN_URL`.

**Verified**: `npm run check` (77 files) ✅ · B1.4 end-to-end (real Express + Mongoose on the in-memory driver, real seeded doctors/departments/jobs, a fake SMTP server capturing mails): **53/53** — normalisation, header-injection, honeypot, field errors, origin, rate limit, booking off/on, chamber slot, duplicate, no-chamber day, past date, unknown doctor, leave, department-only; PDF/DOCX accepted, exe-as-pdf 415, 6 MB 413; role 403s per inbox; booking confirm + serial; PATCH can't edit patient data; xlsx parsed back (no formula cells, `'=HYPERLINK`); CV bytes identical + not reachable via /uploads; uploads per role, EXIF rotate + strip, 3:2 crop, OG 1200×630, SVG/text 415, traversal, 11 MB 413, dev static + 404; activity entries; exactly 10 alert mails ✅ · auth suite re-run with the new roles 46/46 ✅ · public parity 163/163 ✅.

**Pending / for Sifat**
1. `npm install` in `mh-back` (4 new deps; sharp downloads its prebuilt binary).
2. Add the B1.4 block from `.env.example` to `.env` (`UPLOAD_DIR=../mh-front/public/uploads`, `PRIVATE_DIR=./private`, `SERVE_UPLOADS=false`, `ADMIN_EMAIL=…`, `ADMIN_URL=`). **Don't set `MEDIA_ORIGIN` in dev** — Next 16 blocks optimising images from localhost/private IPs (`images.dangerouslyAllowLocalIP` defaults to false); `next dev` serves new files in `public/uploads` directly. Your `SMTP_*` lines already match. **Regenerate the Gmail app password** (it was exposed earlier in this session).
3. If any user was created with the old `admin` role: `db.users.updateMany({ role: "admin" }, { $set: { role: "opd_incharge" } })` in Atlas.
4. VPS later (B4): copy `mh-front/public/uploads` → `/var/www/mh/uploads`; `PRIVATE_DIR=/var/www/mh/private` (outside every Nginx root); `SERVE_UPLOADS=false`.

**Next — B2 admin dashboard** (`mh-front/app/admin`, noindex, not localised): login + forced password change, fetch wrapper (refresh/retry rules in the contract), role-based menu from `permissions`, inbox screens (bookings/messages/applications + exports), user management, activity log, then CRUD modules (doctors + schedule editor, departments, packages, hero, media slots, settings incl. WhatsApp desks + booking mode, SEO…). Backend CRUD endpoints per module land with each screen.

---

## B1.3 — Staff auth, RBAC, activity log (2026-10-27)
**Done** (all in `mh-back`; contract for the admin UI: `docs/API_CONTRACT.md` → "Admin auth")
1. **Users** (`src/modules/users`) — `name, email (unique, lowercased), passwordHash (select:false), role, isActive, mustChangePassword, tokenVersion, failedLogins, lockUntil, lastLoginAt, passwordChangedAt, createdBy`. bcryptjs cost 12 (pure JS — no native build on Windows/VPS). Password rule: ≥ 10 chars, ≤ 72 bytes (bcrypt limit; Bangla = 3 bytes/char), letter + number. No public signup.
2. **Sessions** (`src/modules/auth`) — one doc per login. Access = HS256 JWT (10 min, iss/aud checked, algorithm pinned) in `mh_at` (Path=/api). Refresh = opaque `"<sessionId>.<secret>"`, only sha256 stored, in `mh_rt` (Path=/api/auth). Both HttpOnly + SameSite=Strict, Secure in production. Every refresh rotates (atomic compare-and-swap); replaying an old refresh token > 30 s later revokes the session (theft), < 30 s = `409 REFRESH_RACE` (two tabs). Idle > 30 min → `SESSION_IDLE`; absolute 7 days; TTL index cleans up.
3. **requireAuth** re-reads user + session on every request → role change, deactivation, password reset, logout apply **immediately** (not after token expiry). `mustChangePassword` blocks everything except `/auth/me`, `/auth/password`, `/auth/logout(-all)`.
4. **RBAC** *(roles superseded in B1.4 by the client's 4 roles — see above)* — `src/lib/permissions.js` is the only role→permission map (proposal §5.4): super_admin = all; admin = doctors, departments/facilities/diagnostics, packages, programs (Aesthetic/BHRPC), bookings, messages, careers; marketer = hero, home blocks, notice bar, articles, gallery, stories, SEO, media slots. **Assumptions to confirm with the client:** FAQs = admin + marketer; legal/About/Management pages = super admin only. Routes use `requirePermission("<perm>")` (typos fail at boot).
5. **Login protection** — per account: 5 failures → locked 15 min (atomic `$inc`). Per IP: 20 **failed** logins / 15 min (successful ones don't count — a whole office shares one NAT IP). Unknown email and wrong password return the identical 401 and take the same time (dummy bcrypt compare). Disabled accounts get the same generic 401.
6. **CSRF** (`src/middlewares/csrf.js`) on `/api/auth` + `/api/admin`: Origin must be allow-listed + `X-Requested-With` required on unsafe methods (forces a CORS preflight; covers sibling subdomains, which SameSite treats as same-site). `Cache-Control: no-store` on both.
7. **User admin** — `/api/admin/users` list/create/patch/reset-password/logout-all (super admin). Can't change own role or disable self; last active super admin protected; role/active change and resets revoke the user's sessions. No DELETE (deactivate keeps the activity log intact).
8. **Activity log** — `activity` collection, append-only, actor snapshotted, ip + user agent, `changes: { field: [before, after] }`. Logged: login, failed login (with reason), locked, logout, logout-all, refresh-token reuse, password change, users create/update/reset/force-logout. `GET /api/admin/activity` with filters (`action=auth.*` prefix). B2 modules call `logActivity(req, {...})` on every save.
9. **CLI** — `npm run create-admin -- --email … --name "…"` (password asked hidden; or `ADMIN_PASSWORD` env). `--reset` = new password + unlock + sign out everywhere (locked-out super admin recovery).
10. New env: `JWT_ACCESS_SECRET` (**required**), `ACCESS_TOKEN_TTL_MIN`, `SESSION_IDLE_MIN`, `SESSION_MAX_DAYS`, `LOGIN_MAX_ATTEMPTS`, `LOGIN_LOCK_MIN`, `COOKIE_DOMAIN`, `COOKIE_SECURE`. Deps: `bcryptjs`, `jsonwebtoken`, `cookie-parser`.

**Verified**: `npm run check` (68 files) ✅ · end-to-end test (real Express + real Mongoose on an in-memory driver collection): **46/46** — CSRF header/origin, NoSQL injection, identical 401s, lockout, cookie flags, forced password change, marketer 403s, exact marketer permission set, rotation, race 409, reuse → revoke (kills the legit access token too), idle logout, expired / `alg:none` / foreign-secret tokens, instant revoke on role change, self-demotion blocked, mass-assignment (`passwordHash` in PATCH) rejected, deactivated login, reset unlocks, activity entries + before/after, logout + replayed cookie ✅ · IP limiter: 20 failures then 429 ✅ · public parity still 163/163 ✅ · CLI validation paths ✅.
Not run here: against a real MongoDB → Sifat (steps below).

**Pending / for Sifat**
1. `npm install` in `mh-back` (3 new deps).
2. Add to `mh-back/.env`: `JWT_ACCESS_SECRET=` + output of `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` (server refuses to start without it). Different value on the VPS.
3. `npm run create-admin -- --email solaimanislamsifat@gmail.com --name "Sifat"` → `npm run dev`.
4. Smoke test (PowerShell/Thunder Client): `POST http://localhost:5036/api/auth/login` with header `X-Requested-With: mh-admin` and JSON `{ "email": "...", "password": "..." }` → 200 + two cookies; then `GET /api/auth/me` with the cookies → your user.
5. Confirm with the client: FAQs (admin + marketer?) and legal/About/Management pages (super admin only?).

**Next — B1.4**: uploads (multer + sharp → `/uploads/<collection>/…webp`, same rules as `scripts/optimize-media.mjs`, magic-byte check, size caps, JPEG OG rendition), Nodemailer (SMTP from `.env`), public forms with strict limiters + honeypot: contact → `messages`, careers apply with CV (PDF/DOC, stored outside the web root, admin-only download) → `applications`, booking request (when `bookingMode` = form/both) → `bookings`; email alert to `ADMIN_EMAIL`; exceljs export for bookings/messages/applications.

---

## B1.1 + B1.2 — mh-back: scaffold, models, seed, public read API (2026-10-27)
Repo: `E:\Works\monowara-hospital\mh-back` (Express 5, ESM, JavaScript). Public host decided by Sifat:
**`https://api.monowarahospital.com/api/<resource>`** (e.g. `/api/doctors`) — no `/v1`.

**Done**
1. **Scaffold** — `src/server.js` (connect → listen on `HOST:PORT`, default `127.0.0.1:5020`; graceful SIGINT/SIGTERM; keep-alive > Nginx), `src/app.js`, `src/routes.js` (everything under `/api`), `src/config/env.js` (zod-validated env, process exits with a readable list on bad config), `src/config/db.js` (`strictQuery`), pino + pino-http (auth/cookie headers redacted; pretty in dev).
2. **Security middleware** — helmet (CSP `default-src 'none'`, CORP `same-site`), CORS allow-list with credentials (`CORS_ORIGINS`), `query parser: simple` (no `?a[$ne]=` objects), custom body/params sanitiser (`$`/`.`/`__proto__` keys dropped — `express-mongo-sanitize` breaks on Express 5), zod `validate()` → `req.valid`, one error envelope `{ error: { code, message, details? } }` (Zod/Cast/Validation/11000/bad JSON/413 mapped; no stack traces in prod).
3. **Rate limit** — public GETs 300/min/IP. Exempt: loopback calls **without** `X-Forwarded-For` (the Next server on the VPS, otherwise SSR would throttle itself — all renders share 127.0.0.1) and a valid `x-mh-internal-key` (`INTERNAL_API_KEY`, for `next build` off-VPS; timing-safe compare). `strictLimiter()` factory ready for login/forms.
4. **Models** (`src/modules/<name>/model.js`, all re-exported from `src/models.js`) mirror `data/*.js` exactly: string `_id`s kept (`doc_…`, `dept_…`; new admin docs get an ObjectId-hex string), `{en,bn}` sub-schema, `isActive`/`order`, `slug` + `previousSlugs` (+ `legacySlugs` on departments/facilities/diagnostics), image fields must be `/uploads/...` paths (no external URLs), doctor `schedule` HH:MM + day enum, `leave`, package `priceMode: "call"` only. Collections: settings, heroslides, faqs, keynumbers, centres, talks, stories, departments, facilities, diagnostics, doctors, packages, articles, gallery, pages (`type: legal|site`), management, jobs, aesthetic, bhrpc, media, seo.
5. **Public endpoints** — every row of `docs/API_CONTRACT.md` + `GET /api/health`. Doctors: `department` = id / slug / renamed slug, `day`, `q` (name en/bn, degrees, specialty en/bn, department name; regex-escaped, ≤ 80 chars), `featured`, `page`, `limit ≤ 100` (else 400) → `{ items, total, page, limit }`, department populated. Slug routes resolve the current slug first, then `previousSlugs`. Stories: only `consent.confirmed`, `consent.recordedBy` never leaves the DB. Aesthetic/BHRPC: team populated in admin order, inactive doctors skipped.
6. **Seed** — `npm run seed -- --drop` imports `../mh-front/data/*.js` (or `--front <path>` / `MH_FRONT_DIR`). Validates everything before writing; aborts if any data field isn't in a schema (deep check — nested sub-schemas ignore `strict:"throw"`), warns on dangling refs, refuses non-empty collections without `--drop`, refuses `NODE_ENV=production` without `--production`. `--dry-run` = validation only, no DB.
7. **mh-front diffs** — `lib/api/content.js`: static article sort comparator never returned 0 → same-day articles came out **reversed** (now date desc → order, same as the API). `lib/api/client.js` default + `.env.example`: `API_URL=http://127.0.0.1:5020/api` (127.0.0.1, not `localhost` — Node can resolve `::1`, the API binds IPv4 loopback). `docs/API_CONTRACT.md`: host, rate-limit, error rules.

**Verified**: `npm run check` (esbuild, all files) ✅ · `npm run seed -- --dry-run` against the real `data/` ✅ (all 21 collections) and it rejects injected unknown fields (top-level and nested) ✅ · parity harness (real Express app, Mongoose queries answered in-memory with `sift`, compared to the static services' logic): **163/163** endpoint calls identical (all lists, filters, every detail slug) ✅ · 400 on `limit=500` / bad `day` / bad `category` / uppercase slug, `?department[$ne]=` harmless, 404s, renamed slug resolves, CORS blocks foreign origins, rate limit 429 at #301 for an `X-Forwarded-For` client while direct loopback stays 200 ✅.
Not run here: a real `mongod` (couldn't run one in this environment) and `next build` with `DATA_SOURCE=api` → **Sifat runs both locally** (steps below).

**Decisions**
- API on a subdomain → the admin (monowarahospital.com) and API (api.monowarahospital.com) are **same-site**: `SameSite=Strict` cookies still work; cross-origin → CORS with credentials (B1.3).
- Express 5.3 + Mongoose 9.11 (the versions Sifat installed; whole verification re-run on them). No `$lookup`/aggregation in the public API (two small queries instead).
- Entry point is `src/server.js` (`npm run dev` / `npm start`). The empty root `server.js` from `npm init` is unused — delete it.
- `pages` holds legal + site pages; section `body` is Mixed (legal = paragraph arrays, site = text) — the B2 admin validator enforces shape per type.
- Settings are public as a whole; future private settings (form recipients, SMTP) must be `select: false`.

**Pending / for Sifat**
1. Install MongoDB Community locally (or use an existing one), then in `mh-back`: `npm install` → copy `.env.example` → `.env` → `npm run seed -- --drop` → `npm run dev` → open `http://127.0.0.1:5020/api/health` and `/api/doctors?limit=3`.
2. In `mh-front` `.env.local`: `DATA_SOURCE=api`, `API_URL=http://127.0.0.1:5020/api` → `npm run build` must pass (the site must look identical to the static demo). Switch back to `static` for the Vercel demo.
3. `git init` + first commit in `mh-back`; commit the mh-front diffs.

**Next — B1.3**: `users` (bcrypt, roles super_admin/admin/marketer), `/api/auth` login/refresh/logout/me — access + refresh JWT in HttpOnly `SameSite=Strict` cookies (refresh rotation + reuse detection, idle timeout), login limiter + lockout, `requireAuth`/`requireRole`, `activitylogs`, first super-admin via a CLI script (no public signup).

---

## Client feedback round — hero slider, topbar socials, centres photos, talks gap (2026-10-25)
**Done**
1. **Hero = full-bleed background-photo slider on Swiper 14.3.0** (rev. 2 — Sifat found the card-style v1 "not cool"). `components/home/HeroCarousel.js` (client) + `Hero.js` (server wrapper). Swiper **core** is initialised in `useEffect` on our own SSR'd `.swiper > .swiper-wrapper > .swiper-slide` markup — `swiper/react` builds the instance during render and its modules call `new Date()`, which a Cache Components prerender rejects. Modules: EffectFade, Autoplay (pause on hover, Swiper's own hidden-tab handling + our IntersectionObserver), Keyboard, A11y; `rewind` instead of `loop` (no cloned slides → one `<h1>`). Each slide: bg photo with Ken Burns while active, ink-teal wash (left on desktop, bottom on mobile), copy anchored bottom-left with staggered rise (`.mh-hero` rules in globals.css; copy is visible before init → SSR/LCP fine). **Buttons are common**: one overlay pinned above the QuickPanel overlap; its height is measured (ResizeObserver → `--hero-actions`) and reserved under every slide's copy. **Rev. 3 (Sifat, 2026-10-26): no visible nav at all** (chapter labels / segments / pause / arrows removed — "clean"); a new slide every **5 s** — **admin-controlled** via `settings.heroSlider.intervalSec` (default 5, clamped 2–15 in `lib/api/settings.js`; `Hero` → `HeroCarousel intervalMs`; Swiper `delay = interval − 1 s fade`). Crossfade 1 s, Ken Burns 5 s. B2 admin: Settings → "Hero slider" → seconds-per-slide field; swipe + ←/→ keys still work; dictionary keys `heroPrev/Next/GoTo/Pause/Play` removed. Reduced motion: no autoplay / Ken Burns. Gotcha: Swiper `autoplay.start()/resume()` re-arm the timer even when running → guarded.
2. **Hero data** `data/hero.js` → `{ _id, slug, label (nav name), eyebrow, title, subtitle, image{src, alt, position, source}, order, isActive }` (CTA + `cardMedia/wideMedia/media` fields removed — buttons are common). 5 slides: General (`hospital-building-wide.webp`, focal `72% center`) · BHRPC · Emergency · Diagnostics · MH Aesthetic. Slides 2–5 = **Unsplash placeholders** (`public/uploads/hero/slide-*.webp`), downloaded by `scripts/fetch-stock-images.mjs` (now also reads `heroSlides[].image.source`). Dep added: `swiper@14.3.0` → `npm install`.
3. **TopBar socials** — same icons/URLs as the footer (`settings.socials`), ≥ sm, after the WhatsApp number. Map extracted to `components/ui/Socials.js` (`SOCIALS`, `activeSocials()`), Footer imports it.
4. **Centres** — photo shown by default (16:10, rounded, number chip) above the title; hover/focus = slow zoom + teal tint + teal title + filled arrow chip. No image → quiet teal panel. Stagger trigger lowered (`viewport.amount 0.03`) because the 8 photo cells make a tall list on mobile.
5. **Expert talks** — the side list used a stretched grid (rows filled the large video's height → gap in the middle). Now `content-start` in a flex column, side thumbs 13rem → 17rem at xl, homepage capped at 1 + 3 videos, and a "Watch more health talks" YouTube card follows the list (from `settings.socials.youtube`).
6. Dictionaries: `home.heroLabel/heroPrev/heroNext/heroGoTo/heroPause/heroPlay`, `home.talksMoreTitle/talksMoreLead` (EN + BN).

**Verified**: `next build` ✅ · `eslint .` ✅ · Playwright 1440 / 390, EN + BN: no horizontal overflow, autoplay advances every ~6.5 s + 1.4 s fade, keyboard ←/→, reduced-motion = static, one `<h1>`.

**Pending / for Sifat**: run `node --no-warnings scripts/fetch-stock-images.mjs` once (downloads the 4 hero placeholders; and run `npm install` (Swiper); until the images exist slides 2–5 show the dark teal background). Real photos per slide from the client. Admin B2: "Hero slider" module = CRUD on these fields + order + active toggle (no CTA fields).

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

Not changed (decisions): ~~only the **first** active hero slide is used~~ → superseded 2026-10-25: the hero is a multi-slide slider (`GET /hero` returns all active slides, interval in `settings.heroSlider.intervalSec`); key numbers ~~stay hidden (Sifat's revision 3)~~ → shown again under the QuickPanel (2026-10-21, see Post-Phase-5); old-WordPress redirects stay in `data/redirects.mjs` (build-time) — admin slug renames use `previousSlugs` instead.

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
> Design locked 2026-10-27. B1.1–B1.4 done (sections at the top); continue with B2.

Before: Sifat deploys to Vercel and runs the client demo with `docs/DEMO_CHECKLIST.md`; collect the §4 items; client signs §5.
1. **B1 `mh-api`** (Express, modular): Mongoose models mirroring `data/*` (incl. `{en,bn}` package inclusions, structured settings address, media slots), auth (JWT HttpOnly cookie + refresh), RBAC, zod, rate limit, custom NoSQL sanitising, multer + sharp (same rules as `scripts/optimize-media.mjs`; also a JPEG OG rendition per upload), Nodemailer.
2. **B2 admin** in `app/admin` (all proposal §5.4 modules + FAQ, hero, media slots, WhatsApp tap analytics from `contact_tap` events).
3. **B3** `DATA_SOURCE=api`, `revalidateTag` on admin save, forms POST to the API.
4. **B4** VPS (Nginx, PM2, SSL, Mongo auth + backups), `NEXT_PUBLIC_SITE_ENV=production`, GA4/GTM reading `dataLayer`, Search Console + sitemap.
