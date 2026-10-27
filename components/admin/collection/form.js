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

const paras = (text) =>
    text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

/**
 * Content sections. variant: "article" { heading, body } · "site" + anchor id, bullet points,
 * "confirm" marker and link (kept as-is) · "legal" body = paragraph arrays, edited as text with
 * a blank line between paragraphs.
 */
function sectionToForm(variant, s = {}) {
    const f = { id: s.id ?? "", heading: L(s.heading) };
    if (variant === "legal") {
        f.body = { en: (s.body?.en ?? []).join("\n\n"), bn: (s.body?.bn ?? []).join("\n\n") };
    } else f.body = L(s.body);
    if (variant === "site") {
        f.points = s.points ? s.points.map(L) : null;
        f.confirm = s.confirm;
        f.link = s.link;
    }
    return f;
}

function sectionToPayload(variant, x) {
    if (variant === "article") return { heading: trimL(x.heading), body: trimL(x.body) };
    const base = { ...(x.id && { id: x.id }), heading: trimL(x.heading) };
    if (variant === "legal") return { ...base, body: { en: paras(x.body.en), bn: paras(x.body.bn) } };
    return {
        ...base,
        body: trimL(x.body),
        ...(x.points && { points: x.points.map(trimL).filter((p) => p.en || p.bn) }),
        ...(x.confirm !== undefined && { confirm: x.confirm }),
        ...(x.link && { link: x.link }),
    };
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
            case "number":
            case "textNull":
            case "ref":
            case "path":
                f[fd.key] = v ?? "";
                break;
            case "ids":
                f[fd.key] = [...(v ?? [])];
                break;
            case "treatments":
                f[fd.key] = (v ?? []).map((t) => ({
                    _id: t._id,
                    slug: t.slug,
                    name: L(t.name),
                    summary: L(t.summary),
                    image: t.image ?? null,
                    isActive: t.isActive !== false,
                }));
                break;
            case "pillars":
                f[fd.key] = (v ?? []).map((p) => ({ title: L(p.title), body: L(p.body) }));
                break;
            case "sections":
                f[fd.key] = (v ?? []).map((s) => sectionToForm(fd.variant, s));
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
                if (v || !fd.omitEmpty) out[fd.key] = v || null;
                break;
            case "consent":
                out[fd.key] = { confirmed: v.confirmed, date: v.confirmed ? v.date || null : null };
                break;
            case "number":
                out[fd.key] = v === "" || v === null ? null : Number(v);
                break;
            case "textNull":
            case "ref":
                out[fd.key] = String(v).trim() || null;
                break;
            case "path":
                out[fd.key] = v.trim();
                break;
            case "ids":
                out[fd.key] = v;
                break;
            case "treatments":
                out[fd.key] = v.map((t) => ({
                    ...(t._id && { _id: t._id }),
                    ...(t.slug && { slug: t.slug }),
                    name: trimL(t.name),
                    summary: trimL(t.summary),
                    image: t.image || null,
                    isActive: t.isActive,
                }));
                break;
            case "pillars":
                out[fd.key] = v.map((p) => ({ title: trimL(p.title), body: trimL(p.body) }));
                break;
            case "sections":
                out[fd.key] = v.map((x) => sectionToPayload(fd.variant, x));
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
