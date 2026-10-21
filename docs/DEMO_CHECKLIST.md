# Monowara Hospital — Vercel demo & design-lock checklist

> Phase 5.3. Use this to deploy the static demo, run a final check, walk the client through it,
> and collect what's needed for **design lock**. After lock → backend track B1–B4 (master plan §6).

---

## 1. Deploy to Vercel (one time)

1. Commit and push `mh-front` to GitHub (public/uploads **must** be committed — the demo serves
   images from there; `.env` stays ignored).
2. Before pushing, delete the old duplicates in the root of `public/` (`Dr.-*-230x230.webp`,
   `*-600x494*.webp`, `slider*.webp`, `38-*.png`, `service-*.png`, … — everything except
   `public/logo.png`, `public/og/`, `public/fonts/`, `public/uploads/`). They are unused and would
   be deployed as public files.
3. Vercel → **Add New Project** → import the repo. Framework: Next.js (auto). Build command and
   output: defaults. Node: 22.x (package.json `engines` ≥ 20.9).
4. **Environment variables** (Production + Preview):

   | Key | Value |
   |---|---|
   | `DATA_SOURCE` | `static` |
   | `NEXT_PUBLIC_SITE_ENV` | `demo` (keeps `noindex` + `Disallow: /`) |
   | `NEXT_PUBLIC_SITE_URL` | the Vercel URL, e.g. `https://monowara-hospital.vercel.app` (no trailing slash) |
   | `NEXT_PUBLIC_FALLBACK_HOTLINE` | `09611622333` |
   | `NEXT_PUBLIC_FALLBACK_EMERGENCY` | `01789446240` |

   `NEXT_PUBLIC_*` values are baked in at build time → **redeploy** after changing them.
5. Deploy. If the project name differs, update `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy
   (canonical, hreflang, OG and sitemap URLs all come from it).
6. Optional: Vercel → Settings → Deployment Protection → password, if the client wants the demo private.

## 2. Pre-demo check (on the live Vercel URL)

Phone (real Android Chrome, mobile data — not office Wi-Fi) **and** laptop:

- [ ] `/` first visit: intro loader plays once (~3.5 s, Skip works); reload → no loader. `/doctors` never shows it.
- [ ] EN ↔ বাংলা switch keeps the same page; Bangla headings render in Tiro Bangla, no layout jump.
- [ ] Header mega-menu (laptop) and side menu (phone); top-bar emergency number dials on tap.
- [ ] Doctor card → **Book appointment** → `/appointment?for=…` prefilled; WhatsApp opens with the doctor's name in the message.
- [ ] `/doctors` filters: department + day + name; empty state; pagination.
- [ ] Doctor profile: photo, chamber table, BMDC, "Today / On leave" badge, WhatsApp.
- [ ] Packages: **Call for Price** everywhere (no prices); package detail → WhatsApp with package name.
- [ ] `/emergency`: big call button dials on the phone.
- [ ] WhatsApp dock: desk picker + Quick answers (FAQ chips) on every page.
- [ ] Contact form → WhatsApp hand-off; Careers form rejects a non-PDF/DOC CV and > 5 MB.
- [ ] A wrong URL (e.g. `/xyz`) shows the branded 404; an old WordPress URL (e.g. `/our-doctors/`) redirects.
- [ ] Share the home link and one doctor link on WhatsApp → preview card shows (title, image).
- [ ] PageSpeed Insights (https://pagespeed.web.dev) on `/`, `/doctors`, `/bn` — note the mobile scores for the client.
      Accessibility / Best practices should be 100; SEO shows "blocked from indexing" on the demo — expected.

## 3. Demo walkthrough (≈ 15 min, in this order)

1. Homepage on the **phone** first — that's how most patients will see it: loader, hero, quick search, WhatsApp dock.
2. Find a doctor → profile → Book / WhatsApp (show the prefilled message arriving).
3. Departments → one department (services, its doctors, related packages).
4. Packages → Call for Price; maternity / BHRPC page.
5. Emergency page; MH Aesthetic (own numbers).
6. Switch to বাংলা on any page.
7. Laptop: same flow quickly + Health tips, Gallery, Contact, Careers.
8. Explain what the admin will control after lock (next section) — every photo, number, doctor, package, FAQ and the hero.

Say clearly during the demo:
- It is a **demo with real but unconfirmed content** (doctors migrated from the old site, our transliterations, our draft legal and medical copy).
- Forms hand off to WhatsApp/email for now; the backend (B1–B3) stores them, emails the desk and adds the admin dashboard.
- It is hidden from Google until go-live on the hospital's server.

## 4. What we need from the hospital before / at lock

**Numbers & identity** — WhatsApp desks + labels + which is primary; emergency / ambulance / landline; email (`.com` vs `.com.bd`); DGHS licence no.; 33+ vs 34+ years; logo as SVG/AI.

**Doctors** — confirmed list with chamber times; **BMDC numbers** (61 of 68 missing); proper portraits (most old photos are small; 5 doctors have none); proofread Bangla names; the name conflicts in `data/_migration-report.md` (Rezaul Karim/Haque, Gobinda Banik's photo, Ishaq/Eshaque, Swapan's surname, Munny Momotaz's rank); whether Dr. Ahmed Ali / Dr. Mehzabeen are current MH Aesthetic doctors; two affiliations updated to the institutes' new official names (marked CONFIRM in `data/doctors.js`).

**Photos** — the 11 inner-page header photos are **Unsplash placeholders** → replace with the hospital's own (wards, OT, ICU, NICU, lab, reception, ECG, endoscopy); high-res building photo; management photos.

**Content to review / send** — all medical copy (departments, facilities, diagnostics, packages, health articles); package inclusions + typical stays (maternity and surgical are empty); visiting hours, payment methods, insurance partners; management names + messages; real job openings; chatbot Q&A list; BHRPC full name; patient stories **with written consent**; legal pages (Terms, Privacy, Patient rights) are drafts.

## 5. Design lock = client signs off on

- [ ] Look & feel: teal theme, typography (EN + BN), homepage section order, inner-page layout.
- [ ] Navigation / page list matches the proposal (every page in §3, §5.1–5.5 exists).
- [ ] Appointment flow: `/appointment` page + WhatsApp desks (`bookingMode` = numbers; form ready to switch on).
- [ ] Intro loader: homepage only, first view per session.
- [ ] After sign-off, design changes become change requests; content changes go through the admin.
