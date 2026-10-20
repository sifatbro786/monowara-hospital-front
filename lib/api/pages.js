import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, clone } from "./client";

/** GET /pages/legal — slugs for generateStaticParams */
export async function getLegalSlugs() {
    "use cache";
    cacheTag("pages");
    cacheLife("days");

    if (!isStatic) return ((await apiGet("/pages", { type: "legal" })) ?? []).map((p) => p.slug);
    const { legalPages } = await import("@/data/legal");
    return active(legalPages).map((p) => p.slug);
}

/** GET /pages/:slug */
export async function getLegalPage(slug) {
    "use cache";
    cacheTag("pages", `page:${slug}`);
    cacheLife("days");

    if (!isStatic) return apiGet(`/pages/${encodeURIComponent(slug)}`);
    const { legalPages } = await import("@/data/legal");
    const doc = active(legalPages).find((p) => p.slug === slug);
    return doc ? clone(doc) : null;
}
