import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

/** Mirrors the future Mongo query: GET /doctors?department=&day=&q=&featured=&page=&limit= */
export async function getDoctors({ department, day, q, featured, page = 1, limit = 100 } = {}) {
    "use cache";
    // "departments" too: each doctor carries its populated department name/slug.
    cacheTag("doctors", "departments");
    cacheLife("hours");

    if (!isStatic)
        return (
            (await apiGet("/doctors", { department, day, q, featured, page, limit })) ?? {
                items: [],
                total: 0,
            }
        );

    const [{ doctors }, { departments }] = await Promise.all([
        import("@/data/doctors"),
        import("@/data/departments"),
    ]);
    const deptById = new Map(departments.map((d) => [d._id, d]));
    const needle = q?.trim().toLowerCase();

    let items = active(doctors)
        .filter((d) => (featured ? d.isFeatured : true))
        .filter((d) =>
            department
                ? d.department === department || deptById.get(d.department)?.slug === department
                : true,
        )
        .filter((d) => (day ? d.schedule.some((s) => s.day === day) : true))
        .filter((d) =>
            needle
                ? [
                      d.name.en,
                      d.name.bn,
                      d.degrees,
                      d.specialty?.en,
                      d.specialty?.bn,
                      deptById.get(d.department)?.name.en,
                      deptById.get(d.department)?.name.bn,
                  ]
                      .join(" ")
                      .toLowerCase()
                      .includes(needle)
                : true,
        )
        .sort(byOrder);

    const total = items.length;
    items = items.slice((page - 1) * limit, page * limit).map((d) => populate(d, deptById));
    return clone({ items, total, page, limit });
}

/** API max page size (the B1 validator caps `limit`); getAllDoctors pages through it. */
export const DOCTORS_PAGE_MAX = 100;

/** Every active doctor (sitemap, static params, team lists). Pages through the API instead of
 *  asking for limit=500, which a validating API would reject or silently cap. */
export async function getAllDoctors() {
    const first = await getDoctors({ page: 1, limit: DOCTORS_PAGE_MAX });
    const pages = Math.ceil((first.total || 0) / DOCTORS_PAGE_MAX);
    if (pages <= 1) return first.items;
    const rest = await Promise.all(
        Array.from({ length: pages - 1 }, (_, i) =>
            getDoctors({ page: i + 2, limit: DOCTORS_PAGE_MAX }),
        ),
    );
    return [...first.items, ...rest.flatMap((r) => r.items)];
}

export async function getFeaturedDoctors(limit = 8) {
    const { items } = await getDoctors({ featured: true, limit });
    return items;
}

export async function getDoctorBySlug(slug) {
    "use cache";
    cacheTag("doctors", "departments", `doctor:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGet(`/doctors/${encodeURIComponent(slug)}`);
    const [{ doctors }, { departments }] = await Promise.all([
        import("@/data/doctors"),
        import("@/data/departments"),
    ]);
    const d = active(doctors).find((x) => x.slug === slug);
    return d ? clone(populate(d, new Map(departments.map((x) => [x._id, x])))) : null;
}

// Service-layer "populate" (the API will $lookup the same fields).
function populate(d, deptById) {
    const dept = deptById.get(d.department);
    return { ...d, department: dept ? { _id: dept._id, slug: dept.slug, name: dept.name } : null };
}
