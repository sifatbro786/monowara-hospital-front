# mh-api ↔ mh-front contract (for B1)

> What the Next.js frontend expects when `DATA_SOURCE=api`. Verified on 2026-10-21 by building and
> crawling the whole site (288 URLs, EN + BN) against a mock API that behaves like Mongo/Express
> (ISO dates, `limit` capped at 100, populated departments, a renamed slug, `/uploads` served
> separately). Every public endpoint is `GET`, under `API_URL` (e.g. `http://127.0.0.1:5020/api/v1`).

## General rules

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
