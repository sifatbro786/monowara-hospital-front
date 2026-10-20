import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getHero, getHomeContent } from "@/lib/api/content";
import { getDepartments } from "@/lib/api/departments";
import { getPackages } from "@/lib/api/packages";
import { getFeaturedDoctors } from "@/lib/api/doctors";
import { Hero } from "@/components/home/Hero";
import { QuickPanel } from "@/components/home/QuickPanel";
import { Centres, Maternity, Packages, VisitUs, CtaBand } from "@/components/home/Sections";
import { Doctors, Talks } from "@/components/home/People";
import { pageMeta } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const { meta } = await getDictionary(lang);
    return pageMeta({
        lang,
        path: "/",
        title: `${meta.siteName} — ${meta.tagline}`,
        absoluteTitle: true,
        description: meta.description,
    });
}

// Homepage — section order follows the client's chosen concept (MH_Website_Concept.pdf).
export default async function Home({ params }) {
    const { lang } = await params;
    const [dict, settings, slides, home, departments, packages, doctors] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getHero(),
        getHomeContent(),
        getDepartments(),
        getPackages({ featured: true }),
        getFeaturedDoctors(9),
    ]);

    const by = (c) => packages.filter((p) => p.category === c);

    return (
        <>
            {slides[0] && <Hero slide={slides[0]} settings={settings} dict={dict} lang={lang} />}
            <QuickPanel departments={departments} settings={settings} dict={dict} lang={lang} />
            <Centres items={home.centres} dict={dict} lang={lang} />
            <Maternity packages={by("maternity")} dict={dict} lang={lang} />
            <Packages checkups={by("checkup")} surgical={by("surgical")} dict={dict} lang={lang} />
            <Doctors doctors={doctors} settings={settings} dict={dict} lang={lang} />
            <Talks talks={home.talks} settings={settings} dict={dict} lang={lang} />
            <VisitUs settings={settings} dict={dict} lang={lang} />
            <CtaBand settings={settings} dict={dict} lang={lang} />
        </>
    );
}
