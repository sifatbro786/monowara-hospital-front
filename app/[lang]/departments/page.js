import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getDepartments } from "@/lib/api/departments";
import { getFacilities, getDiagnostics } from "@/lib/api/services";
import { getDoctors } from "@/lib/api/doctors";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const d = (await getDictionary(lang)).departments;
    return {
        title: d.eyebrow,
        description: d.metaDescription,
        alternates: { canonical: href(lang, "/departments") },
    };
}

/** Departments index — editorial numbered list (no icon-card grid), then facilities & diagnostics. */
export default async function DepartmentsPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, departments, facilities, diagnostics, { items: doctors }] = await Promise.all([
        getDictionary(lang),
        getDepartments(),
        getFacilities(),
        getDiagnostics(),
        getDoctors({ limit: 500 }),
    ]);
    const d = dict.departments;
    const count = new Map();
    for (const doc of doctors) {
        const id = doc.department?._id;
        if (id) count.set(id, (count.get(id) || 0) + 1);
    }
    const label = (n) =>
        n === 1 ? d.doctorsOne : d.doctorsCount.replace("{count}", digits(n, lang));

    return (
        <>
            <PageHeader
                eyebrow={d.eyebrow}
                title=<Emphasis text={d.title} />
                lead={d.lead.replace("{count}", digits(departments.length, lang))}
                media={media["header.departments"]}
                lang={lang}
            />

            <section className="bg-paper py-12 lg:py-16">
                <Container>
                    <ol className="grid border-t border-line md:grid-cols-2 md:gap-x-12">
                        {departments.map((x, i) => (
                            <li key={x._id} className="border-b border-line">
                                <Link
                                    href={href(lang, `/departments/${x.slug}`)}
                                    className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-6"
                                >
                                    <span className="font-display text-sm italic tabular-nums text-teal-700">
                                        {digits(String(i + 1).padStart(2, "0"), lang)}
                                    </span>
                                    <span>
                                        <span className="block font-display text-[1.4rem] leading-snug text-ink group-hover:text-teal-800">
                                            {t(x.name, lang)}
                                        </span>
                                        <span className="mt-1 block text-sm text-ink-2">
                                            {t(x.summary, lang)}
                                        </span>
                                        {count.get(x._id) > 0 && (
                                            <span className="mt-2 block text-xs font-medium text-teal-700">
                                                {label(count.get(x._id))}
                                            </span>
                                        )}
                                    </span>
                                    <Icon
                                        name="arrow"
                                        size={18}
                                        className="text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-teal-700"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <section className="bg-mint py-14 lg:py-20">
                <Container className="grid gap-12 lg:grid-cols-2">
                    <LinkList
                        title={d.facilitiesTitle}
                        items={facilities}
                        base="/facilities"
                        lang={lang}
                        tag={(f) => (f.is24x7 ? "24/7" : null)}
                    />
                    <LinkList
                        title={d.diagnosticsTitle}
                        items={diagnostics}
                        base="/diagnostics"
                        lang={lang}
                    />
                </Container>
            </section>
        </>
    );
}

function LinkList({ title, items, base, lang, tag }) {
    return (
        <div>
            <h2 className="text-h3">{title}</h2>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {items.map((x) => (
                    <li key={x._id}>
                        <Link
                            href={href(lang, `${base}/${x.slug}`)}
                            className="group flex items-center justify-between gap-4 py-4"
                        >
                            <span className="text-ink group-hover:text-teal-800">
                                {t(x.name, lang)}
                            </span>
                            <span className="flex items-center gap-3">
                                {tag?.(x) && (
                                    <span className="rounded-pill bg-card px-2 py-0.5 text-[0.7rem] font-semibold text-teal-800">
                                        {digits(tag(x), lang)}
                                    </span>
                                )}
                                <Icon name="arrow" size={16} className="text-ink-3" />
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
