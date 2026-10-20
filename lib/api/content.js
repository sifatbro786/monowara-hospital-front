import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, active, byOrder, clone } from "./client";

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

/** GET /articles?category= — Health Tips & News, newest first. */
export async function getArticles({ category } = {}) {
    "use cache";
    cacheTag("articles");
    cacheLife("hours");

    if (!isStatic) return (await apiGet("/articles", { category })) ?? [];
    const { articles } = await import("@/data/articles");
    return clone(
        active(articles)
            .filter((a) => !category || a.category === category)
            .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1) || byOrder(a, b)),
    );
}

/** GET /articles/:slug */
export async function getArticleBySlug(slug) {
    "use cache";
    cacheTag("articles", `article:${slug}`);
    cacheLife("hours");

    if (!isStatic) return apiGet(`/articles/${encodeURIComponent(slug)}`);
    const { articles } = await import("@/data/articles");
    const doc = active(articles).find((a) => a.slug === slug);
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
