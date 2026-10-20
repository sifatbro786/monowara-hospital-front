import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

/** GET /packages?category=maternity|surgical|checkup&featured=true */
export async function getPackages({ category, featured } = {}) {
    "use cache";
    cacheTag("packages");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/packages", { category, featured })) ?? [];
    const { packages } = await import("@/data/packages");
    return clone(
        active(packages)
            .filter((p) => (category ? p.category === category : true))
            .filter((p) => (featured ? p.isFeatured : true))
            .sort(byOrder),
    );
}
