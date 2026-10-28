import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, apiGetBySlug, active, clone } from "./client";

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

    if (!isStatic) return apiGetBySlug("/pages", slug);
    const { legalPages } = await import("@/data/legal");
    const doc = active(legalPages).find((p) => p.slug === slug);
    return doc ? clone(doc) : null;
}

/** GET /pages/:slug — content pages (about, patients-visitors). */
export async function getSitePage(slug) {
    "use cache";
    cacheTag("pages", `page:${slug}`);
    cacheLife("days");

    if (!isStatic) return apiGetBySlug("/pages", slug);
    const { sitePages } = await import("@/data/site-pages");
    const doc = active(sitePages).find((p) => p.slug === slug);
    return doc ? clone(doc) : null;
}

/** GET /management */
export async function getManagement() {
    "use cache";
    cacheTag("management");
    cacheLife("days");

    if (!isStatic) return (await apiGet("/management")) ?? [];
    const { management } = await import("@/data/site-pages");
    return clone(active(management).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
}

/** GET /jobs */
export async function getJobs() {
    "use cache";
    cacheTag("jobs");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/jobs")) ?? [];
    const { jobs } = await import("@/data/careers");
    return clone(active(jobs).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
}

/** GET /jobs/:slug */
export async function getJobBySlug(slug) {
    "use cache";
    cacheTag("jobs", `job:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGetBySlug("/jobs", slug);
    const { jobs } = await import("@/data/careers");
    const doc = active(jobs).find((j) => j.slug === slug);
    return doc ? clone(doc) : null;
}
