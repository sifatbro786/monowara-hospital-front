import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeaderNav, HeaderShell } from "./HeaderNav";
import { MobileNav } from "./MobileNav";
import { getNavigation } from "@/lib/api/navigation";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

/** Resolve dictionary keys / {en,bn} labels and locale hrefs on the server. */
function resolveNav(nav, dict, lang) {
    const label = (i) => (i.key ? dict.nav[i.key] : t(i.label, lang));
    const link = (i) => ({
        label: label(i),
        href: href(lang, i.href),
        featured: !!i.featured,
        badge: i.badge || null,
        tone: i.tone || null,
    });
    return nav.map((item) => ({
        key: item.key,
        label: label(item),
        href: href(lang, item.href),
        menu: item.menu?.map(link) ?? null,
        mega: item.mega
            ? {
                  columns: item.mega.columns.map((c) => ({
                      title: dict.nav[c.key],
                      items: c.items.map(link),
                  })),
                  all: { label: dict.nav[item.mega.allKey], href: href(lang, item.href) },
              }
            : null,
    }));
}

export async function Header({ settings, dict, lang }) {
    const nav = resolveNav(await getNavigation(), dict, lang);
    const home = href(lang, "/");

    return (
        <HeaderShell>
            <Container className="flex h-18 items-center gap-6 lg:h-20">
                <Link href={home} className="shrink-0" aria-label={dict.meta.legalName}>
                    <Image
                        src="/logo.png"
                        alt={dict.meta.legalName}
                        width={300}
                        height={64}
                        priority
                        className="h-10 w-auto lg:h-11"
                    />
                </Link>

                <HeaderNav items={nav} lang={lang} />

                <div className="ml-auto flex">
                    {/* <a
                        href={telHref(settings.hotline)}
                        className="hidden items-center gap-2 rounded-pill px-3 py-2 text-sm text-ink-2 hover:text-ink 2xl:flex"
                    >
                        <Icon name="phone" size={16} className="text-teal-700" />
                        <span className="tabular-nums">{digits(formatPhone(settings.hotline), lang)}</span>
                    </a> */}
                    {/* wrapper owns visibility: Button's own inline-flex would fight `hidden` */}
                    <span className="hidden sm:block">
                        <Button href={href(lang, "/appointment")} size="md">
                            <Icon name="calendar" size={18} />
                            {dict.nav.book}
                        </Button>
                    </span>
                    <MobileNav items={nav} dict={dict} settings={settings} lang={lang} />
                </div>
            </Container>
        </HeaderShell>
    );
}
