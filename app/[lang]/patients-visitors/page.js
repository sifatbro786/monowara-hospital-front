import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getSitePage } from "@/lib/api/pages";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const page = await getSitePage("patients-visitors");
    return page
        ? {
              title: t(page.title, lang),
              description: t(page.summary, lang),
              alternates: { canonical: href(lang, "/patients-visitors") },
          }
        : {};
}

/** Patients & visitors — anchored sections (#visiting-hours, #admission, #corporate-insurance
 *  are linked from the main menu), sticky contents list on desktop. */
export default async function PatientsVisitorsPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, settings, page] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getSitePage("patients-visitors"),
    ]);
    if (!page) notFound();
    const pv = dict.pv;

    return (
        <>
            <PageHeader
                eyebrow={pv.eyebrow}
                title=<>{t(page.title, lang)}</>
                lead={t(page.summary, lang)}
                media={media["header.patientsVisitors"]}
                lang={lang}
            />
            <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
                <nav aria-label={pv.contents} className="lg:col-span-3">
                    <div className="lg:sticky lg:top-28">
                        <p className="eyebrow">{pv.contents}</p>
                        <ol className="mt-4 space-y-2 text-sm">
                            {page.sections.map((s, i) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        className="flex gap-3 text-ink-2 hover:text-teal-800"
                                    >
                                        <span className="w-5 font-display tabular-nums text-teal-700">
                                            {digits(i + 1, lang)}
                                        </span>
                                        {t(s.heading, lang)}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </nav>
                <div className="space-y-14 lg:col-span-8 lg:col-start-5">
                    {page.sections.map((s) => (
                        <section
                            key={s.id}
                            id={s.id}
                            aria-labelledby={`${s.id}-h`}
                            className="scroll-mt-28 border-t border-line pt-8"
                        >
                            <h2 id={`${s.id}-h`} className="text-h2">
                                {t(s.heading, lang)}
                            </h2>
                            <p className="mt-4 text-lg leading-relaxed text-ink-2">
                                {t(s.body, lang)}
                            </p>
                            {s.points?.length > 0 && (
                                <ul className="mt-6 divide-y divide-line border-y border-line">
                                    {s.points.map((p, i) => (
                                        <li key={i} className="flex gap-3 py-3 text-ink">
                                            <Icon
                                                name="check"
                                                size={18}
                                                className="mt-0.5 shrink-0 text-teal-700"
                                            />
                                            {t(p, lang)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {s.confirm && <p className="mt-4 text-sm text-ink-3">{pv.confirm}</p>}
                            {s.link && (
                                <Link
                                    href={href(lang, s.link.href)}
                                    className="link-underline mt-5 inline-block text-teal-700"
                                >
                                    {t(s.link.label, lang)}
                                </Link>
                            )}
                        </section>
                    ))}
                    <div className="rounded-3xl bg-mint p-6 sm:p-8">
                        <h2 className="text-h3">{pv.help}</h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Button href={telHref(settings.hotline)} variant="ink">
                                <Icon name="phone" size={17} />
                                <span className="tabular-nums">
                                    {digits(formatPhone(settings.hotline), lang)}
                                </span>
                            </Button>
                            <Button href={href(lang, "/contact")} variant="outline">
                                {dict.nav.contact}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
