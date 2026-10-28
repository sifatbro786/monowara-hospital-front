import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, apiGetBySlug, active, byOrder, clone } from "./client";

/** GET /packages?category=maternity|surgical|checkup&featured=true&department=<deptId> */
export async function getPackages({ category, featured, department } = {}) {
    "use cache";
    cacheTag("packages");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/packages", { category, featured, department })) ?? [];
    const { packages } = await import("@/data/packages");
    return clone(
        active(packages)
            .filter((p) => (category ? p.category === category : true))
            .filter((p) => (featured ? p.isFeatured : true))
            .filter((p) => (department ? p.departments?.includes(department) : true))
            .sort(byOrder),
    );
}

/** GET /packages/:slug */
export async function getPackageBySlug(slug) {
    "use cache";
    cacheTag("packages", `package:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGetBySlug("/packages", slug);
    const { packages } = await import("@/data/packages");
    const doc = active(packages).find((p) => p.slug === slug);
    return doc ? clone(doc) : null;
}
