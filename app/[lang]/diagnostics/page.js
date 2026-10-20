import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getDiagnostics } from "@/lib/api/services";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const s = (await getDictionary(lang)).services;
    return {
        title: s.diagnosticsEyebrow,
        description: s.metaDiagnostics,
        alternates: { canonical: href(lang, "/diagnostics") },
    };
}

/** Diagnostics index — information only (no test-report feature, per client). */
export default async function DiagnosticsPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, items] = await Promise.all([getDictionary(lang), getDiagnostics()]);
    const s = dict.services;

    return (
        <>
            <PageHeader
                eyebrow={s.diagnosticsEyebrow}
                title=<Emphasis text={s.diagnosticsTitle} />
                lead={s.diagnosticsLead}
                media={media["header.diagnostics"]}
                lang={lang}
            />
            <section className="bg-paper py-12 lg:py-16">
                <Container>
                    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((x, i) => (
                            <li key={x._id}>
                                <Link
                                    href={href(lang, `/diagnostics/${x.slug}`)}
                                    className="group block"
                                >
                                    <span className="relative block aspect-4/3 overflow-hidden rounded-3xl bg-teal-100">
                                        {x.image && (
                                            <Image
                                                src={x.image}
                                                alt=""
                                                fill
                                                loading={i < 3 ? "eager" : "lazy"}
                                                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw"
                                                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                                            />
                                        )}
                                    </span>
                                    <span className="mt-4 flex items-baseline justify-between gap-3 border-b border-line pb-3">
                                        <span className="font-display text-[1.35rem] leading-snug text-ink group-hover:text-teal-800">
                                            {t(x.name, lang)}
                                        </span>
                                        <Icon
                                            name="arrow"
                                            size={16}
                                            className="shrink-0 text-ink-3"
                                        />
                                    </span>
                                    <span className="mt-2 block text-sm text-ink-2">
                                        {t(x.summary, lang)}
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
