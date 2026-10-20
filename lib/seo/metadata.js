import { href } from "@/lib/i18n/config";
import en from "@/lib/i18n/dictionaries/en.json";
import bn from "@/lib/i18n/dictionaries/bn.json";

// One builder for every page's metadata. Next merges metadata *shallowly*, so a page that sets
// `alternates` or `openGraph` replaces the layout's whole object — this always returns the full set.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://monowarahospital.com"
).replace(/\/$/, "");

const META = { en: en.meta, bn: bn.meta };
const OG_LOCALE = { en: "en_US", bn: "bn_BD" };

/** Branded 1200×630 JPEG per language (scripts/og-card.py). JPEG, so WhatsApp/Facebook previews always work. */
export const defaultOgImage = (lang) => ({
    url: `/og/default-${lang === "bn" ? "bn" : "en"}.jpg`,
    width: 1200,
    height: 630,
    alt: META[lang === "bn" ? "bn" : "en"].legalName,
});

/** canonical + hreflang for a locale-less path ("/doctors/x"). x-default = EN (unprefixed). */
export function alternatesFor(lang, path = "/") {
    return {
        canonical: href(lang, path),
        languages: { en: href("en", path), bn: href("bn", path), "x-default": href("en", path) },
    };
}

/**
 * pageMeta({ lang, path, title, description, image?, imageAlt?, type?, absoluteTitle? })
 * `image` is a site path (e.g. "/uploads/doctors/x.webp"); the default card is always added after it
 * as a fallback for crawlers that skip WebP.
 */
export function pageMeta({
    lang,
    path = "/",
    title,
    description,
    image,
    imageAlt,
    type = "website",
    absoluteTitle = false,
    publishedTime,
    modifiedTime,
}) {
    const m = META[lang] || META.en;
    const fallback = defaultOgImage(lang);
    const images = image ? [{ url: image, alt: imageAlt || title }, fallback] : [fallback];
    const url = href(lang, path);

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: alternatesFor(lang, path),
        openGraph: {
            type,
            url,
            siteName: m.legalName,
            locale: OG_LOCALE[lang] || OG_LOCALE.en,
            alternateLocale: lang === "bn" ? [OG_LOCALE.en] : [OG_LOCALE.bn],
            title,
            description,
            images,
            ...(type === "article" && { publishedTime, modifiedTime }),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: images.map((i) => i.url),
        },
    };
}
