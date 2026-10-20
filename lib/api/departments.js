import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

/** GET /departments?featured=true */
export async function getDepartments({ featured } = {}) {
    "use cache";
    cacheTag("departments");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/departments", { featured })) ?? [];
    const { departments } = await import("@/data/departments");
    return clone(
        active(departments)
            .filter((d) => (featured ? d.isFeatured : true))
            .sort(byOrder),
    );
}

/** GET /departments/:slug */
export async function getDepartmentBySlug(slug) {
    "use cache";
    cacheTag("departments", `department:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGet(`/departments/${encodeURIComponent(slug)}`);
    const { departments } = await import("@/data/departments");
    const doc = active(departments).find((d) => d.slug === slug);
    return doc ? clone(doc) : null;
}
