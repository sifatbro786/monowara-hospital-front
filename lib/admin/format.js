/** Admin display helpers — the hospital runs on Dhaka time whatever the staff device says. */
const TZ = "Asia/Dhaka";

const dateTime = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
const dateOnly = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeOnly = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });

export const fmtDateTime = (d) => (d ? dateTime.format(new Date(d)) : "—");

/** "2026-10-29" (a Dhaka calendar day, stored as a string) → "Thu, 29 Oct 2026" */
export const fmtDay = (ymd) => (ymd ? dateOnly.format(new Date(`${ymd}T12:00:00+06:00`)) : "—");

/** "17:30" → "5:30 pm" */
export function fmtHHMM(hhmm) {
    if (!hhmm) return "";
    return timeOnly.format(new Date(`2000-01-01T${hhmm}:00+06:00`)).toLowerCase();
}

/** "just now", "12 min ago", "3 h ago", "yesterday", else the date. */
export function fmtAgo(d, now = Date.now()) {
    if (!d) return "—";
    const s = Math.round((now - new Date(d).getTime()) / 1000);
    if (s < 45) return "just now";
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86_400) return `${Math.round(s / 3600)} h ago`;
    if (s < 172_800) return "yesterday";
    return fmtDateTime(d);
}

/** Date input value (Dhaka day) → ISO bounds the API's `from`/`to` understand. */
export const dayStart = (ymd) => (ymd ? `${ymd}T00:00:00.000+06:00` : undefined);
export const dayEnd = (ymd) => (ymd ? `${ymd}T23:59:59.999+06:00` : undefined);

/** "01712345678" → "01712-345678" */
export function fmtPhone(p = "") {
    const d = String(p).replace(/\D/g, "");
    return d.length === 11 ? `${d.slice(0, 5)}-${d.slice(5)}` : p;
}
export const telLink = (p) => `tel:+880${String(p).replace(/\D/g, "").replace(/^0/, "")}`;
export const waLink = (p, text) =>
    `https://wa.me/880${String(p).replace(/\D/g, "").replace(/^0/, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const fmtBytes = (n) => (!n ? "" : n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

/**
 * Temporary password that passes the API rule (≥ 10 chars, letter + number) and is easy to read out
 * over the phone: no 0/O/1/l/I. crypto.getRandomValues, never Math.random.
 */
export function tempPassword(len = 12) {
    const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    const digits = "23456789";
    const all = letters + digits;
    const rnd = new Uint32Array(len);
    crypto.getRandomValues(rnd);
    const chars = Array.from(rnd, (n) => all[n % all.length]);
    chars[0] = letters[rnd[0] % letters.length];
    chars[len - 1] = digits[rnd[len - 1] % digits.length];
    return chars.join("");
}

/** Mirrors mh-back lib/password.js: ≥ 10 chars, ≤ 72 bytes, a letter and a number. */
export function passwordProblem(pw) {
    if (!pw || pw.length < 10) return "At least 10 characters.";
    if (new TextEncoder().encode(pw).length > 72) return "Too long (72 bytes max — Bangla letters count as 3).";
    if (!/\p{L}/u.test(pw) || !/\d/.test(pw)) return "Use at least one letter and one number.";
    return null;
}
