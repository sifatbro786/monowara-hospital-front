import "server-only";

/**
 * The one switch between the static demo and the Express API.
 *   DATA_SOURCE=static  -> services read data/* (default, Vercel demo)
 *   DATA_SOURCE=api     -> services fetch `${API_URL}/...` (after design lock)
 * Pages/components never import data/* directly — only lib/api/* services.
 */
export const DATA_SOURCE = process.env.DATA_SOURCE === "api" ? "api" : "static";
export const API_URL = (process.env.API_URL || "http://127.0.0.1:5020/api").replace(/\/$/, "");

export const isStatic = DATA_SOURCE === "static";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// A hung API must not hang server rendering: fail fast, the page error boundary takes over.
const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS) || 8000;

/**
 * Uploaded files live outside Next's public/ (VPS: /var/www/mh/uploads, served by Nginx).
 * Next only knows public/ files that existed when the server started, so next/image would 404 on
 * anything uploaded from the admin later. With MEDIA_ORIGIN set (e.g. https://monowarahospital.com)
 * every "/uploads/..." path in API responses becomes absolute → next/image fetches it through Nginx
 * (allowed by images.remotePatterns in next.config.mjs). Unset (static demo) → paths unchanged.
 */
const MEDIA_ORIGIN = (process.env.MEDIA_ORIGIN || "").replace(/\/$/, "");
function withMediaOrigin(value) {
    if (!MEDIA_ORIGIN) return value;
    if (typeof value === "string")
        return value.startsWith("/uploads/") ? `${MEDIA_ORIGIN}${value}` : value;
    if (Array.isArray(value)) return value.map(withMediaOrigin);
    if (value && typeof value === "object")
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withMediaOrigin(v)]));
    return value;
}

/** GET helper for the API phase. Callers wrap with "use cache" + cacheTag. */
export async function apiGet(path, query) {
    const qs = query
        ? `?${new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""))}`
        : "";
    const res = await fetch(`${API_URL}${path}${qs}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new ApiError(`API ${path} failed`, res.status);
    const body = await res.json();
    return withMediaOrigin(body?.data ?? body);
}

/** Same rule as mh-back SLUG_RE. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * GET /<collection>/:slug. A slug the API would reject (400) — e.g. "photo.webp" when a missing file
 * under /uploads or /fonts falls through to the [lang] routes, or a bot probing "/wp-login.php" — is
 * "not found", not a server error: return null without calling the API.
 */
export function apiGetBySlug(collection, slug) {
    if (typeof slug !== "string" || slug.length > 160 || !SLUG_RE.test(slug)) return null;
    return apiGet(`${collection}/${slug}`);
}

/** Mongo-ish helpers so static mode behaves like the future queries. */
export const active = (docs) => docs.filter((d) => d.isActive !== false);
export const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
export const clone = (v) => structuredClone(v);
