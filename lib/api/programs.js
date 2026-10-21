import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, clone } from "./client";
import { getAllDoctors } from "./doctors";

/** GET /bhrpc — high-risk pregnancy programme singleton with populated team. */
export async function getBhrpc() {
    "use cache";
    cacheTag("bhrpc", "doctors", "departments");
    cacheLife("hours");

    if (!isStatic) return apiGet("/bhrpc");
    const [{ bhrpc }, items] = await Promise.all([import("@/data/bhrpc"), getAllDoctors()]);
    const byId = new Map(items.map((d) => [d._id, d]));
    return clone({ ...bhrpc, doctors: bhrpc.doctors.map((id) => byId.get(id)).filter(Boolean) });
}
