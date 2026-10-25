import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { HeroCarousel } from "./HeroCarousel";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

/**
 * Hero in the client's concept layout (MH_Website_Concept.pdf): teal band with a rounded bottom,
 * the search card (QuickPanel) overlapping the bottom edge.
 * 2026-10-25 (client): full-bleed background-photo slider (Swiper) over `heroSlides`
 * (Admin → Hero slider). Only copy + photo change per slide; the actions below are common and
 * rendered here on the server.
 */
export function Hero({ slides, settings, dict, lang }) {
    const h = dict.home;
    const wa = settings.primaryWhatsapp;
    const items = slides
        .filter((s) => s.image?.src)
        .map((s) => ({
            id: s._id,
            eyebrow: t(s.eyebrow, lang),
            title: t(s.title, lang),
            subtitle: t(s.subtitle, lang),
            label: t(s.label, lang) || t(s.eyebrow, lang),
            image: { src: s.image.src, alt: t(s.image.alt, lang), position: s.image.position },
        }));
    if (!items.length) return null;

    const actions = (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <Button href={href(lang, "/appointment")} size="lg" variant="onTeal">
                    {dict.cta.book}
                    <Icon name="arrow" size={18} />
                </Button>
                <a
                    href={telHref(settings.emergency)}
                    className="inline-flex min-h-13 items-center gap-2.5 rounded-pill border border-white/30 px-5 text-[0.95rem] font-medium text-white transition-colors hover:border-white/70 hover:bg-white/5"
                >
                    <span className="relative flex size-2.5" aria-hidden>
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff2d20]/70 motion-reduce:hidden" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-[#ff2d20]" />
                    </span>
                    {dict.cta.emergency}:
                    <span className="tabular-nums">
                        {digits(formatPhone(settings.emergency), lang)}
                    </span>
                </a>
            </div>

            {wa && (
                <a
                    href={whatsappLink(wa.number, dict.appointment.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                    <WhatsAppMark size={17} className="text-[#6ce39a]" />
                    {h.orWhatsapp}
                    <span className="tabular-nums text-white underline decoration-white/35 underline-offset-4">
                        {digits(formatPhone(wa.number), lang)}
                    </span>
                </a>
            )}
        </>
    );

    return (
        <section
            data-track="hero"
            className="relative isolate overflow-hidden rounded-b-4xl bg-teal-950 text-white lg:rounded-b-[3rem]"
        >
                <HeroCarousel
                    slides={items}
                    actions={actions}
                    lang={lang}
                    intervalMs={settings.heroSlider.intervalSec * 1000}
                    labels={{ region: h.heroLabel }}
                />
        </section>
    );
}
