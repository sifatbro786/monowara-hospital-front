# mh-api ↔ mh-front contract (for B1)

> What the Next.js frontend expects when `DATA_SOURCE=api`. Verified on 2026-10-21 by building and
> crawling the whole site (288 URLs, EN + BN) against a mock API that behaves like Mongo/Express
> (ISO dates, `limit` capped at 100, populated departments, a renamed slug, `/uploads` served
> separately). Every public endpoint is `GET`, under `API_URL`.
>
> **Implemented in `mh-back` (B1, 2026-10-27).** Public host: `https://api.monowarahospital.com/api/<resource>`
> (e.g. `/api/doctors`). The Next server on the VPS calls `http://127.0.0.1:5020/api` directly (no Nginx hop);
> browsers (admin, forms) use the public host. Parity-tested: 163/163 endpoint calls return exactly what the
> static layer returns from `data/*.js`.

## General rules

- **Hosts / limits:** `api.monowarahospital.com` (Nginx → `127.0.0.1:5020`). Public GETs are rate-limited per
  client IP (`RATE_LIMIT_PUBLIC_PER_MIN`, default 300). Exempt: direct loopback calls without
  `X-Forwarded-For` (the Next server on the VPS) and requests with a valid `x-mh-internal-key`
  (`INTERNAL_API_KEY`, for `next build` on another machine). Nginx must *set* `X-Forwarded-For $remote_addr`.
- **Errors:** `{ "error": { "code", "message", "details?" } }` — `400 VALIDATION` (bad query, e.g. `limit > 100`,
  unknown `day`/`category`), `404 NOT_FOUND`, `429 RATE_LIMITED`. `GET /api/health` → 200 / 503 (DB down).
- **Envelope:** `{ "data": … }` (a bare body also works). `404` → the page renders not-found. Any other
  non-2xx → the page error boundary. Requests time out after `API_TIMEOUT_MS` (default 8000).
- **Public endpoints return active documents only** (`isActive !== false`), sorted by `order` ascending
  unless noted. Hidden/draft items must never leak through a public route.
- **Document shape:** `_id` (string), `slug`, `isActive`, `order`, `createdAt`, `updatedAt` — same as
  `data/*.js`. Translatable fields are `{ en, bn }` (either may be empty; the frontend falls back).
- **Dates:** ISO strings (Mongo `Date` → JSON) or `"YYYY-MM-DD"` — both are handled and read in
  Asia/Dhaka (`lib/utils/dates.js`).
- **Images:** store and return site paths `"/uploads/<collection>/<file>.webp"`. Set `MEDIA_ORIGIN`
  (e.g. `https://monowarahospital.com`) on the Next server: `lib/api/client.js` makes those paths absolute
  so `next/image` fetches them through Nginx. Without it, files uploaded after the Next server started
  return 404 (Next only serves `public/` files it saw at startup).
- **Slugs:** keep the old slug in `previousSlugs[]` when the admin renames one; `GET /<col>/:slug` must
  resolve old slugs too. The page then 308-redirects to the new URL (doctors, departments, packages,
  articles).
- **Revalidation (B3):** after an admin save, call Next's `revalidateTag` with the tags below.

## Endpoints

| Endpoint | Query | Returns | Cache tags |
|---|---|---|---|
| `/settings` | — | singleton (see below) | `settings` |
| `/hero` | — | active slides `[]` by `order` — homepage hero slider. Slide: `{ _id, slug, label{en,bn} (nav), eyebrow{en,bn}, title{en,bn} (`*accent*`), subtitle{en,bn}, image{ src (landscape ≥ 2000px), alt{en,bn}, position } }`. Buttons are global (settings), not per slide. Slide interval lives in settings: `heroSlider.intervalSec` (number, 2–15, default 5) | `hero` |
| `/faqs` | `category?` | `[]` | `faqs` |
| `/home` | — | `{ keyNumbers[], centres[], talks[], stories[] }` | `home` |
| `/departments` | `featured?=true` | `[]` (full docs incl. description/services/conditions/seo) | `departments` |
| `/departments/:slug` | — | doc | `departments`, `department:<slug>` |
| `/facilities`, `/facilities/:slug` | — | `[]` / doc | `facilities`, `facility:<slug>` |
| `/diagnostics`, `/diagnostics/:slug` | — | `[]` / doc | `diagnostics`, `diagnostic:<slug>` |
| `/doctors` | `department` (**id or slug**), `day` (`sat…fri`), `q`, `featured`, `page`, `limit` (≤ 100) | `{ items, total, page, limit }` | `doctors`, `departments` |
| `/doctors/:slug` | — | doc | `doctors`, `departments`, `doctor:<slug>` |
| `/packages` | `category` (`maternity`/`surgical`/`checkup`), `featured`, `department` (**id**) | `[]` | `packages` |
| `/packages/:slug` | — | doc | `packages`, `package:<slug>` |
| `/articles` | `category?` | `[]` newest `publishedAt` first | `articles` |
| `/articles/:slug` | — | doc | `articles`, `article:<slug>` |
| `/gallery` | — | `[]` | `gallery` |
| `/pages?type=legal` | — | `[]` legal pages | `pages` |
| `/pages/:slug` | — | legal or site page (`about`, `patients-visitors`) | `pages`, `page:<slug>` |
| `/management` | — | `[]` | `management` |
| `/jobs`, `/jobs/:slug` | — | `[]` / doc | `jobs`, `job:<slug>` |
| `/aesthetic` | — | singleton, `treatments` active+sorted, `doctors` **populated** | `aesthetic`, `doctors`, `departments` |
| `/bhrpc` | — | singleton, `doctors` **populated** | `bhrpc`, `doctors`, `departments` |
| `/media` | — | `[{ key, src, alt{en,bn}, position, overlay }]` | `media` |
| `/seo` | — | `[{ path, title{en,bn}, description{en,bn}, image? }]` | `seo` |

### Doctors
- `department` in responses is **populated**: `{ _id, slug, name{en,bn} }` (or `null`). Directory counts
  and links read `department._id` / `department.slug`.
- `q` matches name (en/bn), degrees, specialty (en/bn) and department name — same as the static filter.
- `schedule: [{ day: "sat"|"sun"|…|"fri", from: "HH:MM", to: "HH:MM" }]` (24 h, Dhaka). The admin form must
  enforce this format.
- `leave: { from, until, note{en,bn}? } | null` → "On leave until …" badge.
- Validate `limit ≤ 100`; the frontend pages through with `getAllDoctors()`.

### Settings (singleton)
Missing nested fields are tolerated (`lib/api/settings.js` fills defaults), but the admin form should
provide: `siteName`, `legalName`, `address` (`{en,bn}` — add structured `street/locality/postalCode` for
schema.org), `hotline`, `emergency`, `ambulance`, `landline`, `phones[]`, `whatsappNumbers[] { _id, label,
number, isPrimary, isActive, order }`, `bookingMode` (`numbers`|`form`|`both`, anything else → `numbers`),
`email`, `hours { emergency, opd }`, `dghsLicence`, `yearsServing`, `socials`, `map { embed, directions }`,
`noticeBar { isActive, text{en,bn}, href }` (internal paths like `/packages` are localised).

### Content rules
- `home.stories[]`: `{ quote, name, context?, consent: { confirmed, date, recordedBy } }` — the site shows
  only `consent.confirmed === true`. The admin must require the consent confirmation (proposal §3, §13).
- `packages[].inclusions[]`: `{ en, bn }` items.
- `seo[]`: keyed by locale-less path (`/doctors`, `/doctors/<slug>`); an override applies only in the
  language it was written in.
- All admin text is rendered as plain text (never HTML). `*phrase*` in titles = one italic accent.

---

## Admin auth (B1.3) — what the B2 admin UI must do

All under `https://api.monowarahospital.com/api` (local `http://localhost:5036/api`). Browser calls only.

**Every admin request:** `fetch(url, { credentials: "include", headers: { "X-Requested-With": "mh-admin", "Content-Type": "application/json" } })`.
The header is mandatory on POST/PATCH/PUT/DELETE (CSRF guard); the Origin must be in `CORS_ORIGINS`.
Cookies are HttpOnly — the UI never sees or stores tokens (no localStorage).

| Endpoint | Body | Result |
|---|---|---|
| `POST /auth/login` | `{ email, password }` | `{ user, permissions[] }` + sets `mh_at` (access, 10 min, Path=/api) and `mh_rt` (refresh, Path=/api/auth) |
| `POST /auth/refresh` | — | rotates both cookies → `{ user, permissions }` |
| `POST /auth/logout` | — | revokes this session, clears cookies (always 200) |
| `POST /auth/logout-all` | — | revokes every session of the user |
| `GET /auth/me` | — | `{ user, permissions }` (works while a password change is pending) |
| `POST /auth/password` | `{ currentPassword, newPassword }` | other sessions die, this browser gets new cookies |
| `GET /admin/users` | `?q&role&active&page&limit` | `{ items, total, page, limit }` — `users.manage` |
| `POST /admin/users` | `{ name, email, role, password }` | 201 user, `mustChangePassword: true` |
| `PATCH /admin/users/:id` | `{ name?, role?, isActive? }` | role/active change revokes their sessions; can't change self |
| `POST /admin/users/:id/reset-password` | `{ password }` | temp password, unlocks, revokes sessions |
| `POST /admin/users/:id/logout-all` | — | force sign-out |
| `GET /admin/activity` | `?actor&action (or "auth.*")&entity&entityId&from&to&page&limit` | `{ items, total, page, limit }` newest first — `activity.read` |

`user` = `{ _id, name, email, role, isActive, mustChangePassword, lastLoginAt, passwordChangedAt, createdAt, updatedAt }`.
`permissions` drive menu visibility only — the server checks every route (map in `mh-back/src/lib/permissions.js`).

**Roles (client, 2026-10-27):** `super_admin` (everything + users, settings, activity log, legal pages) ·
`opd_incharge` (doctors & chamber times, departments/facilities/diagnostics, packages, Aesthetic/BHRPC,
bookings, messages, careers, FAQs) · `graphics_design` (hero, homepage blocks, image slots, gallery,
health tips & news, patient stories, notice bar, About/Patients & Visitors/Management pages) ·
`marketer` (SEO).

**Client error handling (one fetch wrapper):**
- `401 TOKEN_EXPIRED` → `POST /auth/refresh` once, then retry the original request.
- `409 REFRESH_RACE` → another tab just refreshed; retry the original request (no second refresh).
- any other `401` (`AUTH_REQUIRED`, `SESSION_REVOKED`, `SESSION_IDLE`, `SESSION_EXPIRED`, `INVALID_CREDENTIALS`) → login screen.
- `403 PASSWORD_CHANGE_REQUIRED` → change-password screen. `403 FORBIDDEN` → "no access" state.
- `429 ACCOUNT_LOCKED` (message has the minutes) / `429 RATE_LIMITED`.
- Password rule: ≥ 10 chars, ≤ 72 bytes, at least one letter and one number.

**Browser → API directly (decided in B2.1, no Next rewrite):** the dashboard calls `NEXT_PUBLIC_ADMIN_API_URL`
(VPS `https://api.monowarahospital.com/api`, local `http://localhost:5036/api`). Same *site* as the page, so
SameSite=Strict cookies flow; cross-*origin*, so CORS with credentials (the page origin must be in `CORS_ORIGINS`).
Locally a loopback API host follows the hostname the dashboard was opened with (`localhost` ↔ `127.0.0.1`), so both work.

**Cookies (fixed in B2.1):** `mh_at` now lives as long as the session (`Expires` = session expiry), not 10 minutes.
The JWT inside still expires after `ACCESS_TOKEN_TTL_MIN`; keeping the cookie lets the API answer `401 TOKEN_EXPIRED`
(→ silent refresh). Before, the browser dropped the cookie at expiry → `AUTH_REQUIRED` → staff were signed out every 10 min.
The UI also tries one refresh on `AUTH_REQUIRED` (cheap; a browser without a refresh cookie just gets 401 again).

---

## Public forms (B1.4) — wired in B3

Browser → API directly (no cookies). JSON, except the CV upload. Send the honeypot `website` (empty) and
`source` (current path) from every form. `201 { data: { received: true, id } }` on success; a filled
honeypot also gets `202 { received: true }` (silently dropped). Errors: `400 VALIDATION` with
`details[{ path, message }]` → show next to the field; `429 RATE_LIMITED` → "please try again in a few minutes".

| Endpoint | Body | Limits / rules |
|---|---|---|
| `POST /api/contact` | `{ name, phone, email?, subject?, message, website, source? }` | 5 / 10 min / IP. phone = BD mobile (stored `01XXXXXXXXX`), message 5–800 |
| `POST /api/appointments` | `{ name, phone, department? (slug), doctor? (slug), date? (YYYY-MM-DD), note?, website, source? }` | 5 / 10 min / IP. `403 BOOKING_DISABLED` unless `settings.bookingMode` is `form`/`both`. Date: today … +60 days (Dhaka). With doctor + date: `409 NO_CHAMBER` (no chamber that weekday), `409 DOCTOR_ON_LEAVE`. `409 DUPLICATE_BOOKING` = same phone + doctor + day still open. `400 UNKNOWN_DOCTOR` / `UNKNOWN_DEPARTMENT` |
| `POST /api/careers/apply` | multipart: `name, phone, email, job? (slug), note?, website, source?` + file `cv` | 3 / 30 min / IP. CV = PDF/DOC/DOCX by **file content** (`415 CV_TYPE`), ≤ 5 MB (`413 FILE_TOO_LARGE`), `400 CV_REQUIRED`, `400 UNKNOWN_JOB`. Stored privately, never public |

Each accepted form emails a plain-text alert to `ADMIN_EMAIL` (Reply-To = sender when given). Mail failures never fail the form.

## Admin: uploads & inboxes (B1.4)

`POST /api/admin/uploads/:folder?position=<css position>` — multipart field `file` (JPG/PNG/WebP/AVIF by
content, ≤ 10 MB). Folder → permission: `doctors` (doctors) · `departments|facilities|diagnostics`
(departments) · `packages` · `aesthetic` (programs) · `hero` · `home` · `media` · `gallery` · `articles` ·
`management` (pages) · `seo`. → `201 { src: "/uploads/<folder>/<name>.webp", og: "/uploads/…og.jpg" | null,
width, height, bytes, originalBytes, warnings[] }`. Save `src` into the document field. WebP re-encode,
EXIF stripped, auto-rotated, max width per folder (hero 2560 + warning under 2000, doctors 900, media cropped
to 3:2 around `position`). SVG/HEIC rejected (`415`).

Inboxes — same shape for `/api/admin/messages` (messages.manage), `/api/admin/bookings` (bookings.manage),
`/api/admin/applications` (careers.manage):
- `GET /` `?status&q&from&to&page&limit` (+ bookings `doctor`, `date`; applications `job`) →
  `{ items, total, page, limit, counts: { <status>: n } }` (tab badges)
- `GET /export.xlsx` same filters → Excel download (≤ 5000 rows, formula-safe, logged)
- `GET /:id`, `PATCH /:id { status?, staffNote? }` (+ bookings `serial` 1–999) → sets handledBy/handledAt, logged
- list / `GET /:id` / `PATCH` items also carry `handledByName` (staff name, B2.2); `handledBy` stays the user id
- downloads (`export.xlsx`, `cv`): CORS exposes `Content-Disposition` so the dashboard can keep the server's file name
- `GET /api/admin/applications/:id/cv` → the CV as a download (logged)

Statuses — messages `new|read|replied|archived` · bookings `new|confirmed|completed|cancelled|no_show` ·
applications `new|reviewed|shortlisted|rejected|hired`.

## Admin: doctors (B2.3) — `doctors.manage`

| Endpoint | Notes |
|---|---|
| `GET /api/admin/doctors/options` | `{ departments: [{ _id, name, slug, isActive }], days }` for the form |
| `GET /api/admin/doctors` | `?q&department&status=active\|hidden&featured=true&onLeave=true&missing=photo\|bmdc\|schedule&page&limit≤100` → `{ items, total, page, limit }`; hidden doctors included; `department` populated |
| `GET /api/admin/doctors/:id` | raw doc (department as id) |
| `POST /api/admin/doctors` | `name.en` required; slug optional (auto from the English name minus academic title, `-2` on clash); `order` defaults to last → 201 |
| `PATCH /api/admin/doctors/:id` | any subset of: `name, slug, designation, degrees, specialty, affiliation, department, bmdc, phone, photo, schedule, scheduleNote, leave, isFeatured, isActive, order` (strict). Slug rename → old slug added to `previousSlugs` |
| `DELETE /api/admin/doctors/:id` | `409 IN_USE` while on the Aesthetic/BHRPC team or an article byline |

Shapes: translatable `{ en, bn }` (empty optional ones → `null`); `schedule: [{ day: sat…fri, from: "HH:MM", to: "HH:MM" }]` (end after start, no same-day overlap; stored in week order); `leave: null | { from: "YYYY-MM-DD" | null, until: "YYYY-MM-DD", note }` → stored as Dhaka-midnight Dates; `photo: "/uploads/doctors/…" | null` (from `POST /api/admin/uploads/doctors`). Errors: `400 VALIDATION` (`details[].path` like `schedule.2.to`), `400 UNKNOWN_DEPARTMENT`, `409 DUPLICATE_SLUG`.

## Admin: overview stats (B2.3) — any signed-in staff

`GET /api/admin/stats/overview?days=30` (7–90) → only the blocks the role may see:
`bookings { total, daily[{day,count}], byStatus, topDoctors[{doctor,name,count}] }` (bookings.manage) ·
`messages { total, daily }` (messages.manage) · `applications { total, byStatus }` (careers.manage) ·
`doctors { active, hidden, onLeave, noPhoto, noBmdc, noSchedule }` (doctors.manage). Days are Dhaka calendar days, oldest first, ending today.

## Admin: departments / facilities / diagnostics (B2.4) — `departments.manage`

Same contract for `/api/admin/departments`, `/api/admin/facilities`, `/api/admin/diagnostics` (`src/lib/crud.js`):
`GET /?q&status=active|hidden&page&limit≤100` (departments also `featured=true`) · `GET /:id` · `POST /` (`name.en` required, slug optional) · `PATCH /:id` (strict partial; slug rename → `previousSlugs`) · `DELETE /:id` (`409 IN_USE`).

| Collection | Editable fields |
|---|---|
| departments | `name, summary, description, services[], conditions[], image (/uploads/departments), isFeatured, seo{title, description}, isActive, order` — delete blocked while doctors/packages reference it; `legacySlugs` read-only |
| facilities | `name, summary, description, features[], whenTo (nullable), is24x7, image (/uploads/facilities), isActive, order` |
| diagnostics | `name, summary, description, tests[], timing, preparation, image (/uploads/diagnostics), isActive, order` |

All text fields are `{ en, bn }`; list rows `[{ en, bn }]` (≤ 40, features ≤ 30).

## Admin: B2.5–B2.9 content modules

All list-type modules use the `crudRouter` contract above (+ `PUT /<module>/order { ids }` to reorder):

| Route | Permission | Notes |
|---|---|---|
| `/api/admin/packages` | packages.manage | `?category`, `featured`; required `name`, `category`; `departments[]` must exist; no price (Call for Price) |
| `/api/admin/hero` | hero.manage | required `label`, `image{src,alt,position}`; slug from label (internal); last visible slide can't be deleted |
| `/api/admin/keynumbers` · `/centres` · `/talks` | home.manage | not sluggable; centre `href` internal path; talk `youtubeId` 11 chars |
| `/api/admin/stories` | stories.manage | `consent{confirmed,date}`; `recordedBy` set by the server |
| `/api/admin/faqs` | faqs.manage | `?category`; required `question`, `answer` |
| `/api/admin/jobs` | careers.manage | required `title`; `deadline` "YYYY-MM-DD" (Dhaka); delete blocked while applications exist |

Singletons / special:
- `GET /api/admin/settings` (settings.manage or notice.manage) · `PATCH /api/admin/settings` (settings.manage — any subset of the settings fields; `whatsappNumbers` = full list in display order, exactly one active primary; new desks get `_id` from the label) · `PATCH /api/admin/settings/notice { isActive, text{en,bn}, href }` (notice.manage).
- `GET /api/admin/media` · `PATCH /api/admin/media/:id { src?, alt?, position?, overlay? }` (media.manage). Upload with `POST /api/admin/uploads/media?position=<css position>` (3:2 crop around it).

## Admin: B2.10–B2.13 — programmes, articles, gallery, pages, SEO, taps

| Route | Permission | Notes |
|---|---|---|
| `GET /api/admin/programs/options` | programs.manage | `{ doctors[{_id,name,designation,department,photo,isActive}], articles[{_id,title,slug,category,isActive}] }` for the pickers |
| `GET\|PATCH /api/admin/programs/aesthetic` | programs.manage | singleton: name, tagline, about, mission, vision, phone, whatsapp, email, hours, location, heroImage (`/uploads/aesthetic`), `doctors[]` (ordered ids, must exist → 400 `UNKNOWN_DOCTOR`), `treatments[{_id?,slug?,name,summary,image,isActive}]` (full list in display order; new ones get `aes_<slug>`). Logs `aesthetic.update` |
| `GET\|PATCH /api/admin/programs/bhrpc` | programs.manage | singleton: short, name, tagline, about, whoFor[], services[], doctors[], `topics[]` = article slugs (400 `UNKNOWN_ARTICLE`). Logs `bhrpc.update` |
| `/api/admin/articles` (+ `GET /articles/options` → `{ doctors }`) | articles.manage | crud; `?category`; newest first; required `title`, `category`; `publishedAt` Dhaka day (omitted on create = today; future = scheduled); `sections[{heading,body}]`; `author`/`reviewedBy` doctor ids or null; delete blocked while on the BHRPC reading list |
| `/api/admin/gallery` | gallery.manage | crud, not sluggable; required `src`; `?category`; bulk upload = upload + POST per file |
| `/api/admin/management` | pages.manage | crud, not sluggable; name, role, photo (`/uploads/management`), message |
| `GET /api/admin/pages` · `GET\|PATCH /api/admin/pages/:id` | pages.manage (site) · legal.manage (legal) | fixed set — no create/delete/slug change; list = plain array of the types you may edit. Site body: title, summary, body, sections[{id,heading,body,points?,confirm?,link?}], pillars, mission, vision, isActive. Legal body: title, summary, sections[{id,heading,body{en:[…],bn:[…]}}], isDraft, isActive. Missing anchors are generated from the heading |
| `/api/admin/seo` (+ `GET /seo/paths` → `[{path,label}]`) | seo.manage | crud, not sluggable, sorted by path; required `path` (locale-less, `/doctors/x`), unique → 409 `DUPLICATE_PATH`; title ≤70, description ≤170, image (`/uploads/seo`), isActive. **Read by the site in B3** |
| `POST /api/events/tap` | public | beacon from `TapTracker` (text/plain JSON `{channel:"whatsapp"\|"call", desk?, number, section?}`), always 204, foreign Origin ignored, 60/10 min per IP; counted per Dhaka day in `tapstats` |

`GET /api/admin/stats/overview` adds `taps { total, whatsapp, calls, daily[], byDesk[], byNumber[], bySection[] }` for seo.manage or settings.manage.
