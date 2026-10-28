import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, apiGetBySlug, active, byOrder, clone } from "./client";

/** GET /hero — active slides, ordered. */
export async function getHero() {
    "use cache";
    cacheTag("hero");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/hero")) ?? [];
    const { heroSlides } = await import("@/data/hero");
    return clone(active(heroSlides).sort(byOrder));
}

/** GET /faqs?category= */
export async function getFaqs({ category } = {}) {
    "use cache";
    cacheTag("faqs");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/faqs", { category })) ?? [];
    const { faqs } = await import("@/data/faqs");
    return clone(
        active(faqs)
            .filter((f) => !category || f.category === category)
            .sort(byOrder),
    );
}

/** GET /home — admin-editable homepage blocks (numbers, centres, talks, stories). */
export async function getHomeContent() {
    "use cache";
    cacheTag("home");
    cacheLife("hours");

    if (!isStatic)
        return (await apiGet("/home")) ?? { keyNumbers: [], centres: [], talks: [], stories: [] };
    const { keyNumbers, centres, talks, stories } = await import("@/data/home");
    const prep = (arr) => clone(active(arr).sort(byOrder));
    return {
        keyNumbers: prep(keyNumbers),
        centres: prep(centres),
        talks: prep(talks),
        stories: prep(stories),
    };
}

/**
 * Articles the public may see = active AND published (a future `publishedAt` is "Scheduled" in the
 * dashboard). The cache lives ≤ 1 h ("hours"), so a scheduled article appears within the hour.
 * Byline: author / reviewedBy → { _id, slug, name, designation, photo } of an active doctor, else null.
 * "doctors" tag: a renamed or hidden doctor updates the byline.
 */
async function staticArticles() {
    const [{ articles }, { doctors }] = await Promise.all([
        import("@/data/articles"),
        import("@/data/doctors"),
    ]);
    const byId = new Map(active(doctors).map((d) => [d._id, d]));
    const byline = (id) => {
        const d = id && byId.get(id);
        return d
            ? { _id: d._id, slug: d.slug, name: d.name, designation: d.designation, photo: d.photo }
            : null;
    };
    const now = new Date().toISOString();
    return active(articles)
        .filter((a) => !a.publishedAt || new Date(a.publishedAt).toISOString() <= now)
        .map((a) => ({ ...a, author: byline(a.author), reviewedBy: byline(a.reviewedBy) }));
}

/** GET /articles?category= — Health Tips & News, newest first. */
export async function getArticles({ category } = {}) {
    "use cache";
    cacheTag("articles", "doctors");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/articles", { category })) ?? [];
    return clone(
        (await staticArticles())
            .filter((a) => !category || a.category === category)
            // Equal dates must return 0-then-order, or same-day articles come out reversed (= API sort).
            .sort((a, b) =>
                a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : byOrder(a, b),
            ),
    );
}

/** GET /articles/:slug */
export async function getArticleBySlug(slug) {
    "use cache";
    cacheTag("articles", "doctors", `article:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGetBySlug("/articles", slug);
    const doc = (await staticArticles()).find((a) => a.slug === slug);
    return doc ? clone(doc) : null;
}

/** GET /gallery */
export async function getGallery() {
    "use cache";
    cacheTag("gallery");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/gallery")) ?? [];
    const { gallery } = await import("@/data/gallery");
    return clone(active(gallery).sort(byOrder));
}
