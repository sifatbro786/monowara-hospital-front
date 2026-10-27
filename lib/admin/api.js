/**
 * Admin dashboard → mh-back. Browser only (cookies are HttpOnly; the UI never sees a token).
 * Contract: docs/API_CONTRACT.md → "Admin auth".
 *
 *   adminFetch(path, { method, body, query })  → `data` from `{ data }`, throws AdminApiError
 *   adminDownload(path, { query, filename })   → saves an attachment (Excel export, CV)
 *   onAuthEvent(fn)                             → "signed-out" | "password-required" (AdminProvider)
 *
 * Retry rules: 401 TOKEN_EXPIRED / AUTH_REQUIRED → one shared refresh (single-flight across parallel calls) → retry once.
 * Refresh answering 409 REFRESH_RACE = another tab already rotated the cookies (shared jar) → just retry.
 * Any other 401 → signed out. 403 PASSWORD_CHANGE_REQUIRED → forced password screen.
 */

const RAW_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5036/api").replace(/\/$/, "");
const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * SameSite=Strict cookies need page + API on the same *site*. In dev, `localhost:3000` → `127.0.0.1:5036`
 * is cross-site (cookies silently dropped), so a loopback API host follows whatever loopback name the
 * page was opened with. Production uses the env value as is (api.monowarahospital.com).
 */
export function apiBase() {
    if (typeof window === "undefined") return RAW_BASE;
    try {
        const u = new URL(RAW_BASE);
        if (LOOPBACK.has(u.hostname) && LOOPBACK.has(window.location.hostname)) u.hostname = window.location.hostname;
        return u.toString().replace(/\/$/, "");
    } catch {
        return RAW_BASE;
    }
}

export class AdminApiError extends Error {
    constructor(status, code, message, details) {
        super(message || "Request failed");
        this.status = status;
        this.code = code || "ERROR";
        this.details = details;
    }
    /** zod details → { field: message } for inline form errors */
    get fieldErrors() {
        const out = {};
        for (const d of this.details ?? []) {
            const key = Array.isArray(d.path) ? d.path.join(".") : String(d.path ?? "");
            if (key && !out[key]) out[key] = d.message;
        }
        return out;
    }
}

// ── auth events (one listener set per tab) ───────────────────────────────────────────────────────
const listeners = new Set();
export function onAuthEvent(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
function emit(type, detail) {
    for (const fn of listeners) fn(type, detail);
}

// ── low level ────────────────────────────────────────────────────────────────────────────────────
function buildUrl(path, query) {
    const qs = query
        ? new URLSearchParams(
              Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== false),
          ).toString()
        : "";
    return `${apiBase()}${path}${qs ? `?${qs}` : ""}`;
}

async function send(path, { method = "GET", body, query, signal } = {}) {
    const headers = { "X-Requested-With": "mh-admin", Accept: "application/json" };
    let payload;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        payload = JSON.stringify(body);
    }
    try {
        return await fetch(buildUrl(path, query), { method, headers, body: payload, credentials: "include", cache: "no-store", signal });
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        throw new AdminApiError(0, "NETWORK", "Can't reach the server. Check the connection and try again.");
    }
}

async function toError(res) {
    let e = {};
    try {
        e = (await res.json())?.error ?? {};
    } catch {
        /* non-JSON (proxy error page) */
    }
    return new AdminApiError(res.status, e.code, e.message || `Request failed (${res.status})`, e.details);
}

let refreshing = null;
/** One refresh at a time per tab; parallel 401s all wait on the same promise. Resolves true if usable. */
function refreshSession() {
    refreshing ??= (async () => {
        const res = await send("/auth/refresh", { method: "POST" });
        if (res.ok) return true;
        const err = await toError(res);
        if (err.code === "REFRESH_RACE") return true; // the other tab's new cookies are already in the jar
        return false;
    })().finally(() => {
        refreshing = null;
    });
    return refreshing;
}

/**
 * @param {string} path  e.g. "/admin/bookings"
 * @param {{ method?: string, body?: any, query?: object, signal?: AbortSignal, raw?: boolean, auth?: boolean }} opts
 *   raw  → return the Response (downloads)   auth:false → login call (a 401 there is just wrong credentials)
 */
export async function adminFetch(path, opts = {}) {
    const { raw = false, auth = true } = opts;
    let res = await send(path, opts);

    if (res.status === 401 && auth) {
        const err = await toError(res);
        // AUTH_REQUIRED too: a browser that dropped the access cookie early (clock skew, old cookie)
        // still holds the refresh cookie — one refresh attempt decides.
        if ((err.code === "TOKEN_EXPIRED" || err.code === "AUTH_REQUIRED") && (await refreshSession())) {
            res = await send(path, opts);
        } else {
            emit("signed-out", err.code);
            throw err;
        }
        if (res.status === 401) {
            const again = await toError(res);
            emit("signed-out", again.code);
            throw again;
        }
    }
    if (res.status === 409 && auth) {
        // A refresh call made directly can still race; the original request is safe to repeat.
        const err = await toError(res.clone());
        if (err.code === "REFRESH_RACE") res = await send(path, opts);
    }
    if (!res.ok) {
        const err = await toError(res);
        if (err.code === "PASSWORD_CHANGE_REQUIRED") emit("password-required");
        throw err;
    }
    if (raw) return res;
    if (res.status === 204) return null;
    const json = await res.json();
    return json?.data ?? json;
}

/** Downloads an attachment through the same auth/retry path (fetch → blob → <a download>). */
export async function adminDownload(path, { query, filename } = {}) {
    const res = await adminFetch(path, { query, raw: true });
    const cd = res.headers.get("content-disposition") || "";
    const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    const name = m ? decodeURIComponent(m[1] || m[2]) : filename || "download";
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

// ── auth calls ───────────────────────────────────────────────────────────────────────────────────
export const authApi = {
    me: () => adminFetch("/auth/me"),
    login: (email, password) => adminFetch("/auth/login", { method: "POST", body: { email, password }, auth: false }),
    logout: () => adminFetch("/auth/logout", { method: "POST", auth: false }).catch(() => null),
    logoutAll: () => adminFetch("/auth/logout-all", { method: "POST" }),
    changePassword: (currentPassword, newPassword) =>
        adminFetch("/auth/password", { method: "POST", body: { currentPassword, newPassword } }),
};
