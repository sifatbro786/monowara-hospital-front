import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDiagnostics, getDiagnosticBySlug } from "@/lib/api/services";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export async function generateStaticParams() {
    return (await getDiagnostics()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const item = await getDiagnosticBySlug(slug);
    if (!item) return {};
    return pageMeta({
        lang,
        path: `/diagnostics/${slug}`,
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
