/**
 * Public forms → mh-back (B3). Browser-only, no cookies. Contract: docs/API_CONTRACT.md → "Public forms".
 *
 * Live when a browser API URL is baked in at build time (NEXT_PUBLIC_API_URL, falls back to the
 * dashboard's NEXT_PUBLIC_ADMIN_API_URL — same host). Unset (Vercel demo) → FORMS_LIVE=false and the
 * forms keep their WhatsApp / email hand-off.
 *
 * submitForm(path, body) never throws. Result:
 *   { ok: true, data }
 *   { ok: false, kind: "fields", fields: { name: "…", … } }   400 VALIDATION → show next to fields
 *   { ok: false, kind: "code", code }                           known business rule (NO_CHAMBER, CV_TYPE…)
 *   { ok: false, kind: "rate" }                                 429
 *   { ok: false, kind: "offline" }                              network / timeout / 5xx → offer WhatsApp/email
 */
const RAW = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL || "").replace(/\/$/, "");

export const PUBLIC_API_URL = RAW || null;
export const FORMS_LIVE = Boolean(RAW);

export async function submitForm(path, body, { timeoutMs = 15000 } = {}) {
    const isMultipart = typeof FormData !== "undefined" && body instanceof FormData;
    let res;
    try {
        res = await fetch(`${RAW}${path}`, {
            method: "POST",
            headers: isMultipart ? { Accept: "application/json" } : { "Content-Type": "application/json", Accept: "application/json" },
            body: isMultipart ? body : JSON.stringify(body),
            credentials: "omit",
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch {
        return { ok: false, kind: "offline" };
    }
    let json = null;
    try {
        json = await res.json();
    } catch {
        /* empty / non-JSON (proxy error page) */
    }
    if (res.ok) return { ok: true, data: json?.data ?? null };
    if (res.status === 429) return { ok: false, kind: "rate" };
    if (res.status >= 500 || !json?.error) return { ok: false, kind: "offline" };

    const { code, details } = json.error;
    if (code === "VALIDATION" && Array.isArray(details) && details.length) {
        const fields = {};
        for (const d of details) {
            const key = Array.isArray(d.path) ? String(d.path[0] ?? "") : String(d.path ?? "");
            if (key && !fields[key]) fields[key] = true; // the form picks its own localised message
        }
        return { ok: false, kind: "fields", fields };
    }
    return { ok: false, kind: "code", code };
}

/** Current path for the staff's "sent from" column (internal path only, as the API expects). */
export const currentSource = () =>
    typeof window === "undefined" ? undefined : window.location.pathname.slice(0, 200);
