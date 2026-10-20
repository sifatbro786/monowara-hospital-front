import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getManagement } from "@/lib/api/pages";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const a = (await getDictionary(lang)).about;
    return pageMeta({
        lang,
        path: "/about/management",
        title: a.management,
        description: a.managementLead,
    });
}

/** Management — the old site only had placeholders, so this renders an empty state until the
 *  hospital sends names, photos and messages (admin → Management). */
export default async function ManagementPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, people] = await Promise.all([getDictionary(lang), getManagement()]);
    const a = dict.about;
    const withMessage = people.filter((p) => t(p.message, lang));

    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.about, path: "/about" },
                    { name: dict.nav.management, path: "/about/management" },
                ])}
            />
            <PageHeader
                eyebrow={a.eyebrow}
                title=<>{a.management}</>
                lead={a.managementLead}
                media={media["header.management"]}
                lang={lang}
            />
            <section className="bg-paper py-14 lg:py-20">
                <Container>
                    {people.length === 0 ? (
                        <p className="max-w-xl rounded-3xl border border-dashed border-line p-8 text-ink-2">
                            {a.managementEmpty}
                        </p>
                    ) : (
                        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {people.map((p) => (
                                <li key={p._id}>
                                    <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-2xl bg-teal-100">
                                        {p.photo && (
                                            <Image
                                                src={p.photo}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1024px) 18rem, 45vw"
                                                className="object-cover object-top"
                                            />
                                        )}
                                    </div>
                                    <h2 className="mt-4 text-[1.25rem]">{t(p.name, lang)}</h2>
                                    <p className="text-sm text-ink-2">{t(p.role, lang)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Container>
            </section>
            {withMessage.map((p) => (
                <section key={p._id} className="border-t border-line bg-paper-2 py-14">
                    <Container className="max-w-3xl">
                        <p className="eyebrow">{a.message}</p>
                        <blockquote className="mt-4 font-display text-[1.4rem] leading-relaxed text-ink">
                            {t(p.message, lang)}
                        </blockquote>
                        <p className="mt-4 text-sm text-ink-2">
                            {t(p.name, lang)} · {t(p.role, lang)}
                        </p>
                    </Container>
                </section>
            ))}
        </>
    );
}
