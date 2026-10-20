# Placeholders & values to confirm

Everything here is replaceable from the admin dashboard later. Update this list as items are confirmed.

## Images
All current images are the hospital's own, downloaded by Sifat from monowarahospital.com
(2026-10-20) and renamed into `public/uploads/<collection>/`. No stock photos are used.

| Path | Old-site file | Notes |
|---|---|---|
| `hero/hospital-building.webp` | slider-2-1536x640 | Portrait crop with sky extended upward for the arch frame. Ask for a high-res original (current is soft on retina). |
| `hero/hospital-building-wide.webp`, `hero/bhrpc.webp`, `hero/mh-aesthetic.webp`, `hero/ct-scan.webp` | slider images | For the other hero slides / BHRPC / Aesthetic pages |
| `facilities/*.webp` | 600×494 gallery tiles, CT-, NICU | 600px wide — fine for cards, too small for full-width banners |
| `doctors/*.webp` (9 + 59 via script) | profile photos | Low-res; ask the client for originals |
| `facilities/ambulance-card.webp` | ambulanc.webp | A text graphic, not a photo — avoid as a hero |

The copies left in the root of `public/` (e.g. `public/Dr.-Amiruzzaman-Khan-230x230.webp`) are now
duplicates and can be deleted. The small teal icon PNGs (`38-*.png`, `service-*.png`) are 64px and
unused for now.

## Page header photos (`data/media.js` → future Admin → Media management)
- Every inner-page header reads a media slot (`header.doctors`, `header.contact`, …). 11 slots use
  **Unsplash placeholders** (free licence, credit URL in `source.url`) — download them locally with
  `node --no-warnings scripts/fetch-stock-images.mjs`; replace with the hospital's own photos before launch.
- Own photos already in place: `media/header-bhrpc.webp` (old BHRPC banner), `media/header-mh-aesthetic.webp`
  (old aesthetic lounge), `aesthetic/reception.webp`, gallery/management use the building photo.
- `aesthetic/*.webp` — the 8 treatment images Sifat downloaded from the old site (630×408).

## Doctors (`data/doctors.js`)
- All 68 old profiles migrated (66 active, `doctor-2`/`doctor-3` hidden) — full issue list in
  `data/_migration-report.md`. Bangla names/designations are our transliterations → client to proof.
- BMDC published for 7 doctors only; ask for the rest (shown on the profile page in Phase 3).
- Photos for the 59 new profiles: run `node scripts/fetch-wp-images.mjs` (crops to 4:5, 600×750 WebP).
  Most old originals are small — ask for proper portraits.

## Settings (`data/settings.js`) — CONFIRM with client
- `emergency` 01789-446240 — concept PDF labels it Emergency; site lists it unlabelled.
- `ambulance` — no separate number published; currently = emergency.
- `landline` — unknown.
- WhatsApp desks: Appointments = 01301-435549 (header number on old site), Emergency = 01789-446240,
  MH Aesthetic = 01329-672807 (published on the MH Aesthetic page). Labels/primary are our assumption.
- `email` — info@monowarahospital.com (site) vs .com.bd (aesthetic sub-brand uses .com.bd).
- `dghsLicence` — missing; footer hides the line until set.
- `yearsServing` — 33+ (proposal) vs 34+ (old homepage).
- LinkedIn on the old site points to linkedin.com root — left empty.

## Content
- Centres hover photos (`data/home.js`): Cardiology and Endoscopy have no photo yet and fall back to the building shot; Internal Medicine uses the blood-collection room. Ask the client for ward/ECG/endoscopy photos.
- `data/packages.js` — check-up inclusions follow the client's concept examples; maternity and surgical
  inclusions are empty until the hospital sends them.
- `data/home.js` — key numbers from the concept (33+, 100 beds, 24/7, 7 days). Patient stories empty
  until written consent is collected.
- `data/legal.js` — Terms, Privacy, Patient rights written by us as drafts (EN + BN), flagged
  `isDraft` (shows a notice). Hospital must review before launch.
- `data/faqs.js` — 4 seed Q&As using only published facts. Client to send the real chatbot list.
- `data/hero.js` — slide copy written by us from the old site's 4 slide themes; media empty.
