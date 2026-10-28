import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/services/Blocks";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSitePage, getManagement } from "@/lib/api/pages";
import { getBhrpc } from "@/lib/api/programs";
import { getAesthetic } from "@/lib/api/aesthetic";
import { getMedia } from "@/lib/api/media";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const page = await getSitePage("about");
    return page
        ? pageMeta({
              lang,
              path: "/about",
              title: t(page.title, lang),
              description: t(page.summary, lang),
          })
        : {};
}

export default async function AboutPage({ params }) {
    const { lang } = await params;
    const [dict, page, bhrpc, aesthetic, media, people] = await Promise.all([
        getDictionary(lang),
        getSitePage("about"),
        getBhrpc(),
        getAesthetic(),
        getMedia(),
        getManagement(),
    ]);
    if (!page) notFound();
    const a = dict.about;
    const hero = media["header.about"];
    const units = [
        { to: "/bhrpc", eyebrow: bhrpc.short, title: bhrpc.name, body: bhrpc.tagline },
        {
            to: "/mh-aesthetic",
            eyebrow: "MH Aesthetic",
            title: aesthetic.name,
            body: aesthetic.tagline,
        },
    ];

    return (
        <>
            <header className="relative isolate overflow-hidden border-b border-line bg-[#e4f1f2]">
                <Image
                    src={hero.src}
                    alt={t(hero.alt, lang)}
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="100vw"
                    className="-z-20 object-cover"
                    style={{ objectPosition: hero.position }}
                />
                {/* paper wash on the copy side only; the photo's own sky does the rest */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-r from-paper/95 via-paper/75 to-transparent max-lg:via-paper/85 max-lg:to-paper/40"
                />
                <Container className="flex min-h-[26rem] items-center py-16 lg:min-h-[34rem] lg:py-24">
                    <div className="max-w-xl">
                        <p className="eyebrow">{a.eyebrow}</p>
                        <h1 className="mt-4 text-h1">{t(page.title, lang)}</h1>
                        <p className="mt-4 text-lg text-ink-2">{t(page.summary, lang)}</p>
                    </div>
                </Container>
            </header>

            <section className="bg-paper py-14 lg:py-20">
                <Container>
                    <Prose text={t(page.body, lang)} className="max-w-3xl" />
                </Container>
            </section>

            <section aria-labelledby="about-why" className="bg-paper-2 py-14 lg:py-20">
                <Container>
                    <h2 id="about-why" className="text-h2">
                        {a.why}
                    </h2>
                    <ol className="mt-10 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                        {page.pillars.map((p, i) => (
                            <li key={i}>
                                <span className="font-display text-sm tabular-nums text-teal-700">
                                    {digits(String(i + 1).padStart(2, "0"), lang)}
                                </span>
                                <h3 className="mt-3 text-[1.25rem]">{t(p.title, lang)}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {t(p.body, lang)}
                                </p>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <section className="bg-teal-950 py-14 text-paper lg:py-20">
                <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    {[
                        [a.mission, page.mission],
                        [a.vision, page.vision],
                    ].map(([k, v]) => (
                        <div key={k} className="border-t border-paper/20 pt-6">
                            <p className="eyebrow text-teal-300">{k}</p>
                            <p className="mt-4 font-display text-[1.5rem] leading-snug text-paper sm:text-[1.75rem]">
                                {t(v, lang)}
                            </p>
                        </div>
                    ))}
                </Container>
            </section>

            <section aria-labelledby="about-units" className="bg-paper py-14 lg:py-20">
                <Container>
                    <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
                        <h2 id="about-units" className="text-h2 lg:col-span-6">
                            {a.units}
                        </h2>
                        <p className="text-ink-2 lg:col-span-6 lg:text-right">{a.unitsLead}</p>
                    </div>
                    <ul className="mt-10 grid gap-5 lg:grid-cols-2">
                        {units.map((u) => (
                            <li key={u.to}>
                                <Link
                                    href={href(lang, u.to)}
                                    className="group flex h-full flex-col rounded-3xl border border-line bg-card p-7 transition-colors hover:border-teal-600/40 sm:p-9"
                                >
                                    <span className="eyebrow">{u.eyebrow}</span>
                                    <span className="mt-4 font-display text-[1.6rem] leading-snug text-ink group-hover:text-teal-800">
                                        {t(u.title, lang)}
                                    </span>
                                    <span className="mt-3 text-ink-2">{t(u.body, lang)}</span>
                                    <Icon
                                        name="arrow"
                                        size={20}
                                        className="mt-8 text-teal-700 transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {people.length > 0 && (
                        <div className="mt-14 border-t border-line pt-8">
                            <p className="eyebrow">{a.management}</p>
                            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {people.slice(0, 4).map((p) => (
                                    <li key={p._id} className="flex items-center gap-4">
                                        <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-teal-100">
                                            {p.photo && (
                                                <Image
                                                    src={p.photo}
                                                    alt=""
                                                    fill
                                                    sizes="4rem"
                                                    className="object-cover object-top"
                                                />
                                            )}
                                        </span>
                                        <span className="leading-snug">
                                            <span className="block font-medium text-ink">
                                                {t(p.name, lang)}
                                            </span>
                                            <span className="block text-sm text-ink-2">
                                                {t(p.role, lang)}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-12 flex flex-wrap gap-3">
                        <Button href={href(lang, "/doctors")} variant="ink">
                            {a.meetDoctors}
                        </Button>
                        <Button href={href(lang, "/about/management")} variant="outline">
                            {a.management}
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    );
}
