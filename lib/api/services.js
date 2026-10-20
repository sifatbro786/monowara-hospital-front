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

/** GET /diagnostics */
export async function getDiagnostics() {
    "use cache";
    cacheTag("diagnostics");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/diagnostics")) ?? [];
    const { diagnostics } = await import("@/data/diagnostics");
    return clone(active(diagnostics).sort(byOrder));
}
