/**
 * Every "list + editor" content collection of the dashboard, as data. The generic screens in
 * components/admin/collection/ render these; the matching API is mh-back's crudRouter().
 *
 * Field types (form state ⇄ API in components/admin/collection/form.js):
 *   L / Lopt        { en, bn } (Lopt: empty → null)        list    [{ en, bn }] rows
 *   bool            switch                                  text    plain string (empty → null if `nullable`)
 *   select          one of `options`                        departments / department  multi / single department picker
 *   image           upload into `folder`                    heroImage { src, alt{en,bn}, position }
 *   date            "YYYY-MM-DD" ⇄ Dhaka-midnight Date      youtube  11-char id (paste a URL, the id is extracted)
 *   href            internal path                           consent  { confirmed, date } (who recorded it is set by the server)
 *   seo             { title{en,bn}, description{en,bn} }
 *   number          int or null                             textNull plain string, empty → null (phone, email)
 *   ref             one id from `source`[`from`] (or null)  ids      ordered ids/slugs (`by`) from `source`
 *   path            site path, suggestions from `source`    treatments / pillars / sections (variant article|site|legal)
 *
 * Modes: `singleton` (one document at `api`, no list/create/delete) · `noCreate` (fixed set: edit only)
 * · `fieldsFor(doc)` (fields depend on the document, e.g. legal vs site pages) · `viewUrl(doc)`.
 */

const L = (key, label, extra = {}) => ({ key, type: "L", label, ...extra });

// Same keys as the site dictionaries (tips.categories / gallery.categories) — a new key needs a label there.
export const ARTICLE_CATEGORIES = [
    { value: "pregnancy", label: "Pregnancy" },
    { value: "general", label: "General health" },
];
export const GALLERY_CATEGORIES = [
    { value: "hospital", label: "Hospital" },
    { value: "diagnostic", label: "Diagnostics" },
];

const PROGRAM_OPTIONS = "/admin/programs/options";
const fmtDay = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric" }) : "";

const SITE_PAGE_FIELDS = (doc) => [
    L("title", "Title", { section: "basics", required: true, max: 160 }),
    L("summary", "Summary", { section: "basics", multiline: true, rows: 2, max: 400, hint: "The line under the title." }),
    ...(doc.body !== undefined || doc.slug === "about" ? [L("body", "Main text", { section: "content", multiline: true, rows: 9, max: 6000, hint: "Leave a blank line between paragraphs." })] : []),
    ...(doc.pillars !== undefined ? [{ key: "pillars", type: "pillars", section: "content", label: "What we stand for", max: 8 }] : []),
    ...(doc.mission !== undefined ? [L("mission", "Mission", { section: "content", multiline: true, rows: 3, max: 600 })] : []),
    ...(doc.vision !== undefined ? [L("vision", "Vision", { section: "content", multiline: true, rows: 3, max: 600 })] : []),
    ...(doc.sections !== undefined ? [{ key: "sections", type: "sections", variant: "site", section: "content", label: "Sections", max: 30, bodyMax: 4000 }] : []),
    { key: "isActive", type: "bool", section: "website", label: "Show on the website", sub: "Off = the page shows “not found”." },
];
const LEGAL_PAGE_FIELDS = [
    L("title", "Title", { section: "basics", required: true, max: 160 }),
    L("summary", "Summary", { section: "basics", multiline: true, rows: 2, max: 400 }),
    { key: "sections", type: "sections", variant: "legal", section: "content", label: "Sections", max: 40 },
    { key: "isDraft", type: "bool", section: "website", label: "Draft — awaiting legal review", sub: "Shows a “draft” note at the top of the page until the hospital's lawyer has approved the text." },
    { key: "isActive", type: "bool", section: "website", label: "Show on the website" },
];

export const PACKAGE_CATEGORIES = [
    { value: "maternity", label: "Maternity" },
    { value: "surgical", label: "Surgical" },
    { value: "checkup", label: "Health check-up" },
];

const website = (extra = []) => [
    { key: "isActive", type: "bool", section: "website", label: "Show on the website", sub: "Off = hidden from the website. Nothing is deleted." },
    ...extra,
];

const SECTIONS_SERVICES = {
    basics: { title: "Name & summary", sub: "The card text in lists and the mega-menu." },
    content: { title: "Page content", sub: "The detail page. Leave a blank line between paragraphs." },
    visit: { title: "Visit information" },
    image: { title: "Image", sub: "Landscape photo, at least 1600 px wide. Converted to WebP automatically." },
    seo: { title: "Google listing", sub: "Optional. Empty = name and summary are used." },
    website: { title: "On the website" },
};

const serviceBase = [
    L("name", "Name", { section: "basics", required: true, max: 80 }),
    L("summary", "Summary", { section: "basics", multiline: true, rows: 2, max: 300, hint: "One or two sentences." }),
    L("description", "Description", { section: "content", multiline: true, rows: 9, max: 6000 }),
];

const thumbBadges = (d) => [
    d.isActive === false && ["muted", "Hidden"],
    d.isFeatured && ["good", "Featured"],
    d.is24x7 && ["good", "24/7"],
    (d.summary && !d.summary.bn) || (d.description && !d.description.bn) ? ["warn", "Bangla missing"] : null,
];

export const COLLECTIONS = {
    // ── B2.4 ───────────────────────────────────────────────────────────────────────────────────────
    departments: {
        group: "services",
        title: "Departments",
        noun: "department",
        perm: "departments.manage",
        api: "/admin/departments",
        path: "/admin/departments",
        slug: { publicBase: "/departments" },
        nameKey: "name",
        listHint: "Specialties — each has a page with its doctors and packages.",
        sections: SECTIONS_SERVICES,
        list: { thumb: (d) => d.image, title: (d) => d.name?.en, sub: (d) => d.summary?.en || "No summary yet", badges: thumbBadges },
        fields: [
            ...serviceBase,
            { key: "services", type: "list", section: "content", label: "Services & procedures", max: 40, placeholder: "e.g. Normal delivery" },
            { key: "conditions", type: "list", section: "content", label: "Conditions treated", max: 40, placeholder: "e.g. Fibroids" },
            { key: "image", type: "image", section: "image", folder: "departments" },
            ...website([{ key: "isFeatured", type: "bool", section: "website", label: "Feature in the menu", sub: "Listed first, highlighted, in the Departments mega-menu." }]),
            { key: "seo", type: "seo", section: "seo" },
        ],
    },
    facilities: {
        group: "services",
        title: "Facilities",
        noun: "facility",
        perm: "departments.manage",
        api: "/admin/facilities",
        path: "/admin/facilities",
        slug: { publicBase: "/facilities" },
        nameKey: "name",
        listHint: "Emergency, OT, ICU, NICU, dialysis, ambulance, pharmacy, blood bank…",
        sections: SECTIONS_SERVICES,
        list: { thumb: (d) => d.image, title: (d) => d.name?.en, sub: (d) => d.summary?.en || "No summary yet", badges: thumbBadges },
        fields: [
            ...serviceBase,
            { key: "features", type: "list", section: "content", label: "Key features", max: 30, placeholder: "e.g. 10-bed ICU with ventilators" },
            { key: "whenTo", type: "Lopt", section: "visit", label: "When to come here", multiline: true, rows: 3, max: 600 },
            { key: "is24x7", type: "bool", section: "visit", label: "Open 24/7", sub: "Shows a 24/7 badge in the menu and on the page." },
            { key: "image", type: "image", section: "image", folder: "facilities" },
            ...website(),
        ],
    },
    diagnostics: {
        group: "services",
        title: "Diagnostics",
        noun: "diagnostic service",
        perm: "departments.manage",
        api: "/admin/diagnostics",
        path: "/admin/diagnostics",
        slug: { publicBase: "/diagnostics" },
        nameKey: "name",
        listHint: "Test groups with their timings and preparation notes.",
        sections: SECTIONS_SERVICES,
        list: { thumb: (d) => d.image, title: (d) => d.name?.en, sub: (d) => d.summary?.en || "No summary yet", badges: thumbBadges },
        fields: [
            ...serviceBase,
            { key: "tests", type: "list", section: "content", label: "Tests offered", max: 40, placeholder: "e.g. CBC" },
            L("timing", "Timing", { section: "visit", max: 200, hint: "e.g. 8 am – 10 pm daily; reports the same evening" }),
            L("preparation", "Preparation", { section: "visit", multiline: true, rows: 3, max: 1000, hint: "Fasting, medicines, what to bring." }),
            { key: "image", type: "image", section: "image", folder: "diagnostics" },
            ...website(),
        ],
    },

    // ── B2.5 ───────────────────────────────────────────────────────────────────────────────────────
    packages: {
        title: "Packages",
        noun: "package",
        perm: "packages.manage",
        api: "/admin/packages",
        path: "/admin/packages",
        slug: { publicBase: "/packages" },
        nameKey: "name",
        eyebrow: "Hospital",
        listHint: "Prices are never shown — every package says “Call for Price”.",
        filters: [{ key: "category", label: "Category", options: PACKAGE_CATEGORIES }],
        sections: {
            basics: { title: "Package", sub: "Name, category and the card summary." },
            content: { title: "Details", sub: "Leave a blank line between paragraphs." },
            links: { title: "Related departments", sub: "The package appears on these department pages." },
            image: { title: "Image", sub: "Landscape, at least 1600 px wide." },
            website: { title: "On the website" },
        },
        list: {
            thumb: (d) => d.image,
            title: (d) => d.name?.en,
            sub: (d) => `${PACKAGE_CATEGORIES.find((c) => c.value === d.category)?.label ?? d.category} · ${d.summary?.en || "No summary yet"}`,
            badges: thumbBadges,
        },
        fields: [
            L("name", "Name", { section: "basics", required: true, max: 120 }),
            { key: "category", type: "select", section: "basics", label: "Category", options: PACKAGE_CATEGORIES, required: true },
            L("summary", "Summary", { section: "basics", multiline: true, rows: 2, max: 300 }),
            L("description", "Description", { section: "content", multiline: true, rows: 6, max: 6000 }),
            L("whoFor", "Who it's for", { section: "content", max: 300 }),
            L("typicalStay", "Typical stay", { section: "content", max: 120, hint: "e.g. Usually 1–2 days" }),
            { key: "inclusions", type: "list", section: "content", label: "What's included", max: 40, placeholder: "e.g. Surgeon & anaesthetist fees" },
            { key: "departments", type: "departments", section: "links", label: "Departments" },
            { key: "image", type: "image", section: "image", folder: "packages" },
            ...website([{ key: "isFeatured", type: "bool", section: "website", label: "Feature on the homepage", sub: "Shown in the homepage packages block." }]),
        ],
    },

    // ── B2.7 ───────────────────────────────────────────────────────────────────────────────────────
    hero: {
        title: "Hero slider",
        noun: "slide",
        perm: "hero.manage",
        api: "/admin/hero",
        path: "/admin/hero",
        slug: false, // internal only (no public page)
        nameKey: "label",
        eyebrow: "Site content",
        orderable: true,
        preview: "hero",
        listHint: "Homepage slides. The order here is the order on the site; the speed is in Settings.",
        sections: {
            basics: { title: "Slide", sub: "Wrap a phrase in *asterisks* to highlight it in teal." },
            image: { title: "Background photo", sub: "Landscape, at least 2000 px wide (2560 ideal). Choose where the subject sits so phones crop well." },
            website: { title: "On the website" },
        },
        list: {
            thumb: (d) => d.image?.src,
            title: (d) => d.label?.en,
            sub: (d) => (d.title?.en ?? "").replace(/\*/g, ""),
            badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.title && !d.title.bn ? ["warn", "Bangla missing"] : null],
        },
        fields: [
            L("label", "Slide name (admin only)", { section: "basics", required: true, max: 60 }),
            L("eyebrow", "Small line above the title", { section: "basics", max: 120 }),
            L("title", "Title", { section: "basics", multiline: true, rows: 2, max: 140, hint: "e.g. Trusted care for Dhaka families for over *33 years*." }),
            L("subtitle", "Subtitle", { section: "basics", multiline: true, rows: 2, max: 300 }),
            { key: "image", type: "heroImage", section: "image", folder: "hero", required: true },
            ...website(),
        ],
    },

    // ── B2.8 ───────────────────────────────────────────────────────────────────────────────────────
    keynumbers: {
        group: "home",
        title: "Key numbers",
        noun: "number",
        perm: "home.manage",
        api: "/admin/keynumbers",
        path: "/admin/keynumbers",
        slug: false,
        nameKey: "label",
        orderable: true,
        listHint: "The figures strip on the homepage and About page. Use real, checkable numbers.",
        sections: { basics: { title: "Number" }, website: { title: "On the website" } },
        list: { title: (d) => `${d.value?.en ?? ""} — ${d.label?.en ?? ""}`, sub: (d) => `${d.value?.bn ?? ""} ${d.label?.bn ?? ""}`, badges: (d) => [d.isActive === false && ["muted", "Hidden"]] },
        fields: [
            L("value", "Figure", { section: "basics", required: true, max: 12, hint: "e.g. 33+ · ৩৩+" }),
            L("label", "Label", { section: "basics", required: true, max: 60, hint: "e.g. years serving Dhaka" }),
            ...website(),
        ],
    },
    centres: {
        group: "home",
        title: "Centres",
        noun: "centre",
        perm: "home.manage",
        api: "/admin/centres",
        path: "/admin/centres",
        slug: false,
        nameKey: "title",
        orderable: true,
        listHint: "“Centres of excellence” cards on the homepage — each links to a page on the site.",
        sections: { basics: { title: "Card" }, image: { title: "Photo", sub: "Landscape. Uploads go to the homepage folder." }, website: { title: "On the website" } },
        list: { thumb: (d) => d.image, title: (d) => d.title?.en, sub: (d) => d.href, badges: (d) => [d.isActive === false && ["muted", "Hidden"]] },
        fields: [
            L("title", "Title", { section: "basics", required: true, max: 80 }),
            L("summary", "Summary", { section: "basics", multiline: true, rows: 2, max: 200 }),
            { key: "href", type: "href", section: "basics", label: "Opens", required: true, hint: "A page on this site, e.g. /departments/cardiology" },
            { key: "image", type: "image", section: "image", folder: "home" },
            ...website(),
        ],
    },
    talks: {
        group: "home",
        title: "Expert talks",
        noun: "talk",
        perm: "home.manage",
        api: "/admin/talks",
        path: "/admin/talks",
        slug: false,
        nameKey: "title",
        orderable: true,
        listHint: "YouTube videos on the homepage and the Expert talks page (loaded only when tapped).",
        sections: { basics: { title: "Video" }, website: { title: "On the website" } },
        list: { thumb: (d) => (d.youtubeId ? `https://i.ytimg.com/vi/${d.youtubeId}/mqdefault.jpg` : null), title: (d) => d.title?.en, sub: (d) => d.speaker?.en || d.youtubeId, badges: (d) => [d.isActive === false && ["muted", "Hidden"]] },
        fields: [
            { key: "youtubeId", type: "youtube", section: "basics", label: "YouTube link", required: true },
            L("title", "Title", { section: "basics", required: true, max: 160 }),
            L("speaker", "Speaker / topic", { section: "basics", max: 120 }),
            ...website(),
        ],
    },
    stories: {
        title: "Patient stories",
        noun: "story",
        perm: "stories.manage",
        api: "/admin/stories",
        path: "/admin/stories",
        slug: false,
        nameKey: "name",
        orderable: true,
        eyebrow: "Site content",
        listHint: "Shown on the homepage only with the patient's written consent on file.",
        sections: { basics: { title: "Story" }, consent: { title: "Consent", sub: "Proposal §13: no story is published without written consent." }, website: { title: "On the website" } },
        list: {
            title: (d) => d.name?.en,
            sub: (d) => `“${d.quote?.en ?? ""}”`,
            badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.consent?.confirmed ? ["good", "Consent on file"] : ["bad", "No consent — not shown"]],
        },
        fields: [
            L("quote", "Quote", { section: "basics", required: true, multiline: true, rows: 3, max: 600 }),
            L("name", "Name as shown", { section: "basics", required: true, max: 80, hint: "First name + area is enough, e.g. Nusrat, Mirpur" }),
            { key: "context", type: "Lopt", section: "basics", label: "Context (optional)", max: 120, hint: "e.g. Delivered at Monowara, 2025" },
            { key: "consent", type: "consent", section: "consent" },
            ...website(),
        ],
    },

    // ── B2.9 ───────────────────────────────────────────────────────────────────────────────────────
    faqs: {
        title: "FAQ chatbot",
        noun: "question",
        perm: "faqs.manage",
        api: "/admin/faqs",
        path: "/admin/faqs",
        slug: false,
        nameKey: "question",
        orderable: true,
        eyebrow: "Hospital",
        listHint: "Fixed questions with fixed answers in the website's chat bubble. Keep answers short; the widget always offers WhatsApp too.",
        sections: { basics: { title: "Question & answer" }, website: { title: "On the website" } },
        list: { title: (d) => d.question?.en, sub: (d) => `${d.category} · ${d.answer?.en ?? ""}`, badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.answer && !d.answer.bn ? ["warn", "Bangla missing"] : null] },
        fields: [
            L("question", "Question", { section: "basics", required: true, max: 160 }),
            L("answer", "Answer", { section: "basics", required: true, multiline: true, rows: 4, max: 800 }),
            { key: "category", type: "text", optional: true, section: "basics", label: "Topic", max: 40, placeholder: "appointment", hint: "One word used to group questions: appointment, emergency, visit, packages…" },
            ...website(),
        ],
    },
    jobs: {
        title: "Careers",
        noun: "opening",
        perm: "careers.manage",
        api: "/admin/jobs",
        path: "/admin/jobs",
        slug: { publicBase: "/careers" },
        nameKey: "title",
        orderable: true,
        eyebrow: "Hospital",
        listHint: "Openings on the Careers page. Applications arrive in Front desk → Job applications.",
        sections: { basics: { title: "Opening" }, content: { title: "Details" }, website: { title: "On the website" } },
        list: {
            title: (d) => d.title?.en,
            sub: (d) => [d.type?.en, d.deadline ? `apply by ${new Date(d.deadline).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric" })}` : null].filter(Boolean).join(" · "),
            badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.deadline && new Date(d.deadline) < new Date(Date.now() - 86_400_000) ? ["bad", "Deadline passed"] : null],
        },
        fields: [
            L("title", "Title", { section: "basics", required: true, max: 160 }),
            { key: "department", type: "department", section: "basics", label: "Department (optional)" },
            L("type", "Type", { section: "basics", max: 120, hint: "e.g. Full-time · Night shift" }),
            L("location", "Location", { section: "basics", max: 120 }),
            { key: "deadline", type: "date", section: "basics", label: "Apply by (optional)" },
            L("summary", "Summary", { section: "content", multiline: true, rows: 3, max: 600 }),
            { key: "responsibilities", type: "list", section: "content", label: "Responsibilities", max: 30 },
            { key: "requirements", type: "list", section: "content", label: "Requirements", max: 30 },
            ...website(),
        ],
    },

    // ── B2.10 ──────────────────────────────────────────────────────────────────────────────────────
    aesthetic: {
        group: "programs",
        singleton: true,
        title: "MH Aesthetic",
        noun: "clinic page",
        perm: "programs.manage",
        api: "/admin/programs/aesthetic",
        path: "/admin/aesthetic",
        slug: false,
        nameKey: "name",
        viewUrl: () => "/mh-aesthetic",
        sections: {
            basics: { title: "Clinic", sub: "The sub-brand page at /mh-aesthetic." },
            contact: { title: "Contact", sub: "The clinic's own desk. Empty = the hospital's numbers are used." },
            image: { title: "Hero photo", sub: "Landscape, at least 1600 px wide." },
            team: { title: "Doctors", sub: "Shown in this order on the clinic page." },
            treatments: { title: "Treatments", sub: "Cards on the clinic page. Prices are never shown." },
        },
        fields: [
            L("name", "Name", { section: "basics", required: true, max: 120 }),
            L("tagline", "Tagline", { section: "basics", max: 200 }),
            L("about", "About", { section: "basics", multiline: true, rows: 6, max: 4000, hint: "Leave a blank line between paragraphs." }),
            L("mission", "Mission", { section: "basics", multiline: true, rows: 2, max: 400 }),
            L("vision", "Vision", { section: "basics", multiline: true, rows: 2, max: 400 }),
            { key: "phone", type: "textNull", section: "contact", label: "Phone", max: 20, placeholder: "01712-345678", inputType: "tel" },
            { key: "whatsapp", type: "textNull", section: "contact", label: "WhatsApp", max: 20, placeholder: "01712-345678", inputType: "tel" },
            { key: "email", type: "textNull", section: "contact", label: "Email", max: 120, inputType: "email" },
            L("hours", "Hours", { section: "contact", max: 120, hint: "e.g. Sat–Thu, 10 am – 8 pm" }),
            L("location", "Where in the hospital", { section: "contact", max: 200, hint: "e.g. Level 3, Monowara Hospital" }),
            { key: "heroImage", type: "image", section: "image", folder: "aesthetic" },
            { key: "doctors", type: "ids", section: "team", label: "Clinic doctors", source: PROGRAM_OPTIONS, from: "doctors", max: 40, addLabel: "Add doctor" },
            { key: "treatments", type: "treatments", section: "treatments", label: "Treatments", folder: "aesthetic", max: 40 },
        ],
    },
    bhrpc: {
        group: "programs",
        singleton: true,
        title: "BHRPC",
        noun: "programme page",
        perm: "programs.manage",
        api: "/admin/programs/bhrpc",
        path: "/admin/bhrpc",
        slug: false,
        nameKey: "name",
        viewUrl: () => "/bhrpc",
        sections: {
            basics: { title: "Programme", sub: "The high-risk pregnancy page at /bhrpc." },
            content: { title: "Who it's for & services" },
            team: { title: "Care team", sub: "Shown in this order." },
            topics: { title: "Reading list", sub: "Health tips shown at the bottom of the page." },
        },
        fields: [
            { key: "short", type: "text", section: "basics", label: "Short name", max: 20, required: true, hint: "Used in the menu, e.g. BHRPC" },
            L("name", "Full name", { section: "basics", required: true, max: 160 }),
            L("tagline", "Tagline", { section: "basics", max: 200 }),
            L("about", "About", { section: "basics", multiline: true, rows: 6, max: 4000, hint: "Leave a blank line between paragraphs." }),
            { key: "whoFor", type: "list", section: "content", label: "Who it's for", max: 20, placeholder: "e.g. Diabetes before or during pregnancy" },
            { key: "services", type: "list", section: "content", label: "Services", max: 30, placeholder: "e.g. Fetal anomaly scan" },
            { key: "doctors", type: "ids", section: "team", label: "Doctors", source: PROGRAM_OPTIONS, from: "doctors", max: 40, addLabel: "Add doctor" },
            { key: "topics", type: "ids", section: "topics", label: "Articles", source: PROGRAM_OPTIONS, from: "articles", by: "slug", max: 20, addLabel: "Add article" },
        ],
    },

    // ── B2.11 ──────────────────────────────────────────────────────────────────────────────────────
    articles: {
        title: "Health tips & news",
        noun: "article",
        perm: "articles.manage",
        api: "/admin/articles",
        path: "/admin/articles",
        slug: { publicBase: "/health-tips" },
        nameKey: "title",
        eyebrow: "Site content",
        noOrder: true,
        listHint: "Newest first, like the website. A doctor byline helps Google trust health advice.",
        listNote: "The website lists articles newest first, by publish date.",
        filters: [{ key: "category", label: "Category", options: ARTICLE_CATEGORIES }],
        sections: {
            basics: { title: "Article", sub: "Title, category and the card summary." },
            content: { title: "Text", sub: "One block per heading. Leave a blank line between paragraphs." },
            byline: { title: "Byline", sub: "Optional. Shown as “Written by / Medically reviewed by”." },
            image: { title: "Image", sub: "Landscape, at least 1600 px wide. Also used when shared on Facebook/WhatsApp." },
            website: { title: "On the website" },
        },
        list: {
            thumb: (d) => d.image,
            title: (d) => d.title?.en,
            sub: (d) => [ARTICLE_CATEGORIES.find((c) => c.value === d.category)?.label ?? d.category, fmtDay(d.publishedAt)].filter(Boolean).join(" · "),
            badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.publishedAt && new Date(d.publishedAt) > new Date() ? ["warn", "Scheduled"] : null, d.title && !d.title.bn ? ["warn", "Bangla missing"] : null],
        },
        fields: [
            L("title", "Title", { section: "basics", required: true, max: 200 }),
            { key: "category", type: "select", section: "basics", label: "Category", options: ARTICLE_CATEGORIES, required: true },
            L("excerpt", "Summary", { section: "basics", multiline: true, rows: 2, max: 400, hint: "One or two sentences for the card and Google." }),
            { key: "publishedAt", type: "date", omitEmpty: true, section: "basics", label: "Publish date", hint: "Empty on a new article = today. A future date hides it until then." },
            { key: "readMinutes", type: "number", section: "basics", label: "Reading time (minutes)", min: 1, max: 120, hint: "Optional." },
            { key: "sections", type: "sections", variant: "article", section: "content", label: "Sections", max: 30, bodyMax: 8000 },
            { key: "author", type: "ref", section: "byline", label: "Written by", source: "/admin/articles/options", from: "doctors" },
            { key: "reviewedBy", type: "ref", section: "byline", label: "Medically reviewed by", source: "/admin/articles/options", from: "doctors" },
            { key: "image", type: "image", section: "image", folder: "articles" },
            ...website(),
        ],
    },
    gallery: {
        title: "Gallery",
        noun: "photo",
        perm: "gallery.manage",
        api: "/admin/gallery",
        path: "/admin/gallery",
        slug: false,
        nameKey: "caption",
        eyebrow: "Site content",
        orderable: true,
        bulkUpload: { folder: "gallery", category: "hospital" },
        viewUrl: () => "/gallery",
        listHint: "Photos on the Gallery page. Upload several at once, then add captions.",
        filters: [{ key: "category", label: "Category", options: GALLERY_CATEGORIES }],
        sections: { basics: { title: "Photo", sub: "At least 1600 px on the long side. Converted to WebP automatically." }, website: { title: "On the website" } },
        list: {
            thumb: (d) => d.src,
            title: (d) => d.caption?.en || "No caption yet",
            sub: (d) => GALLERY_CATEGORIES.find((c) => c.value === d.category)?.label ?? d.category,
            badges: (d) => [d.isActive === false && ["muted", "Hidden"], !d.caption?.en ? ["warn", "Caption missing"] : d.caption && !d.caption.bn ? ["warn", "Bangla missing"] : null],
        },
        fields: [
            { key: "src", type: "image", section: "basics", folder: "gallery", required: true },
            { key: "category", type: "select", section: "basics", label: "Category", options: GALLERY_CATEGORIES, required: true },
            L("caption", "Caption", { section: "basics", max: 200, hint: "Also the photo's description for screen readers and Google." }),
            ...website(),
        ],
    },

    // ── B2.12 ──────────────────────────────────────────────────────────────────────────────────────
    pages: {
        group: "pages",
        title: "Pages",
        noun: "page",
        perm: "pages.manage",
        api: "/admin/pages",
        path: "/admin/pages",
        slug: false,
        nameKey: "title",
        noCreate: true,
        noOrder: true,
        noFilters: true,
        listHint: "The fixed pages of the site. Their web addresses can't change — menus link to them.",
        listNote: "Legal pages are visible to the super admin only.",
        viewUrl: (d) => (d.type === "legal" ? `/legal/${d.slug}` : `/${d.slug}`),
        fieldsFor: (doc) => (doc.type === "legal" ? LEGAL_PAGE_FIELDS : SITE_PAGE_FIELDS(doc)),
        sections: {
            basics: { title: "Title & summary" },
            content: { title: "Content", sub: "Section headings with #anchor are linked from the menu — keep them." },
            website: { title: "On the website" },
        },
        list: {
            title: (d) => d.title?.en,
            sub: (d) => (d.type === "legal" ? `/legal/${d.slug}` : `/${d.slug}`),
            badges: (d) => [d.type === "legal" && ["muted", "Legal"], d.isDraft && ["warn", "Draft"], d.isActive === false && ["muted", "Hidden"]],
        },
        fields: [],
    },
    management: {
        group: "pages",
        title: "Management",
        noun: "person",
        perm: "pages.manage",
        api: "/admin/management",
        path: "/admin/management",
        slug: false,
        nameKey: "name",
        orderable: true,
        viewUrl: () => "/about/management",
        listHint: "Chairman, directors and administrators on About → Management.",
        sections: { basics: { title: "Person" }, image: { title: "Photo", sub: "Portrait (4:5), at least 800 px wide." }, website: { title: "On the website" } },
        list: { thumb: (d) => d.photo, title: (d) => d.name?.en, sub: (d) => d.role?.en, badges: (d) => [d.isActive === false && ["muted", "Hidden"], d.message ? ["good", "Has message"] : null] },
        fields: [
            L("name", "Name", { section: "basics", required: true, max: 120 }),
            L("role", "Role", { section: "basics", max: 120, hint: "e.g. Chairman" }),
            { key: "message", type: "Lopt", section: "basics", label: "Message (optional)", multiline: true, rows: 6, max: 3000, hint: "e.g. the chairman's message. Leave a blank line between paragraphs." },
            { key: "photo", type: "image", section: "image", folder: "management" },
            ...website(),
        ],
    },

    // ── B2.13 ──────────────────────────────────────────────────────────────────────────────────────
    seo: {
        title: "SEO",
        noun: "page setting",
        perm: "seo.manage",
        api: "/admin/seo",
        path: "/admin/seo",
        slug: false,
        nameKey: "path",
        eyebrow: "Marketing",
        noOrder: true,
        listHint: "Override the Google title, description and share image of any page. Pages without an entry use their own text.",
        listNote: "Sorted by web address.",
        viewUrl: (d) => d.path,
        sections: {
            basics: { title: "Page" },
            google: { title: "Google listing", sub: "Both languages — the Bangla page uses the Bangla text." },
            image: { title: "Share image", sub: "Shown when the link is shared on Facebook / WhatsApp. 1200 × 630 px." },
            website: { title: "Active" },
        },
        list: {
            title: (d) => d.path,
            sub: (d) => d.title?.en || "Description only",
            badges: (d) => [d.isActive === false && ["muted", "Off"], d.title?.en?.length > 60 ? ["warn", "Title long"] : null, d.description?.en?.length > 160 ? ["warn", "Description long"] : null, (d.title?.en && !d.title.bn) || (d.description?.en && !d.description.bn) ? ["warn", "Bangla missing"] : null],
        },
        fields: [
            { key: "path", type: "path", section: "basics", label: "Page", source: "/admin/seo/paths", required: true },
            L("title", "Title in Google", { section: "google", max: 70, count: 60, hint: "About 60 characters." }),
            L("description", "Description in Google", { section: "google", multiline: true, rows: 3, max: 170, count: 155, hint: "About 155 characters." }),
            { key: "image", type: "image", section: "image", folder: "seo" },
            { key: "isActive", type: "bool", section: "website", label: "Use these settings", sub: "Off = the page's own text is used again. Nothing is deleted." },
        ],
    },
};

/** Tab groups: one nav item, several collections. */
export const GROUPS = {
    services: { title: "Departments & services", eyebrow: "Hospital", keys: ["departments", "facilities", "diagnostics"] },
    home: { title: "Homepage blocks", eyebrow: "Site content", keys: ["keynumbers", "centres", "talks"] },
    programs: { title: "Aesthetic & BHRPC", eyebrow: "Hospital", keys: ["aesthetic", "bhrpc"] },
    pages: { title: "Pages", eyebrow: "Site content", keys: ["pages", "management"] },
};
