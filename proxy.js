import { NextResponse } from "next/server";

// EN is the unprefixed canonical URL space; BN lives under /bn.
// /en/* is never public: redirect to the unprefixed URL (one canonical per page).
// Keep this file dependency-free (proxy may run separately from render code).
export function proxy(request) {
    const { pathname } = request.nextUrl;

    if (pathname === "/bn" || pathname.startsWith("/bn/")) return NextResponse.next();

    if (pathname === "/en" || pathname.startsWith("/en/")) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(3) || "/";
        return NextResponse.redirect(url, 308);
    }

    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        // Skip Next internals, VPS-served uploads, future API/admin, metadata files and anything with an extension.
        "/((?!_next|uploads|api|admin|robots.txt|sitemap.xml|manifest.webmanifest|favicon.ico|icon|apple-icon|.*\\..*).*)",
    ],
};
