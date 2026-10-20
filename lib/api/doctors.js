import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

/** Mirrors the future Mongo query: GET /doctors?department=&day=&q=&featured=&page=&limit= */
export async function getDoctors({ department, day, q, featured, page = 1, limit = 100 } = {}) {
    "use cache";
    cacheTag("doctors");
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

export async function getFeaturedDoctors(limit = 8) {
    const { items } = await getDoctors({ featured: true, limit });
    return items;
}

export async function getDoctorBySlug(slug) {
    "use cache";
    cacheTag("doctors", `doctor:${slug}`);
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
