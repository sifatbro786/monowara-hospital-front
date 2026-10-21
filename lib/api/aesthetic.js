import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";
import { getAllDoctors } from "./doctors";

/** GET /aesthetic — sub-brand singleton with treatments and populated team. */
export async function getAesthetic() {
    "use cache";
    cacheTag("aesthetic", "doctors", "departments");
    cacheLife("hours");

    if (!isStatic) return apiGet("/aesthetic");
    const [{ aesthetic }, items] = await Promise.all([import("@/data/aesthetic"), getAllDoctors()]);
    const byId = new Map(items.map((d) => [d._id, d]));
    return clone({
        ...aesthetic,
        treatments: active(aesthetic.treatments).sort(byOrder),
        doctors: aesthetic.doctors.map((id) => byId.get(id)).filter(Boolean),
    });
}
