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
