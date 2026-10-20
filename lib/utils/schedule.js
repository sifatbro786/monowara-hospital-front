// Chamber schedule helpers. Week order follows Bangladesh (Sat → Fri).
export const WEEK = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

const DAY_LABEL = {
    en: { sat: "Sat", sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri" },
    bn: { sat: "শনি", sun: "রবি", mon: "সোম", tue: "মঙ্গল", wed: "বুধ", thu: "বৃহঃ", fri: "শুক্র" },
};
const BN = "০১২৩৪৫৬৭৮৯";
const bnDigits = (s) => s.replace(/\d/g, (d) => BN[d]);

/** "17:00" → "5pm", "20:30" → "8:30pm"; BN → "৫ পিএম" */
export function formatTime(hhmm, lang = "en") {
    const [h, m] = hhmm.split(":").map(Number);
    const h12 = ((h + 11) % 12) + 1;
    const mm = m ? `:${String(m).padStart(2, "0")}` : "";
    if (lang === "bn")
        return (
            bnDigits(`${h12}${mm}`) +
            (h < 12 ? " am" : " pm").replace("am", "এএম").replace("pm", "পিএম")
        );
    return `${h12}${mm}${h < 12 ? "am" : "pm"}`;
}

/**
 * Compress a schedule into short lines: consecutive days sharing the same time
 * slots collapse into ranges. → ["Sat–Thu · 5–8pm"] or ["Sat, Mon, Wed · 2:30–3:30pm"].
 */
export function summariseSchedule(schedule = [], lang = "en") {
    const byDay = new Map();
    for (const s of schedule) {
        const key = byDay.get(s.day) || [];
        key.push(`${s.from}-${s.to}`);
        byDay.set(s.day, key);
    }
    // group days by identical slot signature
    const groups = new Map();
    for (const day of WEEK) {
        if (!byDay.has(day)) continue;
        const sig = byDay.get(day).sort().join(",");
        if (!groups.has(sig)) groups.set(sig, []);
        groups.get(sig).push(day);
    }
    const L = DAY_LABEL[lang] || DAY_LABEL.en;
    const sep = "–";
    const dayRanges = (days) => {
        const idx = days.map((d) => WEEK.indexOf(d));
        const runs = [];
        for (const i of idx) {
            const last = runs.at(-1);
            if (last && i === last[1] + 1) last[1] = i;
            else runs.push([i, i]);
        }
        return runs
            .map(([a, b]) =>
                b - a >= 2
                    ? `${L[WEEK[a]]}${sep}${L[WEEK[b]]}`
                    : a === b
                      ? L[WEEK[a]]
                      : `${L[WEEK[a]]}, ${L[WEEK[b]]}`,
            )
            .join(", ");
    };
    return [...groups.entries()].map(([sig, days]) => {
        const slots = sig.split(",").map((r) => {
            const [from, to] = r.split("-");
            return `${formatTime(from, lang).replace(/\s?(am|pm|এএম|পিএম)$/, (sfx) => (formatTime(to, lang).endsWith(sfx.trim()) ? "" : sfx))}${sep}${formatTime(to, lang)}`;
        });
        return `${dayRanges(days)} · ${slots.join(", ")}`;
    });
}
