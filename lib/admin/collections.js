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
 */

const L = (key, label, extra = {}) => ({ key, type: "L", label, ...extra });

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
};

/** Tab groups: one nav item, several collections. */
export const GROUPS = {
    services: { title: "Departments & services", eyebrow: "Hospital", keys: ["departments", "facilities", "diagnostics"] },
    home: { title: "Homepage blocks", eyebrow: "Site content", keys: ["keynumbers", "centres", "talks"] },
};
