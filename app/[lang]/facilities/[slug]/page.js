import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getFacilities, getFacilityBySlug } from "@/lib/api/services";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

export async function generateStaticParams() {
    return (await getFacilities()).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const item = await getFacilityBySlug(slug);
    if (!item) return {};
    return {
        title: t(item.name, lang),
        description: t(item.summary, lang),
        alternates: { canonical: href(lang, `/facilities/${slug}`) },
        openGraph: item.image ? { images: [item.image] } : undefined,
    };
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
    return (
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
