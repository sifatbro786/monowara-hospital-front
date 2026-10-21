import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

/** Package card — name, summary, first inclusions, Details link + Call for Price. */
export function PackageCard({ pkg, dict, lang }) {
    const name = t(pkg.name, lang);
    return (
        <article className="flex h-full flex-col rounded-card bg-card p-6 shadow-[0_1px_0_rgb(12_42_45/0.04),0_18px_40px_-28px_rgb(7_38_41/0.4)]">
            <h3 className="text-[1.3rem] leading-snug">
                <Link href={href(lang, `/packages/${pkg.slug}`)} className="hover:text-teal-800">
                    {name}
                </Link>
            </h3>
            <p className="mt-2 text-sm text-ink-2">{t(pkg.summary, lang)}</p>
            {pkg.inclusions?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                    {pkg.inclusions.slice(0, 4).map((x) => (
                        <li
                            key={x.en}
                            className="rounded-pill bg-paper px-2.5 py-1 text-xs text-ink-2"
                        >
                            {t(x, lang)}
                        </li>
                    ))}
                </ul>
            )}
            {pkg.typicalStay && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-3">
                    <Icon name="clock" size={13} className="text-teal-700" />
                    {t(pkg.typicalStay, lang)}
                </p>
            )}
            <div className="mt-auto flex items-center gap-3 pt-6">
                <Button
                    appointment
                    kind="package"
                    context={name}
                    variant="price"
                    className="flex-1"
                >
                    {dict.cta.callForPrice}
                </Button>
                <Link
                    href={href(lang, `/packages/${pkg.slug}`)}
                    aria-label={`${dict.cta.learnMore} — ${name}`}
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:border-teal-600/50 hover:text-teal-800"
                >
                    <Icon name="arrow" size={17} />
                </Link>
            </div>
        </article>
    );
}
