// Generic document ⇄ form state for lib/admin/collections.js. Pure functions.
import { toDhakaDay } from "@/lib/utils/dates";

const L = (v) => ({ en: v?.en ?? "", bn: v?.bn ?? "" });
const trimL = (v) => ({ en: v.en.trim(), bn: v.bn.trim() });
const emptyL = (v) => !v.en.trim() && !v.bn.trim();

/** "https://youtu.be/BriBQgWl28Y", ".../watch?v=…", ".../shorts/…" or a bare id → id (or the input). */
export function youtubeId(input = "") {
    const s = input.trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/.exec(s);
    return m ? m[1] : s;
}

export function toForm(cfg, d = {}) {
    const f = { order: d.order ?? "" };
    if (cfg.slug) f.slug = d.slug ?? "";
    for (const fd of cfg.fields) {
        const v = d[fd.key];
        switch (fd.type) {
            case "L":
            case "Lopt":
                f[fd.key] = L(v);
                break;
            case "list":
                f[fd.key] = (v ?? []).map(L);
                break;
            case "bool":
                f[fd.key] = fd.key === "isActive" ? v !== false : !!v;
                break;
            case "image":
                f[fd.key] = v ?? null;
                break;
            case "heroImage":
                f[fd.key] = {
                    src: v?.src ?? null,
                    alt: L(v?.alt),
                    position: v?.position ?? "center",
                };
                break;
            case "seo":
                f[fd.key] = { title: L(v?.title), description: L(v?.description) };
                break;
            case "departments":
                f[fd.key] = [...(v ?? [])];
                break;
            case "department":
            case "select":
            case "text":
            case "href":
            case "youtube":
                f[fd.key] = v ?? "";
                break;
            case "date":
                f[fd.key] = toDhakaDay(v);
                break;
            case "consent":
                f[fd.key] = {
                    confirmed: !!v?.confirmed,
                    date: toDhakaDay(v?.date),
                    recordedBy: v?.recordedBy ?? null,
                };
                break;
        }
    }
    return f;
}

export function toPayload(cfg, f) {
    const out = {};
    if (cfg.slug && f.slug.trim()) out.slug = f.slug.trim().toLowerCase();
    if (f.order !== "" && f.order !== null) out.order = Number(f.order);
    for (const fd of cfg.fields) {
        const v = f[fd.key];
        switch (fd.type) {
            case "L":
                out[fd.key] = trimL(v);
                break;
            case "Lopt":
                out[fd.key] = emptyL(v) ? null : trimL(v);
                break;
            case "list":
                out[fd.key] = v.map(trimL).filter((x) => x.en || x.bn);
                break;
            case "bool":
                out[fd.key] = !!v;
                break;
            case "image":
                out[fd.key] = v || null;
                break;
            case "heroImage":
                out[fd.key] = {
                    src: v.src || null,
                    alt: trimL(v.alt),
                    position: v.position.trim() || "center",
                };
                break;
            case "seo":
                out[fd.key] = { title: trimL(v.title), description: trimL(v.description) };
                break;
            case "departments":
                out[fd.key] = v;
                break;
            case "department":
                out[fd.key] = v || null;
                break;
            case "select":
                if (v) out[fd.key] = v;
                break;
            case "text":
                if (v.trim() || !fd.optional) out[fd.key] = v.trim();
                break;
            case "href":
                out[fd.key] = v.trim();
                break;
            case "youtube":
                out[fd.key] = youtubeId(v);
                break;
            case "date":
                out[fd.key] = v || null;
                break;
            case "consent":
                out[fd.key] = { confirmed: v.confirmed, date: v.confirmed ? v.date || null : null };
                break;
        }
    }
    return out;
}

export function changedKeys(cfg, payload, original) {
    const before = toPayload(cfg, toForm(cfg, original));
    return Object.keys(payload).filter(
        (k) => JSON.stringify(payload[k] ?? null) !== JSON.stringify(before[k] ?? null),
    );
}

/** Client-side "can this be saved" — required fields filled. Returns { key: message }. */
export function missingRequired(cfg, f) {
    const out = {};
    for (const fd of cfg.fields) {
        if (!fd.required) continue;
        const v = f[fd.key];
        const empty =
            fd.type === "L"
                ? !v.en.trim()
                : fd.type === "heroImage"
                  ? !v.src
                  : typeof v === "string"
                    ? !v.trim()
                    : v == null;
        if (empty) out[fd.type === "L" ? `${fd.key}.en` : fd.key] = "Required.";
    }
    return out;
}

/** Same rule as mh-back slugify(). */
export function slugify(s = "") {
    return s
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 160);
}
