import "server-only";

/**
 * The one switch between the static demo and the Express API.
 *   DATA_SOURCE=static  -> services read data/* (default, Vercel demo)
 *   DATA_SOURCE=api     -> services fetch `${API_URL}/...` (after design lock)
 * Pages/components never import data/* directly — only lib/api/* services.
 */
export const DATA_SOURCE = process.env.DATA_SOURCE === "api" ? "api" : "static";
export const API_URL = (process.env.API_URL || "http://127.0.0.1:5000/api/v1").replace(/\/$/, "");

export const isStatic = DATA_SOURCE === "static";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

/** GET helper for the API phase. Callers wrap with "use cache" + cacheTag. */
export async function apiGet(path, query) {
    const qs = query
        ? `?${new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""))}`
        : "";
    const res = await fetch(`${API_URL}${path}${qs}`, { headers: { Accept: "application/json" } });
    if (res.status === 404) return null;
    if (!res.ok) throw new ApiError(`API ${path} failed`, res.status);
    const body = await res.json();
    return body?.data ?? body;
}

/** Mongo-ish helpers so static mode behaves like the future queries. */
export const active = (docs) => docs.filter((d) => d.isActive !== false);
export const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
export const clone = (v) => structuredClone(v);
