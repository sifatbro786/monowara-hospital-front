import Image from "next/image";
import Link from "next/link";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";

/** Article teaser. `large` = lead story layout (image left, text right on desktop). */
export function ArticleCard({ article, dict, lang, large = false, eager = false }) {
    const tp = dict.tips;
    const to = href(lang, `/health-tips/${article.slug}`);
    return (
        <article className={cn("group", large && "grid gap-6 lg:grid-cols-12 lg:items-center")}>
            <Link
                href={to}
                tabIndex={-1}
                aria-hidden
                className={cn(
                    "relative block overflow-hidden rounded-3xl bg-teal-100",
                    large ? "aspect-16/10 lg:col-span-7" : "aspect-4/3",
                )}
            >
                {article.image && (
                    <Image
                        src={article.image}
                        alt=""
                        fill
                        loading={eager ? "eager" : "lazy"}
                        sizes={
                            large
                                ? "(min-width: 1024px) 46rem, 92vw"
                                : "(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw"
                        }
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                )}
            </Link>
            <div className={cn(large ? "lg:col-span-5" : "mt-4")}>
                <p className="text-xs font-semibold text-teal-700">
                    {tp.categories[article.category]} ·{" "}
                    <span className="font-normal text-ink-3">
                        {tp.read.replace("{n}", digits(article.readMinutes, lang))}
                    </span>
                </p>
                <h3 className={cn("mt-2 leading-snug", large ? "text-h2" : "text-[1.3rem]")}>
                    <Link href={to} className="hover:text-teal-800">
                        {t(article.title, lang)}
                    </Link>
                </h3>
                <p className={cn("mt-2 text-ink-2", large ? "text-lg" : "text-sm")}>
                    {t(article.excerpt, lang)}
                </p>
            </div>
        </article>
    );
}
