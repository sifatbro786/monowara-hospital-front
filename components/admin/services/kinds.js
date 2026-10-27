/**
 * Departments, facilities and diagnostics share one list + editor; this config is the only
 * difference. Field types:
 *   L      { en, bn }               Lopt  { en, bn } | null (empty → null)
 *   list   [{ en, bn }]             bool  checkbox            image  upload into `folder`
 *   seo    { title{en,bn}, description{en,bn} }
 * `section` groups fields in the editor (numbered in this order).
 */
export const SECTIONS = {
    basics: { title: "Name & summary", sub: "The card text in lists and the mega-menu." },
    content: { title: "Page content", sub: "The detail page. Leave a blank line between paragraphs." },
    visit: { title: "Visit information" },
    image: { title: "Image", sub: "Landscape photo, at least 1600 px wide. Converted to WebP automatically." },
    seo: { title: "Google listing", sub: "Optional. Empty = name and summary are used." },
    website: { title: "On the website" },
};

const base = [
    { key: "name", type: "L", section: "basics", label: "Name", required: true, max: 80 },
    { key: "summary", type: "L", section: "basics", label: "Summary", multiline: true, rows: 2, max: 300, hint: "One or two sentences." },
    { key: "description", type: "L", section: "content", label: "Description", multiline: true, rows: 9, max: 6000 },
];
const tail = (folder) => [
    { key: "image", type: "image", section: "image", folder },
    { key: "isActive", type: "bool", section: "website", label: "Show on the website", sub: "Off = hidden from the page, lists and the menu. Nothing is deleted." },
];

export const KINDS = {
    departments: {
        title: "Departments",
        noun: "department",
        api: "/admin/departments",
        path: "/admin/departments",
        publicBase: "/departments",
        listHint: "Specialties — each has a page with its doctors and packages.",
        fields: [
            ...base,
            { key: "services", type: "list", section: "content", label: "Services & procedures", max: 40, placeholder: "e.g. Normal delivery" },
            { key: "conditions", type: "list", section: "content", label: "Conditions treated", max: 40, placeholder: "e.g. Fibroids" },
            ...tail("departments"),
            { key: "isFeatured", type: "bool", section: "website", label: "Feature in the menu", sub: "Listed first, highlighted, in the Departments mega-menu." },
            { key: "seo", type: "seo", section: "seo" },
        ],
    },
    facilities: {
        title: "Facilities",
        noun: "facility",
        api: "/admin/facilities",
        path: "/admin/facilities",
        publicBase: "/facilities",
        listHint: "Emergency, OT, ICU, NICU, dialysis, ambulance, pharmacy, blood bank…",
        fields: [
            ...base,
            { key: "features", type: "list", section: "content", label: "Key features", max: 30, placeholder: "e.g. 10-bed ICU with ventilators" },
            { key: "whenTo", type: "Lopt", section: "visit", label: "When to come here", multiline: true, rows: 3, max: 600 },
            { key: "is24x7", type: "bool", section: "visit", label: "Open 24/7", sub: "Shows a 24/7 badge in the menu and on the page." },
            ...tail("facilities"),
        ],
    },
    diagnostics: {
        title: "Diagnostics",
        noun: "diagnostic service",
        api: "/admin/diagnostics",
        path: "/admin/diagnostics",
        publicBase: "/diagnostics",
        listHint: "Test groups with their timings and preparation notes.",
        fields: [
            ...base,
            { key: "tests", type: "list", section: "content", label: "Tests offered", max: 40, placeholder: "e.g. CBC" },
            { key: "timing", type: "L", section: "visit", label: "Timing", max: 200, hint: "e.g. 8 am – 10 pm daily; reports the same evening" },
            { key: "preparation", type: "L", section: "visit", label: "Preparation", multiline: true, rows: 3, max: 1000, hint: "Fasting, medicines, what to bring." },
            ...tail("diagnostics"),
        ],
    },
};

const L = (v) => ({ en: v?.en ?? "", bn: v?.bn ?? "" });
const trimL = (v) => ({ en: v.en.trim(), bn: v.bn.trim() });

/** API doc → form state */
export function toForm(kind, d = {}) {
    const f = { slug: d.slug ?? "", order: d.order ?? "" };
    for (const fd of KINDS[kind].fields) {
        const v = d[fd.key];
        if (fd.type === "L" || fd.type === "Lopt") f[fd.key] = L(v);
        else if (fd.type === "list") f[fd.key] = (v ?? []).map(L);
        else if (fd.type === "bool") f[fd.key] = fd.key === "isActive" ? v !== false : !!v;
        else if (fd.type === "image") f[fd.key] = v ?? null;
        else if (fd.type === "seo") f[fd.key] = { title: L(v?.title), description: L(v?.description) };
    }
    return f;
}

/** form state → API body (all editable keys) */
export function toPayload(kind, f) {
    const out = { ...(f.slug.trim() && { slug: f.slug.trim().toLowerCase() }), ...(f.order !== "" && { order: Number(f.order) }) };
    for (const fd of KINDS[kind].fields) {
        const v = f[fd.key];
        if (fd.type === "L") out[fd.key] = trimL(v);
        else if (fd.type === "Lopt") out[fd.key] = v.en.trim() || v.bn.trim() ? trimL(v) : null;
        else if (fd.type === "list") out[fd.key] = v.map(trimL).filter((x) => x.en || x.bn);
        else if (fd.type === "bool") out[fd.key] = !!v;
        else if (fd.type === "image") out[fd.key] = v || null;
        else if (fd.type === "seo") out[fd.key] = { title: trimL(v.title), description: trimL(v.description) };
    }
    return out;
}

export function changedKeys(kind, payload, original) {
    const before = toPayload(kind, toForm(kind, original));
    return Object.keys(payload).filter((k) => JSON.stringify(payload[k] ?? null) !== JSON.stringify(before[k] ?? null));
}

/** Same as mh-back slugify(): "Obstetrics & Gynaecology" → "obstetrics-gynaecology" */
export function slugify(s = "") {
    return s
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 160);
}
