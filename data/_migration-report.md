# Migration report — monowarahospital.com → mh (Phase 2, 2026-10-20)

Source: the old site's own sitemaps (`page-`, `medilink_doctor-`, `medilink_departments-`,
`medilink_services-`, `medilink_gallrey-sitemap.xml`). The WP REST API does **not** expose the
Medilink theme's doctor/department post types (`/wp-json/wp/v2/types` lists only post/page/media),
so the planned REST migration script was dropped; profiles were read page by page instead.

## Result
| Collection | Migrated | Notes |
|---|---|---|
| doctors | **68 profiles, all active** (doctor-2/-3 activated in Phase 4 — they are MH Aesthetic team members) | 9 kept their existing slugs/photos. Bangla name + designation + specialty written for all (our transliteration — **client to proof**). BMDC on 7 profiles only. |
| departments | 22 | Old specialist pages had only generic copy → we wrote 1-line EN/BN summaries. Tiles mapped to `/uploads/departments/<slug>.webp`. |
| facilities | 10 | EN/BN summaries; 6 photos to download. |
| diagnostics | 6 | EN/BN summaries; 3 photos to download. Ultrasonography has no photo. |
| redirects | 115 | `data/redirects.mjs` → 308s in `next.config.mjs` (old doctor/department/page URLs). |

**Photos:** 54 doctor portraits + 21 department tiles + 9 facility/diagnostic photos are listed in
`scripts/fetch-wp-images.mjs`. Run `node scripts/fetch-wp-images.mjs` locally (this build machine
cannot reach monowarahospital.com). Until then the 57 new doctor cards have no photo — only the
homepage's 9 featured doctors are rendered today, and they already have photos.

**No portrait on the old site** (sitemap still lists the file, server returns 404, profile page
shows no photo) → `photo: null`, card shows the teal placeholder. Ask the client:
`dr-mahjubeh-tajree-mahmud`, `dr-lutfa-begum-lipi`, `dr-mohammad-moin-shahid`,
`dr-md-rashidoon-nabi-khan`, `dr-md-sajid-ahsan`.

## Not migrated (by design)
- MH Aesthetic treatments filed under /departments on the old site (hydra-facial, skin analyzer,
  filler, laser, PRP, glutathione, breast treatment) → redirect to `/mh-aesthetic`; content in Phase 4.
- BHRPC pregnancy articles (diabetes, thalassaemia, genetic counselling, Bangla "উচ্চ রক্তচাপ") —
  redirected to `/health-tips` (master plan §3); the Bangla-slug one is not mapped yet. Article text
  moves into Health Tips in Phase 4.
- Wrong-slug pages: old `/departments/gynecology` (Dialysis) → `/facilities/dialysis`,
  `/departments/chest-and-medicine` (Emergency) → `/facilities/emergency`. Old `/departments/medicine`
  (CT/X-ray) is left alone because it is now the real Internal Medicine URL.
- `/services/*` (3 marketing blurbs) → `/about`. Gallery items are already in `uploads/facilities/`.
- Phone shown on every old profile (+880 1715-839400) is the front desk, not the doctor → `phone: null`.

## Doctor-level issues (CONFIRM with the hospital)
| Slug | Issue |
|---|---|
| `dr-nasima-begum` | Old table: morning slots '10:00am - 12:00am' on Sun/Mon/Wed → 10am–12pm; last evening row had no day → treated as Thu. |
| `dr-ishrat-jabeen` | Old URL says 'israt-zebin' and the bio says 'Dr. Zebin'; title/heading say Ishrat Jabeen (used). |
| `dr-royes-uddin` | Old URL says 'asst-prof', profile heading says Associate Professor (used). |
| `dr-noor-e-ferdous-nimmi` | Sat '2:30pm - 3:30am' → 2:30–3:30pm. |
| `dr-debashish-saha` | Schedule table (Sat/Mon/Wed 5–7pm) used; the page's booking widget shows a different one. |
| `dr-nasrin-akhter` | URL spells 'nasreen', heading 'Nasrin' (used). |
| `dr-rowshan-ara-begum` | Old URL slug is 'jannatul-ferdousi' but the profile is Prof. Dr. Rowshan Ara Begum — slug fixed, redirect added. Degrees missing. |
| `dr-anwara-begum` | Old URL slug is 'dr-hosne-ara-begum' but the profile is Prof. Dr. Anwara Begum — slug fixed, redirect added. Degrees missing. |
| `dr-shamsun-nahar-moni` | Wednesday listed twice on the old table (deduplicated). URL says 'consultant', heading says Asst. Prof. (used). |
| `dr-mahjubeh-tajree-mahmud` | Sat '6:00pm - 8:00am' → 6–8pm. |
| `dr-arifa-sharmin` | Degrees missing on old site. Bio says 'Phyto-Maternal' (typo for feto-maternal). |
| `dr-dina-layla-hossain` | Degrees missing on old site. |
| `dr-tajmira-sultana` | Degrees missing on old site. |
| `dr-sanjida-mahmud` | Degrees missing on old site. |
| `dr-raunak-jahan` | Degrees missing on old site. |
| `dr-rajshree-debnath` | Degrees missing on old site. |
| `dr-md-mustafizur-rahman` | Sun '7:00pm - 8:30am' → 7–8:30pm. URL spells 'mostafizur'. |
| `dr-sadia-armin-khan` | Schedule row has a time (12–3pm) but no day. |
| `dr-munny-momotaz` | Heading says 'Prof.', designation and URL say Associate Professor (used). Spelling Munny Momotaz vs Munni Mumtaz (URL) — CONFIRM. |
| `dr-masroor-ur-rahman-abir` | URL says 'assistant-professor', heading says Associate (used). |
| `dr-sajal-krisno-banerjee` | No schedule published. |
| `dr-shakhawat-alam` | URL spells 'sakhawat', heading 'Shakhawat' (used). |
| `dr-gobinda-chandra-banik` | No schedule published. ⚠ Photo filename is 'PROF.-S.-K.-BANIK' — may be Prof. S.K. Banik's photo. CONFIRM. |
| `dr-pk-datta-ponkaj` | URL says 'assistant-professor … dutta-pankaj', heading 'Asso. Prof. … Datta (Ponkaj)' (used). |
| `dr-abul-kashem-khandaker` | No degrees or schedule published. |
| `dr-bk-biswas` | Old page lists further diplomas/fellowships (Bangladesh, Japan, USA) — degrees shortened; CONFIRM full list. |
| `dr-md-rashidoon-nabi-khan` | Old page also lists 'AANS (USA)' (a membership) — dropped from degrees. |
| `dr-md-fakhrul-islam` | URL says 'asst-prof', heading says Associate (used). |
| `dr-syed-hasan-imam-al-masoom` | Old degrees 'D.L. and (DU)' read as DLO (DU) — CONFIRM. |
| `dr-akm-ishaq` | Heading spells 'Akm Eshaque', URL and photo 'Ishaq' (used) — CONFIRM. |
| `dr-mm-abu-sayed-montu` | URL spells 'abu-saeed', heading 'Abu Sayed' (used). |
| `dr-swapan-bandyopadhyay` | URL 'swapan-banerjee', heading 'Bandyapadhyay', photo 'Swapan Kumar Bandyopadhyaa' — CONFIRM spelling. |
| `dr-md-nahid-hossain` | No degrees or department on old page. |
| `dr-tanvir-ahmed-chowdhury` | URL says 'asst-prof', heading says Associate (used). |
| `dr-md-faruk-hossain-sheikh` | URL spells 'farooq', heading 'Faruk' (used). |
| `nazmul-hasan-pt` | Physiotherapist, not a physician — 'Dr.' dropped. Old page: 'PT' (degree assumed BPT — CONFIRM). Mon evening missing on old table (assumed same as other days). |
| `dr-umme-salma-munni` | PhD (not a physician) — BN uses ড. not ডা. |
| `humayra-nabi` | Listed under MH Aesthetic (Sat–Fri 10am–7pm). URL 'humaira', heading 'Humayra' (used). |
| `dr-akm-rezaul-karim` | ⚠ Heading says 'A.K.M. Rezaul Haque', bio/URL/photo say 'Rezaul Karim' (used). Old department field wrongly '24/7 Ambulance Service'. CONFIRM name. |
| `dr-farzana-rahman-shathi` | MH Aesthetic doctor (Sat–Fri 10am–7pm = aesthetic centre hours?) — CONFIRM chamber times. |
| `dr-ahmed-ali` (hidden) | HIDDEN: old URL /doctors/doctor-2/, bio names 'Dr. Mohammad Ali', template leftovers ('People's care Hospital'). Possibly a real MH Aesthetic doctor — CONFIRM before activating. |
| `dr-mehzabeen` (hidden) | HIDDEN: old URL /doctors/doctor-3/, page names her 'Dr. Mehzabeen' and 'Dr. Khan', no degrees/schedule. CONFIRM before activating. |

### Doctors with no fixed timetable (show `scheduleNote` instead)
`dr-rowshan-ara-begum`, `dr-anwara-begum` (OT days), `dr-sadia-armin-khan` (12–3pm, no days),
`dr-sajal-krisno-banerjee`, `dr-gobinda-chandra-banik`, `dr-abul-kashem-khandaker` (by appointment),
`dr-abid-hossain-mollah` (Sat & Sun, call 7–7:30am / 12 noon).

### Degrees missing on the old site
`dr-rowshan-ara-begum`, `dr-anwara-begum`, `dr-abul-kashem-khandaker`, `dr-md-nahid-hossain`,
`dr-arifa-sharmin`, `dr-dina-layla-hossain`, `dr-tajmira-sultana`, `dr-sanjida-mahmud`,
`dr-raunak-jahan`, `dr-rajshree-debnath`, `dr-mehzabeen` (hidden).
