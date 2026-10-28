import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * POST /api/revalidate { tags: ["doctors", …] } — called by mh-back after every admin save
 * (mh-back src/lib/revalidate.js), header `x-revalidate-secret: <REVALIDATE_SECRET>`.
 * VPS: mh-back calls http://127.0.0.1:3000/api/revalidate on loopback. Nginx should not expose
 * /api/revalidate publicly (B4); the secret still guards it if it does.
 *
 * `{ expire: 0 }`: the next visit renders fresh instead of showing the stale page once — staff check
 * the site right after saving. Tags are the cacheTag names used in lib/api/*.
 */
const SECRET = process.env.REVALIDATE_SECRET || "";
const TAG = /^[a-z][a-z0-9-]{0,40}(?::[a-z0-9-]{1,160})?$/;

function authorised(given) {
    if (SECRET.length < 32 || !given) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(SECRET);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
    if (!authorised(request.headers.get("x-revalidate-secret"))) {
        return Response.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
    }
    let tags;
    try {
        ({ tags } = await request.json());
    } catch {
        tags = null;
    }
    if (!Array.isArray(tags) || !tags.length || tags.length > 40 || !tags.every((t) => typeof t === "string" && TAG.test(t))) {
        return Response.json({ error: { code: "VALIDATION" } }, { status: 400 });
    }
    for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 });
    return Response.json({ data: { revalidated: [...new Set(tags)] } });
}
