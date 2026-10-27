// Doctor document ⇄ form state. Pure functions (no React) so they're easy to reason about.
import { toDhakaDay } from "@/lib/utils/dates";

const L = (v) => ({ en: v?.en ?? "", bn: v?.bn ?? "" });

export const EMPTY_DOCTOR = {
    name: L(),
    slug: "",
    designation: L(),
    degrees: "",
    specialty: L(),
    affiliation: L(),
    department: "",
    bmdc: "",
    phone: "",
    photo: null,
    schedule: [],
    scheduleNote: L(),
    leaveOn: false,
    leave: { from: "", until: "", note: L() },
    isFeatured: false,
    isActive: true,
    order: "",
};

/** API doc → form state (dates as Dhaka "YYYY-MM-DD", nulls as "" for inputs). */
export function toForm(d) {
    return {
        name: L(d.name),
        slug: d.slug ?? "",
        designation: L(d.designation),
        degrees: d.degrees ?? "",
        specialty: L(d.specialty),
        affiliation: L(d.affiliation),
        department: d.department?._id ?? d.department ?? "",
        bmdc: d.bmdc ?? "",
        phone: d.phone ?? "",
        photo: d.photo ?? null,
        schedule: (d.schedule ?? []).map((s) => ({ day: s.day, from: s.from, to: s.to })),
        scheduleNote: L(d.scheduleNote),
        leaveOn: !!d.leave,
        leave: { from: toDhakaDay(d.leave?.from), until: toDhakaDay(d.leave?.until), note: L(d.leave?.note) },
        isFeatured: !!d.isFeatured,
        isActive: d.isActive !== false,
        order: d.order ?? "",
    };
}

const optL = (v) => (v.en.trim() || v.bn.trim() ? { en: v.en.trim(), bn: v.bn.trim() } : null);
const trimL = (v) => ({ en: v.en.trim(), bn: v.bn.trim() });

/** Form state → API body (full shape; the editor sends only changed keys on PATCH). */
export function toPayload(f) {
    return {
        name: trimL(f.name),
        ...(f.slug.trim() && { slug: f.slug.trim().toLowerCase() }),
        designation: trimL(f.designation),
        degrees: f.degrees.trim(),
        specialty: trimL(f.specialty),
        affiliation: optL(f.affiliation),
        department: f.department || null,
        bmdc: f.bmdc.trim() || null,
        phone: f.phone.trim() || null,
        photo: f.photo || null,
        schedule: f.schedule.map((s) => ({ day: s.day, from: s.from, to: s.to })),
        scheduleNote: optL(f.scheduleNote),
        leave: f.leaveOn ? { from: f.leave.from || null, until: f.leave.until, note: optL(f.leave.note) } : null,
        isFeatured: f.isFeatured,
        isActive: f.isActive,
        ...(f.order !== "" && { order: Number(f.order) }),
    };
}

/** Keys whose payload value differs from the original document's. */
export function changedKeys(payload, original) {
    const base = toPayload(toForm(original));
    return Object.keys(payload).filter((k) => JSON.stringify(payload[k] ?? null) !== JSON.stringify(base[k] ?? null));
}

const TITLE = /^(?:(?:assoc(?:iate)?\.?|asst\.?|assistant)\s+)?(?:prof(?:essor)?\.?\s+)/i;
/** Same rule as mh-back: "Prof. Dr. Nasima Begum" → "dr-nasima-begum". */
export function doctorSlug(nameEn = "") {
    return nameEn
        .replace(TITLE, "")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 160);
}

export function isOnLeaveToday(leave) {
    if (!leave?.until) return false;
    const today = toDhakaDay(new Date());
    const from = toDhakaDay(leave.from);
    return (!from || from <= today) && today <= toDhakaDay(leave.until);
}

/** Client-side mirror of the API's schedule rules → { "schedule.<i>.<field>": message } */
export function scheduleProblems(schedule) {
    const out = {};
    schedule.forEach((s, i) => {
        if (!s.from || !s.to) out[`schedule.${i}.to`] = "Set both times.";
        else if (s.from >= s.to) out[`schedule.${i}.to`] = "Ends before it starts.";
    });
    const byDay = {};
    schedule.forEach((s, i) => (byDay[s.day] ??= []).push({ ...s, i }));
    for (const slots of Object.values(byDay)) {
        const sorted = slots.filter((s) => s.from && s.to).sort((a, b) => (a.from < b.from ? -1 : 1));
        for (let k = 1; k < sorted.length; k++) {
            if (sorted[k].from < sorted[k - 1].to) out[`schedule.${sorted[k].i}.from`] = "Overlaps another time that day.";
        }
    }
    return out;
}
