import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { notFound, permanentRedirect } from "next/navigation";
import { href } from "@/lib/i18n/config";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getFacilities, getFacilityBySlug } from "@/lib/api/services";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

// B3: a save in the dashboard → the next request waits for the fresh page (no stale App Shell); new
// slugs are served complete on first visit. See app/[lang]/doctors/[slug]/page.js.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
    return (await getFacilities()).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const item = await getFacilityBySlug(slug);
    if (!item) return {};
    return pageMeta({
        lang,
        path: `/facilities/${item.slug}`, // canonical = current slug (old slugs redirect)
        title: t(item.name, lang),
        description: t(item.summary, lang),
        image: item.image,
    });
}

async function FacilityPageContent({ params }) {
    const { lang, slug } = await params;
    const [item, all, dict, settings] = await Promise.all([
        getFacilityBySlug(slug),
        getFacilities(),
        getDictionary(lang),
        getSettings(),
    ]);
    if (!item) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (item.slug !== slug) permanentRedirect(href(lang, `/facilities/${item.slug}`));
    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.facilities, path: "/departments" },
                    { name: item.name, path: `/facilities/${item.slug}` },
                ])}
            />
            <ServiceDetail
                item={item}
                siblings={all.filter((x) => x.slug !== slug)}
                base="/facilities"
                eyebrow={dict.services.facilitiesEyebrow}
                backHref="/departments"
                settings={settings}
                dict={dict}
                lang={lang}
            />
        </>
    );
}

// params are URL data → read inside <Suspense> so the shared App Shell stays URL-independent
// (partialPrefetching). generateStaticParams still prerenders every page in full.
export default function FacilityPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <FacilityPageContent params={params} />
        </Suspense>
    );
}
