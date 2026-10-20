import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getJobs } from "@/lib/api/pages";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const c = (await getDictionary(lang)).careers;
    return {
        title: c.eyebrow,
        description: c.metaDescription,
        alternates: { canonical: href(lang, "/careers") },
    };
}

export default async function CareersPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, jobs] = await Promise.all([getDictionary(lang), getJobs()]);
    const c = dict.careers;
    return (
        <>
            <PageHeader
                eyebrow={c.eyebrow}
                title=<Emphasis text={c.title} />
                lead={c.lead}
                media={media["header.careers"]}
                lang={lang}
            />
            <section aria-labelledby="jobs-title" className="bg-paper py-14 lg:py-20">
                <Container>
                    <h2 id="jobs-title" className="text-h2">
                        {c.openings}
                    </h2>
                    <ul className="mt-8 divide-y divide-line border-y border-line">
                        {jobs.map((j) => (
                            <li key={j._id}>
                                <Link
                                    href={href(lang, `/careers/${j.slug}`)}
                                    className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center"
                                >
                                    <span>
                                        <span className="block font-display text-[1.4rem] text-ink group-hover:text-teal-800">
                                            {t(j.title, lang)}
                                        </span>
                                        <span className="mt-1 block text-sm text-ink-2">
                                            {t(j.summary, lang)}
                                        </span>
                                        <span className="mt-2 block text-xs text-ink-3">
                                            {t(j.type, lang)} · {t(j.location, lang)}
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-800">
                                        {c.apply}
                                        <Icon
                                            name="arrow"
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>
        </>
    );
}
