import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, clone } from "./client";

/** GET /seo — every per-page override as { [path]: { title, description, image } }. */
export async function getSeoOverrides() {
    "use cache";
    cacheTag("seo");
    cacheLife("hours");

    const list = isStatic ? (await import("@/data/seo")).seo : ((await apiGet("/seo")) ?? []);
    return clone(
        Object.fromEntries(
            active(list).map(({ path, title, description, image }) => [
                path,
                { title, description, image },
            ]),
        ),
    );
}
