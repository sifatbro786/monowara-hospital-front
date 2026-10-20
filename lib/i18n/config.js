// Single source of truth for locales. EN is served unprefixed (proxy rewrite), BN under /bn.
export const locales = ["en", "bn"];
export const defaultLocale = "en";

export const hasLocale = (value) => locales.includes(value);

/** Build a locale-aware href. href("bn", "/doctors") -> "/bn/doctors"; href("en", "/doctors") -> "/doctors" */
export function href(lang, path = "/") {
    const clean = path.startsWith("/") ? path : `/${path}`;
    if (lang === defaultLocale) return clean;
    return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Strip a locale prefix from a visible pathname. "/bn/doctors" -> "/doctors" */
export function stripLocale(pathname = "/") {
    for (const l of locales) {
        if (pathname === `/${l}`) return "/";
        if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
    }
    return pathname;
}

export function localeFromPath(pathname = "/") {
    return pathname === "/bn" || pathname.startsWith("/bn/") ? "bn" : defaultLocale;
}
