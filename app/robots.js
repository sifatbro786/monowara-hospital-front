// Demo/preview deploys are never indexed. Flip NEXT_PUBLIC_SITE_ENV=production on the VPS.
export default function robots() {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://monowarahospital.com";
    if (process.env.NEXT_PUBLIC_SITE_ENV !== "production") {
        return { rules: [{ userAgent: "*", disallow: "/" }] };
    }
    return {
        rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
        sitemap: `${site}/sitemap.xml`,
    };
}
