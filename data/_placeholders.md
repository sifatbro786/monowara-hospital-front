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
| `doctors/*.webp` (9) | 230×230 profile photos | Low-res; ask the client for originals |
| `facilities/ambulance-card.webp` | ambulanc.webp | A text graphic, not a photo — avoid as a hero |

The copies left in the root of `public/` (e.g. `public/Dr.-Amiruzzaman-Khan-230x230.webp`) are now
duplicates and can be deleted. The small teal icon PNGs (`38-*.png`, `service-*.png`) are 64px and
unused for now.

## Doctors (`data/doctors.js`)
- 9 of 66 profiles so far (the ones with downloaded photos). BMDC numbers are not on the old site.
- Normalised from old-site typos: Dr. Nasima Begum "10:00am - 12:00am" → 10am–12pm and a blank-day
  row dropped; Dr. Noor-E-Ferdous Sat "2:30pm - 3:30am" → 3:30pm. Dr. Debashish Saha's booking form
  shows a different schedule (Sat/Sun/Thu 3:30–5:30pm) than his table — table used. CONFIRM all.

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
