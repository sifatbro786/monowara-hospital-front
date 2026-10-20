import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, clone } from "./client";

/** GET /media — every image slot as { [key]: { src, alt, position, overlay } }.
 *  Admin → Media management saves a slot → revalidateTag("media"). */
export async function getMedia() {
    "use cache";
    cacheTag("media");
    cacheLife("hours");

    const list = isStatic ? (await import("@/data/media")).media : ((await apiGet("/media")) ?? []);
    return clone(
        Object.fromEntries(
            active(list).map(({ key, src, alt, position, overlay }) => [
                key,
                { src, alt, position, overlay },
            ]),
        ),
    );
}
