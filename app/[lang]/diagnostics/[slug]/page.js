import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { notFound, permanentRedirect } from "next/navigation";
import { href } from "@/lib/i18n/config";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDiagnostics, getDiagnosticBySlug } from "@/lib/api/services";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

// B3: a save in the dashboard → the next request waits for the fresh page (no stale App Shell); new
// slugs are served complete on first visit. See app/[lang]/doctors/[slug]/page.js.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
    return (await getDiagnostics()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const item = await getDiagnosticBySlug(slug);
    if (!item) return {};
    return pageMeta({
        lang,
        path: `/diagnostics/${item.slug}`, // canonical = current slug (old slugs redirect)
        title: t(item.name, lang),
        description: t(item.summary, lang),
        image: item.image,
    });
}

async function DiagnosticPageContent({ params }) {
    const { lang, slug } = await params;
    const [item, all, dict, settings] = await Promise.all([
        getDiagnosticBySlug(slug),
        getDiagnostics(),
        getDictionary(lang),
        getSettings(),
    ]);
    if (!item) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (item.slug !== slug) permanentRedirect(href(lang, `/diagnostics/${item.slug}`));
    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.diagnostics, path: "/diagnostics" },
                    { name: item.name, path: `/diagnostics/${item.slug}` },
                ])}
            />
            <ServiceDetail
                item={item}
                siblings={all.filter((x) => x.slug !== slug)}
                base="/diagnostics"
                eyebrow={dict.services.diagnosticsEyebrow}
                backHref="/diagnostics"
                settings={settings}
                dict={dict}
                lang={lang}
            />
        </>
    );
}

// params are URL data → read inside <Suspense> so the shared App Shell stays URL-independent
// (partialPrefetching). generateStaticParams still prerenders every page in full.
export default function DiagnosticPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DiagnosticPageContent params={params} />
        </Suspense>
    );
}
