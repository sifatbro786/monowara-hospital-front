import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

/** GET /facilities */
export async function getFacilities() {
    "use cache";
    cacheTag("facilities");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/facilities")) ?? [];
    const { facilities } = await import("@/data/facilities");
    return clone(active(facilities).sort(byOrder));
}

/** GET /facilities/:slug */
export async function getFacilityBySlug(slug) {
    "use cache";
    cacheTag("facilities", `facility:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGet(`/facilities/${encodeURIComponent(slug)}`);
    const { facilities } = await import("@/data/facilities");
    const doc = active(facilities).find((d) => d.slug === slug);
    return doc ? clone(doc) : null;
}

/** GET /diagnostics/:slug */
export async function getDiagnosticBySlug(slug) {
    "use cache";
    cacheTag("diagnostics", `diagnostic:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGet(`/diagnostics/${encodeURIComponent(slug)}`);
    const { diagnostics } = await import("@/data/diagnostics");
    const doc = active(diagnostics).find((d) => d.slug === slug);
    return doc ? clone(doc) : null;
}

/** GET /diagnostics */
export async function getDiagnostics() {
    "use cache";
    cacheTag("diagnostics");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/diagnostics")) ?? [];
    const { diagnostics } = await import("@/data/diagnostics");
    return clone(active(diagnostics).sort(byOrder));
}
