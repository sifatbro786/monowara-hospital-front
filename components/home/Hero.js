import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { Drift } from "@/components/motion/Motion";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

/**
 * Hero in the client's concept layout (MH_Website_Concept.pdf): teal band with a
 * rounded bottom, copy left, the hospital's own building in a rounded photo card on
 * the right, and the search card (QuickPanel) overlapping the bottom edge.
 * Refinements: offset hairline frame behind the photo, floating 24/7 badge,
 * location tag. (Background contour lines removed — Sifat, 2026-10-24.)
 */
export function Hero({ slide, settings, dict, lang }) {
    const h = dict.home;
    const wa = settings.primaryWhatsapp;
    const media = slide.cardMedia?.src ? slide.cardMedia : slide.media;

    return (
        <section
            data-track="hero"
            className="relative isolate overflow-hidden rounded-b-4xl bg-[linear-gradient(140deg,#0b6a6f_0%,#0a5a5e_45%,#084649_100%)] text-white lg:rounded-b-[3rem]"
        >
            <Container className="grid items-center gap-12 pb-48 pt-12 sm:pb-52 lg:grid-cols-12 lg:gap-12 lg:pb-56 lg:pt-20">
                <div className="lg:col-span-6">
                    <p
                        data-enter
                        className="inline-flex items-center gap-2 rounded-pill bg-white/10 py-1.5 pl-1.5 pr-3.5 text-[0.82rem] text-white/90 ring-1 ring-white/15"
                    >
                        <span className="grid size-6 place-items-center rounded-full bg-white/15">
                            <Icon name="pin" size={13} />
                        </span>
                        {t(slide.eyebrow, lang)}
                    </p>

                    <h1
                        data-enter="title"
                        style={{ "--reveal-delay": "60ms" }}
                        className="mt-7 max-w-[14ch] text-display text-white [&:lang(bn)]:leading-[1.22] [&_em]:text-teal-200"
                    >
                        <span>
                            <Emphasis text={t(slide.title, lang)} />
                        </span>
                    </h1>

                    <p
                        data-enter
                        style={{ "--reveal-delay": "180ms" }}
                        className="mt-6 max-w-xl text-lg leading-relaxed text-white/80"
                    >
                        {t(slide.subtitle, lang)}
                    </p>

                    <div
                        data-enter
                        style={{ "--reveal-delay": "260ms" }}
                        className="mt-9 flex flex-wrap items-center gap-3"
                    >
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
                            data-enter
                            style={{ "--reveal-delay": "320ms" }}
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
                </div>

                {media?.src && (
                    <figure
                        data-enter
                        style={{ "--reveal-delay": "160ms" }}
                        className="relative lg:col-span-6"
                    >
                        {/* offset hairline frame */}
                        <div
                            aria-hidden
                            className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.75rem] border border-white/25 sm:translate-x-4 sm:translate-y-4"
                        />

                        <div className="relative aspect-5/4 overflow-hidden rounded-[1.75rem] bg-teal-900 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)]">
                            {/* taller than the frame so the scroll drift never shows an edge */}
                            <Drift
                                range={[0, 48]}
                                offset={["start start", "end start"]}
                                className="absolute inset-x-0 -top-[8%] -bottom-[8%]"
                            >
                                <Image
                                    src={media.src}
                                    alt={t(media.alt, lang)}
                                    fill
                                    loading="eager"
                                    fetchPriority="high"
                                    quality={85}
                                    sizes="(min-width: 1024px) 38rem, 100vw"
                                    className="object-cover"
                                />
                            </Drift>
                            <p className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-pill bg-white/90 sm:inline-flex px-3 py-1.5 text-xs font-medium text-teal-900">
                                <Icon name="pin" size={13} />
                                {h.heroOwnBuilding}
                            </p>
                        </div>
                    </figure>
                )}
            </Container>
        </section>
    );
}
